// Labels and pick-lists for categories, passports, residences and held visas.

import { DATASETS } from "./data";
import type { CredentialCode, Nationality, VisaCategory } from "./types";

export const CATEGORY_META: Record<
  VisaCategory,
  { label: string; short: string; tone: string; order: number }
> = {
  "visa-free": { label: "Visa-free", short: "No visa", tone: "green", order: 0 },
  "visa-on-arrival": { label: "Visa on arrival", short: "On arrival", tone: "teal", order: 1 },
  eta: { label: "Travel authorisation (ETA)", short: "ETA", tone: "sky", order: 2 },
  evisa: { label: "eVisa", short: "eVisa", tone: "amber", order: 3 },
  "visa-required": { label: "Visa required", short: "Visa needed", tone: "clay", order: 4 },
};

/** Categories from most to least permissive. */
export const CATEGORY_ORDER: VisaCategory[] = [
  "visa-free",
  "visa-on-arrival",
  "eta",
  "evisa",
  "visa-required",
];

/** Categories that need no visa applied for before travel. */
export const EASY_ACCESS: VisaCategory[] = ["visa-free", "visa-on-arrival", "eta"];

export const CREDENTIAL_CODES: CredentialCode[] = ["AE", "US", "UK", "SCHENGEN", "CA", "AU", "JP"];

/** Short label for each credential, e.g. "Unlocked by your US visa". */
export const CREDENTIAL_LABELS: Record<CredentialCode, string> = {
  AE: "UAE",
  US: "US",
  UK: "UK",
  SCHENGEN: "Schengen",
  CA: "Canada",
  AU: "Australia",
  JP: "Japan",
};

/** The destination rule code a residence corresponds to (you live there). */
export const CREDENTIAL_DESTINATION: Record<CredentialCode, string> = {
  AE: "AE",
  US: "US",
  UK: "GB",
  SCHENGEN: "SCHENGEN",
  CA: "CA",
  AU: "AU",
  JP: "JP",
};

export const RESIDENCIES: Array<{ code: CredentialCode | "NONE"; name: string; flag: string }> = [
  { code: "NONE", name: "No additional residence", flag: "🌐" },
  { code: "AE", name: "UAE resident (Emirates ID)", flag: "🇦🇪" },
  { code: "US", name: "US resident / Green Card", flag: "🇺🇸" },
  { code: "UK", name: "UK resident", flag: "🇬🇧" },
  { code: "SCHENGEN", name: "EU / Schengen resident", flag: "🇪🇺" },
  { code: "CA", name: "Canada resident", flag: "🇨🇦" },
  { code: "AU", name: "Australia resident", flag: "🇦🇺" },
  { code: "JP", name: "Japan resident", flag: "🇯🇵" },
];

export const HELDVISAS: Array<{ code: CredentialCode; name: string; flag: string }> = [
  { code: "US", name: "Valid US visa", flag: "🇺🇸" },
  { code: "SCHENGEN", name: "Valid Schengen visa", flag: "🇪🇺" },
  { code: "UK", name: "Valid UK visa", flag: "🇬🇧" },
  { code: "CA", name: "Valid Canada visa", flag: "🇨🇦" },
  { code: "AU", name: "Valid Australia visa", flag: "🇦🇺" },
  { code: "JP", name: "Valid Japan visa", flag: "🇯🇵" },
];

const PASSPORTS: Array<Omit<Nationality, "supported">> = [
  { code: "IN", name: "India", flag: "🇮🇳", demonym: "Indian" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", demonym: "Pakistani" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", demonym: "Philippine", aliases: ["Filipino", "Filipina"] },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", demonym: "Nigerian" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", demonym: "Egyptian" },
];

export const NATIONALITIES: Nationality[] = PASSPORTS.map((p) => ({
  ...p,
  supported: (DATASETS[p.code]?.length ?? 0) > 0,
}));
