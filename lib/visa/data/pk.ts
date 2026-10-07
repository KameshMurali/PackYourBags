// Pakistani passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-08 against an official government page (immigration
// authority, foreign ministry, embassy or consulate, or official e-visa portal). A destination
// that could not be confirmed from an official page is deliberately absent: the app then shows
// an honest "not yet verified" card with the country's official link instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.

import type { DestinationRule } from "../types";

const R = "2026-10-08";

export const PAKISTAN_DESTINATIONS: DestinationRule[] = [
  // South Asia
  {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    region: "South Asia",
    base: "eta",
    days: 30,
    fee: "Free of charge",
    note: "Everyone needs an ETA before arrival. Pakistan is on Sri Lanka's list of 40 nationalities whose 30-day tourist ETA is free since 25 May 2026, with double entry within the 30 days. Staying longer needs a paid extension.",
    source: "https://www.eta.gov.lk/slvisa/",
    sourceLabel: "Department of Immigration & Emigration, Sri Lanka (ETA portal)",
    lastReviewed: R,
  },
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
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Southeast Asia",
    base: "evisa",
    processingTime: "2 to 10 working days",
    note: "Visa required: Pakistan is on the Immigration Department's list of nationalities that must have a visa. The High Commission of Malaysia in Islamabad says tourist visa applications are made online on Malaysia's eVISA portal.",
    source: "https://www.kln.gov.my/web/pak_islamabad/requirement_foreigner",
    sourceLabel: "High Commission of Malaysia, Islamabad (Ministry of Foreign Affairs)",
    lastReviewed: R,
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "evisa",
    processingTime: "About 14 working days after the fee is received",
    note: "Visa required: apply for a Thai e-Visa at thaievisa.go.th. From Pakistan, applications go to the Royal Thai Embassy in Islamabad or the Consulate-General in Karachi, and you must be physically in Pakistan for the whole application. Visa fees are non-refundable.",
    source: "https://image.mfa.go.th/mfa/0/eb9u2bRVs7/VISA/2025/FAQs_on_Thailand_s_e-visa/FAQs_on_Thailand.pdf",
    sourceLabel: "Royal Thai Embassy, Islamabad (Thai Ministry of Foreign Affairs)",
    lastReviewed: R,
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "evisa",
    fee: "S$30 (non-refundable processing fee)",
    processingTime: "3 working days (excluding the day of submission)",
    note: "A Singapore entry visa is required for Pakistani travel documents. You can't apply directly: a Singapore citizen or PR local contact, or an authorised visa agent or strategic partner, submits it online and prints your e-Visa; you can also apply at a Singapore overseas mission. Business or social visits also need a Letter of Introduction (Form V39A).",
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements/visa-detail-page/pakistan",
    sourceLabel: "Immigration & Checkpoints Authority, Singapore",
    lastReviewed: R,
  },

  // East Asia
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    region: "East Asia",
    base: "visa-required",
    processingTime: "About 4 working days after the embassy receives the passport",
    note: "Visa required: Pakistani ordinary passports are not visa-exempt. Apply through Gerry's Chinese Visa Application Service Center in Islamabad, Karachi or Lahore. The embassy says tourist (L) visas are for tourists travelling in a group of at least 5 with an invitation letter for a tourist group. It waives its visa fee for Pakistani ordinary passports.",
    source: "https://pk.china-embassy.gov.cn/eng/lsfw/va/202504/t20250428_11606290.htm",
    sourceLabel: "Embassy of China in Pakistan — visa application instructions",
    lastReviewed: R,
  },
  {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "East Asia",
    base: "visa-required",
    note: "Pakistani nationals need a visa for any purpose, including airside transit. Apply at a Chinese diplomatic or consular mission (or its visa application service centre), or to the HKSAR Immigration Department by post or through a local sponsor, and get it before you travel.",
    source: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    sourceLabel: "Immigration Department, Hong Kong SAR",
    lastReviewed: R,
  },

  // Middle East
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    region: "Middle East",
    base: "visa-on-arrival",
    note: "Visit Qatar's visa checker puts Pakistan in the group that gets an entry visa on arrival only after booking a visa-on-arrival hotel on the Discover Qatar website before you travel. Alternatively, apply in advance for a Hayya A1 Entry Visa at hayya.qa and skip the paperwork at the airport.",
    source: "https://visitqatar.com/intl-en/plan-your-trip/visas",
    sourceLabel: "Qatar Tourism — Visit Qatar visa checker",
    lastReviewed: R,
  },
  {
    code: "BH",
    name: "Bahrain",
    flag: "🇧🇭",
    region: "Middle East",
    base: "evisa",
    note: "Pakistan is on Bahrain's list of nationalities that can apply online for a visit eVisa (evisa.gov.bh) and also on its visa-on-arrival list. Terms and conditions apply to both and are shown only in the portal's eligibility check, and entry is not guaranteed, so apply for the eVisa before you travel.",
    source: "https://www.evisa.gov.bh/list-of-online-visa-country.html",
    sourceLabel: "Nationality, Passports & Residence Affairs, Bahrain (eVisa portal)",
    lastReviewed: R,
  },
  {
    code: "TR",
    name: "Türkiye",
    flag: "🇹🇷",
    region: "Middle East",
    base: "visa-required",
    note: "Ordinary-passport holders need a visa. With a valid Schengen, US, UK or Ireland visa or residence permit you can instead get a one-month single-entry e-Visa online at evisa.gov.tr.",
    source: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
    sourceLabel: "Ministry of Foreign Affairs of Türkiye — visa information for foreigners",
    lastReviewed: R,
    aliases: ["Istanbul"],
    overrides: [
      {
        visas: ["SCHENGEN", "US", "UK"],
        residence: ["SCHENGEN", "US", "UK"],
        category: "evisa",
        days: 30,
        note: "One-month single-entry e-Visa at evisa.gov.tr for holders of a valid Schengen, US, UK or Ireland visa or residence permit (Ireland is not selectable here, but it is accepted).",
      },
    ],
  },

  // Caucasus
  {
    code: "GE",
    name: "Georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    base: "visa-required",
    note: "Visa required. A Georgian e-Visa needs a supporting document: a Schengen visa, a visa from any OECD member, or a Schengen or OECD residence permit. UAE residents can enter visa-free for 90 days with a UAE residence permit or multiple-entry visa valid for at least 1 year.",
    source: "https://www.evisa.gov.ge/geovisa/countries/index.html",
    sourceLabel: "Georgia e-Visa portal (Ministry of Foreign Affairs of Georgia)",
    lastReviewed: R,
    overrides: [
      {
        visas: ["SCHENGEN", "US", "UK", "CA", "AU", "JP"],
        residence: ["SCHENGEN", "US", "UK", "CA", "AU", "JP"],
        category: "evisa",
        note: "A Georgian e-Visa is open to Pakistani citizens holding a valid Schengen visa or a valid visa from any OECD member, or a valid Schengen or OECD residence permit (OECD members not selectable here also count).",
      },
      {
        visas: ["AE"],
        residence: ["AE"],
        category: "visa-free",
        days: 90,
        note: "Visa-free for up to 90 days in any 180-day period, per the Embassy of Georgia in the UAE (uae.mfa.gov.ge). For Pakistani citizens the UAE visa must be multiple-entry and, like a residence permit (Emirates ID), valid for at least 1 year on the day you enter. Passport valid at least 90 days.",
      },
    ],
  },

  // East Africa
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    base: "eta",
    processingTime: "Typically 3 working days",
    note: "Every visitor needs an approved Kenya eTA before the journey; Pakistan is not on the exempt-nationalities list. Have a passport valid for 6 months with a blank page, an itinerary, an accommodation booking and a payment card ready.",
    source: "https://etakenya.go.ke/how-to-apply",
    sourceLabel: "Directorate of Immigration Services, Kenya (eTA portal)",
    lastReviewed: R,
  },

  // Europe
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-required",
    note: "A Schengen visa is required for short stays of up to 90 days in any 180-day period. Pakistan is on the EU's list of nationalities that must hold a visa when crossing the external borders (Regulation (EU) 2018/1806, Annex I).",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R1806",
    sourceLabel: "EU Regulation 2018/1806, Annex I (official EUR-Lex text)",
    lastReviewed: R,
    aliases: ["Europe", "EU", "Schengen"],
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    base: "visa-required",
    note: "Pakistan is on the UK visa national list: you need entry clearance (a visa) in advance of travel for any purpose, tourism included.",
    source: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-visa-national-list",
    sourceLabel: "GOV.UK — Immigration Rules Appendix Visitor: visa national list",
    lastReviewed: R,
    aliases: ["London"],
  },
];
