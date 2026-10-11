import { cookies } from "next/headers";
import { auth } from "@/auth";
import { createManualToken, revokeManualTokens } from "@/lib/manual-token";

export const runtime = "nodejs";

// Manual connection tokens are for assistants that can't use the Google sign-in
// (OAuth) flow. Only a signed-in traveller can create one, the server signs it, and
// it works for that traveller's account only. Tokens aren't stored, so this is the one
// time the value is shown.
async function requireEmail() {
  const session = await auth();
  return session?.user?.email ?? null;
}

// Creates a new token. Any earlier manual tokens stop working.
export async function POST() {
  const email = await requireEmail();
  if (!email) {
    return Response.json({ error: "Sign in to create a connection token." }, { status: 401 });
  }

  try {
    const { token, expiresAt } = await createManualToken(email);

    // Older versions kept the token in a cookie; clear any that's still lying around.
    (await cookies()).delete("pyb_mcp_token");

    return Response.json({ token, expiresAt: new Date(expiresAt * 1000).toISOString() });
  } catch {
    return Response.json({ error: "Couldn't create a token right now. Please try again." }, { status: 503 });
  }
}

// Revokes every manual token for this account.
export async function DELETE() {
  const email = await requireEmail();
  if (!email) {
    return Response.json({ error: "Sign in to revoke connection tokens." }, { status: 401 });
  }

  try {
    await revokeManualTokens(email);
    return Response.json({ revoked: true });
  } catch {
    return Response.json({ error: "Couldn't revoke tokens right now. Please try again." }, { status: 503 });
  }
}
