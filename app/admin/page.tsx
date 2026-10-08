import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { ArrowLeft, Database, Shield, ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { db, isDatabaseConfigured, schema } from "@/lib/db";
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
            This area is for administrators only. Your account does not have admin access.
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

        {isDatabaseConfigured ? (
          <div className="glass-panel hero-shadow mt-9 overflow-hidden rounded-[2rem] border border-black/10">
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
          <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-6 md:p-8">
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
