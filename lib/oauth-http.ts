// HTTP helpers shared by the OAuth endpoints. MCP clients may call these from
// a browser, so they allow any origin; no cookies are involved, so that's safe.

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Token and registration responses must never be cached (RFC 6749 §5.1).
export function oauthJson(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { ...CORS_HEADERS, "Cache-Control": "no-store", Pragma: "no-cache" },
  });
}

export function oauthError(error: string, description: string, status = 400) {
  return oauthJson({ error, error_description: description }, status);
}

export function notConfigured() {
  return oauthError(
    "temporarily_unavailable",
    "Assistant connections are not configured on this server yet (AUTH_SECRET is missing).",
    503,
  );
}
