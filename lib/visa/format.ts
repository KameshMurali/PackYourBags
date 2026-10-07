// Plain-text answers for assistants (the MCP check_visa / list_visa_free tools).

import type { VisaCheck, VisaCheckInput } from "./engine";
import { checkVisa, findPassport, resolveDestinations, summarise } from "./engine";
import { IATA_TRAVEL_CENTRE, SCHENGEN_CODE } from "./lookup";
import { CATEGORY_META, CREDENTIAL_LABELS, EASY_ACCESS, NATIONALITIES } from "./meta";
import type { CredentialCode, CredentialUnlock, Nationality, ResolvedDestination } from "./types";

/** Shown with every answer, in the UI and in MCP output. */
export const VISA_DISCLAIMER =
  "Indicative guidance — not legal advice. Visa rules change and depend on your exact situation; verify with the official source before you book.";

/** "IN (India), PK (Pakistan), …" for the passports with verified data. */
export function supportedPassportsLabel(): string {
  return NATIONALITIES.filter((n) => n.supported)
    .map((n) => `${n.code} (${n.name})`)
    .join(", ");
}

/** "US visa", "UK residence permit". */
export function credentialLabel(unlock: CredentialUnlock): string {
  const name = CREDENTIAL_LABELS[unlock.code];
  return unlock.via === "visa" ? `${name} visa` : `${name} residence permit`;
}

/** "your US visa and UK residence permit". */
export function describeUnlocks(unlocks: CredentialUnlock[] | undefined): string | null {
  if (!unlocks || unlocks.length === 0) return null;
  const labels = unlocks.map(credentialLabel);
  const list =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  return `your ${list}`;
}

function days(n: number | undefined) {
  return n ? `up to ${n} day${n === 1 ? "" : "s"}` : null;
}

function sourceLine(d: ResolvedDestination) {
  return `Source: ${d.sourceLabel ? `${d.sourceLabel} — ` : ""}${d.source}`;
}

/** One-line summary of a resolved destination, e.g. "Thailand — No visa · up to 60 days". */
export function summaryLine(d: ResolvedDestination): string {
  const parts = [CATEGORY_META[d.effective].short, days(d.effectiveDays)].filter(Boolean);
  return `${d.name} — ${parts.join(" · ")}`;
}

function verifiedText(check: Extract<VisaCheck, { status: "verified" }>): string {
  const d = check.destination;
  const meta = CATEGORY_META[d.effective];
  const lines: string[] = [];

  const heading = check.via ? `${check.via.name} (${d.name})` : d.name;
  const stay = days(d.effectiveDays);
  lines.push(`${heading}: ${meta.label}${stay ? ` — ${stay}` : ""}`);
  lines.push(`Passport: ${check.passport.name}.`);
  if (check.correctedTo) lines.push(`Closest match: ${check.correctedTo}.`);
  if (d.effectiveNote) lines.push(d.effectiveNote);

  if (check.via && d.code === SCHENGEN_CODE) {
    lines.push(
      `${check.via.name} is in the Schengen Area: one short-stay Schengen visa covers all member countries, for up to 90 days in any 180-day period. Apply at the consulate of your main destination (where you'll spend the most time), or of your first point of entry if stays are equal.`,
    );
  } else if (check.via) {
    lines.push(`${check.via.name} follows ${d.name} entry rules.`);
  }

  if (d.residentHere) {
    lines.push("You live here, so this reflects your residence permit.");
  } else {
    const unlocked = describeUnlocks(d.unlocks);
    if (unlocked) lines.push(`Unlocked by ${unlocked}.`);
  }

  if (d.effective === d.base) {
    if (d.fee) lines.push(`Fee: ${d.fee}`);
    if (d.processingTime) lines.push(`Processing time: ${d.processingTime}`);
  }

  if (check.guide) {
    const g = check.guide;
    lines.push("");
    lines.push(`How to apply — ${g.title}`);
    lines.push(`Documents:\n${g.documents.map((x) => `• ${x}`).join("\n")}`);
    lines.push(`Process:\n${g.steps.map((x, i) => `${i + 1}. ${x}`).join("\n")}`);
    lines.push(`Processing: ${g.processingTime}`);
    if (g.fee) lines.push(`Fee: ${g.fee}`);
    lines.push(`Official links: ${g.officialLinks.map((l) => `${l.label} — ${l.url}`).join("; ")}`);
  }

  lines.push("");
  lines.push(sourceLine(d));
  lines.push(`Last reviewed: ${d.lastReviewed}`);

  if (check.others.length > 0) {
    lines.push("");
    lines.push(`Other matches:\n${check.others.map((o) => `• ${summaryLine(o)}`).join("\n")}`);
  }

  return lines.join("\n");
}

