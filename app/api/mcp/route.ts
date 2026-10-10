import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { isValidTokenShape, namespaceFor } from "@/lib/connection";
import { readAccessToken } from "@/lib/oauth";
import { store, SyncedItem } from "@/lib/store";
import {
  CredentialCode,
  easyAccessAnswer,
  supportedPassportsLabel,
  visaCheckAnswer,
} from "@/lib/visa";

export const runtime = "nodejs";

const RESIDENCE_VALUES = ["NONE", "AE", "US", "UK", "SCHENGEN", "CA", "AU"] as const;
const VISA_VALUES = ["US", "SCHENGEN", "UK", "CA"] as const;

function tokenFrom(extra: unknown): string | null {
  const e = extra as
    | { authInfo?: { token?: string }; http?: { authInfo?: { token?: string } } }
    | undefined;
  return e?.authInfo?.token ?? e?.http?.authInfo?.token ?? null;
}

type AuthInfoLike = { token?: string; extra?: Record<string, unknown> };

// The traveller's private storage namespace for this request. OAuth access
// tokens carry it (set in verifyToken below); legacy pyb_ tokens hash to one.
function namespaceFrom(extra: unknown): string | null {
  const e = extra as { authInfo?: AuthInfoLike; http?: { authInfo?: AuthInfoLike } } | undefined;
  const info = e?.authInfo ?? e?.http?.authInfo;
  const namespace = info?.extra?.namespace;
  if (typeof namespace === "string" && namespace) {
    return namespace;
  }
  return info?.token ? namespaceFor(info.token) : null;
}

function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

function credentialsFrom(
  residence: string | undefined,
  heldVisas: string[] | undefined,
): CredentialCode[] {
  const set = new Set<CredentialCode>();
  if (residence && residence !== "NONE") {
    set.add(residence as CredentialCode);
  }
  for (const v of heldVisas ?? []) {
    set.add(v as CredentialCode);
  }
  return Array.from(set);
}

const baseHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      "save_trip",
      {
        title: "Save a trip brief to PackYourBags",
        description:
          "Save a traveller's trip brief (destination, timing, who's going, mood, notes) into their PackYourBags workspace so it appears in their dashboard inbox.",
        inputSchema: z.object({
          destination: z.string().trim().min(1).max(120).describe("Destination or region, e.g. 'Kyoto, Japan'"),
          dates: z.string().max(200).optional().describe("Timing, e.g. 'Late October, 6 nights'"),
          travellers: z.string().max(200).optional().describe("Who is travelling, e.g. '2 adults'"),
          mood: z.string().max(200).optional().describe("Trip mood, e.g. 'Food and culture'"),
          notes: z.string().max(2000).optional().describe("Anything else the concierge should know"),
        }),
      },
      async (args, extra) => {
        const namespace = namespaceFrom(extra);
        if (!namespace) return text("Not connected. Reconnect PackYourBags from your assistant's connector settings.");

        const item: SyncedItem = {
          id: newId(),
          type: "trip",
          title: args.destination,
          data: {
            destination: args.destination,
            dates: args.dates ?? "Timing to refine",
            travellers: args.travellers ?? "Traveller details to refine",
            mood: args.mood ?? "Concierge brief",
            notes: args.notes ?? "",
          },
          source: "assistant",
          createdAt: new Date().toISOString(),
        };
        await store.push(namespace, item);
        return text(`Saved trip brief for ${args.destination} to PackYourBags. Open the Connected inbox to import it.`);
      },
    );

    server.registerTool(
      "save_itinerary",
      {
        title: "Save a day-by-day itinerary to PackYourBags",
        description:
          "Save a generated day-by-day itinerary into the traveller's PackYourBags workspace. Use 1–14 meaningfully different days.",
        inputSchema: z.object({
          destination: z.string().trim().min(1).max(120).describe("Primary destination or region"),
          summary: z.string().max(1500).describe("A concise overview of the trip's shape and pacing"),
          days: z
            .array(
              z.object({
                day: z.number().int().positive(),
                title: z.string().max(200),
                plan: z.string().max(3000),
              }),
            )
            .min(1)
            .max(14),
        }),
      },
      async (args, extra) => {
        const namespace = namespaceFrom(extra);
        if (!namespace) return text("Not connected. Reconnect PackYourBags from your assistant's connector settings.");

        const item: SyncedItem = {
          id: newId(),
          type: "itinerary",
          title: args.destination,
          data: { destination: args.destination, summary: args.summary, days: args.days },
          source: "assistant",
          createdAt: new Date().toISOString(),
        };
        await store.push(namespace, item);
        return text(`Saved a ${args.days.length}-day itinerary for ${args.destination} to PackYourBags.`);
      },
    );

    server.registerTool(
      "list_trips",
      {
        title: "List the traveller's saved trips and itineraries",
        description: "Return the trips and itineraries saved in this PackYourBags workspace.",
        inputSchema: z.object({}),
      },
      async (_args, extra) => {
        const namespace = namespaceFrom(extra);
        if (!namespace) return text("Not connected.");
        const items = await store.list(namespace);
        if (items.length === 0) return text("No saved trips or itineraries yet.");
        const lines = items.map((i) => {
          const when = new Date(i.createdAt).toISOString().slice(0, 10);
          return `- [${i.type}] ${i.title} (saved ${when})`;
        });
        return text(`Saved items (${items.length}):\n${lines.join("\n")}`);
      },
    );

    server.registerTool(
      "get_latest_itinerary",
      {
        title: "Get the most recent itinerary",
        description: "Return the full day-by-day plan of the most recently saved itinerary.",
        inputSchema: z.object({}),
      },
      async (_args, extra) => {
        const namespace = namespaceFrom(extra);
        if (!namespace) return text("Not connected.");
        const items = await store.list(namespace);
        const latest = items.find((i) => i.type === "itinerary");
        if (!latest) return text("No itinerary saved yet.");
        const d = latest.data as {
          destination: string;
          summary: string;
          days: Array<{ day: number; title: string; plan: string }>;
        };
        const days = d.days.map((day) => `Day ${day.day} — ${day.title}: ${day.plan}`).join("\n");
        return text(`${d.destination}\n${d.summary}\n\n${days}`);
      },
    );

    server.registerTool(
      "check_visa",
      {
        title: "Check the visa requirement for a destination",
        description:
          "Check whether a traveller needs a visa for a destination, given their passport, residence, and any visas they hold. Recognises every country and major territory, including native names (Deutschland, Brasil), major cities (Dubai, Bali) and typos. Returns the requirement and conditions, a how-to-apply checklist when a visa is needed, the official source and the date the rule was last reviewed. If the rule isn't verified for that passport yet, it says so and links the official source instead of guessing. Indicative only — always verify with official sources.",
        inputSchema: z.object({
          destination: z
            .string()
            .describe("Destination country, territory, city or 'Schengen', e.g. 'Germany', 'Japan', 'Dubai'"),
          nationality: z
            .string()
            .default("IN")
            .describe(`Passport as an ISO code or country name. Supported: ${supportedPassportsLabel()}`),
          residence: z
            .enum([...RESIDENCE_VALUES, "JP"] as const)
            .optional()
            .describe("Where the traveller lives: NONE, AE, US, UK, SCHENGEN, CA, AU, JP"),
          heldVisas: z
            .array(z.enum([...VISA_VALUES, "AU", "JP"] as const))
            .optional()
            .describe("Valid visas held: US, SCHENGEN, UK, CA, AU, JP"),
        }),
      },
      async (args, extra) => {
        if (!tokenFrom(extra)) return text("Not connected.");
        return text(
          visaCheckAnswer({
            passport: args.nationality,
            destination: args.destination,
            residence: args.residence,
            credentials: credentialsFrom(args.residence, args.heldVisas),
          }),
        );
      },
    );

    server.registerTool(
      "list_visa_free",
      {
        title: "List easy-access destinations",
        description:
          "List the verified destinations a traveller can enter without a visa in advance (visa-free, visa on arrival, or a travel authorisation), given their passport, residence, and held visas, with each rule's source and review date. Destinations not yet verified for that passport are left out; check them with check_visa. Indicative only.",
        inputSchema: z.object({
          nationality: z
            .string()
            .default("IN")
            .describe(`Passport as an ISO code or country name. Supported: ${supportedPassportsLabel()}`),
          residence: z
            .enum([...RESIDENCE_VALUES, "JP"] as const)
            .optional()
            .describe("Where the traveller lives: NONE, AE, US, UK, SCHENGEN, CA, AU, JP"),
          heldVisas: z
            .array(z.enum([...VISA_VALUES, "AU", "JP"] as const))
            .optional()
            .describe("Valid visas held: US, SCHENGEN, UK, CA, AU, JP"),
        }),
      },
      async (args, extra) => {
        if (!tokenFrom(extra)) return text("Not connected.");
        return text(
          easyAccessAnswer({
            passport: args.nationality,
            residence: args.residence,
            credentials: credentialsFrom(args.residence, args.heldVisas),
          }),
        );
      },
    );
  },
  { serverInfo: { name: "packyourbags", version: "0.1.0" } },
);

const handler = withMcpAuth(
  baseHandler,
  async (_req, bearerToken) => {
    if (!bearerToken) {
      return undefined;
    }

    // OAuth access token from the connector flow (Claude, ChatGPT): data goes
    // to the signed-in traveller's namespace.
    const oauth = readAccessToken(bearerToken);
    if (oauth) {
      return {
        token: bearerToken,
        clientId: oauth.cid,
        scopes: [oauth.scope],
        expiresAt: oauth.exp,
        extra: { namespace: oauth.sub, email: oauth.email },
      };
    }

    // Legacy manual token from /connect (pyb_...): still supported.
    if (isValidTokenShape(bearerToken)) {
      return {
        token: bearerToken,
        clientId: "packyourbags-web",
        scopes: [],
        extra: { namespace: namespaceFor(bearerToken) },
      };
    }

    return undefined;
  },
  { required: true },
);

export { handler as GET, handler as POST, handler as DELETE };
