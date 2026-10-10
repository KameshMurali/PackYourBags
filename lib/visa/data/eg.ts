// Egyptian passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page (immigration
// authority, foreign ministry, embassy or consulate, or official e-visa portal). A destination
// that could not be confirmed from an official page is deliberately absent: the app then shows
// an honest "not yet verified" card with the country's official link instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.

import type { DestinationRule } from "../types";

const R = "2026-10-10";

export const EGYPT_DESTINATIONS: DestinationRule[] = [
  // South Asia
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    region: "South Asia",
    base: "visa-required",
    note: "Visa required. Egypt is not among the countries eligible for India's e-Visa on the official e-Visa portal, so apply for a regular visa: fill in the online form at indianvisaonline.gov.in, print it and submit it with photos and supporting documents to the Embassy of India in Cairo.",
    source: "https://www.eoicairo.gov.in/page/visa-services-for-egyptians-and-foreign-nationals/",
    sourceLabel: "Embassy of India, Cairo (Ministry of External Affairs); e-Visa eligibility list at indianvisaonline.gov.in/evisa/tvoa.html",
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
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "evisa",
    fee: "S$30 (non-refundable processing fee)",
    processingTime: "3 working days (excluding the day of submission)",
    note: "An entry visa is required for Egyptian ordinary passports. You can't apply directly: a Singapore citizen or PR local contact, or a strategic partner, submits it online through the e-service; you can also apply at a Singapore overseas mission or through an authorised visa agent. The application includes a Letter of Introduction (Form V39A).",
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements/visa-detail-page/egypt",
    sourceLabel: "Immigration & Checkpoints Authority, Singapore",
    lastReviewed: R,
  },

  // Caucasus
  {
    code: "GE",
    name: "Georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    base: "evisa",
    note: "Visa required, but Egyptian citizens can apply for a Georgian e-Visa without a supporting Schengen or OECD visa. Tourists upload a biometric photo, passport copy, proof of accommodation, round-trip flight ticket, travel insurance and proof of financial means.",
    source: "https://www.evisa.gov.ge/geovisa/countries/index.html",
    sourceLabel: "Georgia e-Visa portal (Ministry of Foreign Affairs of Georgia)",
    lastReviewed: R,
  },

  // Middle East
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    base: "visa-required",
    note: "Visa required: the UAE Ministry of Foreign Affairs lists Egypt as 'Visa Required' on its visa-exemptions page, and visa on arrival is not offered. Arrange the entry permit before you travel.",
    source: "https://www.mofa.gov.ae/en/visa-exemptions-for-non-citizen",
    sourceLabel: "Ministry of Foreign Affairs, UAE — visa exemptions page",
    lastReviewed: R,
    aliases: ["UAE", "Dubai", "Abu Dhabi"],
  },
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    region: "Middle East",
    base: "evisa",
    fee: "QAR 100 (Hayya platform)",
    note: "Egypt is on Visit Qatar's list of nationalities that must pay a fee to get a visa on arrival or apply for a tourist visa before travel. Apply on the Hayya platform (hayya.qa) before you fly. Egypt is not on the visa-free list.",
    source: "https://visitqatar.com/intl-en/plan-your-trip/visas",
    sourceLabel: "Qatar Tourism — Visit Qatar visa check",
    lastReviewed: R,
  },
  {
    code: "OM",
    name: "Oman",
    flag: "🇴🇲",
    region: "Middle East",
    base: "evisa",
    note: "Apply for an Oman eVisa on the Royal Oman Police portal (evisa.rop.gov.om) before you travel. Egypt is on Oman's second visa-exemption group: visa-free for 14 days only with residence or a valid entry visa for the US, Canada, Australia, UK, a Schengen country or Japan. GCC residents in certain professions can also qualify.",
    source: "https://www.fm.gov.om/en/visitors/entry-visas/",
    sourceLabel: "Ministry of Foreign Affairs, Oman — entry visas",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US", "UK", "SCHENGEN", "CA", "AU", "JP"],
        residence: ["US", "UK", "SCHENGEN", "CA", "AU", "JP"],
        category: "visa-free",
        days: 14,
        note: "Visa-free for 14 days (not extendable) with residence or a valid entry visa for the US, Canada, Australia, UK, a Schengen country or Japan. You also need a passport valid 6+ months, a return ticket, a confirmed hotel booking, health insurance and enough funds. Spouse and children benefit too.",
      },
    ],
  },
  {
    code: "TR",
    name: "Türkiye",
    flag: "🇹🇷",
    region: "Middle East",
    base: "visa-required",
    note: "Ordinary passports need a visa. Egyptians under 15 or over 45 can get an e-Visa (evisa.gov.tr) with no extra condition. Those aged 15 to 45 can get a 30-day single-entry e-Visa only with a valid Schengen, US, UK or Ireland visa or residence permit and when flying Turkish Airlines, AJet, Pegasus, EgyptAir or Air Cairo.",
    source: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
    sourceLabel: "Ministry of Foreign Affairs of Türkiye — visa information for foreigners",
    lastReviewed: R,
    aliases: ["Turkey", "Istanbul"],
    overrides: [
      {
        visas: ["SCHENGEN", "US", "UK"],
        residence: ["SCHENGEN", "US", "UK"],
        category: "evisa",
        days: 30,
        note: "30-day single-entry e-Visa at evisa.gov.tr for Egyptians aged 15 to 45 with a valid Schengen, US, UK or Ireland visa or residence permit, travelling on Turkish Airlines, AJet, Pegasus, EgyptAir or Air Cairo (Ireland is not selectable here, but it is accepted).",
      },
    ],
  },

  // East Africa
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    base: "visa-free",
    days: 60,
    note: "Egypt is on the list of African nationalities exempt from Kenya's eTA for a stay of up to 60 days under the Kenya Citizenship and Immigration (Amendment) Rules, 2025. Entry is still subject to immigration checks at the border.",
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
    note: "A Schengen visa is required for short stays of up to 90 days in any 180-day period. Egypt is on the EU's list of nationalities that must hold a visa when crossing the external borders (Regulation (EU) 2018/1806, Annex I).",
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
    note: "Egypt is on the UK visa national list: you need entry clearance (a visa) in advance of travel for any purpose, tourism included.",
    source: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-visa-national-list",
    sourceLabel: "GOV.UK — Immigration Rules Appendix Visitor: visa national list",
    lastReviewed: R,
    aliases: ["London"],
  },

  // North America
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    region: "North America",
    base: "visa-required",
    note: "Egypt is not on the Department of Homeland Security's list of Visa Waiver Program countries, so you need a US visa before you travel; ESTA is only for Visa Waiver Program travellers. Check travel.state.gov for the visa type and current entry rules.",
    source: "https://www.dhs.gov/visa-waiver-program",
    sourceLabel: "U.S. Department of Homeland Security — Visa Waiver Program",
    lastReviewed: R,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    base: "visa-required",
    note: "Egypt is on IRCC's list of countries whose citizens need a visitor visa to visit or transit through Canada, by any method of travel. Egypt is not among the visa-required countries whose citizens may be eligible for an eTA instead.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html",
    sourceLabel: "Immigration, Refugees and Citizenship Canada — entry requirements by country",
    lastReviewed: R,
  },

  // Oceania
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    base: "visa-required",
    note: "A visa is needed before you travel. Egyptian passports are not on the Electronic Travel Authority (601) eligible-passport list, and the eVisitor (651) is for European passport holders, so apply for a Visitor visa (subclass 600): for tourists, business visitors or family visits of 3, 6 or 12 months.",
    source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601",
    sourceLabel: "Department of Home Affairs, Australia (ETA 601 eligible passports; Visitor visa 600)",
    lastReviewed: R,
  },
];
