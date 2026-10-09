import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MinusCircle,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { adminEmails, roleForEmail } from "@/lib/admin";
import { isDatabaseConfigured } from "@/lib/db";
import { namespaceForUser, isOAuthConfigured } from "@/lib/oauth";
import { getUserRecord, listUsers, store, touchUser, usingDurableStore, type UserRecord } from "@/lib/store";
import { usageSecretSource } from "@/lib/usage";
import { DATASETS, reviewDateLabel } from "@/lib/visa";
import { Logo } from "@/components/logo";

export const runtime = "nodejs";
// This page reflects live auth + storage state, so never cache it.
export const dynamic = "force-dynamic";

const STALE_AFTER_DAYS = 180;

type CheckState = "ok" | "bad" | "optional";

// Computed outside the component: these read the clock, which render functions shouldn't.
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

function ago(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({ user, size = "md" }: { user: Pick<UserRecord, "email" | "name" | "image">; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-16 w-16 text-2xl" : "h-11 w-11 text-base";
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();
  return user.image ? (
    // Google profile photos come from a rotating set of hosts, so a plain <img> is simpler
    // than whitelisting them for next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" referrerPolicy="no-referrer" className={`${box} shrink-0 rounded-full object-cover`} />
  ) : (
    <span
      className={`${box} flex shrink-0 items-center justify-center rounded-full bg-sunset font-display font-extrabold text-night`}
    >
      {initial}
    </span>
  );
}

function RoleBadge({ email }: { email: string }) {
  return roleForEmail(email) === "admin" ? (
    <span className="rounded-full bg-sunset px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-night">
      Admin
    </span>
  ) : (
    <span className="rounded-full bg-sand px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
      Traveller
    </span>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; user?: string }>;
}) {
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

  const params = await searchParams;
  const tab = params.tab === "users" ? "users" : "overview";

  // Make sure the admin looking at this page is in the list, even if they signed in
  // before the registry existed.
  if (session.user.email) {
    await touchUser({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    }).catch(() => {});
  }

  let users: UserRecord[] = [];
  let usersError = false;
  try {
    users = await listUsers();
  } catch {
    usersError = true;
  }

  // Booleans only: this page reports whether things are configured, never their values.
  const checks: Array<{ label: string; state: CheckState; detail: string }> = [
    {
      label: "Google sign-in",
      state: isGoogleConfigured ? "ok" : "bad",
      detail: isGoogleConfigured ? "Travellers can sign in." : "Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET.",
    },
    {
      label: "AI concierge",
      state: process.env.ANTHROPIC_API_KEY ? "ok" : "bad",
      detail: process.env.ANTHROPIC_API_KEY
        ? `Using ${process.env.ANTHROPIC_MODEL || "the default Claude model"}.`
        : "Add ANTHROPIC_API_KEY or itineraries can't be generated.",
    },
    {
      label: "Claude and ChatGPT connectors",
      state: isOAuthConfigured ? "ok" : "bad",
      detail: isOAuthConfigured ? "OAuth sign-in for assistants is on." : "Add AUTH_SECRET (or MCP_OAUTH_SECRET).",
    },
    {
      label: "Durable storage (Upstash)",
      state: usingDurableStore ? "ok" : "bad",
      detail: usingDurableStore
        ? "Holds assistant-saved plans and the user list."
        : "Using in-memory storage: plans and the user list reset when the server restarts.",
    },
    {
      label: "Free-tier counter",
      state: usageSecretSource === "ephemeral" ? "bad" : "ok",
      detail:
        usageSecretSource === "dedicated"
          ? "Signed with USAGE_COOKIE_SECRET."
          : usageSecretSource === "derived"
            ? "Signed with a key derived from AUTH_SECRET, so it can't be forged."
            : "No signing key available, so the counter resets on restart. Set AUTH_SECRET.",
    },
    {
      label: "Postgres database",
      state: isDatabaseConfigured ? "ok" : "optional",
      detail: isDatabaseConfigured
        ? "Accounts are also stored in Postgres."
        : "Optional. Not needed: users are listed from Upstash. Add DATABASE_URL only if you want a Postgres accounts table.",
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

  // Details panel for one traveller.
  const selectedEmail = params.user?.trim().toLowerCase();
  let selected: UserRecord | null = null;
  let savedPlans: Awaited<ReturnType<typeof store.list>> = [];
  if (tab === "users" && selectedEmail) {
    selected = users.find((u) => u.email === selectedEmail) ?? (await getUserRecord(selectedEmail).catch(() => null));
    if (selected) {
      savedPlans = await store.list(namespaceForUser(selected.email)).catch(() => []);
    }
  }

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
      active ? "bg-night text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/30"
    }`;

  return (
    <main className="min-h-screen pb-16">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-4 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-clay">
          <Shield className="h-4 w-4" />
          Admin
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[0.96] tracking-tight text-ink sm:text-5xl md:text-6xl">
          Workspace administration
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Signed in as <span className="font-semibold text-ink">{session.user.email}</span> with admin access.
        </p>

        <nav aria-label="Admin sections" className="mt-8 flex flex-wrap gap-2">
          <Link href="/admin" className={tabClass(tab === "overview")} aria-current={tab === "overview" ? "page" : undefined}>
            <Shield className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/admin?tab=users"
            className={tabClass(tab === "users")}
            aria-current={tab === "users" ? "page" : undefined}
          >
            <Users className="h-4 w-4" />
            Users
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${tab === "users" ? "bg-white/20 text-white" : "bg-sand text-ink"}`}
            >
              {users.length}
            </span>
          </Link>
        </nav>

        {tab === "overview" ? (
          <>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="glass-panel story-shadow rounded-[2rem] border border-ink/10 p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold text-ink">System status</h2>
                <p className="mt-1 text-sm text-muted">Whether each part of the app is switched on. Values are never shown.</p>
                <ul className="mt-5 divide-y divide-ink/10">
                  {checks.map((check) => (
                    <li key={check.label} className="flex items-start gap-3 py-3.5">
                      {check.state === "ok" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lagoon" />
                      ) : check.state === "bad" ? (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
                      ) : (
                        <MinusCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
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
          </>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="glass-panel story-shadow overflow-hidden rounded-[2rem] border border-ink/10">
              <div className="p-6 md:px-8 md:pt-8">
                <h2 className="font-display text-2xl font-bold text-ink">Signed-in users</h2>
                <p className="mt-1 text-sm text-muted">
                  {usersError
                    ? "Couldn't read the user list."
                    : `${users.length} ${users.length === 1 ? "person" : "people"}, most recently active first. Tap one for details.`}
                </p>
              </div>

              {users.length === 0 && !usersError ? (
                <p className="border-t border-ink/10 p-6 text-sm leading-7 text-muted md:px-8">
                  No sign-ins recorded yet. People appear here after they sign in with Google or open their dashboard.
                  {!usingDurableStore && " Storage is in-memory, so this list resets when the server restarts."}
                </p>
              ) : (
                <ul className="divide-y divide-ink/10 border-t border-ink/10">
                  {users.map((user) => {
                    const active = selected?.email === user.email;
                    return (
                      <li key={user.email}>
                        <Link
                          href={`/admin?tab=users&user=${encodeURIComponent(user.email)}`}
                          aria-current={active ? "true" : undefined}
                          className={`flex items-center gap-3.5 px-6 py-4 transition md:px-8 ${
                            active ? "bg-sun/20" : "hover:bg-cream"
                          }`}
                        >
                          <Avatar user={user} />
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-2 font-bold text-ink">
                              <span className="truncate">{user.name || user.email}</span>
                              <RoleBadge email={user.email} />
                            </p>
                            <p className="truncate text-sm text-muted">{user.name ? user.email : "No name shared"}</p>
                          </div>
                          <div className="shrink-0 text-right text-xs text-muted">
                            <p className="font-semibold text-ink">{ago(user.lastSeen)}</p>
                            <p>
                              {user.signIns} sign-in{user.signIns === 1 ? "" : "s"}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="lg:sticky lg:top-6">
              {selected ? (
                <div className="glass-panel story-shadow rounded-[2rem] border border-ink/10 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <Avatar user={selected} size="lg" />
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl font-bold leading-tight text-ink">
                        {selected.name || selected.email}
                      </h2>
                      <p className="mt-0.5 break-all text-sm text-muted">{selected.email}</p>
                      <div className="mt-2">
                        <RoleBadge email={selected.email} />
                      </div>
                    </div>
                  </div>

                  <dl className="mt-7 grid grid-cols-2 gap-3">
                    {[
                      ["First seen", fullDate(selected.firstSeen)],
                      ["Last active", ago(selected.lastSeen)],
                      ["Google sign-ins", String(selected.signIns)],
                      ["AI itineraries made", String(selected.itineraries)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.25rem] border border-ink/10 bg-cream p-4">
                        <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</dt>
                        <dd className="mt-1.5 font-display text-lg font-bold leading-snug text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <h3 className="mt-8 flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <Sparkles className="h-4 w-4 text-clay" />
                    Plans saved from Claude or ChatGPT
                  </h3>
                  {savedPlans.length === 0 ? (
                    <p className="mt-2 text-sm leading-6 text-muted">Nothing saved from an assistant yet.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {savedPlans.slice(0, 8).map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 text-sm"
                        >
                          <span className="min-w-0 truncate font-semibold text-ink">{item.title}</span>
                          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                            <Clock className="h-3 w-3" />
                            {item.source} · {ago(item.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href="/admin?tab=users"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-clay transition hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all users
                  </Link>
                </div>
              ) : (
                <div className="glass-panel rounded-[2rem] border border-dashed border-ink/20 p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted" />
                  <p className="mt-3 font-display text-xl font-bold text-ink">
                    {selectedEmail ? "That person isn't in the list" : "Pick someone to see their details"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Sign-in history, activity and anything they&apos;ve saved from an assistant shows up here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
