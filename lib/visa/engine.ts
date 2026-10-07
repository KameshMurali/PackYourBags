// Visa resolution: apply a traveller's residence and held visas to a passport's dataset,
// search it, and answer "do I need a visa for X?" honestly — including when we haven't
// verified the rule yet.

import { DATASETS } from "./data";
import { GUIDE_BY_DESTINATION, VISA_GUIDES } from "./guides";
import { officialSourceFor, ruleCodesFor, SCHENGEN_CODE } from "./lookup";
import { CATEGORY_META, CREDENTIAL_DESTINATION, EASY_ACCESS, NATIONALITIES } from "./meta";
import {
  findCountry,
  fuzzyCountries,
  matchCountries,
  matchesQuery,
  nearestCountries,
  normalize,
  type CountryMatch,
} from "./search";
import type {
  Country,
  CredentialCode,
  CredentialUnlock,
  DestinationRule,
  Nationality,
  OfficialSource,
  ResolvedDestination,
  VisaCategory,
  VisaGuide,
} from "./types";

// Most to least permissive.
const PERMISSIVENESS: VisaCategory[] = [
  "visa-free",
  "visa-on-arrival",
  "eta",
  "evisa",
  "visa-required",
];

const rank = (category: VisaCategory) => PERMISSIVENESS.indexOf(category);

export function isSupported(nationality: string): boolean {
  return (DATASETS[nationality.toUpperCase()]?.length ?? 0) > 0;
}

export type ResolveOptions = {
  /**
   * The traveller's residence. When this key is present, only this credential counts as a
   * residence and every other credential counts as a held visa. When it's absent, every
   * credential counts as both (the original behaviour).
   */
  residence?: CredentialCode | "NONE" | null;
};

function residenceNote(code: string): string {
  return code === SCHENGEN_CODE
    ? "You live in the Schengen Area: your residence permit lets you visit the other Schengen countries for up to 90 days in any 180-day period without a visa."
    : "You live here: you enter on your residence permit, not a visitor visa.";
}

function guideKeyFor(code: string, explicit: string | undefined, effective: VisaCategory) {
  if (effective !== "visa-required" && effective !== "evisa") return undefined;
  const key = explicit ?? GUIDE_BY_DESTINATION[code];
  return key && VISA_GUIDES[key] ? key : undefined;
}

/**
 * Apply held visas and residence to a passport's verified rules. Sorted by category (most
 * permissive first), then by name.
 *
 * @param credentials every visa and residence the traveller holds (the residence included).
 */
export function resolveDestinations(
  nationality: string,
  credentials: CredentialCode[],
  options?: ResolveOptions,
): ResolvedDestination[] {
  return resolveRules(DATASETS[nationality.toUpperCase()] ?? [], credentials, options);
}

/** resolveDestinations over an explicit rule list (used by tests and previews). */
export function resolveRules(
  rules: readonly DestinationRule[],
  credentials: CredentialCode[],
  options?: ResolveOptions,
): ResolvedDestination[] {
  const precise = options !== undefined && "residence" in options;
  const residence =
    precise && options.residence && options.residence !== "NONE" ? options.residence : null;
  const visas = new Set<CredentialCode>(
    precise ? credentials.filter((c) => c !== residence) : credentials,
  );
  const residences = new Set<CredentialCode>(
    precise ? (residence ? [residence] : []) : credentials,
  );
  const homeRule = residence ? CREDENTIAL_DESTINATION[residence] : null;

  return rules
    .map((rule): ResolvedDestination => {
      if (residence && rule.code === homeRule) {
        return {
          ...rule,
          effective: "visa-free",
          effectiveDays: undefined,
          effectiveNote: residenceNote(rule.code),
          unlockedBy: [residence],
          unlocks: [{ code: residence, via: "residence" }],
          residentHere: true,
          guide: undefined,
        };
      }

      let effective = rule.base;
      let effectiveDays = rule.days;
      let effectiveNote = rule.note;
      let unlocks: CredentialUnlock[] | undefined;

      for (const override of rule.overrides ?? []) {
        const matched: CredentialUnlock[] = [];
        for (const code of override.visas ?? []) {
          if (visas.has(code)) matched.push({ code, via: "visa" });
        }
        for (const code of override.residence ?? []) {
          if (residences.has(code) && !matched.some((m) => m.code === code)) {
            matched.push({ code, via: "residence" });
          }
        }
        if (matched.length > 0 && rank(override.category) < rank(effective)) {
          effective = override.category;
          effectiveDays = override.days;
          effectiveNote = override.note ?? rule.note;
          unlocks = matched;
        }
      }

      return {
        ...rule,
        effective,
        effectiveDays,
        effectiveNote,
        unlockedBy: unlocks?.map((u) => u.code),
        unlocks,
        guide: guideKeyFor(rule.code, rule.guide, effective),
      };
    })
    .sort((a, b) => {
      const byCategory = CATEGORY_META[a.effective].order - CATEGORY_META[b.effective].order;
      return byCategory !== 0 ? byCategory : a.name.localeCompare(b.name);
    });
}

