import { getPublicOrigin, metadataCorsOptionsRequestHandler, protectedResourceHandler } from "mcp-handler";
import { isOAuthConfigured } from "@/lib/oauth";
import { notConfigured } from "@/lib/oauth-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP server. When a
// client calls /api/mcp without a token, the 401 points here; this names our
// own origin as the authorization server.
export function GET(req: Request) {
  if (!isOAuthConfigured) {
    return notConfigured();
  }

  const origin = getPublicOrigin(req);
  return protectedResourceHandler({
    authServerUrls: [origin],
    resourceUrl: `${origin}/api/mcp`,
  })(req);
}

export const OPTIONS = metadataCorsOptionsRequestHandler();
