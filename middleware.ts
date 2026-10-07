import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge middleware built ONLY from the edge-safe config (no adapter, no node
// imports). It gates the private areas of the app and keeps `/` and `/visa`
// public.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const isAdmin = req.auth?.user?.role === "admin";

  if (!isLoggedIn) {
    const signInUrl = new URL("/signin", nextUrl);
    // Preserve where the user was heading so we can send them back after login.
    signInUrl.searchParams.set(
      "callbackUrl",
      `${nextUrl.pathname}${nextUrl.search}`,
    );
    return Response.redirect(signInUrl);
  }

  // /admin additionally requires the admin role.
  if (nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return undefined;
});

// Only run on the protected areas; everything else (including / and /visa) is
// public and skips auth entirely.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/concierge/:path*",
    "/trips/:path*",
    "/connect/:path*",
    "/admin/:path*",
  ],
};
