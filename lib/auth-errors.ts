// Friendly, non-technical messages for the sign-in page. The raw Auth.js error code
// (e.g. "Configuration", "OAuthCallback") is never shown to travellers.

export type SignInNotice = { tone: "info" | "error"; text: string };

export function signInNotice(error: string | undefined): SignInNotice | null {
  if (!error) {
    return null;
  }

  if (error === "cancelled") {
    return {
      tone: "info",
      text: "Sign-in cancelled. No worries, you can try again whenever you're ready.",
    };
  }

  if (error === "AccessDenied") {
    return {
      tone: "error",
      text: "That Google account couldn't be used. Make sure its email is verified, or try a different account.",
    };
  }

  return {
    tone: "error",
    text: "We couldn't complete sign-in. Please try again.",
  };
}
