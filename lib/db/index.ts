import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Optional Postgres connection. The database is entirely optional: when
// DATABASE_URL is absent we export `db` as null and the whole app runs in
// JWT-only mode with no adapter. Nothing here touches the network at import
// time unless a connection string is actually present, so a secret-free build
// never fails and never opens a connection.
//
// This module is node-only (the `postgres` driver uses node `net`), so it must
// never be imported from edge code (middleware / auth.config.ts).

export type Database = PostgresJsDatabase<typeof schema>;

const connectionString = process.env.DATABASE_URL;

function createDb(): Database | null {
  if (!connectionString) {
    return null;
  }

  // `prepare: false` keeps us compatible with connection poolers (Neon /
  // Supabase / Vercel Postgres in transaction mode).
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

export const db: Database | null = createDb();

// Re-export the tables so callers (adapter, admin page) share one schema.
export { schema };
export const isDatabaseConfigured = Boolean(connectionString);
