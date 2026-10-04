import { namespaceFor, readConnectionCookie } from "@/lib/connection";
import { store, usingDurableStore } from "@/lib/store";

export const runtime = "nodejs";

// Items an assistant pushed via the MCP server, for the current browser.
export async function GET() {
  const token = await readConnectionCookie();
  if (!token) {
    return Response.json({ items: [], connected: false, durable: usingDurableStore });
  }
  const items = await store.list(namespaceFor(token));
  return Response.json({ items, connected: true, durable: usingDurableStore });
}

// Clears the synced inbox for the current browser.
export async function DELETE() {
  const token = await readConnectionCookie();
  if (token) {
    await store.clear(namespaceFor(token));
  }
  return Response.json({ ok: true });
}
