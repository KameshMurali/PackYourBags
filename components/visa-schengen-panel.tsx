import {
  officialSourceFor,
  SCHENGEN_CODE,
  SCHENGEN_FACTS,
  type Country,
  type ResolvedDestination,
} from "@/lib/visa";
import { VisaExternalLink } from "@/components/visa-external-link";

function listNames(countries: Country[]) {
  const names = countries.map((c) => c.name);
  return names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Explains how a searched country relates to the rule shown: a Schengen member (where to
// apply, the 90/180-day rule) or a place that follows another country's entry rules.
export function VisaSchengenPanel({
  destination,
  countries,
}: {
  destination: ResolvedDestination;
  countries: Country[];
}) {
  if (destination.code !== SCHENGEN_CODE) {
    return (
      <p className="mt-3 rounded-[1rem] bg-[#f6efe3] px-3 py-2 text-xs leading-5 text-[#5f4a2c]">
        {listNames(countries)} {countries.length === 1 ? "follows" : "follow"} {destination.name}{" "}
        entry rules.
      </p>
    );
  }

  const members = countries.filter((c) => c.schengen);
  const openBorder = countries.filter((c) => !c.schengen && c.rulesFrom === SCHENGEN_CODE);

  if (destination.residentHere) {
    return (
      <p className="mt-3 rounded-[1rem] bg-[#f6efe3] px-3 py-2 text-xs leading-5 text-[#5f4a2c]">
        {listNames(countries)} {countries.length === 1 ? "is" : "are"} covered by your Schengen
        residence permit.
      </p>
    );
  }

  const single = members.length === 1 ? members[0] : null;
  const memberSource = single ? officialSourceFor(single.code) : null;

  return (
    <section
      aria-label="Schengen details"
      className="mt-4 rounded-[1.25rem] border border-[#e7d3a9] bg-[#fbf6ec] p-4"
    >
      {members.length > 0 && (
        <p className="text-sm font-semibold leading-6 text-ink">
          {listNames(members)} {members.length === 1 ? "is" : "are"} in the Schengen Area: one
          visa covers all 29 member countries.
        </p>
      )}
      {openBorder.length > 0 && (
        <p className="text-sm font-semibold leading-6 text-ink">
          {listNames(openBorder)} {openBorder.length === 1 ? "isn't" : "aren't"} in Schengen but{" "}
          {openBorder.length === 1 ? "has" : "have"} open borders with it: you arrive through a
          Schengen country, so Schengen entry rules apply.
        </p>
      )}

      <dl className="mt-3 space-y-2 text-sm leading-6 text-ink/80">
        <div>
          <dt className="font-semibold text-ink">Where to apply</dt>
          <dd>
            {SCHENGEN_FACTS.whereToApply}
            {single &&
              ` If ${single.name} is your main destination, that's ${single.name}'s consulate or its visa centre.`}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">How long you can stay</dt>
          <dd>{SCHENGEN_FACTS.stayRule}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">When to apply</dt>
          <dd>{SCHENGEN_FACTS.timing}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {single && memberSource && !memberSource.isFallback && (
          <VisaExternalLink
            href={memberSource.source.url}
            label={memberSource.source.label}
            className="text-xs font-semibold text-ink hover:text-[#8a4a24]"
          >
            {single.name}: official visa information
          </VisaExternalLink>
        )}
        {SCHENGEN_FACTS.sources.map((s) => (
          <VisaExternalLink
            key={s.url}
            href={s.url}
            className="text-xs font-semibold text-ink hover:text-[#8a4a24]"
          >
            {s.label.replace("European Commission — ", "EU: ")}
          </VisaExternalLink>
        ))}
      </div>
    </section>
  );
}
