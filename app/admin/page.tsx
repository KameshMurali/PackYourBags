import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, Database, Shield, ShieldAlert, XCircle } from "lucide-react";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { adminEmails } from "@/lib/admin";
import { db, isDatabaseConfigured, schema } from "@/lib/db";
import { isOAuthConfigured } from "@/lib/oauth";
import { store, usingDurableStore } from "@/lib/store";
import { DATASETS, reviewDateLabel } from "@/lib/visa";
import { Logo } from "@/components/logo";

export const runtime = "nodejs";
// This page reflects live auth + DB state, so never cache it.
export const dynamic = "force-dynamic";

type AdminUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
};

const STALE_AFTER_DAYS = 180;

// Computed outside the component: it reads the clock, which render functions shouldn't.
function getVisaHealth(staleAfterDays: number) {
  const now = Date.now();
  return Object.entries(DATASETS)
    .filter(([, rules]) => rules.length > 0)
    .map(([passport, rules]) => {
      const dates = rules.map((r) => r.lastReviewed).sort();
      const due = rules.filter((r) => (now - new Date(r.lastReviewed).getTime()) / 86_400_000 > staleAfterDays).length;
      return {
        passport,
        count: rules.length,
        oldest: dates[0] ?? "",
        newest: dates[dates.length - 1] ?? "",
        due,
      };
    });
}

