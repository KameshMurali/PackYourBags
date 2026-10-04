# PackYourBags

PackYourBags is a premium minimal travel planning app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- **Landing page** — product story for leave tracking, visa discovery, trip planning, and the AI concierge.
- **Prototype accounts** — register and sign in with a browser-local account (stored in `localStorage`; no passwords are stored or checked).
- **Trip briefs** — capture destination, timing, travellers, mood, and notes at `/trips/new`, then hand the brief to the concierge.
- **AI concierge** — `/concierge` turns a free-text brief into a 3–7 day itinerary using Claude Sonnet (`claude-sonnet-4-6`). Supports `?from=brief` (prefill from the saved trip brief) and `?view=latest` (reopen the last generated itinerary).
- **Free tier + Pro** — Starter accounts get 3 free itineraries, enforced server-side via a signed HTTP-only cookie. After that the API returns 402 and the concierge shows an upgrade card. `/api/subscribe` is a demo checkout that unlocks unlimited Pro in the current browser — swap it for a real billing provider before launch.
- **Visa intelligence** — `/visa` resolves destinations by passport + residence + held visas (e.g. Indian passport + UAE residence, or a US visa unlocking Mexico/Georgia), grouped into visa-free / on-arrival / ETA / eVisa / visa-required, with documentation checklists and step-by-step guides for Schengen, US, and UK. Indicative only — every record links to an official source.
- **Connect to ChatGPT / Claude (MCP)** — `/connect` + an MCP server at `/api/mcp` let an AI assistant read and write your trips, itineraries, and run visa checks from a chat.
- **Dashboard** — greeting, saved brief, premium itinerary timeline, feature entry points, and visa-aware inspiration.

## Local development

```bash
nvm use
npm install
npm run dev
```

Then open `http://localhost:3000`.

## AI concierge

Create an Anthropic API key at [platform.claude.com](https://platform.claude.com) and add it to `.env.local`:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Restart the dev server after adding the key. The concierge uses `claude-sonnet-4-6`
by default; set `ANTHROPIC_MODEL` to another Claude model ID to override it.

Set `USAGE_COOKIE_SECRET` to a long random string in production so the free-tier
quota cookie cannot be forged.

## Connect to ChatGPT / Claude (MCP server)

PackYourBags exposes a remote [MCP](https://modelcontextprotocol.io) server over
Streamable HTTP at `/api/mcp`, built with `mcp-handler` + `@modelcontextprotocol`.
An assistant connected to it can call these tools:

| Tool | What it does |
| --- | --- |
| `save_trip` | Save a trip brief into the traveller's workspace |
| `save_itinerary` | Save a day-by-day itinerary (1–14 days) |
| `list_trips` | List saved trips and itineraries |
| `get_latest_itinerary` | Return the most recent itinerary |
| `check_visa` | Visa requirement + documentation checklist for a destination |
| `list_visa_free` | Destinations reachable without a prior visa |

**Auth** is a bearer token. The traveller generates one at `/connect`, which stores it
in a cookie (so the web app reads the same private namespace) and displays it to paste
into their assistant's connector config as `Authorization: Bearer <token>`. The token's
SHA-256 hash is the storage namespace — the raw secret is never used as a key.

**Storage** is pluggable (`lib/store.ts`): in-memory for local dev, or **Upstash Redis**
in production when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set (via the
Upstash REST API — no SDK). In-memory data is dropped on serverless cold starts, so set
Upstash for reliable sync.

Connecting:

- **Claude Desktop** — add a remote MCP server with the `/api/mcp` URL and an
  `Authorization: Bearer <token>` header (or use the `mcp-remote` bridge with
  `--header`).
- **Claude.ai** — Settings → Connectors → add a custom connector with the URL + token.
- **ChatGPT** — enable Developer mode / Connectors and add the MCP server URL + bearer header.

Full per-client steps are on the in-app `/connect` page. OAuth 2.1 (one-click connect for
hosted connectors) is the production upgrade path — see `docs/ROADMAP.md`.

## Quality checks

```bash
npm run lint
npm run build
```

## Vercel deployment

This project is ready for zero-config deployment on Vercel.

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as `Next.js`.
3. Use Node.js 20 or newer.
4. Deploy.

Environment variables in Vercel project settings:

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Required for concierge itinerary generation |
| `ANTHROPIC_MODEL` | Optional — override the default `claude-sonnet-4-6` |
| `USAGE_COOKIE_SECRET` | Sign the free-tier quota cookie so it can't be forged |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Durable MCP sync storage (recommended) |
