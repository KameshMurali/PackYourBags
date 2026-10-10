import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { auth } from "@/auth";
import { releaseGeneration, reserveGeneration, usageFor } from "@/lib/quota";
import { countItinerary } from "@/lib/store";

const MAX_PROMPT_LENGTH = 2000;
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are PackYourBags, a premium travel concierge.

Create a thoughtful, destination-specific itinerary from the traveller's request.
Use concrete neighbourhoods, landmarks, food experiences, and realistic pacing when the destination is clear.
Do not invent booking confirmations, prices, visa rules, or live availability.
Return between 3 and 7 days. Make each day meaningfully different.`;

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

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(MAX_PROMPT_LENGTH),
});

export async function POST(request: Request) {
  // The /concierge page is behind sign-in, but this endpoint spends Anthropic
  // credits, so it must check the session itself rather than trust the page.
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return Response.json({ error: "Sign in to use the concierge." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON body with a prompt field." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    const tooLong = parsed.error.issues.some((issue) => issue.code === "too_big");
    return Response.json(
      {
        error: tooLong
          ? `Keep the trip brief under ${MAX_PROMPT_LENGTH} characters.`
          : "Describe the trip you want to plan.",
      },
      { status: 400 },
    );
  }

  // Check configuration before reserving anything, so a misconfigured server never
  // costs anyone an itinerary.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The concierge is resting. Please try again later." },
      { status: 503 },
    );
  }

  // Take one itinerary from this person's allowance (and from today's global cap) up
  // front, so parallel requests can't race past the limit. Fail closed: if storage is
  // unreachable we'd rather decline than spend money without counting it.
  let reservation;
  try {
    reservation = await reserveGeneration(email);
  } catch (error) {
    console.error("Concierge quota check failed", error);
    return Response.json(
      { error: "The concierge is resting. Please try again later." },
      { status: 503 },
    );
  }

  if (!reservation.ok) {
    return Response.json(
      {
        error: reservation.error,
        upgradeRequired: reservation.upgradeRequired,
        usage: await usageFor(email).catch(() => undefined),
      },
      { status: reservation.status },
    );
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Traveller request:\n${parsed.data.prompt}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(itinerarySchema),
      },
    });

    if (!response.parsed_output) {
      await releaseGeneration(email).catch(() => {});
      return Response.json(
        { error: "The concierge could not shape that into an itinerary. Please try again." },
        { status: 502 },
      );
    }

    await countItinerary(email).catch(() => {});

    return Response.json({
      itinerary: response.parsed_output,
      usage: await usageFor(email).catch(() => undefined),
    });
  } catch (error) {
    await releaseGeneration(email).catch(() => {});

    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Concierge: Anthropic rejected the API key");
      return Response.json(
        { error: "The concierge is resting. Please try again later." },
        { status: 503 },
      );
    }

    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "The concierge is busy right now. Please try again in a moment." },
        { status: 429 },
      );
    }

    console.error("Concierge generation failed", error);
    return Response.json(
      { error: "The concierge could not generate an itinerary. Please try again." },
      { status: 502 },
    );
  }
}
