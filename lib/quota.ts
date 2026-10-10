import { createHash } from "node:crypto";
import { FREE_GENERATION_LIMIT, toUsageInfo, type Plan, type UsageInfo } from "@/lib/plan";
import { kv, usingDurableStore } from "@/lib/store";

// Server-side allowance for the AI concierge, the only feature that spends money.
//
// Everything here is keyed by a hash of the traveller's verified Google email and kept
// in Upstash, so it can't be reset by clearing cookies, switching browsers or scripting
// requests. Four independent brakes protect the Anthropic bill:
//   1. A per-person allowance: FREE_GENERATION_LIMIT itineraries on the starter plan,
//      unlimited on Pro. Pro is only granted by an admin, never self-served.
//   2. A one-at-a-time lock per person, so parallel requests can't beat the counter.
//   3. A daily cap across everyone (CONCIERGE_DAILY_CAP, default 200).
//   4. An off switch an admin can flip instantly from /admin, with no redeploy.
//
// Without Upstash (local dev, tests) the same logic runs against in-memory maps.

const LOCK_SECONDS = 20;
const FLAG_KEY = "pyb:flag:concierge-off";

export function dailyCap() {
  const configured = Number.parseInt(process.env.CONCIERGE_DAILY_CAP ?? "", 10);
  return configured > 0 ? configured : 200;
}

function who(email: string) {
  return createHash("sha256").update(`quota:${email.trim().toLowerCase()}`).digest("hex").slice(0, 32);
}

const quotaKey = (email: string) => `pyb:quota:${who(email)}`;
const lockKey = (email: string) => `pyb:lock:${who(email)}`;
const dayKey = () => `pyb:day:${new Date().toISOString().slice(0, 10)}`;

// --- In-memory fallback -------------------------------------------------------
type MemoryQuota = { used: number; plan: Plan; requested: boolean };
const memoryQuota = new Map<string, MemoryQuota>();
const memoryDays = new Map<string, number>();
const memoryLocks = new Map<string, number>();
let memoryOff = false;

function memoryEntry(email: string): MemoryQuota {
  const key = who(email);
  const existing = memoryQuota.get(key);
  if (existing) return existing;
  const created: MemoryQuota = { used: 0, plan: "starter", requested: false };
  memoryQuota.set(key, created);
  return created;
}

/** Test helper: forget all in-memory state. */
export function resetQuotaMemory() {
  memoryQuota.clear();
  memoryDays.clear();
  memoryLocks.clear();
  memoryOff = false;
}

// --- Reads ---------------------------------------------------------------------
export type Quota = { plan: Plan; used: number; requested: boolean };

export async function readQuota(email: string): Promise<Quota> {
  if (!usingDurableStore) {
    const { plan, used, requested } = memoryEntry(email);
    return { plan, used, requested };
  }

  const flat = ((await kv.command(["HGETALL", quotaKey(email)])) as string[] | null) ?? [];
  const fields: Record<string, string> = {};
  for (let i = 0; i < flat.length; i += 2) {
    fields[String(flat[i])] = String(flat[i + 1] ?? "");
  }
  return {
    plan: fields.plan === "pro" ? "pro" : "starter",
    used: Math.max(0, Number.parseInt(fields.used ?? "0", 10) || 0),
    requested: Boolean(fields.requested),
  };
}

export async function usageFor(email: string): Promise<UsageInfo> {
  const quota = await readQuota(email);
  return toUsageInfo(quota.plan, quota.used, quota.requested);
}

export async function conciergeEnabled(): Promise<boolean> {
  if (!usingDurableStore) return !memoryOff;
  return (await kv.command(["GET", FLAG_KEY])) !== "1";
}

export async function generationsToday(): Promise<number> {
  if (!usingDurableStore) return memoryDays.get(dayKey()) ?? 0;
  return Number.parseInt(String((await kv.command(["GET", dayKey()])) ?? "0"), 10) || 0;
}

// --- Counters and locks -----------------------------------------------------
async function addUsed(email: string, delta: number): Promise<number> {
  if (!usingDurableStore) {
    const entry = memoryEntry(email);
    entry.used += delta;
    return entry.used;
  }
  return Number(await kv.command(["HINCRBY", quotaKey(email), "used", delta]));
}

async function addToday(delta: number): Promise<number> {
  if (!usingDurableStore) {
    const key = dayKey();
    const next = (memoryDays.get(key) ?? 0) + delta;
    memoryDays.set(key, next);
    return next;
  }
  const [total] = await kv.pipeline([
    ["INCRBY", dayKey(), delta],
    ["EXPIRE", dayKey(), 172_800],
  ]);
  return Number(total);
}

