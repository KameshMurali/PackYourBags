# PackYourBags

PackYourBags is a premium minimal travel planning app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- **Landing page** — product story for leave tracking, visa discovery, trip planning, and the AI concierge.
- **Prototype accounts** — register and sign in with a browser-local account (stored in `localStorage`; no passwords are stored or checked).
- **Trip briefs** — capture destination, timing, travellers, mood, and notes at `/trips/new`, then hand the brief to the concierge.
- **AI concierge** — `/concierge` turns a free-text brief into a 3–7 day itinerary using Claude Sonnet (`claude-sonnet-4-6`). Supports `?from=brief` (prefill from the saved trip brief) and `?view=latest` (reopen the last generated itinerary).
- **Free tier + Pro** — Starter accounts get 3 free itineraries, enforced server-side via a signed HTTP-only cookie. After that the API returns 402 and the concierge shows an upgrade card. `/api/subscribe` is a demo checkout that unlocks unlimited Pro in the current browser — swap it for a real billing provider before launch.
- **Dashboard** — greeting, saved brief, latest itinerary preview, and visa-aware inspiration.

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

Add `ANTHROPIC_API_KEY` (and `USAGE_COOKIE_SECRET`) in Vercel project settings to enable concierge generation.
