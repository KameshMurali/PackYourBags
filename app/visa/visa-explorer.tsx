"use client";

import { Fragment, useMemo, useState } from "react";
import { Info, Search, X } from "lucide-react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  HELDVISAS,
  IATA_TRAVEL_CENTRE,
  latestReview,
  NATIONALITIES,
  RESIDENCIES,
  resolveDestinations,
  reviewDateLabel,
  searchDestinations,
  summarise,
  type CountryNotice,
  type CredentialCode,
  type VisaCategory,
} from "@/lib/visa";
import { VisaExternalLink } from "@/components/visa-external-link";
import { VisaNoticeCard } from "@/components/visa-notice-card";
import { VisaResultCard } from "@/components/visa-result-card";
import { VISA_TONES } from "@/components/visa-tones";

const STAT_CATEGORIES: VisaCategory[] = ["visa-free", "visa-on-arrival", "visa-required"];

/** "2 verified matches, 1 not yet verified", or "Your passport country" when that's the match. */
function matchSummary(verified: number, notices: readonly CountryNotice[]): string {
  const home = notices.find((n) => n.kind !== "unverified");
  const unverified = notices.filter((n) => n.kind === "unverified").length;
  const parts: string[] = [];
  if (verified > 0 || !home) parts.push(`${verified} verified ${verified === 1 ? "match" : "matches"}`);
  if (home) parts.push(home.kind === "passport" ? "your passport country" : "where you live");
  if (unverified > 0) parts.push(`${unverified} not yet verified`);
  const text = parts.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function VisaExplorer() {
  const [passport, setPassport] = useState("IN");
  const [residence, setResidence] = useState<CredentialCode | "NONE">("AE");
  const [visas, setVisas] = useState<CredentialCode[]>([]);
  const [query, setQuery] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const nationality = NATIONALITIES.find((n) => n.code === passport) ?? NATIONALITIES[0];
  // A residence already covers its own country, so its "valid visa" pill is hidden.
  const heldOptions = HELDVISAS.filter((v) => v.code !== residence);
  const activeVisas = useMemo(() => visas.filter((v) => v !== residence), [visas, residence]);

  const credentials = useMemo(
    () =>
      Array.from(
        new Set<CredentialCode>([...(residence === "NONE" ? [] : [residence]), ...activeVisas]),
      ),
    [residence, activeVisas],
  );
  const resolved = useMemo(
    () => resolveDestinations(passport, credentials, { residence }),
    [passport, credentials, residence],
  );
  const search = useMemo(
    () => searchDestinations(passport, resolved, query, { residence }),
    [passport, resolved, query, residence],
  );
  const stats = useMemo(() => summarise(resolved), [resolved]);
  const reviewed = useMemo(() => latestReview(resolved), [resolved]);

  const trimmed = query.trim();
  const nothingFound = trimmed.length > 0 && search.rules.length === 0 && search.notices.length === 0;
  const liveMessage = !trimmed
    ? `${resolved.length} verified destinations`
    : nothingFound
      ? `No country found for ${trimmed}`
      : matchSummary(search.rules.length, search.notices);

  function toggleVisa(code: CredentialCode) {
    setVisas((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  return (
    <>
      <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="visa-passport" className="mb-2 block text-sm font-semibold text-ink">
              Passport
            </label>
            <select
              id="visa-passport"
              className="field"
              value={passport}
              onChange={(e) => {
                setPassport(e.target.value);
                setOpenGuide(null);
              }}
            >
              {NATIONALITIES.map((n) => (
                <option key={n.code} value={n.code} disabled={!n.supported}>
                  {n.flag} {n.name}
                  {n.supported ? "" : " — coming soon"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="visa-residence" className="mb-2 block text-sm font-semibold text-ink">
              Residence
            </label>
            <select
              id="visa-residence"
              className="field"
              value={residence}
              onChange={(e) => setResidence(e.target.value as CredentialCode | "NONE")}
            >
              {RESIDENCIES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 block text-sm font-semibold text-ink">
            Visas you already hold{" "}
            <span className="font-normal text-muted">(unlocks easier access)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {heldOptions.map((v) => {
              const active = activeVisas.includes(v.code);
              return (
                <button
                  key={v.code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleVisa(v.code)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-clay bg-[#fde8d3] text-[#b5391c]"
                      : "border-black/10 bg-white/70 text-ink hover:bg-white"
                  }`}
                >
                  <span aria-hidden>{v.flag}</span>
                  {v.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div
        role="note"
        className="mt-4 flex items-start gap-3 rounded-[1.4rem] border border-[#ffd9a0] bg-[#fdeedd] p-4 text-sm leading-6 text-[#6b4f19]"
      >
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong className="font-semibold">Indicative guidance — not legal advice.</strong> Visa
          rules change and depend on your exact situation. Always confirm with the official source
          linked on each destination before you book.
        </p>
      </div>

      {nationality.supported ? (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="glass-panel rounded-[1.5rem] border border-black/10 p-4 sm:p-5">
              <dt className="text-sm text-muted">Reachable without a prior visa</dt>
              <dd className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                {stats.freedom}
                <span className="ml-2 font-sans text-lg text-muted">/ {stats.total}</span>
              </dd>
            </div>
            {STAT_CATEGORIES.map((cat) => (
              <div key={cat} className="glass-panel rounded-[1.5rem] border border-black/10 p-4 sm:p-5">
                <dt className="text-sm text-muted">{CATEGORY_META[cat].label}</dt>
                <dd className="mt-2 font-display text-3xl text-ink sm:text-4xl">{stats.counts[cat]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-5 text-muted">
            {stats.total} verified destinations for {nationality.demonym} passports
            {reviewed ? `, last reviewed ${reviewDateLabel(reviewed)}` : ""}. Search any other
            country to get its official source.
          </p>

          <div className="mt-8 max-w-md">
            <label htmlFor="visa-search" className="mb-2 block text-sm font-semibold text-ink">
              Search any country, city or region
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                id="visa-search"
                type="search"
                className="field pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
                placeholder="e.g. Germany, Dubai, Brasil"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            {liveMessage}
          </p>

          {search.correctedTo && (
            <p className="mt-3 text-sm text-muted">
              Showing results for <span className="font-semibold text-ink">{search.correctedTo}</span>.
            </p>
          )}

          <div className="mt-8 space-y-10">
            {search.notices.length > 0 && (
              <section aria-labelledby="visa-notices-heading">
                <h2 id="visa-notices-heading" className="sr-only">
                  Other matching countries
                </h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {search.notices.map((notice) => (
                    <VisaNoticeCard key={notice.country.code} notice={notice} passport={nationality} />
                  ))}
                </div>
              </section>
            )}

            {CATEGORY_ORDER.map((cat) => {
              const group = search.rules.filter((d) => d.effective === cat);
              if (group.length === 0) return null;
              const meta = CATEGORY_META[cat];
              return (
                <section key={cat} aria-labelledby={`visa-group-${cat}`}>
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${VISA_TONES[meta.tone].dot}`} aria-hidden />
                    <h2 id={`visa-group-${cat}`} className="font-display text-2xl text-ink">
                      {meta.label}
                    </h2>
                    <span className="text-sm text-muted">{group.length}</span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {group.map((d) => (
                      <VisaResultCard
                        key={d.code}
                        destination={d}
                        via={search.via[d.code]}
                        guideOpen={openGuide === d.code}
                        onToggleGuide={() => setOpenGuide(openGuide === d.code ? null : d.code)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {nothingFound && (
              <div className="rounded-[1.4rem] border border-black/10 bg-white/60 p-6">
                <p className="font-semibold text-ink">
                  We couldn&apos;t find “{trimmed}” as a country or territory.
                </p>
                {search.suggestions.length > 0 && (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Did you mean{" "}
                    {search.suggestions.map((c, i) => (
                      <Fragment key={c.code}>
                        {i > 0 && (i === search.suggestions.length - 1 ? " or " : ", ")}
                        <button
                          type="button"
                          onClick={() => setQuery(c.name)}
                          className="rounded-sm font-semibold text-[#b5391c] underline-offset-2 hover:underline"
                        >
                          {c.name}
                        </button>
                      </Fragment>
                    ))}
                    ?
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-muted">
                  Try a country name, a major city, or a region such as “Europe”. You can also check
                  any destination on the{" "}
                  <VisaExternalLink
                    href={IATA_TRAVEL_CENTRE.url}
                    className="font-semibold text-[#b5391c]"
                  >
                    {IATA_TRAVEL_CENTRE.label}
                  </VisaExternalLink>
                  , the database airlines check at boarding. Planning Europe? Try{" "}
                  <button
                    type="button"
                    onClick={() => setQuery("Schengen")}
                    className="rounded-sm font-semibold text-[#b5391c] underline-offset-2 hover:underline"
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
          <h2 className="font-display text-3xl text-ink">{nationality.name} is coming soon.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            We only publish rules we&apos;ve verified against official sources. Until then, check the{" "}
            <VisaExternalLink href={IATA_TRAVEL_CENTRE.url} className="font-semibold text-[#b5391c]">
              {IATA_TRAVEL_CENTRE.label}
            </VisaExternalLink>
            .
          </p>
        </div>
      )}
    </>
  );
}
