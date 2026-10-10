import { auth } from "@/auth";
import { requestPro, usageFor } from "@/lib/quota";

export const runtime = "nodejs";

// There is no self-serve upgrade: this only records that the traveller would like Pro.
// An admin reviews requests on /admin and grants the plan, which is the only way a
// person's allowance becomes unlimited.
export async function POST() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return Response.json({ error: "Sign in to request Pro access." }, { status: 401 });
  }

  try {
    const current = await usageFor(email);
    if (current.plan === "pro") {
      return Response.json(current);
    }

    await requestPro(email);
    return Response.json(await usageFor(email), { status: 202 });
  } catch {
    return Response.json({ error: "Couldn't record your request. Please try again." }, { status: 503 });
  }
}
