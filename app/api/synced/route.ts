import { auth } from "@/auth";
import { namespaceFor, readConnectionCookie } from "@/lib/connection";
import { namespaceForUser } from "@/lib/oauth";
import { store, SyncedItem, usingDurableStore } from "@/lib/store";

export const runtime = "nodejs";

// The private spaces this browser can read: the signed-in traveller's (where
// OAuth-connected assistants write) plus a legacy manual token's, if present.
async function readableNamespaces() {
  const namespaces: string[] = [];

  const session = await auth();
  if (session?.user?.email) {
    namespaces.push(namespaceForUser(session.user.email));
  }

  const token = await readConnectionCookie();
  if (token) {
    namespaces.push(namespaceFor(token));
  }

  return namespaces;
}

// Items assistants pushed via the MCP server, newest first.
export async function GET() {
  const namespaces = await readableNamespaces();
  if (namespaces.length === 0) {
    return Response.json({ items: [], connected: false, durable: usingDurableStore });
  }

  const lists = await Promise.all(namespaces.map((namespace) => store.list(namespace)));
  const seen = new Set<string>();
  const items: SyncedItem[] = [];
  for (const item of lists.flat()) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      items.push(item);
    }
  }
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return Response.json({ items, connected: true, durable: usingDurableStore });
}

// Clears the assistant inbox for this browser.
export async function DELETE() {
  const namespaces = await readableNamespaces();
  await Promise.all(namespaces.map((namespace) => store.clear(namespace)));
  return Response.json({ ok: true });
}
