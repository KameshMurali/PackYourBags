// Indian passport (ordinary). Indicative only — every record links to its source.
//
// Migrated unchanged from lib/visa.ts (authored 2026-10-04; Brazil 2026-10-06), pending the
// P0.3 re-verification audit. Overrides keep the old "visa or residence" meaning by listing
// each credential under both `visas` and `residence` until the audit narrows them.

import type { DestinationRule } from "../types";

const SCHENGEN_MEMBERS = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Czechia",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Italy",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
];

const SCHENGEN_CITIES = [
  "Paris",
  "Berlin",
  "Munich",
  "Rome",
  "Milan",
  "Venice",
  "Madrid",
  "Barcelona",
  "Amsterdam",
  "Lisbon",
  "Vienna",
  "Prague",
  "Athens",
  "Zurich",
  "Geneva",
  "Brussels",
  "Copenhagen",
  "Stockholm",
  "Oslo",
  "Reykjavik",
  "Budapest",
  "Nice",
];

const R = "2026-10-04";

export const INDIA_DESTINATIONS: DestinationRule[] = [
  // South Asia / neighbours
  { code: "NP", name: "Nepal", flag: "🇳🇵", region: "South Asia", base: "visa-free", note: "No visa or permit — open border.", source: "https://www.immigration.gov.np/", lastReviewed: R },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", region: "South Asia", base: "visa-free", note: "Entry permit at border; Sustainable Development Fee applies.", source: "https://www.immi.gov.bt/", lastReviewed: R },
  { code: "MV", name: "Maldives", flag: "🇲🇻", region: "South Asia", base: "visa-on-arrival", days: 30, note: "Free 30-day visa issued on arrival.", source: "https://immigration.gov.mv/", lastReviewed: R },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", region: "South Asia", base: "visa-free", days: 30, note: "ETA waived for Indian nationals (confirm current status).", source: "https://eta.gov.lk/", lastReviewed: R },

  // Southeast Asia
  { code: "TH", name: "Thailand", flag: "🇹🇭", region: "Southeast Asia", base: "visa-free", days: 60, note: "Visa exemption for tourism (confirm current duration).", source: "https://www.thaievisa.go.th/", lastReviewed: R },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", region: "Southeast Asia", base: "visa-free", days: 30, note: "Visa exemption extended through 2026 (confirm).", source: "https://malaysiavisa.imi.gov.my/", lastReviewed: R },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", region: "Southeast Asia", base: "visa-on-arrival", days: 30, note: "VOA / e-VOA for Bali and main airports.", source: "https://molina.imigrasi.go.id/", lastReviewed: R },
  { code: "SG", name: "Singapore", flag: "🇸🇬", region: "Southeast Asia", base: "evisa", note: "Electronic visa required; apply via authorised agent.", source: "https://www.ica.gov.sg/", lastReviewed: R },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", region: "Southeast Asia", base: "evisa", days: 90, note: "e-Visa online before travel.", source: "https://evisa.gov.vn/", lastReviewed: R },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", region: "Southeast Asia", base: "evisa", days: 30, note: "e-Visa or visa on arrival.", source: "https://www.evisa.gov.kh/", lastReviewed: R },
  { code: "PH", name: "Philippines", flag: "🇵🇭", region: "Southeast Asia", base: "visa-required", note: "Visa required; may be waived with valid US/Schengen/UK/etc. visa.", source: "https://evisa.gov.ph/", lastReviewed: R, overrides: [{ visas: ["US", "SCHENGEN", "UK", "CA", "AU"], residence: ["US", "SCHENGEN", "UK", "CA", "AU"], category: "visa-free", days: 14, note: "Visa-free up to 14 days with a valid visa from these countries (confirm conditions)." }] },

  // East Asia
  { code: "JP", name: "Japan", flag: "🇯🇵", region: "East Asia", base: "evisa", note: "eVisa for eligible travellers, else embassy visa.", source: "https://www.evisa.mofa.go.jp/", lastReviewed: R },
  { code: "KR", name: "South Korea", flag: "🇰🇷", region: "East Asia", base: "visa-required", note: "Visa or K-ETA required.", source: "https://www.k-eta.go.kr/", lastReviewed: R },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", region: "East Asia", base: "visa-free", days: 14, note: "Pre-arrival registration required.", source: "https://www.immd.gov.hk/", lastReviewed: R },

  // Middle East
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East", base: "evisa", days: 30, note: "eVisa; 14-day VOA if you hold a qualifying US/EU/… visa or residence.", source: "https://www.icp.gov.ae/", lastReviewed: R, aliases: ["UAE", "Dubai", "Abu Dhabi", "Emirates"], overrides: [{ visas: ["US", "SCHENGEN", "CA", "AU"], residence: ["US", "SCHENGEN", "CA", "AU"], category: "visa-on-arrival", days: 14, note: "14-day visa on arrival with qualifying visa/residence (UK no longer qualifies as of 2026 — confirm)." }] },
  { code: "QA", name: "Qatar", flag: "🇶🇦", region: "Middle East", base: "visa-on-arrival", days: 30, note: "VOA / eligible for free waiver for some residents.", source: "https://www.visitqatar.com/", lastReviewed: R },
  { code: "OM", name: "Oman", flag: "🇴🇲", region: "Middle East", base: "evisa", note: "e-Visa; GCC residents may be eligible for easier entry.", source: "https://evisa.rop.gov.om/", lastReviewed: R },
  { code: "JO", name: "Jordan", flag: "🇯🇴", region: "Middle East", base: "visa-on-arrival", note: "VOA; free with Jordan Pass.", source: "https://www.visitjordan.com/", lastReviewed: R },
  { code: "TR", name: "Türkiye", flag: "🇹🇷", region: "Middle East", base: "visa-required", note: "e-Visa available if you hold a valid US/UK/Schengen visa.", source: "https://www.evisa.gov.tr/", lastReviewed: R, aliases: ["Turkey", "Turkiye", "Istanbul"], overrides: [{ visas: ["US", "UK", "SCHENGEN"], residence: ["US", "UK", "SCHENGEN"], category: "evisa", days: 30, note: "e-Visa eligible with a valid supporting visa/residence (single entry, conditions apply)." }] },

  // Caucasus / Central Asia
  { code: "GE", name: "Georgia", flag: "🇬🇪", region: "Caucasus", base: "visa-required", note: "Visa-free for holders of valid visa/residence of US, EU/Schengen, GCC, etc.", source: "https://www.geoconsul.gov.ge/", lastReviewed: R, overrides: [{ visas: ["US", "SCHENGEN", "UK", "CA", "AE"], residence: ["US", "SCHENGEN", "UK", "CA", "AE"], category: "visa-free", days: 90, note: "Visa-free for up to 1 year for holders of qualifying visas/residence (confirm)." }] },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", region: "Caucasus", base: "evisa", days: 30, note: "ASAN e-Visa online.", source: "https://evisa.gov.az/", lastReviewed: R },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", region: "Central Asia", base: "visa-required", note: "Visa required; some exemptions apply.", source: "https://www.vmp.gov.kz/", lastReviewed: R },

  // Europe (Schengen + others)
  { code: "SCHENGEN", name: "Schengen Area (29 countries)", flag: "🇪🇺", region: "Europe", base: "visa-required", note: "Short-stay (90/180) Schengen visa required — covers Germany, France, Italy, Spain, Netherlands and more.", source: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en", sourceLabel: "European Commission — Schengen visa policy", lastReviewed: R, guide: "schengen", aliases: [...SCHENGEN_MEMBERS, ...SCHENGEN_CITIES, "Europe", "EU", "Schengen"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", region: "Europe", base: "visa-required", note: "Standard Visitor visa required.", source: "https://www.gov.uk/standard-visitor", lastReviewed: R, guide: "uk", aliases: ["UK", "Britain", "England", "Great Britain", "London", "Scotland"] },
  { code: "RS", name: "Serbia", flag: "🇷🇸", region: "Europe", base: "visa-required", note: "Visa-free with a valid multiple-entry Schengen/US/UK visa.", source: "https://www.mfa.gov.rs/", lastReviewed: R, overrides: [{ visas: ["SCHENGEN", "US", "UK"], residence: ["SCHENGEN", "US", "UK"], category: "visa-free", days: 90, note: "Visa-free with a valid supporting visa (confirm current rule)." }] },
  { code: "AL", name: "Albania", flag: "🇦🇱", region: "Europe", base: "visa-required", note: "Visa-free with a valid multiple-entry Schengen/US/UK visa.", source: "https://punetejashtme.gov.al/en/", lastReviewed: R, overrides: [{ visas: ["SCHENGEN", "US", "UK"], residence: ["SCHENGEN", "US", "UK"], category: "visa-free", days: 90, note: "Visa-free with a valid supporting visa (seasonal rules may also apply)." }] },

  // Americas
  { code: "US", name: "United States", flag: "🇺🇸", region: "North America", base: "visa-required", note: "B1/B2 visitor visa required.", source: "https://travel.state.gov/", lastReviewed: R, guide: "us", aliases: ["USA", "US", "America", "United States", "New York", "Los Angeles"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", region: "North America", base: "visa-required", note: "Visa-free with a valid US visa.", source: "https://www.gob.mx/inm", lastReviewed: R, overrides: [{ visas: ["US", "UK", "SCHENGEN", "CA"], residence: ["US", "UK", "SCHENGEN", "CA"], category: "visa-free", days: 180, note: "Visa-free with a valid visa of these countries (confirm)." }] },
  { code: "CA", name: "Canada", flag: "🇨🇦", region: "North America", base: "visa-required", note: "Visitor visa (or eTA if previously issued US/Canada visa — confirm).", source: "https://www.canada.ca/en/immigration-refugees-citizenship.html", lastReviewed: R },
  { code: "BR", name: "Brazil", flag: "🇧🇷", region: "South America", base: "visa-required", note: "Visitor Visa (VIVIS) required — apply on Brazil's e-Consular portal through the Brazilian mission where you live (UAE residents: Brazil's embassy or consulate in the UAE). Brazil's tourist e-Visa is only for US, Canadian and Australian passports; Indian citizens can use a business e-Visa for business trips.", source: "https://www.gov.br/mre/pt-br/embaixada-nova-delhi/embassy-of-brazil-in-new-delhi/visas", lastReviewed: "2026-10-06", aliases: ["Brasil", "Rio de Janeiro", "São Paulo"] },
  { code: "PA", name: "Panama", flag: "🇵🇦", region: "Central America", base: "visa-required", note: "Visa-free with a valid US/UK/Schengen/Canada visa.", source: "https://www.migracion.gob.pa/", lastReviewed: R, overrides: [{ visas: ["US", "UK", "SCHENGEN", "CA"], residence: ["US", "UK", "SCHENGEN", "CA"], category: "visa-free", days: 90, note: "Visa-free with a used, valid supporting visa (confirm conditions)." }] },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", region: "Caribbean", base: "visa-free", days: 30, note: "E-ticket required.", source: "https://eticket.migracion.gob.do/", lastReviewed: R },
  { code: "BB", name: "Barbados", flag: "🇧🇧", region: "Caribbean", base: "visa-free", days: 90, source: "https://www.gov.bb/", lastReviewed: R },

  // Africa
  { code: "MU", name: "Mauritius", flag: "🇲🇺", region: "East Africa", base: "visa-free", days: 90, source: "https://passport.govmu.org/", lastReviewed: R },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", region: "East Africa", base: "eta", days: 30, note: "Travel authorisation before arrival.", source: "https://seychelles.govtas.com/", lastReviewed: R },
  { code: "KE", name: "Kenya", flag: "🇰🇪", region: "East Africa", base: "eta", note: "Electronic travel authorisation required.", source: "https://www.etakenya.go.ke/", lastReviewed: R },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", region: "Southern Africa", base: "visa-required", note: "Visitor visa required (eVisa for tourism).", source: "https://www.dha.gov.za/", lastReviewed: R },
  { code: "EG", name: "Egypt", flag: "🇪🇬", region: "North Africa", base: "evisa", days: 30, note: "e-Visa or VOA.", source: "https://visa2egypt.gov.eg/", lastReviewed: R },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", region: "East Africa", base: "evisa", note: "e-Visa; VOA at main airports.", source: "https://eservices.immigration.go.tz/", lastReviewed: R },

  // Oceania
  { code: "FJ", name: "Fiji", flag: "🇫🇯", region: "Oceania", base: "visa-free", days: 120, source: "https://www.immigration.gov.fj/", lastReviewed: R },
  { code: "AU", name: "Australia", flag: "🇦🇺", region: "Oceania", base: "visa-required", note: "Visitor visa (subclass 600) required.", source: "https://immi.homeaffairs.gov.au/", lastReviewed: R },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", region: "Oceania", base: "visa-required", note: "Visitor visa required; NZeTA for transit.", source: "https://www.immigration.govt.nz/", lastReviewed: R },
];
