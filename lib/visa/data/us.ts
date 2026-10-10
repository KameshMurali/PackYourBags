// American (United States) passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page: the
// destination's own immigration authority, foreign ministry, embassy or consulate, official
// e-visa/ETA portal, or an EU institution for the Schengen area. The US State Department's
// travel.state.gov country pages sit behind a bot check that cannot be passed by automated tools,
// so every record cites the destination government's own page instead. A destination that could
// not be confirmed from an official page is deliberately absent: the app then shows an honest
// "not yet verified" card instead of a guess.
// Fees, processing times and stay lengths are included only where an official page states them.
// No overrides: none of the cited pages states an easier rule for holders of another country's visa
// or residence permit, or for UAE residents.

import type { DestinationRule } from "../types";

const R = "2026-10-10";

export const UNITED_STATES_DESTINATIONS: DestinationRule[] = [
  // North America
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    base: "visa-free",
    note: "US citizens need neither a visa nor an eTA, whether they arrive by air, land or sea. Carry proper identification such as a valid US passport. Lawful permanent residents of the US are also exempt from the eTA but must show their passport and green card.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/eligibility.html",
    sourceLabel: "Immigration, Refugees and Citizenship Canada (canada.ca) — eTA eligibility",
    lastReviewed: R,
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    region: "North America",
    base: "visa-free",
    days: 180,
    note: "No visa for visits of up to 180 days without paid activities (tourism, business, study). You need a passport valid for your whole stay and a completed Multiple Migratory Form (FMM), which the airline or the border post gives you. Officers may ask for documents showing the purpose of your trip.",
    source: "https://consulmex.sre.gob.mx/leamington/index.php/non-mexicans/visas/111-visitor-visa",
    sourceLabel: "Secretaría de Relaciones Exteriores of Mexico — Consulate of Mexico visa page (visitors who do not require a visa, up to 180 days)",
    lastReviewed: R,
  },

  // Europe
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-free",
    days: 90,
    note: "No visa for stays of up to 90 days in any 180-day period across the whole Schengen area. You can enter as many times as you like but may stay only 90 days in total in any 180. ETIAS is not yet in operation: the official ETIAS site says no applications are being collected and the EU will announce a start date several months ahead.",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R1806",
    sourceLabel: "Regulation (EU) 2018/1806, Annex II (EUR-Lex): United States exempt for 90 days in any 180; 90/180 rule from the European Commission; ETIAS status from the EU's official ETIAS website (travel-europe.europa.eu)",
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
    processingTime: "Usually within a day; up to 3 working days",
    note: "US citizens usually need a UK electronic travel authorisation (ETA) rather than a visa. It lasts 2 years or until your passport expires, lets you visit the UK, Jersey, Guernsey or the Isle of Man for up to 6 months, and does not guarantee entry. Apply only through the official GOV.UK page or the UK ETA app.",
    source: "https://www.gov.uk/eta",
    sourceLabel: "UK Government (GOV.UK) — Electronic travel authorisation (ETA)",
    lastReviewed: R,
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    region: "Europe",
    base: "visa-free",
    days: 90,
    note: "US citizens are not visa-required. The Immigration Officer stamps your passport on arrival with how long you may stay, and staying beyond 90 days needs permission from the immigration authorities. Ireland is outside Schengen, so Schengen days do not count here. Be ready to show accommodation and return travel.",
    source: "https://www.irishimmigration.ie/visa-non-visa-required-nationalities/",
    sourceLabel: "Irish Immigration Service Delivery (visa and non-visa required nationalities); 90-day rule from the Department of Foreign Affairs of Ireland (ireland.ie)",
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
    note: "The US is on Japan's list of countries exempt from the visa requirement for short-term stays, and the period of stay granted on landing is 90 days. Work, study or longer stays need the right visa or status arranged in advance.",
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
    days: 90,
    note: "No visa for up to 90 days for tourism, business meetings, conferences or visiting family; extension of stay is not permitted. US citizens are temporarily exempt from the K-ETA until 31 Dec 2026; after that date a K-ETA is normally required unless Korea extends the exemption again.",
    source: "https://overseas.mofa.go.kr/us-newyork-en/wpge/m_23502/contents.do",
    sourceLabel: "Consulate General of the Republic of Korea in New York (Ministry of Foreign Affairs); K-ETA exemption to 31 Dec 2026 from the official K-ETA website (k-eta.go.kr)",
    lastReviewed: R,
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    region: "East Asia",
    base: "visa-required",
    fee: "USD 140 (single entry; reduced fee for US citizens until 31 Dec 2026; express service +USD 25)",
    note: "The US is not on China's unilateral 30-day visa-free list (National Immigration Administration, as of 17 Feb 2026), so you need a visa before you go. Exceptions: 240-hour visa-free transit through 65 ports with an onward ticket to a third country, and 30-day visa-free entry to Hainan only.",
    source: "https://en.nia.gov.cn/n147418/n147463/c183390/content.html",
    sourceLabel: "National Immigration Administration of China (unilateral visa exemption list; transit and Hainan policies); fee from the Consulate General of China in New York",
    lastReviewed: R,
  },
  {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "East Asia",
    base: "visa-free",
    days: 90,
    note: "US passport holders (other than diplomatic passports) can visit Hong Kong without a visa for up to 90 days. To work, study, set up or join a business, or take up residence you need a visa or entry permit.",
    source: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    sourceLabel: "Hong Kong Immigration Department — Visit Visa / Entry Permit Requirements",
    lastReviewed: R,
  },
  {
    code: "TW",
    name: "Taiwan",
    flag: "🇹🇼",
    region: "East Asia",
    base: "visa-free",
    days: 90,
    note: "Visa-exempt entry for up to 90 days; the stay cannot be extended. US nationals need a passport valid for the whole intended stay, a confirmed return or onward ticket (or a visa for the next destination), and must not be found ineligible by immigration officers at the port of entry.",
    source: "https://www.boca.gov.tw/cp-149-4486-7785a-2.html",
    sourceLabel: "Bureau of Consular Affairs, Ministry of Foreign Affairs of Taiwan — Visa-Exempt Entry",
    lastReviewed: R,
  },

  // Southeast Asia
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "visa-free",
    note: "The US is not on Singapore's list of countries whose travellers need an entry visa. Immigration officers decide the length of stay and issue it as an electronic Visit Pass. Submit the SG Arrival Card (not a visa) online within 3 days before you arrive. Your passport must be valid for at least 6 months.",
    source: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore",
    sourceLabel: "Immigration & Checkpoints Authority of Singapore (ICA) — Entering Singapore and visa requirements",
    lastReviewed: R,
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "Under Thailand's revised scheme (Cabinet, 19 May 2026) US citizens get 30 days visa-free for tourism only; the old 60-day exemption was revoked. Work or other purposes need a visa through Thailand's e-Visa system. Complete the Thailand Digital Arrival Card (TDAC) online before you arrive.",
    source: "https://image.mfa.go.th/mfa/0/wdW3FTtVMc/2026-05-22/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%97%E0%B8%9A%E0%B8%97%E0%B8%A7%E0%B8%99%E0%B8%A1%E0%B8%B2%E0%B8%95%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A3_ver._eng.pdf",
    sourceLabel: "Ministry of Foreign Affairs of Thailand — Revision of Thailand's visa exemption and VoA schemes, 2026 (30-day list); TDAC from the Thai Immigration Bureau (tdac.immigration.go.th)",
    lastReviewed: R,
  },
  {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    base: "evisa",
    days: 90,
    note: "US citizens are not on Vietnam's visa-exemption lists, so get an e-visa before you travel from the official portal (evisa.gov.vn) or a visa from a Vietnamese embassy. An e-visa is valid for up to 90 days, and its validity must end at least 30 days before your passport expires.",
    source: "https://evisa.gov.vn/faq",
    sourceLabel: "Immigration Department, Ministry of Public Security of Vietnam (official e-visa portal); exemption lists from the Vietnam National Authority of Tourism (vietnam.travel)",
    lastReviewed: R,
  },
];
