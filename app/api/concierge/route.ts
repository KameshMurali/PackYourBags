import { generateText, Output } from "ai";
import { z } from "zod";

const itinerarySchema = z.object({
  destination: z.string().describe("The primary destination or region"),
  summary: z.string().describe("A concise overview of the trip's shape and pacing"),
  days: z
    .array(
      z.object({
        day: z.number().int().positive(),
        title: z.string(),
        plan: z.string(),
      }),
    )
    .min(3)
    .max(7),
});

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json(
      {
        error:
          "AI Gateway is not configured. Add AI_GATEWAY_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 },
    );
  }

  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt?.trim()) {
    return Response.json({ error: "Describe the trip you want to plan." }, { status: 400 });
  }

  try {
    const { output } = await generateText({
      model: process.env.AI_GATEWAY_MODEL ?? "openai/gpt-5.4",
      output: Output.object({ schema: itinerarySchema }),
      prompt: `You are PackYourBags, a premium travel concierge.

Create a thoughtful, destination-specific itinerary from the traveller's request.
Use concrete neighbourhoods, landmarks, food experiences, and realistic pacing when the destination is clear.
Do not invent booking confirmations, prices, visa rules, or live availability.
Return between 3 and 7 days. Make each day meaningfully different.

Traveller request:
${prompt.trim()}`,
    });

    return Response.json(output);
  } catch (error) {
    console.error("Concierge generation failed", error);
    const message = error instanceof Error ? error.message : "";

    if (message.includes("valid credit card")) {
      return Response.json(
        {
          error:
            "AI Gateway is connected, but Vercel requires billing verification before it can generate itineraries. Add a card in your Vercel AI Gateway settings, then try again.",
        },
        { status: 403 },
      );
    }

    return Response.json(
      { error: "The concierge could not generate an itinerary. Please try again." },
      { status: 502 },
    );
  }
}
