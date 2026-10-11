import { createHash } from "node:crypto";
import { issueManualToken, readManualToken } from "@/lib/oauth";
import { kv, usingDurableStore } from "@/lib/store";

// Manual connection tokens (see lib/oauth.ts) are only valid while their version
// matches the account's current one. Creating a new token, or pressing "Revoke",
// bumps the version, which invalidates every earlier token for that account.

const memoryVersions = new Map<string, number>();

function versionKey(email: string) {
  const hash = createHash("sha256").update(`tokver:${email.trim().toLowerCase()}`).digest("hex").slice(0, 32);
  return `pyb:tokver:${hash}`;
}

async function currentVersion(email: string): Promise<number> {
  if (!usingDurableStore) {
    return memoryVersions.get(versionKey(email)) ?? 1;
  }
  const stored = await kv.command(["GET", versionKey(email)]);
  return Number.parseInt(String(stored ?? "1"), 10) || 1;
}

async function bumpVersion(email: string): Promise<number> {
  if (!usingDurableStore) {
    const next = (memoryVersions.get(versionKey(email)) ?? 1) + 1;
    memoryVersions.set(versionKey(email), next);
    return next;
  }
  const next = Number(await kv.command(["INCR", versionKey(email)]));
  // INCR on a missing key returns 1; make sure the very first bump moves past the default.
  return next < 2 ? Number(await kv.command(["INCR", versionKey(email)])) : next;
}

/** Test helper: forget all in-memory versions. */
export function resetManualTokenMemory() {
  memoryVersions.clear();
}

/** Issues a new token for a signed-in account, revoking any earlier ones. */
export async function createManualToken(email: string) {
  const version = await bumpVersion(email);
  return issueManualToken({ email, version });
}

/** Invalidates every manual token the account has. */
export async function revokeManualTokens(email: string) {
  await bumpVersion(email);
}

/** The account a token belongs to, or null if it's forged, expired or revoked. */
export async function resolveManualToken(token: string | null | undefined) {
  const claims = readManualToken(token);
  if (!claims) return null;
  if (claims.ver !== (await currentVersion(claims.email))) return null;
  return { namespace: claims.sub, email: claims.email, expiresAt: claims.exp };
}
