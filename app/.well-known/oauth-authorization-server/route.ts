import { getPublicOrigin } from "mcp-handler";
import { isOAuthConfigured, OAUTH_SCOPE } from "@/lib/oauth";
import { CORS_HEADERS, notConfigured, preflight } from "@/lib/oauth-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// OAuth 2.0 Authorization Server Metadata (RFC 8414). MCP clients read this to
// find where to register, send the traveller to sign in, and exchange codes.
export function GET(req: Request) {
  if (!isOAuthConfigured) {
    return notConfigured();
  }

  const origin = getPublicOrigin(req);
  return Response.json(
    {
      issuer: origin,
      authorization_endpoint: `${origin}/oauth/authorize`,
      token_endpoint: `${origin}/api/oauth/token`,
      registration_endpoint: `${origin}/api/oauth/register`,
      scopes_supported: [OAUTH_SCOPE],
      response_types_supported: ["code"],
      response_modes_supported: ["query"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      token_endpoint_auth_methods_supported: ["none"],
      code_challenge_methods_supported: ["S256"],
      service_documentation: `${origin}/connect`,
    },
    { headers: CORS_HEADERS },
  );
}

export const OPTIONS = preflight;
