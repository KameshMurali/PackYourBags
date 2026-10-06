// Country lookups shared by the engine, search, and UI.

import { COUNTRIES } from "./countries";
import { COUNTRY_SOURCES } from "./country-sources";
import type { Country, OfficialSource } from "./types";

export const SCHENGEN_CODE = "SCHENGEN";

/** Public view of IATA Timatic, the database airlines check at boarding. */
export const IATA_TRAVEL_CENTRE: OfficialSource = {
  label: "IATA Travel Centre",
  url: "https://www.iatatravelcentre.com/",
};

/** Flag emoji for an ISO 3166-1 alpha-2 code (regional indicator pair); 🇪🇺 for Schengen. */
export function flagOf(code: string): string {
  if (code === SCHENGEN_CODE) return "🇪🇺";
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  return String.fromCodePoint(
    ...code.split("").map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

export const COUNTRY_BY_CODE: ReadonlyMap<string, Country> = new Map(
  COUNTRIES.map((c) => [c.code, c]),
);

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRY_BY_CODE.get(code.toUpperCase());
}

/** ISO codes of the full Schengen members, from the country index. */
export const SCHENGEN_MEMBER_CODES: readonly string[] = COUNTRIES.filter((c) => c.schengen).map(
  (c) => c.code,
);

/** The rule code a country resolves to: its own code, SCHENGEN, or the rule it borrows. */
export function ruleCodesFor(country: Country): string[] {
  const codes = [country.code];
  if (country.schengen) codes.push(SCHENGEN_CODE);
  if (country.rulesFrom) codes.push(country.rulesFrom);
  return codes;
}

/** The official visa source for a country, or the IATA Travel Centre when none is verified. */
export function officialSourceFor(code: string): { source: OfficialSource; isFallback: boolean } {
  const found = COUNTRY_SOURCES[code.toUpperCase()];
  if (found) return { source: { label: found.label, url: found.url }, isFallback: false };
  return { source: IATA_TRAVEL_CENTRE, isFallback: true };
}
