import { ChevronDown, Home, ShieldCheck, Sparkles } from "lucide-react";
import {
  CATEGORY_META,
  describeUnlocks,
  reviewDateLabel,
  VISA_GUIDES,
  type Country,
  type ResolvedDestination,
} from "@/lib/visa";
import { VisaExternalLink } from "@/components/visa-external-link";
import { VisaGuidePanel } from "@/components/visa-guide-panel";
import { VisaSchengenPanel } from "@/components/visa-schengen-panel";
import { VISA_TONES } from "@/components/visa-tones";

type Props = {
  destination: ResolvedDestination;
  /** Countries the search matched that resolve to this rule (e.g. Germany → Schengen). */
  via?: Country[];
  guideOpen: boolean;
  onToggleGuide: () => void;
};

export function VisaResultCard({ destination: d, via, guideOpen, onToggleGuide }: Props) {
  const meta = CATEGORY_META[d.effective];
  const tone = VISA_TONES[meta.tone];
  const guide = d.guide ? VISA_GUIDES[d.guide] : null;
  const unlocked = d.residentHere ? null : describeUnlocks(d.unlocks);
  const titleId = `visa-card-${d.code}`;
  const guideId = `visa-guide-${d.code}`;

  // Fee and processing time describe the base route, so only show them when it applies.
  const facts: Array<[string, string]> = [];
  if (d.effectiveDays) facts.push(["Stay", `Up to ${d.effectiveDays} days`]);
  if (d.effective === d.base && d.fee) facts.push(["Fee", d.fee]);
  if (d.effective === d.base && d.processingTime) facts.push(["Processing", d.processingTime]);

  const viaOther = via?.filter((c) => c.code !== d.code) ?? [];

  return (
    <article
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col rounded-[1.5rem] border border-black/10 bg-white/75 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-2xl leading-none" aria-hidden>
            {d.flag}
          </span>
          <div className="min-w-0">
            <h3
              id={titleId}
              className="break-words text-base font-semibold leading-6 text-ink [font-family:var(--font-sans)]"
            >
              {d.name}
            </h3>
            <p className="text-xs text-muted">{d.region}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tone.pill}`}>
          {meta.short}
          {d.effectiveDays ? ` · ${d.effectiveDays}d` : ""}
        </span>
      </div>

      {d.effectiveNote && <p className="mt-3 text-sm leading-6 text-muted">{d.effectiveNote}</p>}

      {d.residentHere ? (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">
          <Home className="h-3 w-3" aria-hidden />
          Your residence
        </p>
      ) : unlocked ? (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">
          <Sparkles className="h-3 w-3" aria-hidden />
          Unlocked by {unlocked}
        </p>
      ) : null}

      {facts.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="inline text-muted">{label}: </dt>
              <dd className="inline font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {viaOther.length > 0 && <VisaSchengenPanel destination={d} countries={viaOther} />}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
        {guide && (
          <button
            type="button"
            onClick={onToggleGuide}
            aria-expanded={guideOpen}
            aria-controls={guideId}
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-ink transition hover:text-[#8a4a24]"
          >
            <ShieldCheck className="h-4 w-4 text-clay" aria-hidden />
            How to apply
            <ChevronDown
              className={`h-4 w-4 transition-transform motion-reduce:transition-none ${guideOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        )}
        <VisaExternalLink
          href={d.source}
          label={d.sourceLabel}
          className="text-sm font-semibold text-muted hover:text-ink"
        >
          Official source
        </VisaExternalLink>
        <span className="text-xs text-muted">Reviewed {reviewDateLabel(d.lastReviewed)}</span>
      </div>

      {guide && (
        <div id={guideId} hidden={!guideOpen}>
          {guideOpen && <VisaGuidePanel guide={guide} />}
        </div>
      )}
    </article>
  );
}