export function summarise(resolved: ResolvedDestination[]) {
  const counts: Record<VisaCategory, number> = {
    "visa-free": 0,
    "visa-on-arrival": 0,
    eta: 0,
    evisa: 0,
    "visa-required": 0,
  };

  for (const d of resolved) {
    counts[d.effective] += 1;
  }

  const freedom = resolved.filter((d) => EASY_ACCESS.includes(d.effective)).length;

  return { counts, freedom, total: resolved.length };
}

// ---------------------------------------------------------------------------
// Search across verified rules and the country index
// ---------------------------------------------------------------------------

export type CountryNotice = {
  /**
   * unverified: a real country with no verified rule for this passport yet.
   * passport: the traveller's own passport country.
   * residence: the traveller lives there (and no rule is listed for it).
   */
  kind: "unverified" | "passport" | "residence";
  country: Country;
  source: OfficialSource;
  /** True when `source` is the IATA Travel Centre because no official source is listed. */
  isFallbackSource: boolean;
};

export type DestinationSearch = {
  query: string;
  /** Verified rules that match, in resolved order (category, then name). */
  rules: ResolvedDestination[];
  /** Recognised countries that have no verified rule for this passport. */
  notices: CountryNotice[];
  /** Rule code → the searched countries that led to it, e.g. SCHENGEN → [Germany]. */
  via: Record<string, Country[]>;
  /** Recognised countries, best match first. */
  countries: Country[];
  /** Set when the match came from typo tolerance: the name we matched, e.g. "Germany". */
  correctedTo: string | null;
  /** When nothing matched: the closest country names, for "did you mean". */
  suggestions: Country[];
};

const MAX_NOTICES = 4;

/**
 * Search a passport's resolved rules and the country index for a query. Every recognised
 * country ends up either as a verified rule or as a notice, so there are no dead ends.
 */
export function searchDestinations(
  nationality: string,
  resolved: ResolvedDestination[],
  query: string,
  options: { residence?: CredentialCode | "NONE" | null } = {},
): DestinationSearch {
  const q = normalize(query);
  if (!q) {
    return { query, rules: resolved, notices: [], via: {}, countries: [], correctedTo: null, suggestions: [] };
  }

  const passport = nationality.toUpperCase();
  const residence = options.residence && options.residence !== "NONE" ? options.residence : null;
  const residenceRule = residence ? CREDENTIAL_DESTINATION[residence] : null;
  const byCode = new Map(resolved.map((r) => [r.code, r]));

  const direct = resolved.filter((d) => matchesQuery(d, query));
  let countryMatches: CountryMatch[] = matchCountries(query);
  let correctedTo: string | null = null;

  if (direct.length === 0 && countryMatches.length === 0) {
    countryMatches = fuzzyCountries(query);
    if (countryMatches.length > 0) correctedTo = countryMatches[0].country.name;
  }

  const matchedCodes = new Set(direct.map((d) => d.code));
  const via: Record<string, Country[]> = {};
  const notices: CountryNotice[] = [];

  for (const match of countryMatches) {
    const country = match.country;
    const ruleCode = ruleCodesFor(country).find((code) => byCode.has(code));

    if (ruleCode) {
      matchedCodes.add(ruleCode);
      if (ruleCode !== country.code) (via[ruleCode] ??= []).push(country);
      continue;
    }

    const { source, isFallback } = officialSourceFor(country.code);
    const kind: CountryNotice["kind"] =
      country.code === passport
        ? "passport"
        : residenceRule && ruleCodesFor(country).includes(residenceRule)
          ? "residence"
          : "unverified";
    notices.push({ kind, country, source, isFallbackSource: isFallback });
  }

  const rules = resolved.filter((d) => matchedCodes.has(d.code));
  const limitedNotices = notices.slice(0, MAX_NOTICES);

  return {
    query,
    rules,
    notices: limitedNotices,
    via,
    countries: countryMatches.map((m) => m.country),
    correctedTo,
    suggestions: rules.length === 0 && limitedNotices.length === 0 ? nearestCountries(query) : [],
  };
}

