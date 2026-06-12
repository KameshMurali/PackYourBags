import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { FREE_GENERATION_LIMIT, toUsageInfo } from "@/lib/plan";
import { readUsageState, writeUsageState } from "@/lib/usage";

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

  const usage = await readUsageState();

  if (usage.plan !== "pro" && usage.used >= FREE_GENERATION_LIMIT) {
    return Response.json(
      {
        error: `You have used all ${FREE_GENERATION_LIMIT} free itineraries. Upgrade to Pro for unlimited concierge planning.`,
        upgradeRequired: true,
        usage: toUsageInfo(usage.plan, usage.used),
      },
      { status: 402 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "The concierge is not configured. Add ANTHROPIC_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 },
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
      return Response.json(
        { error: "The concierge could not shape that into an itinerary. Please try again." },
        { status: 502 },
      );
    }

    const nextState =
      usage.plan === "pro" ? usage : { plan: usage.plan, used: usage.used + 1 };
    await writeUsageState(nextState);

    return Response.json({
      itinerary: response.parsed_output,
      usage: toUsageInfo(nextState.plan, nextState.used),
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "The concierge API key is invalid. Check ANTHROPIC_API_KEY and try again." },
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
