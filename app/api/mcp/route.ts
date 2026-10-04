import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { isValidTokenShape, namespaceFor } from "@/lib/connection";
import { store, SyncedItem } from "@/lib/store";
import {
  CATEGORY_META,
  CredentialCode,
  matchesQuery,
  resolveDestinations,
  summarise,
  VISA_GUIDES,
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
          destination: z.string().describe("Destination or region, e.g. 'Kyoto, Japan'"),
          dates: z.string().optional().describe("Timing, e.g. 'Late October, 6 nights'"),
          travellers: z.string().optional().describe("Who is travelling, e.g. '2 adults'"),
          mood: z.string().optional().describe("Trip mood, e.g. 'Food and culture'"),
          notes: z.string().optional().describe("Anything else the concierge should know"),
        }),
      },
      async (args, extra) => {
        const token = tokenFrom(extra);
        if (!token) return text("Not connected. Reconnect PackYourBags with a valid token.");

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
        await store.push(namespaceFor(token), item);
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
          destination: z.string().describe("Primary destination or region"),
          summary: z.string().describe("A concise overview of the trip's shape and pacing"),
          days: z
            .array(
              z.object({
                day: z.number().int().positive(),
                title: z.string(),
                plan: z.string(),
              }),
            )
            .min(1)
            .max(14),
        }),
      },
      async (args, extra) => {
        const token = tokenFrom(extra);
        if (!token) return text("Not connected. Reconnect PackYourBags with a valid token.");

        const item: SyncedItem = {
          id: newId(),
          type: "itinerary",
          title: args.destination,
          data: { destination: args.destination, summary: args.summary, days: args.days },
          source: "assistant",
          createdAt: new Date().toISOString(),
        };
        await store.push(namespaceFor(token), item);
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
        const token = tokenFrom(extra);
        if (!token) return text("Not connected.");
        const items = await store.list(namespaceFor(token));
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
        const token = tokenFrom(extra);
        if (!token) return text("Not connected.");
        const items = await store.list(namespaceFor(token));
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
          "Check whether a traveller needs a visa for a destination, given their nationality, residence, and any visas they hold. Returns the requirement and, if a visa is required, a documentation checklist. Indicative only — always verify with official sources.",
        inputSchema: z.object({
          destination: z.string().describe("Destination country or region, e.g. 'Schengen', 'Japan', 'Mexico'"),
          nationality: z.string().default("IN").describe("Passport country code (currently 'IN' supported)"),
          residence: z.enum(RESIDENCE_VALUES).optional().describe("Residence: NONE, AE, US, UK, SCHENGEN, CA, AU"),
          heldVisas: z.array(z.enum(VISA_VALUES)).optional().describe("Valid visas held: US, SCHENGEN, UK, CA"),
        }),
      },
      async (args, extra) => {
        if (!tokenFrom(extra)) return text("Not connected.");
        const resolved = resolveDestinations(
          args.nationality.toUpperCase(),
          credentialsFrom(args.residence, args.heldVisas),
        );
        if (resolved.length === 0) {
          return text(`Nationality '${args.nationality}' isn't supported yet (currently: India / IN).`);
        }
        const q = args.destination.toLowerCase();
        const match =
          resolved.find((d) => d.name.toLowerCase() === q || d.code.toLowerCase() === q) ??
          resolved.find((d) => matchesQuery(d, args.destination));
        if (!match) {
          return text(`No visa record for '${args.destination}'. It may not be in the dataset yet — check official sources.`);
        }
        const meta = CATEGORY_META[match.effective];
        let out = `${match.name}: ${meta.label}`;
        if (match.effectiveDays) out += ` (up to ${match.effectiveDays} days)`;
        if (match.effectiveNote) out += `\n${match.effectiveNote}`;
        if (match.unlockedBy?.length) out += `\nUnlocked by: ${match.unlockedBy.join(", ")}`;
        if (match.guide && VISA_GUIDES[match.guide]) {
          const g = VISA_GUIDES[match.guide];
          out += `\n\n${g.title} — documents:\n${g.documents.map((x) => `• ${x}`).join("\n")}`;
          out += `\n\nProcess:\n${g.steps.map((x, idx) => `${idx + 1}. ${x}`).join("\n")}`;
        }
        out += `\n\nSource: ${match.source}\n(Indicative — verify with official sources before booking.)`;
        return text(out);
      },
    );

    server.registerTool(
      "list_visa_free",
      {
        title: "List easy-access destinations",
        description:
          "List destinations the traveller can enter without a prior visa (visa-free, visa on arrival, or travel authorisation), given nationality, residence, and held visas. Indicative only.",
        inputSchema: z.object({
          nationality: z.string().default("IN").describe("Passport country code (currently 'IN' supported)"),
          residence: z.enum(RESIDENCE_VALUES).optional().describe("Residence: NONE, AE, US, UK, SCHENGEN, CA, AU"),
          heldVisas: z.array(z.enum(VISA_VALUES)).optional().describe("Valid visas held: US, SCHENGEN, UK, CA"),
        }),
      },
      async (args, extra) => {
        if (!tokenFrom(extra)) return text("Not connected.");
        const resolved = resolveDestinations(
          args.nationality.toUpperCase(),
          credentialsFrom(args.residence, args.heldVisas),
        );
        if (resolved.length === 0) {
          return text(`Nationality '${args.nationality}' isn't supported yet (currently: India / IN).`);
        }
        const easy = resolved.filter((d) =>
          ["visa-free", "visa-on-arrival", "eta"].includes(d.effective),
        );
        const s = summarise(resolved);
        const lines = easy.map((d) => {
          const meta = CATEGORY_META[d.effective];
          const days = d.effectiveDays ? ` · up to ${d.effectiveDays}d` : "";
          const unlocked = d.unlockedBy?.length ? ` (via ${d.unlockedBy.join("/")})` : "";
          return `• ${d.name} — ${meta.short}${days}${unlocked}`;
        });
        return text(
          `${s.freedom} easy-access destinations of ${s.total} in the dataset:\n${lines.join("\n")}\n\n(Indicative — verify before booking.)`,
        );
      },
    );
  },
  { serverInfo: { name: "packyourbags", version: "0.1.0" } },
);

const handler = withMcpAuth(
  baseHandler,
  async (_req, bearerToken) => {
    if (!isValidTokenShape(bearerToken)) {
      return undefined;
    }
    return { token: bearerToken, clientId: "packyourbags-web", scopes: [] };
  },
  { required: true },
);

export { handler as GET, handler as POST, handler as DELETE };
