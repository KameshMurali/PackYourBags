import { toUsageInfo } from "@/lib/plan";
import { readUsageState } from "@/lib/usage";

export async function GET() {
  const usage = await readUsageState();

  return Response.json(toUsageInfo(usage.plan, usage.used));
}
