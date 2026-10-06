// Text normalisation and destination / country search.
//
// Matching rules, in order of preference:
//  1. exact term ("brasil" → Brazil, "uk" → United Kingdom, ISO code "de" → Germany);
//  2. the query contains a term as whole words ("flights to germany");
//  3. the query starts a word of a term ("bras" → Brasil, "york" → New York). Never a
//     fragment inside a word, so "oman" doesn't hit "Romania" and "jerusalem" doesn't hit "USA";
//  4. only when nothing above matches: typo tolerance (edit distance ≤ 1 for 4–6 characters,
//     ≤ 2 for 7 or more), so "germny" → Germany.

import { COUNTRIES } from "./countries";
import { COUNTRY_BY_CODE, SCHENGEN_CODE } from "./lookup";
import type { Country } from "./types";

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

// Letters that Unicode decomposition doesn't reduce to ASCII.
const SPECIAL_LETTERS: Record<string, string> = {
  ß: "ss",
  æ: "ae",
  œ: "oe",
  ø: "o",
  ł: "l",
  đ: "d",
  ð: "d",
  þ: "th",
  ı: "i",
};
const SPECIAL_RE = /[ßæœøłđðþı]/g;
// Built from strings so the TypeScript (ES5 target) regex checker accepts \p{…} escapes.
const MARKS_RE = new RegExp("\\p{M}+", "gu");
const NON_WORD_RE = new RegExp("[^\\p{L}\\p{N}]+", "gu");
const APOSTROPHES_RE = /['’ʼ`´]/g;

/**
 * Lowercase, strip accents and apostrophes, and turn other punctuation into single spaces.
 * "Türkiye" → "turkiye", "São Paulo" → "sao paulo", "Côte d'Ivoire" → "cote divoire".
 * Letters from any script are kept, so native names like "日本" stay searchable.
 */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(MARKS_RE, "")
    .toLowerCase()
    .replace(SPECIAL_RE, (ch) => SPECIAL_LETTERS[ch] ?? ch)
    .replace(APOSTROPHES_RE, "")
    .replace(NON_WORD_RE, " ")
    .trim();
}

/** True when `query` starts a word of `term` (both normalised). */
function startsWord(term: string, query: string): boolean {
  return ` ${term}`.includes(` ${query}`);
}

/** True when `query` contains `term` as whole words (both normalised). */
function containsWhole(query: string, term: string): boolean {
  return term.length >= 2 && ` ${query} `.includes(` ${term} `);
}

// ---------------------------------------------------------------------------
// Typo tolerance
// ---------------------------------------------------------------------------

/**
 * Optimal string alignment distance: insertions, deletions, substitutions and adjacent
 * transpositions each cost 1 ("dubia" → "dubai" is 1). Stops early once the distance
 * must exceed `max`, returning `max + 1`.
 */
export function editDistance(a: string, b: string, max = Number.POSITIVE_INFINITY): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let before: number[] = new Array(b.length + 1).fill(0);
  let previous: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  let current: number[] = new Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, before[j - 2] + 1);
      }
      current[j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
    const recycled = before;
    before = previous;
    previous = current;
    current = recycled;
  }
  return previous[b.length];
}

/** Allowed typos for a query of this length: none below 4 characters. */
export function typoAllowance(length: number): number {
  if (length < 4) return 0;
  if (length <= 6) return 1;
  return 2;
}

// ---------------------------------------------------------------------------
// Country index terms
// ---------------------------------------------------------------------------

type TermKind = "name" | "alias" | "city";
type Term = { text: string; kind: TermKind; country: Country };

let termCache: Term[] | null = null;

function countryTerms(): Term[] {
  if (termCache) return termCache;
  const terms: Term[] = [];
  for (const country of COUNTRIES) {
    const add = (value: string, kind: TermKind) => {
      const text = normalize(value);
      if (text) terms.push({ text, kind, country });
    };
    add(country.name, "name");
    country.aliases?.forEach((a) => add(a, "alias"));
    country.cities?.forEach((c) => add(c, "city"));
  }
  termCache = terms;
  return terms;
}

export type CountryMatchKind = "code" | "exact" | "contains" | "prefix" | "fuzzy";

export type CountryMatch = {
  country: Country;
  kind: CountryMatchKind;
  /** The normalised term that matched (a name, alias, or city). */
  term: string;
  termKind: TermKind | "code";
  score: number;
  distance: number;
};

const KIND_BONUS: Record<TermKind, number> = { name: 0, alias: -4, city: -8 };

// Countries whose best match scores more than this below the top match are dropped, so
// "korea" returns South Korea without North Korea, while "niger" still offers Nigeria.
const SCORE_WINDOW = 25;

function rank(matches: Map<string, CountryMatch>): CountryMatch[] {
  const sorted = Array.from(matches.values()).sort(
    (a, b) =>
      b.score - a.score ||
      a.distance - b.distance ||
      a.country.name.length - b.country.name.length ||
      a.country.name.localeCompare(b.country.name),
  );
  if (sorted.length === 0) return sorted;
  const floor = sorted[0].score - SCORE_WINDOW;
  return sorted.filter((m) => m.score >= floor);
}

function keepBest(matches: Map<string, CountryMatch>, match: CountryMatch) {
  const existing = matches.get(match.country.code);
  if (!existing || match.score > existing.score) matches.set(match.country.code, match);
}

/**
 * Countries matching the query exactly, by whole words, or by word prefix (no typo
 * tolerance). Prefix matches need at least 3 characters, so "us" means the US, not
 * "Ushuaia". Best match first.
 */
