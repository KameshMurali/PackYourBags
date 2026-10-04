import { generateToken, readConnectionCookie, setConnectionCookie } from "@/lib/connection";

export const runtime = "nodejs";

// Returns the current connection token (if the browser already has one).
export async function GET() {
  const token = await readConnectionCookie();
  return Response.json({ token });
}

// Generates a fresh connection token and stores it in a cookie so the web app
// and the MCP server resolve to the same private namespace.
export async function POST() {
  const token = generateToken();
  await setConnectionCookie(token);
  return Response.json({ token });
}
