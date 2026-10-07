import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Stateless OAuth 2.1 authorization server for the MCP connector.
//
// Claude and ChatGPT connect to /api/mcp with OAuth: they register a client
// (RFC 7591), send the traveller through /oauth/authorize (sign in with Google,
// approve), then swap the code for tokens at /api/oauth/token (PKCE S256).
//
// Nothing is stored server-side. Client IDs, authorization codes, and tokens
// are HMAC-signed with AUTH_SECRET (or MCP_OAUTH_SECRET), which is what lets
// this run on serverless instances that share no memory. Consequences:
// - Codes can't be marked single-use; PKCE plus a 5-minute expiry stands in.
// - Individual tokens can't be revoked; access tokens expire after an hour,
//   and rotating the secret revokes everything.
//
// This module only uses node:crypto so it can be imported and tested directly.

const SECRET = process.env.MCP_OAUTH_SECRET || process.env.AUTH_SECRET || "";

export const isOAuthConfigured = SECRET.length > 0;

export const OAUTH_SCOPE = "trips";
const AUDIENCE = "packyourbags-mcp";

const CODE_TTL_SECONDS = 5 * 60;
const ACCESS_TTL_SECONDS = 60 * 60;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

type Kind = "client" | "code" | "access" | "refresh";

const PREFIX: Record<Kind, string> = {
  client: "pyc_",
  code: "pyo_",
  access: "pya_",
  refresh: "pyr_",
};

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function mac(kind: Kind, body: string) {
  // The kind is part of the signed input, so one artifact can never be
  // replayed as another (e.g. a refresh token used as an access token).
  return createHmac("sha256", SECRET).update(`${kind}.${body}`).digest("base64url");
}

function sign(kind: Kind, payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${PREFIX[kind]}${body}.${mac(kind, body)}`;
}

function verify<T extends object>(kind: Kind, value: string | null | undefined): T | null {
  if (!isOAuthConfigured || !value || !value.startsWith(PREFIX[kind])) {
    return null;
  }

  const rest = value.slice(PREFIX[kind].length);
  const dot = rest.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }

  const body = rest.slice(0, dot);
  const given = Buffer.from(rest.slice(dot + 1));
  const expected = Buffer.from(mac(kind, body));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: unknown };
    if (typeof payload.exp === "number" && payload.exp < nowSeconds()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

// --- Traveller namespace ----------------------------------------------------

// Assistant data for an OAuth-connected traveller lives under a namespace
// derived from their (verified, Google) email, so every connector they
// authorize writes to the same private space their web session reads.
export function namespaceForUser(email: string) {
  return createHash("sha256")
    .update(`user:${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 24);
}

// --- Redirect URIs ----------------------------------------------------------

const BLOCKED_SCHEMES = new Set(["javascript:", "data:", "file:", "vbscript:", "about:", "blob:"]);

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

// https anywhere, http only on loopback, or a native-app custom scheme.
export function isAllowedRedirectUri(uri: string) {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }

  if (url.hash) {
    return false;
  }
  if (url.protocol === "https:") {
    return true;
  }
  if (url.protocol === "http:") {
    return isLoopbackHost(url.hostname);
  }
  if (BLOCKED_SCHEMES.has(url.protocol)) {
    return false;
  }
  return /^[a-z][a-z0-9+.-]*:$/.test(url.protocol);
}

// Exact match, except loopback redirects may use any port (RFC 8252 §7.3).
export function redirectUriMatches(registered: string[], requested: string) {
  if (registered.includes(requested)) {
    return true;
  }

  let wanted: URL;
  try {
    wanted = new URL(requested);
  } catch {
    return false;
  }
  if (wanted.protocol !== "http:" || !isLoopbackHost(wanted.hostname)) {
    return false;
  }

  return registered.some((entry) => {
    try {
      const allowed = new URL(entry);
      return (
        allowed.protocol === "http:" &&
        allowed.hostname === wanted.hostname &&
        allowed.pathname === wanted.pathname &&
        allowed.search === wanted.search
      );
    } catch {
      return false;
    }
  });
}

// --- Clients (stateless dynamic registration) --------------------------------

export type RegisteredClient = {
  redirect_uris: string[];
  client_name?: string;
  iat: number;
};

export function registerClient(input: { redirect_uris: string[]; client_name?: string }) {
  const client: RegisteredClient = {
    redirect_uris: input.redirect_uris,
    client_name: input.client_name,
    iat: nowSeconds(),
  };
  return { client_id: sign("client", client), client };
}

export function readClient(clientId: string | null | undefined) {
  return verify<RegisteredClient>("client", clientId);
}

