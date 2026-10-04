# PackYourBags — trends analysis & roadmap

_Last updated: 2026-10-04_

## Where travel-planning products are heading (2026)

1. **Assistant-native planning.** People increasingly plan trips *inside* ChatGPT and
   Claude. The winning move is not to rebuild the chatbot — it's to be the **system of
   record** the assistant writes into. MCP (Model Context Protocol) is now the common
   standard for this, supported by Claude and ChatGPT. → shipped: the PackYourBags MCP
   server (`/api/mcp`) + `/connect`.
2. **Visa-first discovery.** Travellers increasingly filter by "where can I actually go"
   before destinations. Passport + residence + held-visa logic (e.g. an Indian passport
   with UAE residence, or a US visa unlocking Mexico/Georgia) is a genuine differentiator.
   → shipped: `/visa`.
3. **Structured, verifiable AI output.** Free-text itineraries are being replaced by typed,
   editable structures. → already using Claude Sonnet with structured outputs.
4. **Agentic execution.** The next step beyond "generate a plan" is "do the admin" — leave
   requests, booking checklists, visa appointment reminders.
5. **Durable, portable profiles.** The traveller profile (passport, residence, loyalty,
   preferences) should persist across devices and feed every surface.

## What we shipped this round

- **Visa Intelligence** (`/visa`) — passport + residence + held-visa engine, grouped
  requirements, documentation guides for Schengen / US / UK. Indicative + source-linked.
- **MCP server** (`/api/mcp`) — remote Streamable-HTTP MCP with 6 tools, bearer auth, a
  pluggable store (in-memory / Upstash), and a `/connect` setup + import inbox.
- **Premium itinerary timeline** — redesigned concierge + dashboard itinerary view.

## Highest-leverage next steps (prioritised)

### P0 — make it real
- **Durable storage + real accounts.** Replace `localStorage` + in-memory store with a DB
  (Postgres/Neon) and real auth (NextAuth). This unlocks cross-device sync and is the
  foundation for everything else.
- **OAuth for MCP.** Bearer tokens work today; hosted ChatGPT/Claude connectors prefer
  OAuth 2.1. Add an authorization server so "Connect" is one click.

### P1 — depth
- **Expand visa coverage.** More passports; wire a live source (IATA Timatic / Sherpa API)
  behind the current data model so rules stay current, with `lastReviewed` per record.
- **Traveller profile.** Store passport/residence/held-visas once; auto-apply to the visa
  explorer, concierge prompts, and MCP tools.
- **Visa tasks → itinerary.** Turn a "visa required" result into a checklist with
  appointment reminders on the dashboard.

### P2 — reach
- **Leave/PTO integration** (Google/Outlook calendar) to make "leave-aware" real.
- **Booking hand-off** (flights/hotels affiliate deep links) from the itinerary.
- **Shareable trip spaces** (public read-only itinerary pages).

## Known caveats (current prototype)
- Visa data is curated and indicative — every record links to an official source; verify
  before booking. Primary coverage: Indian passport.
- MCP store is in-memory unless `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are
  set; serverless cold starts drop in-memory data.
- MCP auth is bearer-token; treat the token like a password, regenerate if leaked.
- Concierge needs `ANTHROPIC_API_KEY` in the environment to generate itineraries.
