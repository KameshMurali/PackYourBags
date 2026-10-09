import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";

export const runtime = "nodejs";

const GOOGLE_ISSUER = "https://accounts.google.com";

// Google redirects back to /callback/google in two situations we need to handle
// before Auth.js sees the request:
//
// 1. The traveller cancelled, or Google refused (?error=access_denied). Auth.js's
//    OAuth library checks for the `iss` parameter *before* it checks for an error,
//    and Google's error redirects don't carry `iss`, so a plain "Cancel" surfaced as
//    a scary "Server error: configuration" page. Send them back to sign-in instead.
//
// 2. A response without `iss`. Google advertises RFC 9207 support, so the library
//    insists on it. That check only defends against mix-ups between several
//    authorization servers; this app has exactly one (Google), so supplying the
//    expected issuer when it's absent loses no protection and keeps sign-in working.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.endsWith("/callback/google")) {
    const error = url.searchParams.get("error");
    if (error) {
      const reason = error === "access_denied" ? "cancelled" : "google";
      return NextResponse.redirect(new URL(`/signin?error=${reason}`, request.url));
    }

    if (!url.searchParams.has("iss")) {
      const patched = new URL(request.url);
      patched.searchParams.set("iss", GOOGLE_ISSUER);
      return handlers.GET(new NextRequest(patched, { headers: request.headers, method: "GET" }));
    }
  }

  return handlers.GET(request);
}

export const { POST } = handlers;
