"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Globe2,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import {
  CATEGORY_META,
  CredentialCode,
  HELDVISAS,
  matchesQuery,
  NATIONALITIES,
  RESIDENCIES,
  resolveDestinations,
  summarise,
  VISA_GUIDES,
  VisaCategory,
} from "@/lib/visa";

const TONE: Record<string, { pill: string; dot: string }> = {
  green: { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  teal: { pill: "bg-[#e1f5ee] text-[#0f6e56]", dot: "bg-[#1d9e75]" },
  sky: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
  amber: { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ba7517]" },
  clay: { pill: "bg-[#f5ead9] text-[#8a4a24]", dot: "bg-clay" },
};

const CATEGORY_ORDER: VisaCategory[] = [
  "visa-free",
  "visa-on-arrival",
  "eta",
  "evisa",
  "visa-required",
];

export default function VisaExplorer() {
  const [nationality, setNationality] = useState("IN");
  const [residence, setResidence] = useState<string>("AE");
  const [heldVisas, setHeldVisas] = useState<CredentialCode[]>([]);
  const [query, setQuery] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const credentials = useMemo<CredentialCode[]>(() => {
    const set = new Set<CredentialCode>();
    if (residence !== "NONE") set.add(residence as CredentialCode);
    heldVisas.forEach((v) => set.add(v));
    return Array.from(set);
  }, [residence, heldVisas]);

  const resolved = useMemo(
    () => resolveDestinations(nationality, credentials),
    [nationality, credentials],
  );

  const filtered = useMemo(
    () => resolved.filter((d) => matchesQuery(d, query)),
    [resolved, query],
  );

  const stats = useMemo(() => summarise(resolved), [resolved]);
  const selectedNationality = NATIONALITIES.find((n) => n.code === nationality);
  const supported = Boolean(selectedNationality?.supported);

  function toggleVisa(code: CredentialCode) {
    setHeldVisas((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

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

      <section className="mx-auto max-w-6xl px-5 pt-8 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          <Globe2 className="h-4 w-4" />
          Visa intelligence
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] tracking-tight text-ink md:text-7xl">
          Where can you go?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Start with destinations you can actually reach. Pick your passport and residence, add any
          visas you already hold, and see what opens up.
        </p>

        <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-5 md:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">Passport</span>
              <select
                className="field"
                onChange={(e) => setNationality(e.target.value)}
                value={nationality}
              >
                {NATIONALITIES.map((n) => (
                  <option key={n.code} value={n.code} disabled={!n.supported}>
                    {n.flag} {n.name}
                    {n.supported ? "" : " — coming soon"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">Residence</span>
              <select
                className="field"
                onChange={(e) => setResidence(e.target.value)}
                value={residence}
              >
                {RESIDENCIES.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Visas you already hold{" "}
              <span className="font-normal text-muted">(unlocks easier access)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {HELDVISAS.map((v) => {
                const active = heldVisas.includes(v.code);
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => toggleVisa(v.code)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-clay bg-[#f5ead9] text-[#8a4a24]"
                        : "border-black/10 bg-white/70 text-ink hover:bg-white"
                    }`}
                  >
                    <span aria-hidden>{v.flag}</span>
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-[1.4rem] border border-[#e7d3a9] bg-[#fbf3e3] p-4 text-sm leading-6 text-[#7a5a1e]">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Indicative guidance for planning — not legal advice. Visa rules change and depend on your
            exact situation. Always confirm with the official source linked on each destination before
            you book.
          </p>
        </div>

        {supported ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-panel rounded-[1.5rem] border border-black/10 p-5">
                <p className="text-sm text-muted">Reachable without a prior visa</p>
                <p className="mt-2 font-display text-4xl text-ink">
                  {stats.freedom}
                  <span className="ml-2 text-lg font-sans text-muted">/ {stats.total}</span>
                </p>
              </div>
              {(["visa-free", "visa-on-arrival", "visa-required"] as VisaCategory[]).map((cat) => (
                <div key={cat} className="glass-panel rounded-[1.5rem] border border-black/10 p-5">
                  <p className="text-sm text-muted">{CATEGORY_META[cat].label}</p>
                  <p className="mt-2 font-display text-4xl text-ink">{stats.counts[cat]}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-8 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className="field pl-11"
                placeholder="Search a country or region"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search destinations"
              />
            </div>

            <div className="mt-8 space-y-10">
              {CATEGORY_ORDER.map((cat) => {
                const group = filtered.filter((d) => d.effective === cat);
                if (group.length === 0) return null;
                const meta = CATEGORY_META[cat];
                const tone = TONE[meta.tone];
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                      <h2 className="font-display text-2xl text-ink">{meta.label}</h2>
                      <span className="text-sm text-muted">{group.length}</span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {group.map((d) => {
                        const guide = d.guide ? VISA_GUIDES[d.guide] : null;
                        const isOpen = openGuide === d.code;
                        return (
                          <div
                            key={d.code}
                            className="flex flex-col rounded-[1.5rem] border border-black/10 bg-white/75 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl" aria-hidden>
                                  {d.flag}
                                </span>
                                <div>
                                  <p className="font-semibold text-ink">{d.name}</p>
                                  <p className="text-xs text-muted">{d.region}</p>
                                </div>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.pill}`}>
                                {meta.short}
                                {d.effectiveDays ? ` · ${d.effectiveDays}d` : ""}
                              </span>
                            </div>
                            {d.effectiveNote && (
                              <p className="mt-3 text-sm leading-6 text-muted">{d.effectiveNote}</p>
                            )}
                            {d.unlockedBy?.length ? (
                              <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">
                                <Sparkles className="h-3 w-3" />
                                Unlocked by your {d.unlockedBy.join(" / ")}
                              </p>
                            ) : null}

                            <div className="mt-auto flex items-center gap-4 pt-4">
                              {guide && (
                                <button
                                  type="button"
                                  onClick={() => setOpenGuide(isOpen ? null : d.code)}
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition hover:text-clay"
                                >
                                  <ShieldCheck className="h-4 w-4 text-clay" />
                                  How to apply
                                  <ChevronDown
                                    className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                              )}
                              <a
                                href={d.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"
                              >
                                Official source <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>

                            {guide && isOpen && (
                              <div className="mt-4 rounded-[1.25rem] border border-black/10 bg-[#fffcf7] p-4 text-left">
                                <p className="font-display text-lg text-ink">{guide.title}</p>
                                <p className="mt-1 text-xs text-muted">{guide.appliesTo}</p>
                                <p className="mt-3 text-sm leading-6 text-muted">{guide.overview}</p>
                                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                                  Documents
                                </p>
                                <ul className="mt-2 space-y-1.5">
                                  {guide.documents.map((doc) => (
                                    <li key={doc} className="flex gap-2 text-sm leading-6 text-ink/80">
                                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                                  Process
                                </p>
                                <ol className="mt-2 space-y-1.5">
                                  {guide.steps.map((step, idx) => (
                                    <li key={step} className="flex gap-2 text-sm leading-6 text-ink/80">
                                      <span className="font-semibold text-clay">{idx + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                                <p className="mt-4 text-xs text-muted">
                                  Processing: {guide.processingTime}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                  {guide.officialLinks.map((l) => (
                                    <a
                                      key={l.url}
                                      href={l.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink transition hover:text-clay"
                                    >
                                      {l.label} <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="rounded-[1.4rem] border border-black/10 bg-white/60 p-6">
                  <p className="font-semibold text-ink">
                    We haven&apos;t verified “{query}” for this passport yet.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    You can check the current rule right now on the{" "}
                    <a
                      href="https://www.iatatravelcentre.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-clay underline-offset-2 hover:underline"
                    >
                      IATA Travel Centre <ExternalLink className="h-3 w-3" />
                    </a>
                    , the same database airlines check at boarding, or on the destination&apos;s
                    embassy website. Planning Europe? Try{" "}
                    <button
                      type="button"
                      onClick={() => setQuery("Schengen")}
                      className="font-semibold text-clay underline-offset-2 hover:underline"
                    >
                      Schengen
                    </button>
                    .
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="glass-panel mt-8 rounded-[2rem] border border-black/10 p-8 text-center">
            <h2 className="font-display text-3xl text-ink">
              {selectedNationality?.name} is coming soon.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              We&apos;re expanding passport coverage. India is fully supported today — switch the
              passport above to explore it.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
