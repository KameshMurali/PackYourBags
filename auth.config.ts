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
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  callbacks: {
    // Stamp the role onto the token. Admin status is derived from ADMIN_EMAILS
    // (edge-safe), so it is always correct even without a database.
    jwt({ token, user }) {
      if (user?.email) {
        token.role = roleForEmail(user.email);
      } else if (token.email && !token.role) {
        token.role = roleForEmail(token.email);
      }
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
