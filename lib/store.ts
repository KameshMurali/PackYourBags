// Pluggable per-namespace item store shared by the MCP server and the web app.
//
// - Local dev / single warm instance: in-memory Map (resets on cold start).
// - Production: Upstash Redis via its REST API when UPSTASH_REDIS_REST_URL and
//   UPSTASH_REDIS_REST_TOKEN are set. No SDK dependency — just fetch().
//
// Everything is namespaced so one traveller's assistant data never mixes with
// another's. The namespace is a hash of the connection token (see mcp-auth.ts).

export type SyncedItemType = "trip" | "itinerary";

export type SyncedItem = {
  id: string;
  type: SyncedItemType;
  title: string;
  data: unknown;
  source: string;
  createdAt: string;
};

const MAX_ITEMS = 50;

interface Store {
  push(namespace: string, item: SyncedItem): Promise<void>;
  list(namespace: string): Promise<SyncedItem[]>;
  clear(namespace: string): Promise<void>;
}

function key(namespace: string) {
  return `pyb:items:${namespace}`;
}

// --- In-memory -------------------------------------------------------------
const memory = new Map<string, SyncedItem[]>();

const memoryStore: Store = {
  async push(namespace, item) {
    const list = memory.get(key(namespace)) ?? [];
    list.unshift(item);
    memory.set(key(namespace), list.slice(0, MAX_ITEMS));
  },
  async list(namespace) {
    return memory.get(key(namespace)) ?? [];
  },
  async clear(namespace) {
    memory.delete(key(namespace));
  },
};

// --- Upstash Redis (REST) --------------------------------------------------
// Upstash's own variable names, or the KV_* names that Vercel's Marketplace
// "Upstash for Redis" integration sets automatically.
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

async function upstash(command: unknown[]): Promise<unknown> {
  const response = await fetch(UPSTASH_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash error ${response.status}`);
  }

  const json = (await response.json()) as { result?: unknown; error?: string };

  if (json.error) {
    throw new Error(json.error);
  }

  return json.result;
}

const upstashStore: Store = {
  async push(namespace, item) {
    await upstash(["LPUSH", key(namespace), JSON.stringify(item)]);
    await upstash(["LTRIM", key(namespace), 0, MAX_ITEMS - 1]);
  },
  async list(namespace) {
    const result = (await upstash(["LRANGE", key(namespace), 0, -1])) as string[] | null;
    if (!result) {
      return [];
    }
    return result
      .map((raw) => {
        try {
          return JSON.parse(raw) as SyncedItem;
        } catch {
          return null;
        }
      })
      .filter((item): item is SyncedItem => item !== null);
  },
  async clear(namespace) {
    await upstash(["DEL", key(namespace)]);
  },
};

export const store: Store = UPSTASH_URL && UPSTASH_TOKEN ? upstashStore : memoryStore;

export const usingDurableStore = Boolean(UPSTASH_URL && UPSTASH_TOKEN);
