import { auth } from "@/auth";
import { namespaceForUser } from "@/lib/oauth";
import { deleteUserRecord, store } from "@/lib/store";

export const runtime = "nodejs";

// Self-serve data deletion for the signed-in traveller: their profile record, their
// place in the user list, and anything an assistant saved for them. The free-itinerary
// counter is deliberately kept (it is stored under a one-way hash, not their email) so
// that deleting and re-registering can't be used to reset the free allowance. The
// privacy policy says so.
export async function DELETE() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return Response.json({ error: "Sign in to delete your data." }, { status: 401 });
  }

  try {
    await Promise.all([deleteUserRecord(email), store.clear(namespaceForUser(email))]);
    return Response.json({ deleted: true });
  } catch (error) {
    console.error("Account deletion failed", error);
    return Response.json({ error: "Couldn't delete your data right now. Please try again." }, { status: 503 });
  }
}
