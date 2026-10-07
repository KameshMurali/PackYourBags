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

  // Middle East
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
