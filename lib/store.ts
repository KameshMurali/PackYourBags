// Pluggable per-namespace item store shared by the MCP server and the web app.
//
// - Local dev / single warm instance: in-memory Map (resets on cold start).
// - Production: Upstash Redis via its REST API when UPSTASH_REDIS_REST_URL and
//   UPSTASH_REDIS_REST_TOKEN are set. No SDK dependency — just fetch().
//
// Everything is namespaced so one traveller's assistant data never mixes with
// another's. The namespace is a hash of the connection token (see mcp-auth.ts).

export type SyncedItemType = "trip" | "itinerary";

export type SyncedItem = {
  id: string;
  type: SyncedItemType;
  title: string;
  data: unknown;
  source: string;
  createdAt: string;
};

const MAX_ITEMS = 50;

interface Store {
  push(namespace: string, item: SyncedItem): Promise<void>;
  list(namespace: string): Promise<SyncedItem[]>;
  clear(namespace: string): Promise<void>;
  /** How many travellers have saved assistant data (admin overview only). */
  summary(): Promise<{ travellers: number }>;
}

function key(namespace: string) {
  return `pyb:items:${namespace}`;
}

// --- In-memory -------------------------------------------------------------
const memory = new Map<string, SyncedItem[]>();

const memoryStore: Store = {
  async push(namespace, item) {
    const list = memory.get(key(namespace)) ?? [];
    list.unshift(item);
    memory.set(key(namespace), list.slice(0, MAX_ITEMS));
  },
  async list(namespace) {
    return memory.get(key(namespace)) ?? [];
  },
  async clear(namespace) {
    memory.delete(key(namespace));
  },
  async summary() {
    return { travellers: memory.size };
  },
};

// --- Upstash Redis (REST) --------------------------------------------------
// Upstash's own variable names, or the KV_* names that Vercel's Marketplace
// "Upstash for Redis" integration sets automatically.
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

