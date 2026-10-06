import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { roleForEmail, type Role } from "@/lib/admin";

// Edge-safe Auth.js configuration. This file is imported by `middleware.ts`, so
// it MUST NOT import the database, the Drizzle adapter, or any node-only module.
// It only declares providers + callbacks that can run on the edge runtime.

// Only register the Google provider when BOTH credentials are present. With no
// credentials the app still builds and runs — sign-in simply reports that
// Google is not configured yet (see /signin).
const googleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const isGoogleConfigured = googleConfigured;

export const authConfig = {
  trustHost: true,
  // JWT sessions so authentication works with or without a database.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: googleConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : [],
  callbacks: {
    // Admin access is granted by email address, so only accept Google accounts
    // whose email Google has verified.
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        return (profile as { email_verified?: boolean } | undefined)?.email_verified === true;
      }
      return true;
    },
    // Recompute the role on every request (it's a cheap env lookup) rather than
    // freezing it at sign-in, so removing someone from ADMIN_EMAILS takes effect
    // immediately instead of when their 30-day session expires.
    jwt({ token, user }) {
      token.role = roleForEmail(user?.email ?? token.email);
      return token;
    },
    // Surface the role on the session for client + server components.
    session({ session, token }) {
      if (session.user) {
        const tokenRole = token.role as Role | undefined;
        session.user.role = tokenRole ?? roleForEmail(session.user.email);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