export function matchCountries(query: string): CountryMatch[] {
  const q = normalize(query);
  const matches = new Map<string, CountryMatch>();
  if (!q) return [];

  if (/^[a-z]{2}$/.test(q)) {
    const byCode = COUNTRY_BY_CODE.get(q.toUpperCase());
    if (byCode) {
      keepBest(matches, { country: byCode, kind: "code", term: q, termKind: "code", score: 90, distance: 0 });
    }
  }

  for (const t of countryTerms()) {
    const bonus = KIND_BONUS[t.kind];
    if (t.text === q) {
      keepBest(matches, { country: t.country, kind: "exact", term: t.text, termKind: t.kind, score: 100 + bonus, distance: 0 });
    } else if (containsWhole(q, t.text)) {
      keepBest(matches, { country: t.country, kind: "contains", term: t.text, termKind: t.kind, score: 88 + bonus, distance: 0 });
    } else if (q.length >= 3 && startsWord(t.text, q)) {
      // Prefix of the whole term ranks above a prefix of a later word.
      const score = (t.text.startsWith(q) ? 75 : 65) + bonus;
      keepBest(matches, { country: t.country, kind: "prefix", term: t.text, termKind: t.kind, score, distance: 0 });
    }
  }

  return rank(matches);
}

// Generic words that make poor typo targets on their own ("southt" shouldn't match every
// "South …" country through the word "south").
const GENERIC_WORDS = new Set([
  "republic",
  "islands",
  "island",
  "saint",
  "united",
  "north",
  "south",
  "east",
  "west",
  "central",
  "democratic",
  "states",
  "kingdom",
  "guinea",
]);

/**
 * Typo-tolerant country matches, for when matchCountries finds nothing. The query (and each
 * of its words of 4+ characters) is compared with names, aliases and cities, and with the
 * individual words of multi-word names ("zeland" → New Zealand).
 */
export function fuzzyCountries(query: string): CountryMatch[] {
  const q = normalize(query);
  const matches = new Map<string, CountryMatch>();
  if (!q) return [];

  const words = q.split(" ").filter((w) => w.length >= 4);
  const probes = Array.from(new Set([q, ...words]));

  for (const t of countryTerms()) {
    const termWords = t.text.split(" ");
    const targets = termWords.length > 1
      ? [t.text, ...termWords.filter((w) => w.length >= 4 && !GENERIC_WORDS.has(w))]
      : [t.text];

    for (const probe of probes) {
      const allowance = typoAllowance(probe.length);
      if (allowance === 0) continue;
      for (const target of targets) {
        const distance = editDistance(probe, target, allowance);
        if (distance > allowance) continue;
        const wholeTerm = target === t.text && probe === q;
        const score = (wholeTerm ? 50 : 40) - distance * 10 + KIND_BONUS[t.kind];
        keepBest(matches, { country: t.country, kind: "fuzzy", term: t.text, termKind: t.kind, score, distance });
      }
    }
  }

  return rank(matches);
}

/** matchCountries, falling back to typo tolerance when nothing matches. */
export function searchCountries(query: string): CountryMatch[] {
  const direct = matchCountries(query);
  return direct.length > 0 ? direct : fuzzyCountries(query);
}

/** The single best country for a query, if any. */
export function findCountry(query: string): Country | undefined {
  return searchCountries(query)[0]?.country;
}

/**
 * Closest country names for "did you mean" when nothing matched, allowing more typos than
 * search does (about 40% of the query length).
 */
export function nearestCountries(query: string, limit = 3): Country[] {
  const q = normalize(query);
  if (q.length < 3) return [];
  const max = Math.max(2, Math.ceil(q.length * 0.4));
  const best = new Map<string, { country: Country; distance: number }>();
  for (const t of countryTerms()) {
    if (t.kind === "city") continue;
    const distance = editDistance(q, t.text, max);
    if (distance > max) continue;
    const existing = best.get(t.country.code);
    if (!existing || distance < existing.distance) best.set(t.country.code, { country: t.country, distance });
  }
  return Array.from(best.values())
    .sort((a, b) => a.distance - b.distance || a.country.name.localeCompare(b.country.name))
    .slice(0, limit)
    .map((b) => b.country);
}

// ---------------------------------------------------------------------------
// Destination (rule) matching
// ---------------------------------------------------------------------------

type Searchable = { code: string; name: string; region?: string; aliases?: string[] };

const ruleTermCache = new WeakMap<object, string[]>();

/** Countries whose searches resolve to the rule with this code. */
function countriesForRule(code: string): Country[] {
  if (code === SCHENGEN_CODE) {
    return COUNTRIES.filter((c) => c.schengen || c.rulesFrom === SCHENGEN_CODE);
  }
  const own = COUNTRY_BY_CODE.get(code);
  const borrowers = COUNTRIES.filter((c) => c.rulesFrom === code);
  return own ? [own, ...borrowers] : borrowers;
}

function termsForRule(d: Searchable): string[] {
  const cached = ruleTermCache.get(d);
  if (cached) return cached;
  const values = [d.name, ...(d.aliases ?? [])];
  for (const country of countriesForRule(d.code)) {
    values.push(country.name, ...(country.aliases ?? []), ...(country.cities ?? []));
  }
  const terms = Array.from(new Set(values.map(normalize).filter(Boolean)));
  ruleTermCache.set(d, terms);
  return terms;
}

/**
 * Whether a destination rule matches a free-text query, across its name, region and aliases,
 * plus the country index's names, native names and cities for that destination (and every
 * member country for the Schengen rule). An empty query matches everything.
 */
export function matchesQuery(d: Searchable, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  if (d.region && startsWord(normalize(d.region), q)) return true;
  return termsForRule(d).some((term) => startsWord(term, q) || containsWhole(q, term));
}
