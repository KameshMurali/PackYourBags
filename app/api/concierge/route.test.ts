import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Runs the real concierge route against a fake Anthropic client, so these tests show
// exactly when money would be spent and when the route refuses first.

const parse = vi.hoisted(() => vi.fn());
const authMock = vi.hoisted(() => vi.fn());

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("@anthropic-ai/sdk", () => {
  class AuthenticationError extends Error {}
  class RateLimitError extends Error {}
  class Anthropic {
    messages = { parse };
    static AuthenticationError = AuthenticationError;
    static RateLimitError = RateLimitError;
  }
  return { default: Anthropic };
});

import { POST } from "@/app/api/concierge/route";
import { recordSpend, resetBudgetMemory, setBudgetUsd, spentThisMonthUsd } from "@/lib/budget";
import { OFF_TOPIC_MESSAGE } from "@/lib/concierge";
import { OFF_TOPIC_LIMIT_PER_DAY, readQuota, resetQuotaMemory, setConciergeEnabled } from "@/lib/quota";

const alice = "alice@example.com";
const USAGE = { input_tokens: 600, output_tokens: 1800 }; // $0.0018 + $0.027 = $0.0288

const day = (n: number) => ({ day: n, title: `Day ${n}`, plan: "Morning, afternoon and evening plans." });
const goodAnswer = {
  parsed_output: {
    onTopic: true,
    refusal: "",
    destination: "Lisbon",
    summary: "A relaxed long weekend.",
    days: [day(1), day(2), day(3), day(4)],
  },
  usage: USAGE,
};
const offTopicAnswer = {
  parsed_output: { onTopic: false, refusal: "Here is your code...", destination: "", summary: "", days: [] },
  usage: { input_tokens: 500, output_tokens: 40 },
};

