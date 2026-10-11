import { kv, usingDurableStore } from "@/lib/store";

// An app-level monthly spending cap for the AI concierge, separate from (and a backstop
// in front of) any limit set in the Anthropic console. Each real call's token usage is
// priced and added to the month's total; once the total reaches the budget the concierge
// politely refuses until next month. The budget can be changed from /admin.
//
// Prices are dollars per million tokens and default to Claude Sonnet 4.6's list price.
// If you switch ANTHROPIC_MODEL to something cheaper the app simply over-estimates, which
// is the safe direction; raise or lower the prices with CONCIERGE_PRICE_IN_PER_MTOK and
// CONCIERGE_PRICE_OUT_PER_MTOK when you want the numbers exact.

const BUDGET_KEY = "pyb:cfg:monthly-budget";
const DEFAULT_BUDGET_USD = 25;

function number(value: string | undefined, fallback: number) {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const priceIn = () => number(process.env.CONCIERGE_PRICE_IN_PER_MTOK, 3);
const priceOut = () => number(process.env.CONCIERGE_PRICE_OUT_PER_MTOK, 15);

const spendKey = () => `pyb:spend:${new Date().toISOString().slice(0, 7).replace("-", "")}`;

// --- In-memory fallback ----------------------------------------------------------
const memorySpend = new Map<string, number>(); // micro-dollars per month key
let memoryBudget: number | null = null;

/** Test helper: forget all in-memory state. */
export function resetBudgetMemory() {
  memorySpend.clear();
  memoryBudget = null;
}

/** Cost of one call in micro-dollars ($ per million tokens equals micro-dollars per token). */
export function costMicroUsd(usage: { inputTokens: number; outputTokens: number }) {
  return Math.ceil(usage.inputTokens * priceIn() + usage.outputTokens * priceOut());
}

export async function budgetUsd(): Promise<number> {
  if (!usingDurableStore) {
    return memoryBudget ?? number(process.env.CONCIERGE_MONTHLY_BUDGET_USD, DEFAULT_BUDGET_USD);
  }
  const stored = await kv.command(["GET", BUDGET_KEY]);
  return number(String(stored ?? ""), number(process.env.CONCIERGE_MONTHLY_BUDGET_USD, DEFAULT_BUDGET_USD));
}

export async function setBudgetUsd(amount: number): Promise<void> {
  if (!usingDurableStore) {
    memoryBudget = amount;
    return;
  }
  await kv.command(["SET", BUDGET_KEY, String(amount)]);
}

export async function spentThisMonthUsd(): Promise<number> {
  if (!usingDurableStore) {
    return (memorySpend.get(spendKey()) ?? 0) / 1_000_000;
  }
  const stored = await kv.command(["GET", spendKey()]);
  return (Number.parseInt(String(stored ?? "0"), 10) || 0) / 1_000_000;
}

/** Adds one call's cost to this month's total. */
export async function recordSpend(usage: { inputTokens: number; outputTokens: number }): Promise<void> {
  const micro = costMicroUsd(usage);
  if (micro <= 0) return;

  if (!usingDurableStore) {
    memorySpend.set(spendKey(), (memorySpend.get(spendKey()) ?? 0) + micro);
    return;
  }
  await kv.pipeline([
    ["INCRBY", spendKey(), micro],
    ["EXPIRE", spendKey(), 60 * 60 * 24 * 45],
  ]);
}

export async function withinBudget(): Promise<boolean> {
  const [spent, budget] = await Promise.all([spentThisMonthUsd(), budgetUsd()]);
  return spent < budget;
}