/** The full plain-text answer for check_visa, always ending with the disclaimer. */
export function formatVisaCheck(check: VisaCheck): string {
  let body: string;

  switch (check.status) {
    case "verified":
      body = verifiedText(check);
      break;
    case "unverified": {
      const lines = [
        `${check.country.name}: rule not yet verified for ${check.passport.demonym} passport holders.`,
      ];
      if (check.correctedTo) lines.push(`Closest match: ${check.correctedTo}.`);
      lines.push(
        "PackYourBags hasn't verified this destination for this passport yet, so it won't guess.",
      );
      lines.push(`Check the official source before you book: ${check.source.label} — ${check.source.url}`);
      if (!check.isFallbackSource) {
        lines.push(
          `Or the ${IATA_TRAVEL_CENTRE.label}, the database airlines check at boarding: ${IATA_TRAVEL_CENTRE.url}`,
        );
      }
      body = lines.join("\n");
      break;
    }
    case "passport":
      body = `${check.country.name} is the traveller's own passport country (${check.passport.name}): citizens don't need a visa to enter.`;
      break;
    case "residence":
      body = [
        `${check.country.name}: the traveller lives here, so they enter on their residence permit rather than a visitor visa.`,
        `Official source: ${check.source.label} — ${check.source.url}`,
      ].join("\n");
      break;
    case "not-found": {
      const hint = check.suggestions.length
        ? ` Did you mean ${check.suggestions.map((c) => c.name).join(", ")}?`
        : "";
      body = `Couldn't identify "${check.query}" as a country or territory.${hint} Try the country name (e.g. "Germany"), a major city, or "Schengen".`;
      break;
    }
    case "unsupported-passport":
      body = [
        `Passport "${check.query}" isn't covered yet. Supported passports: ${supportedPassportsLabel()}.`,
        `For other passports, check the ${IATA_TRAVEL_CENTRE.label}: ${IATA_TRAVEL_CENTRE.url}`,
      ].join("\n");
      break;
  }

  return `${body}\n\n${VISA_DISCLAIMER}`;
}

/** The plain-text answer for list_visa_free, always ending with the disclaimer. */
export function formatEasyAccess(
  passport: Nationality,
  resolved: ResolvedDestination[],
  held: { residence?: CredentialCode | "NONE" | null; visas?: CredentialCode[] } = {},
): string {
  const s = summarise(resolved);
  const easy = resolved.filter((d) => EASY_ACCESS.includes(d.effective));
  const profile = [
    held.residence && held.residence !== "NONE" ? `${CREDENTIAL_LABELS[held.residence]} resident` : null,
    held.visas?.length ? `holding ${held.visas.map((v) => `${CREDENTIAL_LABELS[v]}`).join(", ")} visas` : null,
  ].filter(Boolean);

  const lines = [
    `${passport.name} passport${profile.length ? ` (${profile.join(", ")})` : ""}: ${s.freedom} of ${s.total} verified destinations need no visa in advance (visa-free, visa on arrival, or a travel authorisation).`,
    "",
    ...easy.map((d) => {
      const unlocked = d.residentHere ? "you live here" : describeUnlocks(d.unlocks);
      const via = unlocked ? ` (${d.residentHere ? unlocked : `via ${unlocked}`})` : "";
      return `• ${summaryLine(d)}${via} · reviewed ${d.lastReviewed} · ${d.source}`;
    }),
    "",
    `Destinations we haven't verified for this passport aren't listed — check them with check_visa or the ${IATA_TRAVEL_CENTRE.label} (${IATA_TRAVEL_CENTRE.url}).`,
  ];

  return `${lines.join("\n")}\n\n${VISA_DISCLAIMER}`;
}

/** check_visa: the full answer for one destination. */
export function visaCheckAnswer(input: VisaCheckInput): string {
  return formatVisaCheck(checkVisa(input));
}

/** list_visa_free: every verified destination reachable without a visa in advance. */
export function easyAccessAnswer(input: Omit<VisaCheckInput, "destination">): string {
  const passport = findPassport(input.passport);
  if (!passport || !passport.supported) {
    return formatVisaCheck({
      status: "unsupported-passport",
      query: input.passport,
      supported: NATIONALITIES.filter((n) => n.supported),
    });
  }
  const residence = input.residence && input.residence !== "NONE" ? input.residence : null;
  const credentials = Array.from(
    new Set<CredentialCode>([
      ...(residence ? [residence] : []),
      ...(input.visas ?? []),
      ...(input.credentials ?? []),
    ]),
  );
  const visas = credentials.filter((c) => c !== residence);
  const resolved = resolveDestinations(passport.code, credentials, { residence });
  return formatEasyAccess(passport, resolved, { residence, visas });
}
