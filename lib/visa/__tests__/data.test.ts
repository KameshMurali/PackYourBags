// Data validation over every dataset, the country index, official sources and guides.
// Research contributors: run `npx vitest run lib/visa/__tests__/data.test.ts` after editing.

import { describe, expect, it } from "vitest";
import {
  CATEGORY_ORDER,
  COUNTRIES,
  COUNTRY_SOURCES,
  CREDENTIAL_CODES,
  DATASETS,
  flagOf,
  getCountry,
  GUIDE_BY_DESTINATION,
  NATIONALITIES,
  normalize,
  REGIONS,
  SCHENGEN_CODE,
  VISA_GUIDES,
  type DestinationRule,
  type VisaCategory,
} from "@/lib/visa";

// All 193 UN member states (ISO 3166-1 alpha-2).
const UN_MEMBERS = `AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV
KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE
DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY
LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA
PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY
TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VE VN YE ZM ZW`.split(/\s+/);

// UN observers, plus Taiwan and Kosovo.
const ALSO_REQUIRED = ["VA", "PS", "TW", "XK"];

const SCHENGEN_MEMBERS = `AT BE BG HR CZ DK EE FI FR DE GR HU IS IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE
CH`.split(/\s+/);

// Commercial or crowd-sourced sites: fine as leads, never as the cited source.
const DISALLOWED_SOURCE_HOSTS = [
  "wikipedia.org",
  "schengenvisainfo.com",
  "visaguide.world",
  "ivisa.com",
  "visahq.com",
  "visahq.in",
  "passportindex.org",
  "henleyglobal.com",
  "visaindex.com",
  "atlys.com",
  "tripadvisor.com",
];

const EARLIEST_REVIEW = Date.parse("2025-01-01T00:00:00Z");
// Allow two days of clock and timezone skew for records reviewed "today".
const LATEST_REVIEW = Date.now() + 2 * 24 * 60 * 60 * 1000;

function httpsProblem(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return `not a URL: ${url}`;
  }
  if (parsed.protocol !== "https:") return `not https: ${url}`;
  const host = parsed.hostname.toLowerCase();
  const banned = DISALLOWED_SOURCE_HOSTS.find((h) => host === h || host.endsWith(`.${h}`));
  return banned ? `disallowed source host ${host}: ${url}` : null;
}

function dateProblem(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `lastReviewed must be YYYY-MM-DD, got ${String(value)}`;
  }
  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== value) {
    return `invalid date ${value}`;
  }
  if (time < EARLIEST_REVIEW) return `lastReviewed ${value} is before 2025-01-01`;
  if (time > LATEST_REVIEW) return `lastReviewed ${value} is in the future`;
  return null;
}

function daysProblem(days: unknown): string | null {
  if (days === undefined) return null;
  return typeof days === "number" && Number.isInteger(days) && days >= 1 && days <= 365
    ? null
    : `days must be an integer from 1 to 365, got ${String(days)}`;
}

const rankOf = (c: VisaCategory) => CATEGORY_ORDER.indexOf(c);

