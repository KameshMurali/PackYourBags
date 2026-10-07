import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { authConfig } from "@/auth.config";
import { roleForEmail } from "@/lib/admin";
import { db, schema } from "@/lib/db";

// Node-side Auth.js setup. This file is imported by the route handler and server
// components only — never by the edge middleware — so it is free to use the
// node-only Postgres driver and the Drizzle adapter.
//
// The adapter is added ONLY when a database is configured (db !== null). With no
// DATABASE_URL the app runs JWT-only: login still works, nothing is persisted.

const adapter = db
  ? DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    })
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  events: {
    // When a database is present, keep the persisted `role` column in sync with
    // ADMIN_EMAILS on every sign-in. No-op in JWT-only mode.
    async signIn({ user }) {
      if (!db || !user?.email) {
        return;
      }

      const desiredRole = roleForEmail(user.email);

      try {
        await db
          .update(schema.users)
          .set({ role: desiredRole })
          .where(eq(schema.users.email, user.email));
      } catch {
        // Role sync is best-effort; a transient DB error must not block login.
      }
    },
  },
});
