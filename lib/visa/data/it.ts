// Italian passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page (the
// destination's immigration authority, foreign ministry, embassy or consulate, or its official
// e-visa/ETA portal; for EU states, the EU's Your Europe portal or the national government).
// A destination that could not be confirmed from an official page is deliberately absent: the app
// then shows an honest "not yet verified" card instead of a guess.
// Fees, processing times and stay lengths are included only where an official page states them.
// Italy is an EU and Schengen member, so Italian citizens have free movement in the EU:
// SCHENGEN, IE and CY are visa-free on that basis (no 90/180-day limit), with a travel document.
// ETIAS is not relevant to EU citizens and is not mentioned.

import type { DestinationRule } from "../types";

const R = "2026-10-10";

export const ITALY_DESTINATIONS: DestinationRule[] = [
  // Europe: EU free movement
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-free",
    note: "Free movement: as an Italian (EU) citizen you may enter and live in any Schengen state with a valid passport or national ID card. No visa and no 90/180-day limit. Carry your document: Schengen states can reintroduce border checks temporarily. After 3 months in another EU state you may need to register your residence there.",
    source: "https://europa.eu/youreurope/citizens/travel/entry-exit/eu-citizen/index_en.htm",
    sourceLabel: "Your Europe, the EU's official citizens portal (europa.eu/youreurope) — travel documents and residence rights for EU nationals",
    lastReviewed: R,
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    region: "Europe",
    base: "visa-free",
    note: "No visa for EU citizens. Ireland is an EU state outside Schengen, so you must show a valid passport or national ID card when travelling to or from Ireland. Under EU free movement you can stay up to 3 months without registering as a resident; longer stays may need registration. The Schengen 90/180-day rule does not apply to you.",
    source: "https://www.citizensinformation.ie/en/moving-country/visas-for-ireland/visa-requirements-for-entering-ireland/",
    sourceLabel: "Citizens Information, Government of Ireland (no visa for EU citizens); ID rule and 3-month stay from the EU's Your Europe portal",
    lastReviewed: R,
  },
  {
    code: "CY",
    name: "Cyprus",
    flag: "🇨🇾",
    region: "Europe",
    base: "visa-free",
    note: "No visa for EU citizens: you can enter with a valid passport or national ID card. Cyprus is an EU state outside Schengen, so you must show that document when travelling to or from Cyprus. Under EU free movement you can stay up to 3 months without registering as a resident; longer stays may need registration. The Schengen 90/180-day rule does not apply to you.",
    source: "https://www.gov.cy/mip-md/en/documents/entry-in-cyprus-carriers-responsibility/",
    sourceLabel: "Migration Department, Republic of Cyprus (gov.cy); 3-month stay and ID rule for travel from the EU's Your Europe portal",
    lastReviewed: R,
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    base: "eta",
    days: 180,
    fee: "GBP 20",
    note: "EU citizens (except Irish citizens) need an electronic travel authorisation (ETA) before travelling; it is not a visa. It lets you visit for up to 6 months for tourism, family visits or business meetings. You need a valid passport: an ID card is accepted only in limited cases. You cannot work for a UK employer. Apply only through the official GOV.UK channels.",
    source: "https://www.gov.uk/guidance/visiting-the-uk-as-an-eu-eea-or-swiss-citizen",
    sourceLabel: "UK Government (GOV.UK) — visiting the UK as an EU citizen; ETA fee from the GOV.UK ETA guidance",
    lastReviewed: R,
  },

  // North America
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    region: "North America",
    base: "eta",
    days: 90,
    fee: "USD 40.27",
    note: "Italy is a Visa Waiver Program country: no visa for tourism or business of 90 days or less, but you must hold an approved ESTA before you board. An ESTA is normally valid for two years or until your passport expires, whichever is sooner. Apply only on the official ESTA website or app.",
    source: "https://www.dhs.gov/visa-waiver-program",
    sourceLabel: "US Department of Homeland Security — Visa Waiver Program country list; ESTA fee and validity from US Customs and Border Protection (esta.cbp.dhs.gov, cbp.gov)",
    lastReviewed: R,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    base: "eta",
    days: 180,
    fee: "CAD 7",
    note: "No visa, but you need an electronic travel authorization (eTA) to fly to or transit through Canada; it is valid up to 5 years or until your passport expires. No eTA is needed if you arrive by car, bus, train or boat. You can normally stay up to 6 months; the border officer decides how long.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html",
    sourceLabel: "Immigration, Refugees and Citizenship Canada (canada.ca) — Italy is on the eTA-required list; stay, validity and CAD 7 fee from the eTA pages",
    lastReviewed: R,
    overrides: [
      {
        residence: ["US"],
        category: "visa-free",
        note: "Lawful permanent residents of the United States are exempt from the eTA requirement (Government of Canada). Check which documents Canada requires you to carry.",
      },
    ],
  },

  // Oceania
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    base: "eta",
    days: 90,
    fee: "Free for the eVisitor visa; AUD 20 service charge to use the ETA app",
    note: "A visa is needed before you fly, but Italy is eligible for both the free eVisitor (subclass 651, applied for online) and the ETA (subclass 601, via the Australian ETA app). Each lets you visit as often as you like within 12 months, staying up to 3 months each time you enter.",
    source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651",
    sourceLabel: "Australian Department of Home Affairs — eVisitor (651); ETA (601) page at immi.homeaffairs.gov.au for the AUD 20 app charge",
    lastReviewed: R,
  },

  // East Asia
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    region: "East Asia",
    base: "visa-free",
    days: 90,
    note: "Italy is on Japan's list of countries and regions with a reciprocal visa exemption for short-term stays, and the period of stay granted is 90 days. To stay longer than 90 days you must apply to the Regional Immigration Bureau for an extension before your permitted stay ends. Work or longer stays need the right status.",
    source: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html",
    sourceLabel: "Ministry of Foreign Affairs of Japan — Exemption of Visa (Short-Term Stay)",
    lastReviewed: R,
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    region: "East Asia",
    base: "visa-free",
    fee: "USD 7 to 8 if you choose to apply for a K-ETA voluntarily",
    note: "Visa-free for short stays; paid or income-earning activity needs a C-4 visa. Italy is temporarily exempt from K-ETA from 1 Jan to 31 Dec 2026 (the K-ETA form shows 'K-ETA Exempt'). After 31 Dec 2026 a K-ETA is normally required before departure unless the exemption is extended. A voluntary K-ETA can replace the arrival card.",
    source: "https://overseas.mofa.go.kr/it-it/brd/m_8792/view.do?seq=760827",
    sourceLabel: "Embassy of the Republic of Korea in Italy (Ministry of Foreign Affairs of Korea) — notice on short-stay visa-exempt citizens and K-ETA, 23 Dec 2025",
    lastReviewed: R,
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    region: "East Asia",
    base: "visa-free",
    days: 30,
    note: "Until 24:00 on 31 Dec 2026, holders of an Italian ordinary passport can enter visa-free for up to 30 days for business, tourism, family or friend visits, exchanges and visits, or transit. Other purposes or other passport types need a visa in advance. Check the policy again if you travel after 31 Dec 2026.",
    source: "https://it.china-embassy.gov.cn/ita/lstz/202512/t20251222_11780590.htm",
    sourceLabel: "Embassy of the People's Republic of China in Italy — notice on extending the visa exemption policy (22 Dec 2025)",
    lastReviewed: R,
  },
  {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "East Asia",
    base: "visa-free",
    days: 90,
    note: "Italy is on the Immigration Department's list of countries whose nationals can visit Hong Kong without a visa for up to 90 days. The exemption is for visits: other purposes, such as work or study, need the right visa or entry permit before you travel.",
    source: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    sourceLabel: "Immigration Department, Hong Kong SAR Government — visit visa / entry permit requirements",
    lastReviewed: R,
  },

  // Southeast Asia
  {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    base: "visa-free",
    days: 45,
    note: "Vietnam waives visas for Italian citizens for 45 days from the date of entry, whatever the passport type or purpose of entry, from 15 Mar 2025 to 14 Mar 2028 (Resolution No. 44/NQ-CP). You must meet Vietnam's normal entry conditions. For longer stays apply for an e-visa or another visa type.",
    source: "https://en.baochinhphu.vn/viet-nam-waives-visas-for-citizens-from-12-countries-until-march-2028-111250308085955058.htm",
    sourceLabel: "Government of Viet Nam — official government news portal (baochinhphu.vn)",
    lastReviewed: R,
  },

  // Middle East
  {
    code: "TR",
    name: "Türkiye",
    flag: "🇹🇷",
    region: "Middle East",
    base: "visa-free",
    days: 90,
    note: "Italian ordinary and official passport holders are exempt from the visa for stays of up to 90 days. Longer stays, work or study need the right visa or permit obtained beforehand.",
    source: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
    sourceLabel: "Ministry of Foreign Affairs of the Republic of Türkiye — visa information for foreigners",
    lastReviewed: R,
  },
];