function ruleProblems(passport: string, rule: DestinationRule): string[] {
  const problems: string[] = [];
  const at = `${passport}/${rule.code}`;
  const push = (p: string | null) => p && problems.push(`${at}: ${p}`);

  if (rule.code === SCHENGEN_CODE) {
    push(rule.flag === "🇪🇺" ? null : "Schengen flag must be 🇪🇺");
    push(rule.region === "Europe" ? null : "Schengen region must be Europe");
    push(rule.name.startsWith("Schengen") ? null : "Schengen name must start with 'Schengen'");
  } else {
    const country = getCountry(rule.code);
    if (!country) {
      push(`unknown country code (not in lib/visa/countries.ts)`);
    } else {
      push(country.schengen ? "Schengen members must use the single SCHENGEN rule" : null);
      push(rule.code === passport ? "a passport's own country can't be a destination" : null);
      push(rule.name === country.name ? null : `name "${rule.name}" must be "${country.name}"`);
      push(rule.region === country.region ? null : `region "${rule.region}" must be "${country.region}"`);
      push(rule.flag === flagOf(rule.code) ? null : `flag must be ${flagOf(rule.code)}`);
    }
  }

  push(CATEGORY_ORDER.includes(rule.base) ? null : `invalid base category ${String(rule.base)}`);
  push(daysProblem(rule.days));
  push(httpsProblem(rule.source));
  push(dateProblem(rule.lastReviewed));
  if (rule.sourceLabel !== undefined) push(rule.sourceLabel.trim() ? null : "empty sourceLabel");
  if (rule.note !== undefined) {
    push(rule.note.trim() ? null : "empty note");
    push(rule.note.length <= 400 ? null : `note is ${rule.note.length} characters (max 400)`);
  }
  if (rule.fee !== undefined) push(rule.fee.trim() ? null : "empty fee");
  if (rule.processingTime !== undefined) push(rule.processingTime.trim() ? null : "empty processingTime");
  if (rule.guide !== undefined) push(VISA_GUIDES[rule.guide] ? null : `unknown guide "${rule.guide}"`);
  for (const alias of rule.aliases ?? []) push(normalize(alias) ? null : `empty alias "${alias}"`);

  (rule.overrides ?? []).forEach((o, i) => {
    const where = `override ${i}`;
    push(CATEGORY_ORDER.includes(o.category) ? null : `${where}: invalid category`);
    push(
      rankOf(o.category) < rankOf(rule.base)
        ? null
        : `${where}: ${o.category} isn't more permissive than base ${rule.base}`,
    );
    const codes = [...(o.visas ?? []), ...(o.residence ?? [])];
    push(codes.length > 0 ? null : `${where}: needs at least one visa or residence credential`);
    for (const list of [o.visas ?? [], o.residence ?? []]) {
      push(new Set(list).size === list.length ? null : `${where}: duplicate credential`);
    }
    for (const code of codes) {
      push(CREDENTIAL_CODES.includes(code) ? null : `${where}: unknown credential ${String(code)}`);
    }
    push(daysProblem(o.days));
    if (o.note !== undefined) {
      push(o.note.trim() ? null : `${where}: empty note`);
      push(o.note.length <= 400 ? null : `${where}: note longer than 400 characters`);
    }
  });

  return problems;
}

describe("passport datasets", () => {
  it("are registered for every listed passport, and only those", () => {
    expect(Object.keys(DATASETS).sort()).toEqual(NATIONALITIES.map((n) => n.code).sort());
  });

  it("mark a passport as supported exactly when it has verified rules", () => {
    for (const n of NATIONALITIES) {
      expect(n.supported, n.code).toBe(DATASETS[n.code].length > 0);
    }
  });

  it("include India", () => {
    expect(DATASETS.IN.length).toBeGreaterThan(0);
  });

  describe.each(Object.entries(DATASETS))("%s", (passport, rules) => {
    it("has unique destination codes", () => {
      const codes = rules.map((r) => r.code);
      const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i);
      expect(duplicates).toEqual([]);
    });

    it("has valid, sourced, reviewed records", () => {
      expect(rules.flatMap((rule) => ruleProblems(passport, rule))).toEqual([]);
    });
  });
});

