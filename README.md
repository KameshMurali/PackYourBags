# PackYourBags

PackYourBags is a premium minimal travel planning landing page built with Next.js App Router, TypeScript, and Tailwind CSS.

## Local development

```bash
nvm use
npm install
npm run dev
```

Then open `http://localhost:3000`.

## AI concierge

Create a Vercel AI Gateway key and add it to `.env.local`:

```bash
AI_GATEWAY_API_KEY=your_gateway_key
```

Restart the dev server after adding the key. The concierge route uses `openai/gpt-5.4`
by default. Set `AI_GATEWAY_MODEL` to another Gateway model slug to override it.

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

Add `AI_GATEWAY_API_KEY` in Vercel project settings to enable concierge generation.
