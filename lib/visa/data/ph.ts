// Philippine passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page (immigration
// authority, foreign ministry, embassy or consulate, or official e-visa portal). A destination
// that could not be confirmed from an official page is deliberately absent: the app then shows
// an honest "not yet verified" card with the country's official link instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.
// Overrides list exactly the credentials the source accepts: a held visa under `visas`, a
// residence permit / green card under `residence`.

import type { DestinationRule } from "../types";

const R = "2026-10-10";

export const PHILIPPINES_DESTINATIONS: DestinationRule[] = [
  // South Asia
  {
    code: "MV",
    name: "Maldives",
    flag: "🇲🇻",
    region: "South Asia",
    base: "visa-on-arrival",
    note: "Tourist visa is granted on arrival; no pre-approval needed. You must show a passport with at least 1 month's validity, a complete itinerary with confirmed return tickets, a prepaid booking at a registered facility and enough funds (or an approved sponsorship), and submit the free online Traveller Declaration within 96 hours before arrival.",
    source: "https://www.immigration.gov.mv/visa/tourist-visa",
    sourceLabel: "Maldives Immigration",
    lastReviewed: R,
  },

  // Southeast Asia
  {
    code: "BN",
    name: "Brunei",
    flag: "🇧🇳",
    region: "Southeast Asia",
    base: "visa-free",
    days: 14,
    note: "Philippine passport holders can stay up to 14 days without a visa, per the Brunei Ministry of Foreign Affairs' travel page for the Philippines. A longer stay (up to 3 months) needs a visa from the Brunei Embassy in Manila, which asks for a passport valid more than 6 months past entry and a confirmed return ticket.",
    source: "https://www.mfa.gov.bn/philippines_manila/SitePages/Travelling%20to%20Brunei%20Darussalam.aspx",
    sourceLabel: "Ministry of Foreign Affairs, Brunei Darussalam (Embassy in Manila)",
    lastReviewed: R,
  },
  {
    code: "KH",
    name: "Cambodia",
    flag: "🇰🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "Ordinary Philippine passports are visa-exempt for up to 30 days, per the exemption table published by Cambodia's Ministry of Foreign Affairs and International Cooperation (as of 25 September 2026). The ministry updates this table, so check it again just before you fly.",
    source: "https://recberlin.mfaic.gov.kh/en-us/visa-exemption",
    sourceLabel: "Ministry of Foreign Affairs and International Cooperation, Cambodia (Royal Embassy in Berlin) — visa exemption table",
    lastReviewed: R,
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Southeast Asia",
    base: "visa-free",
    note: "ASEAN nationals except Myanmar don't need a visa for a stay of less than one month, per the Immigration Department of Malaysia; a visa is required for a longer stay. You must also submit the online Malaysia Digital Arrival Card (MDAC) before arrival (within 3 days).",
    source: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-requirement-by-country/",
    sourceLabel: "Immigration Department of Malaysia",
    lastReviewed: R,
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "visa-free",
    note: "The Philippines is not on ICA's list of nationalities that need a Singapore entry visa. ICA does not publish a fixed stay: the officer at the checkpoint decides how long your e-Pass lasts. Submit the SG Arrival Card with Electronic Health Declaration within 3 days (including the day of arrival) before you arrive.",
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    sourceLabel: "Immigration & Checkpoints Authority, Singapore",
    lastReviewed: R,
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "From 15 September 2026 the Philippines is on Thailand's 60-country list for a 30-day visa exemption (the 60-day scheme has ended). Tourism only, ordinary passports only, limited to two visa-exempt entries per calendar year, and you must show confirmed onward travel out of Thailand within 30 days.",
    source: "https://oslo.thaiembassy.org/en/page/visa-exemption?menu=60b4c9a7180a9f3d4f28a932",
    sourceLabel: "Royal Thai Embassy, Oslo (Thai Ministry of Foreign Affairs) — visa exemption list effective 15 September 2026",
    lastReviewed: R,
  },
  {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    base: "visa-free",
    days: 21,
    note: "Ordinary Philippine passports are visa-exempt for 21 days, per Viet Nam's Ministry of Foreign Affairs visa exemption list (page updated 30 June 2025). You must still meet Viet Nam's general entry conditions, and a longer stay needs a visa.",
    source: "https://mofa.gov.vn/tin-chi-tiet/chi-tiet/viet-nam-39-s-visa-exemption-list-57163-596.html",
    sourceLabel: "Ministry of Foreign Affairs of Viet Nam — Viet Nam's visa exemption list",
    lastReviewed: R,
  },

  // East Asia
  {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "East Asia",
    base: "visa-free",
    days: 14,
    note: "Philippine nationals can visit visa-free for up to 14 days, per the Immigration Department's table of visit visa-free periods. For a longer stay, or to work or study, get a visa or entry permit before you travel.",
    source: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    sourceLabel: "Immigration Department, Hong Kong SAR",
    lastReviewed: R,
  },
  {
    code: "MO",
    name: "Macau",
    flag: "🇲🇴",
    region: "East Asia",
    base: "visa-free",
    days: 30,
    note: "Philippine passports are on Macao's visa-exemption list: up to 30 days on arrival. You need a passport valid 90+ days beyond your stay, an onward or return ticket, and proof of funds (MOP 5,000 for up to 7 days, MOP 10,000 for 8-14 days, MOP 15,000 for 15-21 days, MOP 20,000 beyond).",
    source: "https://www.gov.mo/en/services/ps-1474/ps-1474b/",
    sourceLabel: "Macao SAR Government — Public Security Police Force immigration service",
    lastReviewed: R,
  },
];