// ---------------------------------------------------------------------------
// Single-destination check (used by the MCP check_visa tool)
// ---------------------------------------------------------------------------

/** Find a passport by ISO code, country name, or demonym ("IN", "India", "Indian"). */
export function findPassport(value: string): Nationality | undefined {
  const q = normalize(value);
  if (!q) return undefined;
  const direct = NATIONALITIES.find(
    (n) =>
      n.code.toLowerCase() === q ||
      [n.name, n.demonym, ...(n.aliases ?? [])].some((term) => normalize(term) === q),
  );
  if (direct) return direct;
  const country = findCountry(value);
  return country ? NATIONALITIES.find((n) => n.code === country.code) : undefined;
}

export type VisaCheckInput = {
  /** Passport as an ISO code, country name, or demonym. */
  passport: string;
  /** Destination as a country, native name, city, ISO code, or "Schengen". */
  destination: string;
  residence?: CredentialCode | "NONE" | null;
  /** Valid visas held. */
  visas?: CredentialCode[];
  /** Every visa and residence held (the residence may be included); merged with `visas`. */
  credentials?: CredentialCode[];
};

export type VisaCheck =
  | {
      status: "verified";
      passport: Nationality;
      destination: ResolvedDestination;
      /** The country searched for, when it isn't the rule itself (Germany → Schengen). */
      via: Country | null;
      guide: VisaGuide | null;
      correctedTo: string | null;
      /** Other verified matches, for region queries such as "europe". */
      others: ResolvedDestination[];
    }
  | {
      status: "unverified" | "passport" | "residence";
      passport: Nationality;
      country: Country;
      source: OfficialSource;
      isFallbackSource: boolean;
      correctedTo: string | null;
    }
  | { status: "not-found"; passport: Nationality; query: string; suggestions: Country[] }
  | { status: "unsupported-passport"; query: string; supported: Nationality[] };

export function checkVisa(input: VisaCheckInput): VisaCheck {
  const supported = NATIONALITIES.filter((n) => n.supported);
  const passport = findPassport(input.passport);
  if (!passport || !passport.supported) {
    return { status: "unsupported-passport", query: input.passport, supported };
  }

  const residence = input.residence && input.residence !== "NONE" ? input.residence : null;
  const credentials = Array.from(
    new Set<CredentialCode>([
      ...(residence ? [residence] : []),
      ...(input.visas ?? []),
      ...(input.credentials ?? []),
    ]),
  );
  const resolved = resolveDestinations(passport.code, credentials, { residence });
  const search = searchDestinations(passport.code, resolved, input.destination, { residence });

  const top = search.countries[0];
  if (top) {
    const ruleCode = ruleCodesFor(top).find((code) => search.rules.some((r) => r.code === code));
    const rule = ruleCode ? search.rules.find((r) => r.code === ruleCode) : undefined;
    if (rule) {
      return {
        status: "verified",
        passport,
        destination: rule,
        via: rule.code === top.code ? null : top,
        guide: rule.guide ? VISA_GUIDES[rule.guide] ?? null : null,
        correctedTo: search.correctedTo,
        others: [],
      };
    }
    const notice = search.notices.find((n) => n.country.code === top.code);
    if (notice) {
      return {
        status: notice.kind,
        passport,
        country: notice.country,
        source: notice.source,
        isFallbackSource: notice.isFallbackSource,
        correctedTo: search.correctedTo,
      };
    }
  }

  const [first, ...others] = search.rules;
  if (first) {
    return {
      status: "verified",
      passport,
      destination: first,
      via: null,
      guide: first.guide ? VISA_GUIDES[first.guide] ?? null : null,
      correctedTo: search.correctedTo,
      others,
    };
  }

  return {
    status: "not-found",
    passport,
    query: input.destination,
    suggestions: search.suggestions,
  };
}