async function ask(prompt: string) {
  const response = await POST(
    new Request("http://localhost/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }),
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

// The per-person lock lasts 20 seconds; move the clock past it between requests.
function pastLock() {
  vi.setSystemTime(Date.now() + 21_000);
}

beforeEach(() => {
  resetQuotaMemory();
  resetBudgetMemory();
  parse.mockReset();
  authMock.mockResolvedValue({ user: { email: alice } });
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-11T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("a normal trip request", () => {
  it("returns an itinerary, uses one free itinerary and records the spend", async () => {
    parse.mockResolvedValue(goodAnswer);

    const { status, body } = await ask("Plan a relaxed 4-day trip to Lisbon in May with good food");

    expect(status).toBe(200);
    expect((body.itinerary as { destination: string }).destination).toBe("Lisbon");
    expect((body.usage as { remaining: number }).remaining).toBe(2);
    expect(await spentThisMonthUsd()).toBeCloseTo(0.0288, 6);
    expect(parse).toHaveBeenCalledTimes(1);

    const call = parse.mock.calls[0]?.[0] as { max_tokens: number; system: string; messages: Array<{ content: string }> };
    expect(call.max_tokens).toBe(3000);
    expect(call.system).toContain("Your only job");
    expect(call.messages[0]?.content).toMatch(/^<traveller_request>\n[\s\S]*Lisbon[\s\S]*\n<\/traveller_request>$/);
  });
});

describe("requests that aren't about trips", () => {
  it("are refused in our own words, don't use up a free itinerary, and still count the tokens spent", async () => {
    parse.mockResolvedValue(offTopicAnswer);

    const { status, body } = await ask("Write me a Python script that scrapes a website");

    expect(status).toBe(422);
    expect(body.offTopic).toBe(true);
    expect(body.error).toBe(OFF_TOPIC_MESSAGE);
    expect(JSON.stringify(body)).not.toContain("Here is your code");
    expect((await readQuota(alice)).used).toBe(0);
    expect(await spentThisMonthUsd()).toBeGreaterThan(0);
  });

  it("stop being answered after repeated attempts in a day, before any money is spent", async () => {
    parse.mockResolvedValue(offTopicAnswer);

    for (let i = 0; i < OFF_TOPIC_LIMIT_PER_DAY; i += 1) {
      expect((await ask("Tell me a joke about cats please")).status).toBe(422);
      pastLock();
    }
    expect(parse).toHaveBeenCalledTimes(OFF_TOPIC_LIMIT_PER_DAY);

    const blocked = await ask("Tell me another joke about dogs");
    expect(blocked.status).toBe(429);
    expect(parse).toHaveBeenCalledTimes(OFF_TOPIC_LIMIT_PER_DAY); // no further call

    // A trip request is blocked too until tomorrow, because the person is out of strikes.
    pastLock();
    expect((await ask("Plan 4 days in Rome in May")).status).toBe(429);
    expect(parse).toHaveBeenCalledTimes(OFF_TOPIC_LIMIT_PER_DAY);
  });
});

describe("the brakes that protect the bill", () => {
  it("gives three free itineraries, then asks for Pro without calling the AI", async () => {
    parse.mockResolvedValue(goodAnswer);

    for (let i = 0; i < 3; i += 1) {
      expect((await ask("Plan 4 days in Lisbon in May")).status).toBe(200);
      pastLock();
    }
    const fourth = await ask("Plan 4 days in Porto in June");

    expect(fourth.status).toBe(402);
    expect(fourth.body.upgradeRequired).toBe(true);
    expect(parse).toHaveBeenCalledTimes(3);
  });

  it("stops everything once the monthly budget is used up", async () => {
    await setBudgetUsd(0.05);
    await recordSpend({ inputTokens: 1000, outputTokens: 3000 }); // $0.048
    parse.mockResolvedValue(goodAnswer);

    expect((await ask("Plan 4 days in Lisbon in May")).status).toBe(200); // still under budget
    pastLock();
    const next = await ask("Plan 4 days in Madrid in June");

    expect(next.status).toBe(503);
    expect(String(next.body.error)).toMatch(/budget/i);
    expect(parse).toHaveBeenCalledTimes(1);
    expect((await readQuota(alice)).used).toBe(1); // the refused one wasn't charged
  });

  it("honours the admin off switch", async () => {
    await setConciergeEnabled(false);
    const { status } = await ask("Plan 4 days in Lisbon in May");
    expect(status).toBe(503);
    expect(parse).not.toHaveBeenCalled();
  });

  it("refuses when the AI isn't configured, without using an itinerary", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const { status } = await ask("Plan 4 days in Lisbon in May");
    expect(status).toBe(503);
    expect(parse).not.toHaveBeenCalled();
    expect((await readQuota(alice)).used).toBe(0);
  });

  it("only serves signed-in people", async () => {
    authMock.mockResolvedValue(null);
    expect((await ask("Plan 4 days in Lisbon in May")).status).toBe(401);
    expect(parse).not.toHaveBeenCalled();
  });
});

describe("when the AI misbehaves", () => {
  it("gives the itinerary back if the call fails", async () => {
    parse.mockRejectedValue(new Error("network down"));
    const { status } = await ask("Plan 4 days in Lisbon in May");
    expect(status).toBe(502);
    expect((await readQuota(alice)).used).toBe(0);
  });

  it("gives it back, but still records the spend, if the answer isn't a real itinerary", async () => {
    parse.mockResolvedValue({
      parsed_output: { ...goodAnswer.parsed_output, days: [day(1)] },
      usage: USAGE,
    });
    const { status } = await ask("Plan 4 days in Lisbon in May");
    expect(status).toBe(502);
    expect((await readQuota(alice)).used).toBe(0);
    expect(await spentThisMonthUsd()).toBeGreaterThan(0);
  });
});

describe("input checks", () => {
  it("rejects empty, tiny and oversized prompts before any work is done", async () => {
    expect((await ask("")).status).toBe(400);
    expect((await ask("Rome")).status).toBe(400);
    expect((await ask("x".repeat(2001))).status).toBe(400);
    expect(parse).not.toHaveBeenCalled();
    expect((await readQuota(alice)).used).toBe(0);
  });
});