async function takeLock(email: string): Promise<boolean> {
  if (!usingDurableStore) {
    const key = who(email);
    const now = Date.now();
    if ((memoryLocks.get(key) ?? 0) > now) return false;
    memoryLocks.set(key, now + LOCK_SECONDS * 1000);
    return true;
  }
  return (await kv.command(["SET", lockKey(email), "1", "EX", LOCK_SECONDS, "NX"])) === "OK";
}

async function dropLock(email: string): Promise<void> {
  if (!usingDurableStore) {
    memoryLocks.delete(who(email));
    return;
  }
  await kv.command(["DEL", lockKey(email)]);
}

// --- Reserve / release -----------------------------------------------------------
export type Reservation =
  | { ok: true }
  | { ok: false; status: 402 | 429 | 503; error: string; upgradeRequired?: boolean };

/**
 * Call BEFORE spending anything. Takes one itinerary from the person's allowance and
 * from today's cap. If it returns ok, either let the generation finish or call
 * releaseGeneration() so a failed attempt doesn't cost them an itinerary.
 */
export async function reserveGeneration(email: string): Promise<Reservation> {
  if (!(await conciergeEnabled())) {
    return { ok: false, status: 503, error: "The concierge is taking a short break. Please check back soon." };
  }

  if (!(await takeLock(email))) {
    return { ok: false, status: 429, error: "One itinerary at a time. Give it a few seconds and try again." };
  }

  const quota = await readQuota(email);
  if (quota.plan !== "pro") {
    const used = await addUsed(email, 1);
    if (used > FREE_GENERATION_LIMIT) {
      await addUsed(email, -1);
      await dropLock(email);
      return {
        ok: false,
        status: 402,
        error: `You have used all ${FREE_GENERATION_LIMIT} free itineraries. Request Pro access for unlimited concierge planning.`,
        upgradeRequired: true,
      };
    }
  }

  const today = await addToday(1);
  if (today > dailyCap()) {
    await addToday(-1);
    if (quota.plan !== "pro") await addUsed(email, -1);
    await dropLock(email);
    return {
      ok: false,
      status: 503,
      error: "The concierge has reached its daily limit. Please try again tomorrow.",
    };
  }

  return { ok: true };
}

/** Gives the reservation back (the generation failed) and frees the lock. */
export async function releaseGeneration(email: string): Promise<void> {
  const quota = await readQuota(email);
  if (quota.plan !== "pro") await addUsed(email, -1);
  await addToday(-1);
  await dropLock(email);
}

// --- Admin and plan changes --------------------------------------------------
export async function setPlan(email: string, plan: Plan): Promise<void> {
  if (!usingDurableStore) {
    const entry = memoryEntry(email);
    entry.plan = plan;
    if (plan === "pro") entry.requested = false;
    return;
  }
  const commands: unknown[][] = [["HSET", quotaKey(email), "plan", plan]];
  if (plan === "pro") commands.push(["HDEL", quotaKey(email), "requested"]);
  await kv.pipeline(commands);
}

export async function requestPro(email: string): Promise<void> {
  if (!usingDurableStore) {
    memoryEntry(email).requested = true;
    return;
  }
  await kv.command(["HSET", quotaKey(email), "requested", new Date().toISOString()]);
}

export async function setConciergeEnabled(on: boolean): Promise<void> {
  if (!usingDurableStore) {
    memoryOff = !on;
    return;
  }
  await kv.command(on ? ["DEL", FLAG_KEY] : ["SET", FLAG_KEY, "1"]);
}

/** Plans for many people at once (admin user list); one round trip to storage. */
export async function readQuotas(emails: string[]): Promise<Map<string, Quota>> {
  const result = new Map<string, Quota>();
  if (emails.length === 0) return result;

  if (!usingDurableStore) {
    for (const email of emails) result.set(email, await readQuota(email));
    return result;
  }

  const rows = await kv.pipeline(emails.map((email) => ["HGETALL", quotaKey(email)]));
  rows.forEach((flat, i) => {
    const list = (flat as string[] | null) ?? [];
    const fields: Record<string, string> = {};
    for (let j = 0; j < list.length; j += 2) fields[String(list[j])] = String(list[j + 1] ?? "");
    result.set(emails[i] as string, {
      plan: fields.plan === "pro" ? "pro" : "starter",
      used: Math.max(0, Number.parseInt(fields.used ?? "0", 10) || 0),
      requested: Boolean(fields.requested),
    });
  });
  return result;
}
