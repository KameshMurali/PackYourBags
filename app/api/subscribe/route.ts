import { toUsageInfo } from "@/lib/plan";
import { readUsageState, writeUsageState } from "@/lib/usage";

// Prototype checkout: flips the plan cookie to Pro without payment. Replace
// with a real billing provider (Stripe, Paddle, ...) before launch.
export async function POST() {
  const usage = await readUsageState();
  const nextState = { plan: "pro" as const, used: usage.used };

  await writeUsageState(nextState);

  return Response.json(toUsageInfo(nextState.plan, nextState.used));
}
