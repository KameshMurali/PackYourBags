import { reviewDateLabel, type VisaGuide } from "@/lib/visa";
import { VisaExternalLink } from "@/components/visa-external-link";

const sectionLabel =
  "mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#b5391c] [font-family:var(--font-sans)]";

export function VisaGuidePanel({ guide }: { guide: VisaGuide }) {
  return (
    <div className="mt-4 rounded-[1.25rem] border border-black/10 bg-[#fffaf3] p-4 text-left">
      <p className="font-display text-lg leading-6 text-ink">{guide.title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{guide.appliesTo}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{guide.overview}</p>

      <h4 className={sectionLabel}>Documents</h4>
      <ul className="mt-2 space-y-1.5">
        {guide.documents.map((doc) => (
          <li key={doc} className="flex gap-2 text-sm leading-6 text-ink/80">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden />
            <span>{doc}</span>
          </li>
        ))}
      </ul>

      <h4 className={sectionLabel}>Process</h4>
      <ol className="mt-2 space-y-1.5">
        {guide.steps.map((step, idx) => (
          <li key={step} className="flex gap-2 text-sm leading-6 text-ink/80">
            <span className="font-semibold text-[#b5391c]">{idx + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {guide.tips.length > 0 && (
        <>
          <h4 className={sectionLabel}>Tips</h4>
          <ul className="mt-2 space-y-1.5">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-6 text-ink/80">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b9a382]" aria-hidden />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <dl className="mt-4 space-y-1 text-xs leading-5 text-muted">
        <div>
          <dt className="inline font-semibold text-ink">Processing: </dt>
          <dd className="inline">{guide.processingTime}</dd>
        </div>
        {guide.fee && (
          <div>
            <dt className="inline font-semibold text-ink">Fee: </dt>
            <dd className="inline">{guide.fee}</dd>
          </div>
        )}
        <div>
          <dt className="inline font-semibold text-ink">Guide reviewed: </dt>
          <dd className="inline">{reviewDateLabel(guide.lastReviewed)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {guide.officialLinks.map((l) => (
          <VisaExternalLink
            key={l.url}
            href={l.url}
            className="text-xs font-semibold text-ink hover:text-[#b5391c]"
          >
            {l.label}
          </VisaExternalLink>
        ))}
      </div>
    </div>
  );
}
