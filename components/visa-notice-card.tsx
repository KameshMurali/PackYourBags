import { BadgeCheck, Home, Info } from "lucide-react";
import {
  flagOf,
  IATA_TRAVEL_CENTRE,
  VISA_DISCLAIMER,
  type CountryNotice,
  type Nationality,
} from "@/lib/visa";
import { VisaExternalLink } from "@/components/visa-external-link";

const linkClass = "text-sm font-semibold text-[#b5391c] hover:text-ink";

// A recognised country without a verified rule for this passport: say so plainly and give
// the official next step, instead of a dead end or a guess.
export function VisaNoticeCard({
  notice,
  passport,
}: {
  notice: CountryNotice;
  passport: Nationality;
}) {
  const { country, source, isFallbackSource } = notice;
  const titleId = `visa-notice-${country.code}`;

  const header = (badge: React.ReactNode) => (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl leading-none" aria-hidden>
          {flagOf(country.code)}
        </span>
        <div className="min-w-0">
          <h3
            id={titleId}
            className="break-words text-base font-semibold leading-6 text-ink [font-family:var(--font-sans)]"
          >
            {country.name}
          </h3>
          <p className="text-xs text-muted">{country.region}</p>
        </div>
      </div>
      {badge}
    </div>
  );

  if (notice.kind === "passport") {
    return (
      <article
        aria-labelledby={titleId}
        className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5"
      >
        {header(
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">
            <BadgeCheck className="h-3 w-3" aria-hidden />
            Your passport
          </span>,
        )}
        <p className="mt-3 text-sm leading-6 text-muted">
          This is your passport country, so as a citizen of {passport.name} you don’t need a
          visa to enter.
        </p>
      </article>
    );
  }

  if (notice.kind === "residence") {
    return (
      <article
        aria-labelledby={titleId}
        className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5"
      >
        {header(
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">
            <Home className="h-3 w-3" aria-hidden />
            You live here
          </span>,
        )}
        <p className="mt-3 text-sm leading-6 text-muted">
          You enter {country.name} on your residence permit rather than a visitor visa. Keep it
          valid for your return.
        </p>
        <div className="mt-3">
          <VisaExternalLink href={source.url} label={source.label} className={linkClass}>
            {source.label}
          </VisaExternalLink>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-labelledby={titleId}
      className="rounded-[1.5rem] border border-dashed border-[#d6bf98] bg-[#fffaf2] p-5"
    >
      {header(
        <span className="shrink-0 rounded-full bg-[#fde8d3] px-3 py-1 text-xs font-semibold text-[#5f4a2c]">
          Not yet verified
        </span>,
      )}
      <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-6 text-ink">
        <Info className="mt-1 h-4 w-4 shrink-0 text-[#b5391c]" aria-hidden />
        Rule not yet verified for your passport
      </p>
      <p className="mt-1 text-sm leading-6 text-muted">
        We haven’t verified the {country.name} entry rule for {passport.demonym} passport
        holders yet, so we won’t guess. Check the official source before you book:
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        <VisaExternalLink href={source.url} label={source.label} className={linkClass}>
          {isFallbackSource ? `${IATA_TRAVEL_CENTRE.label} (what airlines check)` : source.label}
        </VisaExternalLink>
        {!isFallbackSource && (
          <VisaExternalLink href={IATA_TRAVEL_CENTRE.url} className={linkClass}>
            {IATA_TRAVEL_CENTRE.label}
          </VisaExternalLink>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{VISA_DISCLAIMER}</p>
    </article>
  );
}
