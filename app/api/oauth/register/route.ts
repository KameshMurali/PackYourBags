import { isAllowedRedirectUri, isOAuthConfigured, registerClient } from "@/lib/oauth";
import { notConfigured, oauthError, oauthJson, preflight } from "@/lib/oauth-http";

export const runtime = "nodejs";

// Dynamic Client Registration (RFC 7591). Claude and ChatGPT call this once to
// get a client_id. Registration is stateless: the client_id is a signed record
// of the app's allowed redirect URIs.
export async function POST(req: Request) {
  if (!isOAuthConfigured) {
    return notConfigured();
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return oauthError("invalid_client_metadata", "Send client metadata as a JSON object.");
  }

  const redirectUris = body.redirect_uris;
  if (
    !Array.isArray(redirectUris) ||
    redirectUris.length === 0 ||
    redirectUris.length > 10 ||
    !redirectUris.every(
      (uri) => typeof uri === "string" && uri.length <= 2000 && isAllowedRedirectUri(uri),
    )
  ) {
    return oauthError(
      "invalid_redirect_uri",
      "redirect_uris must list 1–10 https, loopback http, or native-app callback URLs.",
    );
  }

  const clientName = typeof body.client_name === "string" ? body.client_name.slice(0, 100) : undefined;
  const { client_id, client } = registerClient({
    redirect_uris: redirectUris as string[],
    client_name: clientName,
  });

  // Every client is registered as a public PKCE client, whatever auth method it
  // asked for; RFC 7591 lets the server decide and the client must follow.
  return oauthJson(
    {
      client_id,
      client_id_issued_at: client.iat,
      client_name: client.client_name,
      redirect_uris: client.redirect_uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
    201,
  );
}

export const OPTIONS = preflight;
