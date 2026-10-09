import { auth } from "@/auth";
import { touchUser } from "@/lib/store";

export const runtime = "nodejs";

// Called once when a signed-in traveller opens their dashboard. It keeps "last seen"
// fresh for the admin user list, and adds people whose session predates the registry.
export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response(null, { status: 401 });
  }

  try {
    await touchUser({ email: session.user.email, name: session.user.name, image: session.user.image });
  } catch {
    // Best-effort bookkeeping; never surface a failure to the traveller.
  }

  return new Response(null, { status: 204 });
}