describe("country index", () => {
  const codes = COUNTRIES.map((c) => c.code);

  it("lists all 193 UN members, the observers, Taiwan and Kosovo", () => {
    expect(UN_MEMBERS).toHaveLength(193);
    const missing = [...UN_MEMBERS, ...ALSO_REQUIRED].filter((c) => !codes.includes(c));
    expect(missing).toEqual([]);
  });

  it("has unique, well-formed codes and names", () => {
    expect(codes.filter((c) => !/^[A-Z]{2}$/.test(c))).toEqual([]);
    expect(codes.filter((c, i) => codes.indexOf(c) !== i)).toEqual([]);
    const names = COUNTRIES.map((c) => normalize(c.name));
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it("uses known regions", () => {
    const regions: readonly string[] = REGIONS;
    expect(COUNTRIES.filter((c) => !regions.includes(c.region)).map((c) => c.code)).toEqual([]);
  });

  it("flags exactly the 29 Schengen members", () => {
    expect(SCHENGEN_MEMBERS).toHaveLength(29);
    expect(COUNTRIES.filter((c) => c.schengen).map((c) => c.code).sort()).toEqual(
      [...SCHENGEN_MEMBERS].sort(),
    );
  });

  it("points rulesFrom and territoryOf at real entries", () => {
    const problems: string[] = [];
    for (const c of COUNTRIES) {
      if (c.rulesFrom && c.rulesFrom !== SCHENGEN_CODE && !codes.includes(c.rulesFrom)) {
        problems.push(`${c.code}: rulesFrom ${c.rulesFrom}`);
      }
      if (c.territoryOf && !codes.includes(c.territoryOf)) {
        problems.push(`${c.code}: territoryOf ${c.territoryOf}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("has non-empty aliases and cities that don't reuse another country's name", () => {
    const nameOwner = new Map(COUNTRIES.map((c) => [normalize(c.name), c.code]));
    const problems: string[] = [];
    for (const c of COUNTRIES) {
      const terms = [...(c.aliases ?? []), ...(c.cities ?? [])];
      const normalized = terms.map(normalize);
      normalized.forEach((t, i) => {
        if (!t) problems.push(`${c.code}: empty term "${terms[i]}"`);
        const owner = nameOwner.get(t);
        if (owner && owner !== c.code) problems.push(`${c.code}: "${terms[i]}" is ${owner}'s name`);
      });
      const own = [normalize(c.name), ...normalized];
      own.forEach((t, i) => {
        if (own.indexOf(t) !== i) problems.push(`${c.code}: duplicate term "${t}"`);
      });
    }
    expect(problems).toEqual([]);
  });
});

describe("official country sources", () => {
  it("are keyed by known countries, https, labelled and reviewed", () => {
    const problems: string[] = [];
    for (const [code, source] of Object.entries(COUNTRY_SOURCES)) {
      if (!getCountry(code)) problems.push(`${code}: unknown country`);
      if (!source.label.trim()) problems.push(`${code}: empty label`);
      const url = httpsProblem(source.url);
      if (url) problems.push(`${code}: ${url}`);
      const date = dateProblem(source.lastReviewed);
      if (date) problems.push(`${code}: ${date}`);
    }
    expect(problems).toEqual([]);
  });
});

describe("visa guides", () => {
  it("map destinations to guides that exist", () => {
    for (const [destination, key] of Object.entries(GUIDE_BY_DESTINATION)) {
      expect(destination === SCHENGEN_CODE || Boolean(getCountry(destination)), destination).toBe(true);
      expect(VISA_GUIDES[key], `${destination} → ${key}`).toBeDefined();
    }
  });

  it.each(Object.entries(VISA_GUIDES))("%s is complete and sourced", (key, guide) => {
    const problems: string[] = [];
    for (const field of ["title", "appliesTo", "processingTime", "overview"] as const) {
      if (!guide[field].trim()) problems.push(`${key}: empty ${field}`);
    }
    if (guide.documents.length < 3) problems.push(`${key}: needs at least 3 documents`);
    if (guide.steps.length < 3) problems.push(`${key}: needs at least 3 steps`);
    if (guide.officialLinks.length < 1) problems.push(`${key}: needs an official link`);
    for (const link of guide.officialLinks) {
      if (!link.label.trim()) problems.push(`${key}: link without label`);
      const url = httpsProblem(link.url);
      if (url) problems.push(`${key}: ${url}`);
    }
    if (guide.fee !== undefined && !guide.fee.trim()) problems.push(`${key}: empty fee`);
    const date = dateProblem(guide.lastReviewed);
    if (date) problems.push(`${key}: ${date}`);
    expect(problems).toEqual([]);
  });
});
