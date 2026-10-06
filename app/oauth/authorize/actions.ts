"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createAuthorizationCode,
  isOAuthConfigured,
  isValidCodeChallenge,
  readClient,
  redirectUriMatches,
  withQuery,
} from "@/lib/oauth";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

// Re-validate everything server-side: the hidden form fields come from the
// browser and can't be trusted. Returns null when the redirect URI isn't one
// the client registered, in which case we must not redirect to it at all.
function readRequest(formData: FormData) {
  const clientId = field(formData, "client_id");
  const redirectUri = field(formData, "redirect_uri");
  const client = isOAuthConfigured ? readClient(clientId) : null;

  if (!client || !clientId || !redirectUri || !redirectUriMatches(client.redirect_uris, redirectUri)) {
    return null;
  }

  return {
    clientId,
    redirectUri,
    state: field(formData, "state"),
    codeChallenge: field(formData, "code_challenge"),
    codeChallengeMethod: field(formData, "code_challenge_method"),
  };
}

export async function approveConnection(formData: FormData) {
  const request = readRequest(formData);
  if (!request) {
    redirect("/connect");
  }

  if (!isValidCodeChallenge(request.codeChallenge, request.codeChallengeMethod)) {
    redirect(withQuery(request.redirectUri, { error: "invalid_request", state: request.state }));
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    redirect("/signin");
  }

  const code = createAuthorizationCode({
    clientId: request.clientId,
    redirectUri: request.redirectUri,
    codeChallenge: request.codeChallenge,
    email,
  });

  redirect(withQuery(request.redirectUri, { code, state: request.state }));
}

export async function denyConnection(formData: FormData) {
  const request = readRequest(formData);
  if (!request) {
    redirect("/connect");
  }

  redirect(withQuery(request.redirectUri, { error: "access_denied", state: request.state }));
}
