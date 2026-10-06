// Official immigration / visa information source for each country in the country index.
//
// Shown on "Rule not yet verified for your passport" cards, so a traveller always has an
// authoritative next step. Only government sources (immigration authority, foreign ministry,
// official e-visa portal) belong here. Countries without a verified source fall back to the
// IATA Travel Centre.

import type { OfficialSource } from "./types";

export type CountrySource = OfficialSource & {
  /** ISO date (YYYY-MM-DD) the URL was last checked. */
  lastReviewed: string;
};

export const COUNTRY_SOURCES: Record<string, CountrySource> = {};
