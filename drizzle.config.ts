import type { Config } from "drizzle-kit";

// Used by `npm run db:push`. Only relevant when you have a Postgres database and
// DATABASE_URL set — the app itself never imports this file.
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
