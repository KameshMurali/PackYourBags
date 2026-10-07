// Shared types for the visa intelligence engine.
//
// This module (and everything under lib/visa) is framework-free on purpose: no package
// imports, so the engine runs the same in the browser, in route handlers, and in Vitest.

export type VisaCategory =
  | "visa-free"
  | "visa-on-arrival"
  | "eta"
  | "evisa"
  | "visa-required";

// Credentials a traveller can hold that unlock easier access to third countries.
// Each code can be held as a visa (a valid visa issued by that country/area) and/or as a
// residence (residence permit, green card or permanent residence there).
export type CredentialCode = "AE" | "US" | "UK" | "SCHENGEN" | "CA" | "AU" | "JP";

export type Nationality = {
  code: string; // ISO 3166-1 alpha-2 code of the passport
  name: string; // "India"
  flag: string;
  demonym: string; // "Indian"
  aliases?: string[]; // other demonyms, e.g. "Filipino"
  supported: boolean; // true when at least one verified rule exists for this passport
};

// A rule that applies instead of the base rule when the traveller holds a qualifying
// visa or residence. List exactly what the official source accepts: a rule that accepts a
// US visa *or* US residence lists "US" in both arrays; a rule that accepts only UK
// residence lists "UK" in `residence` alone.
export type Override = {
  /** A valid visa issued by ANY of these unlocks the rule. */
  visas?: CredentialCode[];
  /** Residence (permit, green card, PR) in ANY of these unlocks the rule. */
  residence?: CredentialCode[];
  category: VisaCategory;
  /** Maximum stay in days under this rule, only when the source states it. */
  days?: number;
  /** Conditions in plain words (validity, "must have been used", entry points…). */
  note?: string;
};

export type DestinationRule = {
  /** ISO 3166-1 alpha-2 code of the destination, or "SCHENGEN" for the Schengen Area. */
  code: string;
  /** Must equal the country index name for `code`. */
  name: string;
  /** Must equal the flag emoji derived from `code` (🇪🇺 for SCHENGEN). */
  flag: string;
  /** Must equal the country index region for `code`. */
  region: string;
  /** The rule for every holder of this passport (most permissive route open to all). */
  base: VisaCategory;
  /** Maximum stay in days under the base rule, only when the source states it. */
  days?: number;
  /** Key conditions in plain words. */
  note?: string;
  /** Visa / authorisation fee, only when the source states it, e.g. "USD 35". */
  fee?: string;
  /** Typical processing time, only when the source states it, e.g. "3 working days". */
  processingTime?: string;
  /** https URL of the official (or authoritative) page that states this rule. */
  source: string;
  /** Who publishes `source`, e.g. "Immigration Department of Malaysia". */
  sourceLabel?: string;
  /** ISO date (YYYY-MM-DD) the rule was last checked against `source`. */
  lastReviewed: string;
  overrides?: Override[];
  /** Key into VISA_GUIDES. Usually derived from the destination; set to override. */
  guide?: string;
  /** Extra searchable terms. Country names, native names and cities come from the country index. */
  aliases?: string[];
};

export type CredentialUnlock = { code: CredentialCode; via: "visa" | "residence" };

export type ResolvedDestination = DestinationRule & {
  effective: VisaCategory;
  effectiveDays?: number;
  effectiveNote?: string;
  /** Credentials that unlocked the effective rule (kept for backwards compatibility). */
  unlockedBy?: CredentialCode[];
  /** Same as unlockedBy, with whether each counted as a visa or a residence. */
  unlocks?: CredentialUnlock[];
  /** The traveller lives here: they enter on their residence permit. */
  residentHere?: boolean;
};

export type VisaGuide = {
  title: string;
  appliesTo: string;
  processingTime: string;
  /** Government fee, only when the official source states it. */
  fee?: string;
  overview: string;
  documents: string[];
  steps: string[];
  tips: string[];
  officialLinks: Array<{ label: string; url: string }>;
  /** ISO date (YYYY-MM-DD) the guide was last checked against its official links. */
  lastReviewed: string;
};

export const REGIONS = [
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "Central Asia",
  "Caucasus",
  "Middle East",
  "Europe",
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Southern Africa",
  "North America",
  "Central America",
  "Caribbean",
  "South America",
  "Oceania",
] as const;

export type Region = (typeof REGIONS)[number];

export type Country = {
  /** ISO 3166-1 alpha-2 code ("XK" for Kosovo). */
  code: string;
  /** Common English short name, e.g. "Germany", "Türkiye", "Côte d'Ivoire". */
  name: string;
  region: Region;
  /** Native, alternate, former and abbreviated names: "Deutschland", "Holland", "UAE". */
  aliases?: string[];
  /** Capital and major destinations: cities, islands, regions ("Bali", "Phuket"). */
  cities?: string[];
  /** Full member of the Schengen Area: the passport's SCHENGEN rule applies. */
  schengen?: boolean;
  /** Code of the rule that applies here (e.g. "US" for Puerto Rico, "SCHENGEN" for Monaco). */
  rulesFrom?: string;
  /** ISO code of the sovereign state, for territories. */
  territoryOf?: string;
};

export type OfficialSource = { label: string; url: string };
