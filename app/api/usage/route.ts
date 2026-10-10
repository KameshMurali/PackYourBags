import { auth } from "@/auth";
import { usageFor } from "@/lib/quota";

export const runtime = "nodejs";

// The signed-in traveller's allowance. Per person and server-side, so it can't be
// reset from the browser.
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return Response.json({ error: "Sign in to see your plan." }, { status: 401 });
  }

  try {
    return Response.json(await usageFor(email));
  } catch {
    return Response.json({ error: "Couldn't read your plan right now." }, { status: 503 });
  }
}
