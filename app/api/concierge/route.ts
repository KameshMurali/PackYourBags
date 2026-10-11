import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { auth } from "@/auth";
import { recordSpend, withinBudget } from "@/lib/budget";
import {
  interpretOutput,
  itinerarySchema,
  MAX_PROMPT_LENGTH,
  MIN_PROMPT_LENGTH,
  SYSTEM_PROMPT,
  wrapTravellerRequest,
} from "@/lib/concierge";
import { recordOffTopic, releaseGeneration, reserveGeneration, usageFor } from "@/lib/quota";
import { countItinerary } from "@/lib/store";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
// A 7-day itinerary at the prompt's length limit is well under this; it caps the worst case.
const MAX_OUTPUT_TOKENS = 3000;

const requestSchema = z.object({
  prompt: z.string().trim().min(MIN_PROMPT_LENGTH).max(MAX_PROMPT_LENGTH),
});

const RESTING = { error: "The concierge is resting. Please try again later." };

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

  // Check configuration and the monthly budget before reserving anything, so a
  // misconfigured or capped server never costs anyone an itinerary.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(RESTING, { status: 503 });
  }

  try {
    if (!(await withinBudget())) {
      return Response.json(
        { error: "The concierge has reached this month’s budget and will be back next month." },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Concierge budget check failed", error);
    return Response.json(RESTING, { status: 503 });
  }

  // Take one itinerary from this person's allowance (and from today's global cap) up
  // front, so parallel requests can't race past the limit. Fail closed: if storage is
  // unreachable we'd rather decline than spend money without counting it.
  let reservation;
  try {
    reservation = await reserveGeneration(email);
  } catch (error) {
    console.error("Concierge quota check failed", error);
    return Response.json(RESTING, { status: 503 });
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
      max_tokens: MAX_OUTPUT_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: wrapTravellerRequest(parsed.data.prompt) }],
      output_config: {
        format: zodOutputFormat(itinerarySchema),
      },
    });

    // Whatever the answer turns out to be, the tokens were used: count them.
    await recordSpend({
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
    }).catch((error) => console.error("Concierge spend recording failed", error));

    const outcome = interpretOutput(response.parsed_output);

    if (outcome.kind === "off-topic") {
      // Not a trip request: it doesn't use up a free itinerary, but it counts as a strike.
      await releaseGeneration(email).catch(() => {});
      await recordOffTopic(email).catch(() => {});
      return Response.json(
        { error: outcome.message, offTopic: true, usage: await usageFor(email).catch(() => undefined) },
        { status: 422 },
      );
    }

    if (outcome.kind === "invalid") {
      await releaseGeneration(email).catch(() => {});
      return Response.json(
        { error: "The concierge could not shape that into an itinerary. Please try again." },
        { status: 502 },
      );
    }

    await countItinerary(email).catch(() => {});

    return Response.json({
      itinerary: outcome.itinerary,
      usage: await usageFor(email).catch(() => undefined),
    });
  } catch (error) {
    await releaseGeneration(email).catch(() => {});

    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Concierge: Anthropic rejected the API key");
      return Response.json(RESTING, { status: 503 });
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
