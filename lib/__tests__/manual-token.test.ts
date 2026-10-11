import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The signing secret is read when lib/oauth loads, so set it first and import after.
async function load() {
  vi.resetModules();
  vi.stubEnv("AUTH_SECRET", "test-secret-for-manual-tokens-0123456789");
  vi.stubEnv("MCP_OAUTH_SECRET", "");
  const oauth = await import("@/lib/oauth");
  const manual = await import("@/lib/manual-token");
  manual.resetManualTokenMemory();
  return { oauth, manual };
}

const alice = "alice@example.com";
const bob = "bob@example.com";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-11T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("manual connection tokens", () => {
  it("resolve to the account they were issued to", async () => {
    const { oauth, manual } = await load();
    const { token } = await manual.createManualToken(alice);

    expect(token.startsWith("pyb_")).toBe(true);
    const resolved = await manual.resolveManualToken(token);
    expect(resolved).toMatchObject({ email: alice, namespace: oauth.namespaceForUser(alice) });
  });

  it("reject a made-up token, which is what the old code accepted", async () => {
    const { manual } = await load();
    expect(await manual.resolveManualToken("pyb_thisIsNotARealTokenButLooksLikeOne12345")).toBeNull();
    expect(await manual.resolveManualToken("pyb_" + "a".repeat(100))).toBeNull();
    expect(await manual.resolveManualToken("")).toBeNull();
    expect(await manual.resolveManualToken(undefined)).toBeNull();
  });

  it("reject a tampered token", async () => {
    const { manual } = await load();
    const { token } = await manual.createManualToken(alice);

    // Flip a character in the signature.
    const last = token.slice(-1);
    const tamperedSignature = token.slice(0, -1) + (last === "A" ? "B" : "A");
    expect(await manual.resolveManualToken(tamperedSignature)).toBeNull();

    // Swap in a different (validly encoded) payload that names someone else.
    const [, rest = ""] = token.split("pyb_");
    const dot = rest.lastIndexOf(".");
    const forgedBody = Buffer.from(
      JSON.stringify({ sub: "x", email: bob, ver: 2, aud: "packyourbags-mcp", exp: 9999999999, jti: "x" }),
    ).toString("base64url");
    expect(await manual.resolveManualToken(`pyb_${forgedBody}${rest.slice(dot)}`)).toBeNull();
  });

  it("expire after 90 days", async () => {
    const { manual } = await load();
    const { token } = await manual.createManualToken(alice);

    vi.setSystemTime(new Date("2027-01-01T10:00:00Z")); // ~82 days later
    expect(await manual.resolveManualToken(token)).not.toBeNull();

    vi.setSystemTime(new Date("2027-01-15T10:00:00Z")); // ~96 days later
    expect(await manual.resolveManualToken(token)).toBeNull();
  });

  it("stop working when a new one is created or all are revoked", async () => {
    const { manual } = await load();
    const first = await manual.createManualToken(alice);
    expect(await manual.resolveManualToken(first.token)).not.toBeNull();

    const second = await manual.createManualToken(alice);
    expect(await manual.resolveManualToken(first.token)).toBeNull();
    expect(await manual.resolveManualToken(second.token)).not.toBeNull();

    await manual.revokeManualTokens(alice);
    expect(await manual.resolveManualToken(second.token)).toBeNull();
  });

  it("keep accounts separate", async () => {
    const { manual } = await load();
    const a = await manual.createManualToken(alice);
    const b = await manual.createManualToken(bob);

    // Bob creating a token must not revoke Alice's.
    expect(await manual.resolveManualToken(a.token)).toMatchObject({ email: alice });
    expect(await manual.resolveManualToken(b.token)).toMatchObject({ email: bob });
  });

  it("can't be confused with OAuth tokens, in either direction", async () => {
    const { oauth, manual } = await load();
    const { token } = await manual.createManualToken(alice);
    expect(oauth.readAccessToken(token)).toBeNull();

    const code = oauth.createAuthorizationCode({
      clientId: "pyc_x",
      redirectUri: "https://example.com/cb",
      codeChallenge: "a".repeat(43),
      email: alice,
    });
    expect(await manual.resolveManualToken(code)).toBeNull();
  });
});
