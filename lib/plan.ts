export type Plan = "starter" | "pro";

export type UsageInfo = {
  plan: Plan;
  used: number;
  limit: number;
  remaining: number | null;
  /** True once the traveller has asked for Pro and is waiting for approval. */
  proRequested?: boolean;
};

export const FREE_GENERATION_LIMIT = 3;

export function toUsageInfo(plan: Plan, used: number, proRequested = false): UsageInfo {
  return {
    plan,
    used,
    limit: FREE_GENERATION_LIMIT,
    remaining: plan === "pro" ? null : Math.max(0, FREE_GENERATION_LIMIT - used),
    proRequested,
  };
}