export default async function AdminPage() {
  const session = await auth();

  // First-layer guard (middleware is the second layer): must be signed in.
  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }

  // In-page guard: non-admins see a "not authorized" panel instead of data.
  if (session.user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="glass-panel hero-shadow w-full max-w-md rounded-[2rem] border border-black/10 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f6dede] text-[#9a3131]">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-4xl text-ink">Not authorized</h1>
          <p className="mt-3 text-base leading-7 text-muted">
            This area is for administrators only. You&apos;re signed in as{" "}
            <span className="font-semibold text-ink">{session.user.email}</span>, which doesn&apos;t have
            admin access. If you meant to use a different Google account, sign out and sign in again with it.
          </p>
          <Link
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(10,34,51,0.22)]"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Booleans only: this page reports whether things are configured, never their values.
  const checks: Array<{ label: string; ok: boolean; detail: string }> = [
    {
      label: "Google sign-in",
      ok: isGoogleConfigured,
      detail: isGoogleConfigured ? "Travellers can sign in." : "Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET.",
    },
    {
      label: "AI concierge",
      ok: Boolean(process.env.ANTHROPIC_API_KEY),
      detail: process.env.ANTHROPIC_API_KEY
        ? `Using ${process.env.ANTHROPIC_MODEL || "the default Claude model"}.`
        : "Add ANTHROPIC_API_KEY or itineraries can't be generated.",
    },
    {
      label: "Claude and ChatGPT connectors",
      ok: isOAuthConfigured,
      detail: isOAuthConfigured ? "OAuth sign-in for assistants is on." : "Add AUTH_SECRET (or MCP_OAUTH_SECRET).",
    },
    {
      label: "Durable storage (Upstash)",
      ok: usingDurableStore,
      detail: usingDurableStore
        ? "Assistant-saved plans persist."
        : "Using in-memory storage: saved plans reset when the server restarts.",
    },
    {
      label: "Free-tier counter",
      ok: Boolean(process.env.USAGE_COOKIE_SECRET),
      detail: process.env.USAGE_COOKIE_SECRET ? "Signed cookies protect the 3 free itineraries." : "Add USAGE_COOKIE_SECRET.",
    },
    {
      label: "User database",
      ok: isDatabaseConfigured,
      detail: isDatabaseConfigured ? "Accounts are stored." : "Optional. Add DATABASE_URL to list users below.",
    },
  ];

  const admins = adminEmails();
  const usingDefaultAdmin = !process.env.ADMIN_EMAILS?.trim();

  const visaHealth = getVisaHealth(STALE_AFTER_DAYS);

  let travellersWithPlans: number | null = null;
  try {
    travellersWithPlans = (await store.summary()).travellers;
  } catch {
    travellersWithPlans = null;
  }

  let users: AdminUserRow[] = [];
  let loadError = false;

  if (db) {
    try {
      users = await db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.users.role,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .orderBy(desc(schema.users.createdAt));
    } catch {
      loadError = true;
    }
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-8 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          <Shield className="h-4 w-4" />
          Admin
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] tracking-tight text-ink md:text-6xl">
          Workspace administration
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Signed in as{" "}
          <span className="font-semibold text-ink">{session.user.email}</span> with admin access.
        </p>

        <div className="mt-9 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel story-shadow rounded-[2rem] border border-ink/10 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-ink">System status</h2>
            <p className="mt-1 text-sm text-muted">Whether each part of the app is switched on. Values are never shown.</p>
            <ul className="mt-5 divide-y divide-ink/10">
              {checks.map((check) => (
                <li key={check.label} className="flex items-start gap-3 py-3.5">
                  {check.ok ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lagoon" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
                  )}
                  <div>
                    <p className="font-semibold text-ink">{check.label}</p>
                    <p className="text-sm leading-6 text-muted">{check.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="glass-panel story-shadow rounded-[2rem] border border-ink/10 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">Admins</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {admins.map((email) => (
                  <li key={email} className="flex items-center gap-2 font-medium text-ink">
                    <Shield className="h-4 w-4 text-lagoon" />
                    {email}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-muted">
                {usingDefaultAdmin
                  ? "Using the built-in default. Set ADMIN_EMAILS to a comma-separated list to change it."
                  : "Set by the ADMIN_EMAILS setting."}
              </p>
            </div>

            <div className="glass-panel story-shadow rounded-[2rem] border border-ink/10 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">Assistants</h2>
              <p className="mt-4 font-display text-5xl font-extrabold leading-none text-ink">
                {travellersWithPlans === null ? "—" : travellersWithPlans}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {travellersWithPlans === null
                  ? "Couldn't read storage."
                  : travellersWithPlans === 1
                    ? "traveller has plans saved from Claude or ChatGPT."
                    : "travellers have plans saved from Claude or ChatGPT."}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel story-shadow mt-5 overflow-hidden rounded-[2rem] border border-ink/10">
          <div className="p-6 md:px-8 md:pt-8">
            <h2 className="font-display text-2xl font-bold text-ink">Visa data health</h2>
            <p className="mt-1 text-sm text-muted">
              Rules are re-checked against official sources. Anything not reviewed in {STALE_AFTER_DAYS} days is flagged.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-ink/10 text-xs uppercase tracking-[0.18em] text-muted">
                  <th className="px-6 py-3 font-semibold md:px-8">Passport</th>
                  <th className="px-6 py-3 font-semibold">Rules</th>
                  <th className="px-6 py-3 font-semibold">Newest review</th>
                  <th className="px-6 py-3 font-semibold">Oldest review</th>
                  <th className="px-6 py-3 font-semibold">Review due</th>
                </tr>
              </thead>
              <tbody>
                {visaHealth.map((row) => (
                  <tr key={row.passport} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-3 font-bold text-ink md:px-8">{row.passport}</td>
                    <td className="px-6 py-3 text-ink">{row.count}</td>
                    <td className="px-6 py-3 text-muted">{reviewDateLabel(row.newest)}</td>
                    <td className="px-6 py-3 text-muted">{reviewDateLabel(row.oldest)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          row.due > 0 ? "bg-sun text-night" : "bg-lagoon/10 text-lagoon"
                        }`}
                      >
                        {row.due > 0 ? `${row.due} due` : "All current"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isDatabaseConfigured ? (
          <div className="glass-panel hero-shadow mt-5 overflow-hidden rounded-[2rem] border border-black/10">
            <div className="flex items-center gap-3 border-b border-black/10 p-6 md:px-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
                <Database className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl text-ink">Users</h2>
                <p className="text-sm text-muted">
                  {loadError
                    ? "Could not read the database."
                    : `${users.length} ${users.length === 1 ? "account" : "accounts"} in the database.`}
                </p>
              </div>
            </div>

            {loadError ? (
              <p className="p-6 text-sm leading-7 text-muted md:px-8">
                The database is configured but could not be queried. Confirm{" "}
                <code className="font-mono">DATABASE_URL</code> is reachable and that{" "}
                <code className="font-mono">npm run db:push</code> has been run to create the tables.
              </p>
            ) : users.length === 0 ? (
              <p className="p-6 text-sm leading-7 text-muted md:px-8">
                No users yet. Accounts appear here after people sign in with Google.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 text-xs uppercase tracking-[0.18em] text-muted">
                      <th className="px-6 py-3 font-semibold md:px-8">Email</th>
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-black/5 last:border-0">
                        <td className="px-6 py-3 font-medium text-ink md:px-8">{user.email}</td>
                        <td className="px-6 py-3 text-muted">{user.name ?? "—"}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-[#e2eee9] text-[#0a4d5c]"
                                : "bg-[#fde8d3] text-ink"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel hero-shadow mt-5 rounded-[2rem] border border-black/10 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
                <Database className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl text-ink">User listing is off</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              The app is running in JWT-only mode, so accounts are not persisted and cannot be
              listed. To enable the user directory, set{" "}
              <code className="font-mono">DATABASE_URL</code> to a Postgres connection string and run{" "}
              <code className="font-mono">npm run db:push</code> to create the tables.
            </p>
            <p className="mt-4 rounded-[1.1rem] border border-[#b7d4c8] bg-[#eff8f4]/90 p-4 text-sm leading-6 text-[#0a4d5c]">
              You still have full admin access. Admin status is driven by{" "}
              <code className="font-mono">ADMIN_EMAILS</code> and works with or without a database.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
