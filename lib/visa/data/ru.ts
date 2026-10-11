// Russian passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-11 against an official government page: the
// destination's immigration authority, foreign ministry, embassy or official e-visa/ETA portal,
// or the Russian Ministry of Foreign Affairs' Consular Information Portal (kdmid.ru), whose
// per-country pages and table of visa/visa-free regimes ("as of 30 September 2026") are cited
// where the destination's own page does not give the Russia-specific terms.
// A destination that could not be confirmed from an official page is deliberately absent: the app
// then shows an honest "not yet verified" card instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.
// Where the Russian MFA table and the destination's own authority disagree, the destination's
// authority wins (Mexico, Indonesia), and the rule is described conservatively.

import type { DestinationRule } from "../types";

const R = "2026-10-11";
const MFA_RU = "Russian Ministry of Foreign Affairs — Consular Information Portal (kdmid.ru)";

export const RUSSIA_DESTINATIONS: DestinationRule[] = [
  // Europe
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-required",
    note: "A Schengen short-stay visa is required (Regulation (EU) 2018/1806, Annex I). The EU fully suspended its visa facilitation agreement with Russia in 2022, so standard Visa Code rules apply. Since Nov 2025 Russian nationals cannot get multiple-entry visas: a new visa is needed for each trip. Travel documents issued in Russian-occupied parts of Ukraine or Georgia's breakaway regions are not accepted.",
    source: "https://commission.europa.eu/topics/eu-solidarity-ukraine/eu-sanctions-against-russia-following-invasion-ukraine/visa-measures_en",
    sourceLabel: "European Commission — visa measures for Russian nationals; visa requirement from Annex I of Regulation (EU) 2018/1806 (EUR-Lex)",
    lastReviewed: R,
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    base: "visa-required",
    note: "Russian nationals are on the UK visa national list: you need a visa (entry clearance) before you travel to the UK as a visitor, or for any other purpose for less than six months. Apply for a Standard Visitor visa before you travel.",
    source: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-visa-national-list",
    sourceLabel: "UK Home Office — Immigration Rules Appendix Visitor: Visa national list (GOV.UK, updated 8 October 2026)",
    lastReviewed: R,
  },
  {
    code: "BY",
    name: "Belarus",
    flag: "🇧🇾",
    region: "Europe",
    base: "visa-free",
    note: "No visa and no migration card under the Union State agreement. Belarus's foreign ministry says Russian citizens can stay up to 90 days without registration; a longer stay needs a residence permit. Some places need a special permit under Belarusian law.",
    source: "https://www.kdmid.ru/docs/belarus/information-about-the-country/",
    sourceLabel: `${MFA_RU} — Belarus entry rules; the 90-day no-registration limit is from the Belarus Ministry of Foreign Affairs (mfa.gov.by)`,
    lastReviewed: R,
  },
  {
    code: "RS",
    name: "Serbia",
    flag: "🇷🇸",
    region: "Europe",
    base: "visa-free",
    days: 30,
    note: "No visa for ordinary passports for visits of up to 30 days, under the 2009 Russia–Serbia agreement. A longer stay, work or study needs a visa from a Serbian mission. Foreigners must be registered with the police within 24 hours of arrival (hotels do this for guests).",
    source: "https://www.mfa.gov.rs/en/citizens/travel-serbia/visa-regime/ruska-federacija",
    sourceLabel: "Ministry of Foreign Affairs of Serbia — visa regime for entering Serbia: Russian Federation; registration rule from the Russian MFA Consular Portal",
    lastReviewed: R,
  },
  {
    code: "ME",
    name: "Montenegro",
    flag: "🇲🇪",
    region: "Europe",
    base: "visa-required",
    note: "From 1 Nov 2026 Russian citizens need a visa to enter Montenegro (apply at VFS centres, including Moscow). Until 31 Oct 2026 they may stay up to 30 days without one. Check the date of your trip: after 31 Oct the visa-free entry no longer applies.",
    source: "https://www.gov.me/en/diplomatic-missions/embassies-and-consulates-of-montenegro/russian-federation",
    sourceLabel: "Government of Montenegro — visa regime for citizens of the Russian Federation",
    lastReviewed: R,
    overrides: [
      {
        visas: ["SCHENGEN", "US", "UK"],
        residence: ["US", "UK"],
        category: "visa-free",
        days: 30,
        note: "A valid Schengen, US, UK or Irish visa, or a residence permit from the US, UK or Ireland, lets you enter and stay up to 30 days, but no longer than the visa's validity if that is shorter.",
      },
    ],
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    flag: "🇧🇦",
    region: "Europe",
    base: "visa-free",
    days: 30,
    note: "No visa for ordinary passports: up to 30 days in any 60-day period from first entry, under the 2013 agreement. Work, study or residence need a visa. The BiH foreign ministry's Russia page also mentions a tourist voucher or verified invitation, so confirm with the BiH embassy in Moscow before you go.",
    source: "https://www.kdmid.ru/docs/bosnia-and-herzegovina/information-about-the-country/",
    sourceLabel: `${MFA_RU} — Bosnia and Herzegovina entry rules; BiH government list of visa-free ordinary passports (fipa.vijeceministara.gov.ba)`,
    lastReviewed: R,
  },

  // North America
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    region: "North America",
    base: "visa-required",
    note: "Tourist and business trips need a US nonimmigrant visa. The US Embassy in Moscow no longer offers non-diplomatic visa services: Russian nationals schedule their visa interview at the US Embassy in Warsaw (Poland) or Astana (Kazakhstan).",
    source: "https://ru.usembassy.gov/visas/",
    sourceLabel: "U.S. Embassy & Consulates in Russia (U.S. Department of State) — visa services",
    lastReviewed: R,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    base: "visa-required",
    note: "A visitor visa is required: Russia is on the Government of Canada's list of citizens who need a visa. Apply online. Since 28 Jan 2026 the Canadian Embassy in Moscow no longer offers visa services and visa application centres in Russia only take biometrics; passports go to a centre outside Russia when requested.",
    source: "https://ircc.canada.ca/english/visit/visas.asp",
    sourceLabel: "Immigration, Refugees and Citizenship Canada — who needs a visa; Moscow service change from the Government of Canada's Moscow office page (international.gc.ca)",
    lastReviewed: R,
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    region: "North America",
    base: "visa-required",
    note: "Mexico's immigration institute lists the Russian Federation among nationalities that need a Mexican visa, applied for at a Mexican consulate. A valid visa from Canada, the US, Japan, the UK or a Schengen state, or permanent residence in those places (or in Chile, Colombia or Peru), is accepted instead.",
    source: "https://www.inm.gob.mx/gobmx/word/index.php/paises-requieren-visa-para-mexico/",
    sourceLabel: "Instituto Nacional de Migración (Mexico) — countries and regions that require a visa",
    lastReviewed: R,
    overrides: [
      {
        visas: ["CA", "US", "JP", "UK", "SCHENGEN"],
        residence: ["CA", "US", "JP", "UK", "SCHENGEN"],
        category: "visa-free",
        days: 180,
        note: "A valid visa from Canada, the US, Japan, the UK or a Schengen state, or permanent residence there (also Chile, Colombia or Peru), replaces the Mexican visa. Stay up to 180 days. Air arrivals get the immigration form (FMM) automatically; land arrivals fill it in.",
      },
    ],
  },

  // Caribbean
  {
    code: "DO",
    name: "Dominican Republic",
    flag: "🇩🇴",
    region: "Caribbean",
    base: "visa-free",
    days: 60,
    note: "No visa for tourism: up to 60 days in any 180-day period under the 2018 Russia–Dominican Republic agreement (in force since Dec 2020). You need a passport valid 6 months, a return or onward ticket, an address in the country, proof of funds, and the free online E-Ticket form completed before check-in.",
    source: "https://www.godominicanrepublic.com/travel/entry-requirements",
    sourceLabel: "Dominican Republic Ministry of Tourism (official tourism website) — entry requirements; 60-day limit from the Russian MFA Consular Portal",
    lastReviewed: R,
  },
  {
    code: "CU",
    name: "Cuba",
    flag: "🇨🇺",
    region: "Caribbean",
    base: "visa-free",
    days: 90,
    note: "No visa for stays of up to 90 days within 180 days on a Russian passport (2018 agreement). The stay can be extended on the spot by up to 90 days through Cuban migration. Longer stays, work or business need a visa from the Cuban Embassy in Moscow.",
    source: "https://www.kdmid.ru/docs/cuba/information-about-the-country/",
    sourceLabel: `${MFA_RU} — Cuba entry rules`,
    lastReviewed: R,
  },
];
