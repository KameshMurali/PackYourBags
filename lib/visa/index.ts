// Visa intelligence engine — public API (`@/lib/visa`).
//
// IMPORTANT: the datasets are *indicative* and for planning only. Visa rules change often and
// depend on nationality, residence, purpose and the specific border. Every record links to an
// official or authoritative source and carries the date it was last reviewed; the UI and the
// MCP tools always show a "verify before you book" disclaimer.

export * from "./types";
export {
  CATEGORY_META,
  CATEGORY_ORDER,
  CREDENTIAL_CODES,
  CREDENTIAL_DESTINATION,
  CREDENTIAL_LABELS,
  EASY_ACCESS,
  HELDVISAS,
  NATIONALITIES,
  RESIDENCIES,
} from "./meta";
export { GUIDE_BY_DESTINATION, VISA_GUIDES } from "./guides";
export { COUNTRIES } from "./countries";
export { COUNTRY_SOURCES } from "./country-sources";
export { DATASETS } from "./data";
export {
  COUNTRY_BY_CODE,
  flagOf,
  getCountry,
  IATA_TRAVEL_CENTRE,
  officialSourceFor,
  ruleCodesFor,
  SCHENGEN_CODE,
  SCHENGEN_MEMBER_CODES,
} from "./lookup";
export {
  editDistance,
  findCountry,
  fuzzyCountries,
  matchCountries,
  matchesQuery,
  nearestCountries,
  normalize,
  searchCountries,
  typoAllowance,
} from "./search";
export type { CountryMatch, CountryMatchKind } from "./search";
export {
  checkVisa,
  findPassport,
  isSupported,
  resolveDestinations,
  resolveRules,
  searchDestinations,
  summarise,
} from "./engine";
export type {
  CountryNotice,
  DestinationSearch,
  ResolveOptions,
  VisaCheck,
  VisaCheckInput,
} from "./engine";
export {
  credentialLabel,
  describeUnlocks,
  formatEasyAccess,
  formatVisaCheck,
  summaryLine,
  supportedPassportsLabel,
  VISA_DISCLAIMER,
} from "./format";
