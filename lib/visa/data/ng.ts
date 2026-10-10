// Nigerian passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page (immigration
// authority, foreign ministry, embassy or consulate, or official e-visa portal). A destination
// that could not be confirmed from an official page is deliberately absent: the app then shows
// an honest "not yet verified" card with the country's official link instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.

import type { DestinationRule } from "../types";

const R = "2026-10-10";

export const NIGERIA_DESTINATIONS: DestinationRule[] = [
  // West Africa (ECOWAS)
  {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    region: "West Africa",
    base: "visa-free",
    note: "Ghana Immigration Service lists Nigeria among the ECOWAS states whose citizens need no visa, for all types of passport. The page states no maximum stay. You still need a valid passport.",
    source: "https://gis.gov.gh/visas/",
    sourceLabel: "Ghana Immigration Service",
    lastReviewed: R,
  },
  {
    code: "BJ",
    name: "Benin",
    flag: "🇧🇯",
    region: "West Africa",
    base: "visa-free",
    days: 90,
    note: "The Government of Benin lets nationals of all African countries, Nigeria included, enter and move freely for 3 months (90 days). Benin's e-Visa platform repeats that Africans can visit without a visa for 90 days.",
    source: "https://www.gouv.bj/article/851/diplomatie---liste-pays-dont-ressortissants-sont-exemptes-visa-entree-benin-sans-exigence-reciprocite/",
    sourceLabel: "Government of Benin (gouv.bj), visa-exempt countries announcement",
    lastReviewed: R,
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    region: "West Africa",
    base: "visa-free",
    note: "Nigeria is on the official list of ECOWAS members whose nationals with an ordinary or official passport are not subject to the entry-visa requirement. The list does not state a maximum stay.",
    source: "https://snedai.com/e-visa/",
    sourceLabel: "SNEDAI, Côte d'Ivoire's official e-Visa platform (list of countries exempt from entry visa)",
    lastReviewed: R,
  },
  {
    code: "SN",
    name: "Senegal",
    flag: "🇸🇳",
    region: "West Africa",
    base: "visa-free",
    note: "Nigeria is named among the African countries whose citizens need no visa for a stay of less than 3 months. You need a passport or travel document valid for at least 6 months. The page dates the current rules from 1 May 2015.",
    source: "https://www.diplomatie.gouv.sn/visiter-le-senegal",
    sourceLabel: "Ministry of Foreign Affairs of Senegal",
    lastReviewed: R,
  },

  // East Africa
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    base: "visa-free",
    days: 60,
    note: "Nigeria is among the African nationals exempt from Kenya's Electronic Travel Authorisation (eTA) for up to 60 days, under the Kenya Citizenship and Immigration (Amendment) Rules, 2025. The eTA portal also tells all foreign visitors except East African Community citizens to submit immigration forms before travel; check it before you fly.",
    source: "https://etakenya.go.ke/how-to-apply",
    sourceLabel: "Directorate of Immigration Services, Kenya (eTA portal)",
    lastReviewed: R,
  },
  {
    code: "RW",
    name: "Rwanda",
    flag: "🇷🇼",
    region: "East Africa",
    base: "visa-on-arrival",
    days: 30,
    fee: "Waived for African Union, Commonwealth and La Francophonie citizens",
    note: "Visa on arrival without prior application. Citizens of African Union, Commonwealth or La Francophonie states, which includes Nigeria, are waived the visa fee for a 30-day visit. Nigeria is not on Rwanda's 90-day visa-free list.",
    source: "https://www.migration.gov.rw/visa-on-arrival",
    sourceLabel: "Directorate General of Immigration and Emigration, Rwanda",
    lastReviewed: R,
  },
  {
    code: "ET",
    name: "Ethiopia",
    flag: "🇪🇹",
    region: "East Africa",
    base: "evisa",
    fee: "USD 62 (30 days) or USD 152 (90 days), single entry",
    processingTime: "3 days",
    note: "Apply for the tourist e-Visa online before travel and carry the approval. Nigeria is not on the portal's list of countries eligible for tourist visa on arrival, and only Kenya and Djibouti citizens are visa-exempt. Passport valid at least 6 months.",
    source: "https://www.evisa.gov.et/information/tourist",
    sourceLabel: "Immigration and Citizenship Service of Ethiopia (e-Visa portal)",
    lastReviewed: R,
  },
  {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    region: "East Africa",
    base: "evisa",
    processingTime: "Within 10 days online; longer for 'referral' nationalities",
    note: "Nigeria is excluded from Tanzania's Commonwealth visa exemption and is not on the visa-on-arrival list, so apply online and wait for the visa grant notice before travelling. Nationals on Tanzania's separate 'referral' list should apply 2 months ahead and not book flights until approved; check that list for Nigeria. Passport valid at least 6 months.",
    source: "https://visa.immigration.go.tz/guidelines",
    sourceLabel: "Tanzania Immigration Services Department (eVisa portal)",
    lastReviewed: R,
  },

  // Southern Africa
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    region: "Southern Africa",
    base: "visa-required",
    note: "Visa required: on the Department of Home Affairs exemption list Nigeria is exempt only for diplomatic, official and service passports (90 days), not ordinary passports. The Presidency said in December 2024 that applicants can submit certified copies of the passport bio-page first and hand in the passport only after approval.",
    source: "https://www.dha.gov.za/index.php/immigration-services/exempt-countries",
    sourceLabel: "Department of Home Affairs, South Africa",
    lastReviewed: R,
  },

  // Middle East
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    region: "Middle East",
    base: "visa-required",
    days: 90,
    note: "Nigeria is not eligible for the standard tourist eVisa: apply at a Saudi embassy or consulate, or through an authorised visa office. The visa allows stays of up to 90 days. Passport valid at least 6 months beyond entry. Travellers under 18 must be accompanied by a parent, grandparent or adult sibling.",
    source: "https://www.visitsaudi.com/en/plan-your-trip/visa-regulations",
    sourceLabel: "Visit Saudi, Saudi Tourism Authority's official visa checker (no readable immigration page found)",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US", "UK", "SCHENGEN"],
        residence: ["US", "UK", "SCHENGEN"],
        category: "evisa",
        days: 90,
        note: "Nigerian passport holders with a US, UK or Schengen resident, business or tourist visa can get the eVisa (about USD 90.50) or a visa on arrival. On first use the visa must still be valid and carry an entry stamp from the issuing country; digital stamps are not accepted.",
      },
    ],
  },
  {
    code: "TR",
    name: "Türkiye",
    flag: "🇹🇷",
    region: "Middle East",
    base: "visa-required",
    note: "Visa required: Türkiye's Ministry of Foreign Affairs says ordinary and official or service passport holders from Nigeria need a visa. Its Nigeria entry lists no e-Visa route, unlike its entries for some other nationalities. Apply through the Turkish Embassy in Abuja (online pre-application). Passport valid at least 6 months.",
    source: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
    sourceLabel: "Ministry of Foreign Affairs of the Republic of Türkiye",
    lastReviewed: R,
    aliases: ["Istanbul"],
  },

  // Southeast Asia
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "evisa",
    fee: "S$30 (non-refundable processing fee)",
    processingTime: "3 working days (excluding the day of submission)",
    note: "A Singapore entry visa is required for Nigerian travel documents (diplomatic, official and service passports are exempt). You can't apply directly: a Singapore citizen or PR local contact, or a strategic partner, applies online, or you apply at a Singapore overseas mission. Apply within 30 days before arrival; Form V39A (Letter of Introduction) is required.",
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements/visa-detail-page/nigeria",
    sourceLabel: "Immigration & Checkpoints Authority, Singapore",
    lastReviewed: R,
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "evisa",
    processingTime: "15 business days, up to 4 to 6 weeks in some cases",
    note: "Apply online for a Thai e-Visa at thaievisa.go.th. Nigerian passport holders must also upload an NDLEA visa clearance and a police clearance issued by POSSAP; both are mandatory. Apply well ahead of travel because processing can run long.",
    source: "https://abuja.thaiembassy.org/en/content/thailand-e-visa-application-requirements-general-i",
    sourceLabel: "Royal Thai Embassy, Abuja (Thai Ministry of Foreign Affairs)",
    lastReviewed: R,
  },

  // South Asia
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    region: "South Asia",
    base: "visa-required",
    fee: "USD 585 plus USD 3 ICWF, whatever the visa type, paid in naira equivalent",
    note: "Visa required: the High Commission of India in Abuja says there is no e-Visa facility for Nigerian nationals. Apply in person at the High Commission in Abuja or the Consulate General in Lagos with the original documents. Processing times vary and are at the Mission's discretion. Visas run from the date of issue, not arrival.",
    source: "https://hciabuja.gov.in/pages/MTA4",
    sourceLabel: "High Commission of India, Abuja",
    lastReviewed: R,
  },
];