function clientFingerprint(clientId: string) {
  return sha256(clientId).slice(0, 22);
}

// --- Authorization codes + PKCE -----------------------------------------------

type CodeClaims = {
  cid: string; // client fingerprint
  ruri: string; // redirect_uri the code was issued for
  cc: string; // PKCE S256 code challenge
  sub: string; // traveller namespace
  email: string;
  scope: string;
  exp: number;
  jti: string;
};

export function createAuthorizationCode(input: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  email: string;
}) {
  const claims: CodeClaims = {
    cid: clientFingerprint(input.clientId),
    ruri: input.redirectUri,
    cc: input.codeChallenge,
    sub: namespaceForUser(input.email),
    email: input.email.trim().toLowerCase(),
    scope: OAUTH_SCOPE,
    exp: nowSeconds() + CODE_TTL_SECONDS,
    jti: randomBytes(9).toString("base64url"),
  };
  return sign("code", claims);
}

const CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;

export function isValidCodeChallenge(
  challenge: string | null | undefined,
  method: string | null | undefined,
): challenge is string {
  return method === "S256" && Boolean(challenge && CHALLENGE_PATTERN.test(challenge));
}

// Appends OAuth response parameters (code, state, error...) to a redirect URI
// that has already been validated against the client's registration.
export function withQuery(uri: string, params: Record<string, string | undefined>) {
  const url = new URL(uri);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function pkceMatches(verifier: string | null | undefined, challenge: string) {
  if (!verifier || !VERIFIER_PATTERN.test(verifier)) {
    return false;
  }
  const computed = Buffer.from(sha256(verifier));
  const expected = Buffer.from(challenge);
  return computed.length === expected.length && timingSafeEqual(computed, expected);
}

// --- Tokens -------------------------------------------------------------------

type TokenClaims = {
  sub: string;
  email: string;
  cid: string;
  scope: string;
  aud: string;
  exp: number;
  jti: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
};

function issueTokens(base: { sub: string; email: string; cid: string; scope: string }): TokenResponse {
  const now = nowSeconds();
  const common = { ...base, aud: AUDIENCE };
  return {
    access_token: sign("access", {
      ...common,
      exp: now + ACCESS_TTL_SECONDS,
      jti: randomBytes(9).toString("base64url"),
    } satisfies TokenClaims),
    token_type: "Bearer",
    expires_in: ACCESS_TTL_SECONDS,
    refresh_token: sign("refresh", {
      ...common,
      exp: now + REFRESH_TTL_SECONDS,
      jti: randomBytes(9).toString("base64url"),
    } satisfies TokenClaims),
    scope: base.scope,
  };
}

export type GrantResult = { ok: true; tokens: TokenResponse } | { ok: false; error: string; description: string };

export function exchangeAuthorizationCode(input: {
  code: string | null;
  clientId: string | null;
  redirectUri: string | null;
  codeVerifier: string | null;
}): GrantResult {
  const claims = verify<CodeClaims>("code", input.code);
  if (!claims) {
    return { ok: false, error: "invalid_grant", description: "The authorization code is invalid or expired." };
  }
  if (!input.clientId || clientFingerprint(input.clientId) !== claims.cid) {
    return { ok: false, error: "invalid_grant", description: "The code was issued to a different client." };
  }
  if (input.redirectUri !== claims.ruri) {
    return { ok: false, error: "invalid_grant", description: "redirect_uri does not match the authorization request." };
  }
  if (!pkceMatches(input.codeVerifier, claims.cc)) {
    return { ok: false, error: "invalid_grant", description: "PKCE verification failed." };
  }
  return {
    ok: true,
    tokens: issueTokens({ sub: claims.sub, email: claims.email, cid: claims.cid, scope: claims.scope }),
  };
}

export function exchangeRefreshToken(input: { refreshToken: string | null; clientId: string | null }): GrantResult {
  const claims = verify<TokenClaims>("refresh", input.refreshToken);
  if (!claims || claims.aud !== AUDIENCE) {
    return { ok: false, error: "invalid_grant", description: "The refresh token is invalid or expired." };
  }
  if (input.clientId && clientFingerprint(input.clientId) !== claims.cid) {
    return { ok: false, error: "invalid_grant", description: "The refresh token was issued to a different client." };
  }
  return {
    ok: true,
    tokens: issueTokens({ sub: claims.sub, email: claims.email, cid: claims.cid, scope: claims.scope }),
  };
}

export function readAccessToken(token: string | null | undefined) {
  const claims = verify<TokenClaims>("access", token);
  return claims && claims.aud === AUDIENCE ? claims : null;
}
