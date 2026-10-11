import { auth } from "@/auth";
import { namespaceForUser } from "@/lib/oauth";
import { store, SyncedItem, usingDurableStore } from "@/lib/store";

export const runtime = "nodejs";

// The signed-in traveller's private space. OAuth connections and manual tokens both write
// here, because both resolve to the same account namespace.
async function readableNamespaces() {
  const session = await auth();
  return session?.user?.email ? [namespaceForUser(session.user.email)] : [];
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
