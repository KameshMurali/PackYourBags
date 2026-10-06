import { exchangeAuthorizationCode, exchangeRefreshToken, isOAuthConfigured } from "@/lib/oauth";
import { notConfigured, oauthError, oauthJson, preflight } from "@/lib/oauth-http";

export const runtime = "nodejs";

async function readParams(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let params: URLSearchParams;

  if (contentType.includes("application/json")) {
    const json = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    params = new URLSearchParams();
    for (const [key, value] of Object.entries(json)) {
      if (typeof value === "string") {
        params.set(key, value);
      }
    }
  } else {
    params = new URLSearchParams(await req.text());
  }

  // Public clients normally send client_id in the body, but some send HTTP
  // Basic credentials anyway; take the client_id from there if needed.
  const authorization = req.headers.get("authorization");
  if (!params.get("client_id") && authorization?.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
      const clientId = decodeURIComponent(decoded.split(":")[0] ?? "");
      if (clientId) {
        params.set("client_id", clientId);
      }
    } catch {
      // Malformed Basic header: fall through and let validation reject it.
    }
  }

  return params;
}

// Token endpoint (RFC 6749 §3.2) for the authorization_code (with PKCE) and
// refresh_token grants.
export async function POST(req: Request) {
  if (!isOAuthConfigured) {
    return notConfigured();
  }

  const params = await readParams(req);
  const grantType = params.get("grant_type");

  const result =
    grantType === "authorization_code"
      ? exchangeAuthorizationCode({
          code: params.get("code"),
          clientId: params.get("client_id"),
          redirectUri: params.get("redirect_uri"),
          codeVerifier: params.get("code_verifier"),
        })
      : grantType === "refresh_token"
        ? exchangeRefreshToken({
            refreshToken: params.get("refresh_token"),
            clientId: params.get("client_id"),
          })
        : null;

  if (!result) {
    return oauthError("unsupported_grant_type", "Use authorization_code or refresh_token.");
  }
  if (!result.ok) {
    return oauthError(result.error, result.description);
  }
  return oauthJson(result.tokens);
}

export const OPTIONS = preflight;
