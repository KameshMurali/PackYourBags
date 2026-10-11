import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  budgetUsd,
  costMicroUsd,
  recordSpend,
  resetBudgetMemory,
  setBudgetUsd,
  spentThisMonthUsd,
  withinBudget,
} from "@/lib/budget";

beforeEach(() => {
  resetBudgetMemory();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-11T10:00:00Z"));
  vi.stubEnv("CONCIERGE_MONTHLY_BUDGET_USD", "");
  vi.stubEnv("CONCIERGE_PRICE_IN_PER_MTOK", "");
  vi.stubEnv("CONCIERGE_PRICE_OUT_PER_MTOK", "");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("pricing", () => {
  it("prices tokens at $3 in / $15 out per million by default", () => {
    // 1,000 in + 1,000 out = $0.003 + $0.015 = $0.018 = 18,000 micro-dollars
    expect(costMicroUsd({ inputTokens: 1000, outputTokens: 1000 })).toBe(18_000);
    expect(costMicroUsd({ inputTokens: 0, outputTokens: 0 })).toBe(0);
  });

  it("can be re-priced from the environment", () => {
    vi.stubEnv("CONCIERGE_PRICE_IN_PER_MTOK", "2");
    vi.stubEnv("CONCIERGE_PRICE_OUT_PER_MTOK", "10");
    expect(costMicroUsd({ inputTokens: 1000, outputTokens: 1000 })).toBe(12_000);
  });
});

describe("monthly budget", () => {
  it("defaults to $25, can come from the environment, and can be changed", async () => {
    expect(await budgetUsd()).toBe(25);
    vi.stubEnv("CONCIERGE_MONTHLY_BUDGET_USD", "40");
    expect(await budgetUsd()).toBe(40);
    await setBudgetUsd(10);
    expect(await budgetUsd()).toBe(10);
  });

  it("accumulates spend and blocks once the budget is reached", async () => {
    await setBudgetUsd(0.05);
    expect(await withinBudget()).toBe(true);

    await recordSpend({ inputTokens: 1000, outputTokens: 1000 }); // $0.018
    await recordSpend({ inputTokens: 1000, outputTokens: 1000 }); // $0.036
    expect(await spentThisMonthUsd()).toBeCloseTo(0.036, 6);
    expect(await withinBudget()).toBe(true);

    await recordSpend({ inputTokens: 1000, outputTokens: 1000 }); // $0.054
    expect(await withinBudget()).toBe(false);
  });

  it("starts a fresh month with zero spend", async () => {
    await setBudgetUsd(0.01);
    await recordSpend({ inputTokens: 1000, outputTokens: 1000 });
    expect(await withinBudget()).toBe(false);

    vi.setSystemTime(new Date("2026-11-01T00:30:00Z"));
    expect(await spentThisMonthUsd()).toBe(0);
    expect(await withinBudget()).toBe(true);
  });
});
