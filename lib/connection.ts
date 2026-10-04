import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

// A connection token is an opaque secret the traveller pastes into their
// ChatGPT / Claude MCP connector. The token itself is the credential; its
// SHA-256 hash is the storage namespace, so the raw secret is never used as a
// key or logged.

const COOKIE_NAME = "pyb_mcp_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const TOKEN_PREFIX = "pyb_";

export function generateToken() {
  return TOKEN_PREFIX + randomBytes(24).toString("base64url");
}

export function isValidTokenShape(token: string | undefined): token is string {
  return Boolean(token && token.startsWith(TOKEN_PREFIX) && token.length >= 20 && token.length <= 128);
}

export function namespaceFor(token: string) {
  return createHash("sha256").update(token).digest("hex").slice(0, 24);
}

export async function setConnectionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: false, // the /connect page re-displays it; it is the user's own secret on their device
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readConnectionCookie() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return isValidTokenShape(token) ? token : null;
}
