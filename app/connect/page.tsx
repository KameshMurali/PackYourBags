"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Inbox,
  KeyRound,
  Plug,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import {
  GeneratedItinerary,
  saveGeneratedItinerary,
  saveTripDraft,
  TripDraft,
} from "@/lib/local-auth";

type SyncedItem = {
  id: string;
  type: "trip" | "itinerary";
  title: string;
  data: unknown;
  source: string;
  createdAt: string;
};

export default function Connect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [items, setItems] = useState<SyncedItem[]>([]);
  const [durable, setDurable] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [imported, setImported] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    let cancelled = false;

    (async () => {
      setOrigin(window.location.origin);
      try {
        const res = await fetch("/api/connect");
        const data = (await res.json()) as { token: string | null };
        if (!cancelled) {
          setToken(data.token);
        }
      } catch {
        /* ignore */
      }
      await refreshInbox();
      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, router]);

  async function refreshInbox() {
    try {
      const res = await fetch("/api/synced");
      const data = (await res.json()) as { items: SyncedItem[]; durable: boolean };
      setItems(data.items ?? []);
      setDurable(data.durable);
    } catch {
      /* ignore */
    }
  }

  async function generate() {
    setBusy(true);
    try {
      const res = await fetch("/api/connect", { method: "POST" });
      const data = (await res.json()) as { token: string };
      setToken(data.token);
    } finally {
      setBusy(false);
    }
  }

  function copy(label: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1600);
  }

  function importItem(item: SyncedItem) {
    if (item.type === "itinerary") {
      const it = item.data as GeneratedItinerary;
      saveGeneratedItinerary(it);
      saveTripDraft({
        destination: it.destination,
        dates: "Timing to refine",
        travellers: "Traveller details to refine",
        mood: "From assistant",
        notes: it.summary,
      });
    } else {
      saveTripDraft(item.data as TripDraft);
    }
    setImported((prev) => [...prev, item.id]);
  }

  async function clearInbox() {
    await fetch("/api/synced", { method: "DELETE" });
    setItems([]);
  }

  const mcpUrl = origin ? `${origin}/api/mcp` : "/api/mcp";

  if (!ready) {
    return <main className="min-h-screen" />;
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
          <Plug className="h-4 w-4" />
          Connect your assistant
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] tracking-tight text-ink md:text-7xl">
          Plan in ChatGPT or Claude. Keep it here.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          PackYourBags runs a secure MCP server. Connect it to your AI assistant and it can save
          trips and itineraries into your workspace, and check visas — straight from a chat.
        </p>

        {/* Step 1 — connect (OAuth: just the URL) */}
        <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
              <Plug className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl text-ink">1. Add PackYourBags to your assistant</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">
            All you need is this address. Your assistant opens a PackYourBags sign-in, you continue
            with Google and approve, and it&apos;s connected. No keys to copy.
          </p>

          <div className="mt-5">
            <Field label="Connector URL" value={mcpUrl} copied={copied === "url"} onCopy={() => copy("url", mcpUrl)} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ClientCard
              title="Claude (web & desktop)"
              steps={[
                "Settings → Connectors → Add custom connector",
                "Name it PackYourBags and paste the URL",
                "Click Connect, continue with Google, then Allow",
                "Turn it on in a chat from the tools menu",
              ]}
            />
            <ClientCard
              title="ChatGPT"
              steps={[
                "Settings → Apps & Connectors → Advanced → turn on Developer mode",
                "Create a connector and paste the URL",
                "Choose OAuth, continue with Google, then Allow",
                "Enable it for the chat",
              ]}
            />
            <ClientCard
              title="Claude Code, Cursor & other MCP apps"
              steps={[
                "Add a remote (HTTP) MCP server with the URL",
                "e.g. claude mcp add --transport http packyourbags <URL>",
                "Sign in with Google when the browser opens",
                "Ask it to save or list your trips",
              ]}
            />
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">
            Your assistant only gets access to PackYourBags trips, itineraries, and visa checks, never
            your Google account. Remove the connector in its settings to disconnect.
          </p>
        </div>

        {/* Step 2 — inbox */}
        <div className="glass-panel hero-shadow mt-5 rounded-[2rem] border border-black/10 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
                <Inbox className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl text-ink">2. From your assistant</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={refreshInbox}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold text-ink transition hover:bg-white"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearInbox}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </div>

          {!durable && isAdmin && (
            <p className="mt-4 flex items-start gap-2 rounded-[1.1rem] border border-[#ffd9a0] bg-[#fdeedd] p-3 text-xs leading-5 text-[#7a5a1e]">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Admin note: assistant storage is in-memory, so items can disappear between requests on
                Vercel. Set <code className="font-mono">UPSTASH_REDIS_REST_URL</code> and{" "}
                <code className="font-mono">UPSTASH_REDIS_REST_TOKEN</code> for durable sync.
              </span>
            </p>
          )}

          {items.length === 0 ? (
            <p className="mt-4 text-sm leading-7 text-muted">
              Nothing yet. In your assistant, try: “Save a 5-day Lisbon food trip to PackYourBags.”
              Then refresh.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-[1.4rem] border border-black/10 bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                      {item.type === "itinerary" ? "Itinerary" : "Trip brief"}
                    </p>
                    <p className="mt-1 font-semibold text-ink">{item.title}</p>
                    <p className="text-xs text-muted">
                      from {item.source} · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => importItem(item)}
                    disabled={imported.includes(item.id)}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {imported.includes(item.id) ? (
                      <>
                        <Check className="h-4 w-4" /> Imported
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Import
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced — manual token for MCP clients without OAuth */}
        <details className="glass-panel mt-5 rounded-[2rem] border border-black/10 p-6 md:p-8">
          <summary className="flex cursor-pointer list-none items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
              <KeyRound className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl text-ink">Advanced: connect with a manual token</span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-muted">
            Only for MCP clients that can&apos;t sign in with OAuth (for example the{" "}
            <code className="font-mono">mcp-remote</code> bridge with{" "}
            <code className="font-mono">--header &quot;Authorization: Bearer &lt;token&gt;&quot;</code>). The token is a
            secret, like a password. Generating a new one replaces the old.
          </p>
          {token ? (
            <div className="mt-4 space-y-3">
              <Field label="Connection token" value={token} copied={copied === "token"} onCopy={() => copy("token", token)} />
              <Field
                label="Authorization header"
                value={`Authorization: Bearer ${token}`}
                copied={copied === "hdr"}
                onCopy={() => copy("hdr", `Authorization: Bearer ${token}`)}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No token yet.</p>
          )}
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(10,34,51,0.22)] disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            {token ? "Regenerate token" : "Generate token"}
          </button>
        </details>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 overflow-x-auto rounded-[1rem] border border-black/10 bg-[#fffaf3] px-4 py-3 font-mono text-sm text-ink">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-ink transition hover:bg-white"
        >
          {copied ? <Check className="h-4 w-4 text-[#0a4d5c]" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ClientCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-[1.4rem] border border-black/10 bg-white/70 p-5">
      <p className="font-display text-xl text-ink">{title}</p>
      <ol className="mt-3 space-y-2">
        {steps.map((step, idx) => (
          <li key={step} className="flex gap-2 text-sm leading-6 text-ink/80">
            <span className="font-semibold text-clay">{idx + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
