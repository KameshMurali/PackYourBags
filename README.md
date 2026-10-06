# PackYourBags

PackYourBags is a premium minimal travel planning app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- **Landing page** — product story for leave tracking, visa discovery, trip planning, and the AI concierge.
- **Accounts** — real authentication with [Auth.js](https://authjs.dev) (NextAuth v5) and Google sign-in. JWT sessions mean login works with or without a database; an optional Postgres database persists users. See [Authentication](#authentication).
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

## Authentication

Accounts use [Auth.js](https://authjs.dev) (NextAuth v5) with **Google** as the
sign-in provider. Sessions are **JWT-based**, so authentication works even with
no database. A **Postgres database is optional**: when configured it persists
users (via the Drizzle adapter); when absent the app runs JWT-only.

How it fits together (the Auth.js split-config pattern keeps middleware
edge-safe):

- `auth.config.ts` — edge-safe providers + callbacks (no database, no node-only
  imports). Imported by `middleware.ts`.
- `auth.ts` — imports `auth.config.ts`, conditionally adds the Drizzle adapter
  when `DATABASE_URL` is set, and exports `{ handlers, auth, signIn, signOut }`.
- `app/api/auth/[...nextauth]/route.ts` — exposes the Auth.js handlers.
- `middleware.ts` — protects `/dashboard`, `/concierge`, `/trips/*`, `/connect`,
  and `/admin` (redirecting unauthenticated visitors to `/signin`). `/` and
  `/visa` stay public.

Trips and itineraries intentionally remain in browser `localStorage`
(`lib/local-auth.ts`); only account/session identity moved to Auth.js.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | Yes (prod) | Encrypts the session JWT. Generate with `npx auth secret`. |
| `AUTH_GOOGLE_ID` | For sign-in | Google OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | For sign-in | Google OAuth client secret. |
| `ADMIN_EMAILS` | Optional | Comma-separated admin emails. Defaults to `kameshwar.murali@gmail.com` when unset. |
| `DATABASE_URL` | Optional | Postgres connection string. Enables user persistence + the admin user list. |

Sign-in is only enabled when **both** `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
are present. Without them the app still builds and runs — `/signin` shows a
friendly "Google sign-in isn't configured yet" message.

### Setup steps

1. **Create a Google OAuth client.** Go to the
   [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials),
   create an **OAuth client ID** of type **Web application**, and add these
   **Authorized redirect URIs**:
   - `https://packyourbags.tonewbeginning.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`

   Copy the client ID and secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
2. **Generate the session secret:** `npx auth secret` and set the result as
   `AUTH_SECRET`.
3. **(Optional) Create a Postgres database** — e.g. a free
   [Neon](https://neon.tech) or Vercel Postgres database — and set its
   connection string as `DATABASE_URL`.
4. **(Optional) Push the schema:** with `DATABASE_URL` set, run
   `npm run db:push` once to create the Auth.js tables (`user`, `account`,
   `session`, `verificationToken`). This uses `drizzle-kit push` — no migration
   files are generated.
5. **(Optional) Set `ADMIN_EMAILS`** to a comma-separated list of admin emails.
   When unset, `kameshwar.murali@gmail.com` is the default admin.

### Admin

`kameshwar.murali@gmail.com` is the built-in admin. Admin status is derived from
`ADMIN_EMAILS` on every request, so it is always correct with or without a
database; when a database is present, a `role` column on `user` is also kept in
sync on each sign-in. Admins see an **Admin** link in the dashboard header and
can open `/admin`:

- **With a database** — lists users (email, name, role, created).
- **Without a database** — shows the signed-in admin's status plus a note that
  user listing requires `DATABASE_URL`.

Non-admins are redirected away from `/admin` by the middleware and also shown a
"not authorized" panel by the in-page guard.

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

**Auth is OAuth 2.1** (the MCP authorization spec), so connecting only needs the URL:

1. The client calls `/api/mcp` without a token and gets a `401` whose `WWW-Authenticate`
   header points at `/.well-known/oauth-protected-resource`. That names this site as the
   authorization server (`/.well-known/oauth-authorization-server`).
2. It registers itself at `/api/oauth/register` (Dynamic Client Registration, RFC 7591).
3. It opens `/oauth/authorize`: the traveller signs in with Google and clicks **Allow**.
4. It swaps the code for tokens at `/api/oauth/token` (PKCE S256 required; refresh supported).

The server is **stateless**: client IDs, codes, and tokens are HMAC-signed with
`AUTH_SECRET` (or `MCP_OAUTH_SECRET`), so it works across serverless instances with no
storage. Codes expire after 5 minutes and access tokens after 1 hour; refresh tokens last
30 days, and rotating the secret revokes everything. Assistant data lands in a namespace
derived from the traveller's verified Google email, so every connector they authorize
writes to the same inbox their signed-in `/connect` page reads. The core logic is in
`lib/oauth.ts`.

Manual bearer tokens (`pyb_...`, generated under **Advanced** on `/connect`) still work for
clients without OAuth, such as the `mcp-remote` bridge.

**Storage** is pluggable (`lib/store.ts`): in-memory for local dev, or **Upstash Redis**
in production when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set (via the
Upstash REST API — no SDK). In-memory data is dropped on serverless cold starts, so set
Upstash for reliable sync.

Connecting (connector URL: `https://<your-domain>/api/mcp`):

- **Claude (web & desktop)** — Settings → Connectors → Add custom connector → paste the URL
  → Connect → continue with Google → Allow.
- **ChatGPT** — turn on Developer mode, create a connector with the URL, choose OAuth, then
  continue with Google → Allow.
- **Claude Code / other MCP clients** — e.g. `claude mcp add --transport http packyourbags <URL>`;
  the browser opens for sign-in.

Full per-client steps are on the in-app `/connect` page.

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
| `AUTH_SECRET` | Encrypts the Auth.js session JWT — generate with `npx auth secret` (required in production) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth credentials; sign-in is enabled only when both are set |
| `ADMIN_EMAILS` | Comma-separated admin emails (defaults to `kameshwar.murali@gmail.com` when unset) |
| `DATABASE_URL` | Optional Postgres connection string for user persistence; run `npm run db:push` after setting it |
| `ANTHROPIC_API_KEY` | Required for concierge itinerary generation |
| `ANTHROPIC_MODEL` | Optional — override the default `claude-sonnet-4-6` |
| `USAGE_COOKIE_SECRET` | Sign the free-tier quota cookie so it can't be forged |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Durable MCP sync storage (recommended) |

> After adding `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`, make sure the production
> redirect URI `https://packyourbags.tonewbeginning.com/api/auth/callback/google`
> is registered on the Google OAuth client.