async function upstash(command: unknown[]): Promise<unknown> {
  const response = await fetch(UPSTASH_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash error ${response.status}`);
  }

  const json = (await response.json()) as { result?: unknown; error?: string };

  if (json.error) {
    throw new Error(json.error);
  }

  return json.result;
}

const upstashStore: Store = {
  async push(namespace, item) {
    await upstash(["LPUSH", key(namespace), JSON.stringify(item)]);
    await upstash(["LTRIM", key(namespace), 0, MAX_ITEMS - 1]);
  },
  async list(namespace) {
    const result = (await upstash(["LRANGE", key(namespace), 0, -1])) as string[] | null;
    if (!result) {
      return [];
    }
    return result
      .map((raw) => {
        try {
          return JSON.parse(raw) as SyncedItem;
        } catch {
          return null;
        }
      })
      .filter((item): item is SyncedItem => item !== null);
  },
  async clear(namespace) {
    await upstash(["DEL", key(namespace)]);
  },
  async summary() {
    // Each traveller's items live in one list key, so counting keys counts travellers.
    // SCAN is paged and capped so a large keyspace can't make the admin page slow.
    let cursor = "0";
    let travellers = 0;
    for (let page = 0; page < 20; page += 1) {
      const [next, keys] = (await upstash(["SCAN", cursor, "MATCH", "pyb:items:*", "COUNT", 500])) as [
        string,
        string[],
      ];
      travellers += keys.length;
      cursor = next;
      if (cursor === "0") break;
    }
    return { travellers };
  },
};

export const store: Store = UPSTASH_URL && UPSTASH_TOKEN ? upstashStore : memoryStore;

export const usingDurableStore = Boolean(UPSTASH_URL && UPSTASH_TOKEN);


// --- Traveller registry ------------------------------------------------------
// Who has signed in, kept in the same store as assistant data so the admin page can
// list people without needing a Postgres database. One hash per traveller plus a
// sorted set (score = last seen) to list the most recent first.

export type UserRecord = {
  email: string;
  name: string;
  image: string;
  firstSeen: string;
  lastSeen: string;
  signIns: number;
  itineraries: number;
};

const USERS_INDEX = "pyb:users";

function userKey(email: string) {
  return `pyb:user:${email.trim().toLowerCase()}`;
}

function blankUser(email: string): UserRecord {
  const now = new Date().toISOString();
  return { email, name: "", image: "", firstSeen: now, lastSeen: now, signIns: 0, itineraries: 0 };
}

const memoryUsers = new Map<string, UserRecord>();

async function upstashPipeline(commands: unknown[][]): Promise<unknown[]> {
  const response = await fetch(`${UPSTASH_URL as string}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Upstash error ${response.status}`);
  }
  const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
  return results.map((entry) => {
    if (entry.error) {
      throw new Error(entry.error);
    }
    return entry.result;
  });
}

function parseUser(email: string, flat: unknown): UserRecord | null {
  if (!Array.isArray(flat) || flat.length === 0) {
    return null;
  }
  const fields: Record<string, string> = {};
  for (let i = 0; i < flat.length; i += 2) {
    fields[String(flat[i])] = String(flat[i + 1] ?? "");
  }
  const base = blankUser(email);
  return {
    email: fields.email || email,
    name: fields.name ?? "",
    image: fields.image ?? "",
    firstSeen: fields.firstSeen || base.firstSeen,
    lastSeen: fields.lastSeen || base.lastSeen,
    signIns: Number.parseInt(fields.signIns ?? "0", 10) || 0,
    itineraries: Number.parseInt(fields.itineraries ?? "0", 10) || 0,
  };
}

/**
 * Records that a traveller was seen. `signIn: true` counts a fresh Google sign-in;
 * otherwise it only refreshes "last seen" (and adds people who were already signed
 * in before the registry existed).
 */
export async function touchUser(
  input: { email: string; name?: string | null; image?: string | null },
  options: { signIn?: boolean } = {},
): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const now = new Date();

  if (!usingDurableStore) {
    const user = memoryUsers.get(email) ?? blankUser(email);
    user.lastSeen = now.toISOString();
    user.name = input.name || user.name;
    user.image = input.image || user.image;
    if (options.signIn) user.signIns += 1;
    memoryUsers.set(email, user);
    return;
  }

  const key = userKey(email);
  const set: unknown[] = ["HSET", key, "email", email, "lastSeen", now.toISOString()];
  if (input.name) set.push("name", input.name);
  if (input.image) set.push("image", input.image);

  const commands: unknown[][] = [["HSETNX", key, "firstSeen", now.toISOString()], set];
  if (options.signIn) commands.push(["HINCRBY", key, "signIns", 1]);
  commands.push(["ZADD", USERS_INDEX, now.getTime(), email]);
  await upstashPipeline(commands);
}

/** Counts one AI itinerary against a traveller (admin overview only). */
export async function countItinerary(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!usingDurableStore) {
    const user = memoryUsers.get(normalized);
    if (user) user.itineraries += 1;
    return;
  }
  await upstashPipeline([["HINCRBY", userKey(normalized), "itineraries", 1]]);
}

/** Most recently seen travellers first. */
export async function listUsers(limit = 200): Promise<UserRecord[]> {
  if (!usingDurableStore) {
    return Array.from(memoryUsers.values())
      .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
      .slice(0, limit);
  }

  const emails = (await upstash(["ZREVRANGE", USERS_INDEX, 0, limit - 1])) as string[] | null;
  if (!emails || emails.length === 0) {
    return [];
  }
  const rows = await upstashPipeline(emails.map((email) => ["HGETALL", userKey(email)]));
  return rows
    .map((flat, i) => parseUser(emails[i] as string, flat))
    .filter((user): user is UserRecord => user !== null);
}

export async function getUserRecord(email: string): Promise<UserRecord | null> {
  const normalized = email.trim().toLowerCase();
  if (!usingDurableStore) {
    return memoryUsers.get(normalized) ?? null;
  }
  const [flat] = await upstashPipeline([["HGETALL", userKey(normalized)]]);
  return parseUser(normalized, flat);
}

/** Removes a traveller's profile record and index entry (account deletion). */
export async function deleteUserRecord(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!usingDurableStore) {
    memoryUsers.delete(normalized);
    return;
  }
  await upstashPipeline([
    ["DEL", userKey(normalized)],
    ["ZREM", USERS_INDEX, normalized],
  ]);
}

/**
 * Raw access for small counters, flags and locks (see lib/quota.ts). Only meaningful
 * when `usingDurableStore` is true; callers keep their own in-memory fallback.
 */
export const kv = {
  command: upstash,
  pipeline: upstashPipeline,
};
