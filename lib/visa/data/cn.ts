// Chinese (People's Republic of China, mainland) passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-11 against an official government page (immigration
// authority, foreign ministry, embassy or consulate, or official e-visa portal), including China's
// own Ministry of Foreign Affairs consular pages and Chinese embassy and consulate notices. A
// destination that could not be confirmed from an official page is deliberately absent: the app then
// shows an honest "not yet verified" card with the country's official link instead of a guess.
// Fees, processing times and stay lengths are included only where the cited page states them.
// Hong Kong, Macau and Taiwan are not visa matters for mainland residents: they need a travel permit
// (and, for Taiwan, an entry permit), recorded here as "visa-required" with the permit named in the note.
// Time-limited arrangements (Russia, Brazil) say when they end: re-check before booking.

import type { DestinationRule } from "../types";

const R = "2026-10-11";
const MFA_TABLE =
  "https://cs.mfa.gov.cn/zggmcgx/cgqzapecswlxk/ylb/202607/t20260716_11984014.html";

export const CHINA_DESTINATIONS: DestinationRule[] = [
  // East Asia
  {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "East Asia",
    base: "visa-required",
    note: "No visa, but Mainland residents need an Exit-Entry Permit for Travelling to and from Hong Kong and Macao (往来港澳通行证) with a valid exit endorsement: group tour (L) or, where offered, individual visit (G). The stay follows the endorsement; Mainland tourism endorsements allow up to 7 days per visit.",
    source: "https://www.immd.gov.hk/eng/services/visas/overseas-chinese-entry-arrangement.html",
    sourceLabel:
      "Immigration Department, Hong Kong SAR (entry arrangements for Mainland residents); endorsement types and 7-day tourism stay from China's National Immigration Administration (nia.gov.cn)",
    lastReviewed: R,
  },
  {
    code: "MO",
    name: "Macau",
    flag: "🇲🇴",
    region: "East Asia",
    base: "visa-required",
    note: "No visa, but Mainland residents need a Two-way Exit Permit (往来港澳通行证) with a valid exit endorsement for Macao. The permitted stay is the period shown on the endorsement, up to 90 days; Mainland tourism endorsements allow up to 7 days per visit.",
    source: "https://www.gov.mo/en/services/ps-1474/ps-1474b/",
    sourceLabel:
      "Macao SAR Government Portal — immigration clearance of non-residents (Public Security Police); 7-day tourism stay from China's National Immigration Administration (nia.gov.cn)",
    lastReviewed: R,
    aliases: ["Macao"],
  },
  {
    code: "TW",
    name: "Taiwan",
    flag: "🇹🇼",
    region: "East Asia",
    base: "visa-required",
    note: "Mainland residents don't use a visa. For individual tourism they need an Exit-Entry Permit for Travelling to and from Taiwan (valid 6+ months, with an individual-tourism endorsement), a Taiwan entry/exit permit applied for through an approved Taiwan travel agency, and a return ticket. Stay: 15 days from the day after entry, 120 days a year at most.",
    source: "https://www.immigration.gov.tw/5385/7244/7250/7257/7266/36078/",
    sourceLabel:
      "National Immigration Agency, Taiwan (R.O.C.) — online application notice for Mainland Area people visiting as individual tourists; document checklist and stay limits also from its Q&A for Mainland Area people",
    lastReviewed: R,
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    region: "East Asia",
    base: "visa-required",
    note: "Visa required before travel. Residents of China apply through an accredited Chinese travel agency: tourist visas are single-entry for 15 or 30 days (some multiple-entry types exist) and are issued electronically. Chinese nationals living outside China apply at the Japanese mission covering where they live.",
    source: "https://www.mofa.go.jp/j_info/visit/visa/topics/china.html",
    sourceLabel:
      "Ministry of Foreign Affairs of Japan — visa information for Chinese nationals; electronic visa rules from its JAPAN eVISA page (15 May 2026)",
    lastReviewed: R,
    overrides: [
      {
        residence: ["AE"],
        category: "evisa",
        days: 90,
        note: "Foreign nationals residing in the UAE can get a JAPAN eVISA for tourism (single entry, up to 90 days) through an accredited agency there. Air or sea arrival only; an interview may be requested (MOFA Japan, 15 May 2026).",
      },
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    region: "East Asia",
    base: "visa-required",
    note: "Chinese ordinary passports need a visa to visit Korea. Visa-free options are narrow and conditional: the Jeju Island policy, transit programmes for people continuing to a third country, and designated group-tour schemes run through approved agencies. Confirm the current terms with the Korean Embassy or an approved agency.",
    source: "https://overseas.mofa.go.kr/cn-guangzhou-zh/wpge/m_96/contents.do",
    sourceLabel:
      "Ministry of Foreign Affairs of the Republic of Korea — Consulate General in Guangzhou, guide to visa-free entry to Korea",
    lastReviewed: R,
    aliases: ["Korea", "Seoul", "Jeju"],
  },
  {
    code: "MN",
    name: "Mongolia",
    flag: "🇲🇳",
    region: "East Asia",
    base: "evisa",
    days: 30,
    processingTime: "Within 48 hours",
    note: "Chinese citizens are not on Mongolia's visa-exempt list but are eligible for its e-visa: K2 (tourism) or K4 (sports and cultural activities) for up to 30 days, or a 10-day K6 for transit. Apply at evisa.mn; the approved ETA is emailed to you.",
    source: "https://immigration.gov.mn/en/articles/264/",
    sourceLabel:
      "Immigration Agency of Mongolia — list of countries eligible for e-visa (China listed); evisa.mn nationality list checked",
    lastReviewed: R,
  },

  // Southeast Asia
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 1 Mar 2024: up to 30 days per stay and 90 days in any 180; not for work, study or media activity. It still applies after Thailand dropped its 60-day scheme on 15 Sep 2026. Fill in the free Thailand Digital Arrival Card (tdac.immigration.go.th) within 3 days before arrival, and carry an onward ticket, accommodation proof and funds.",
    source: "https://mfa.go.th/en/content/thcn280124?cate=5d5bcb4e15e39c306000683e",
    sourceLabel:
      "Ministry of Foreign Affairs of Thailand (agreement terms); entry reminders from the Chinese Embassy in Thailand (Jun and Sep 2026) and the Thai Immigration Bureau (TDAC)",
    lastReviewed: R,
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "Visa-free for up to 30 days on a PRC ordinary passport since 9 Feb 2024. Submit the free SG Arrival Card with health declaration online within 3 days before arrival; it is not a visa.",
    source:
      "https://www.ica.gov.sg/news-and-publications/newsroom/media-release/mutual-30-day-visa-exemption-arrangement-between-singapore-and-the-people-s-republic-of-china",
    sourceLabel:
      "Immigration & Checkpoints Authority, Singapore (media release of 25 Jan 2024); SG Arrival Card rules from the ICA website",
    lastReviewed: R,
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Southeast Asia",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 17 Jul 2025: up to 30 days per entry and 90 days in any 180, for tourism, visiting family or friends, business, personal affairs or medical treatment. Passport valid 6+ months. Complete the Malaysia Digital Arrival Card (MDAC) at least 3 days before arrival and carry a return or onward ticket and proof of accommodation.",
    source: "https://www.imi.gov.my/wp-content/uploads/2022/01/21OKT_FAQs-MYS-CHINA_LULUS.pdf",
    sourceLabel:
      "Immigration Department of Malaysia — FAQs on the Malaysia–China mutual visa exemption agreement",
    lastReviewed: R,
  },
  {
    code: "ID",
    name: "Indonesia",
    flag: "🇮🇩",
    region: "Southeast Asia",
    base: "visa-on-arrival",
    days: 30,
    fee: "IDR 500,000",
    note: "Chinese citizens can get a 30-day tourist visa on arrival (B1), extendable once for 30 more days; the e-VOA can also be bought online (evisa.imigrasi.go.id). Passport valid 6+ months and a return or onward ticket are required. Submit the arrival card (allindonesia.imigrasi.go.id) within 3 days before arrival.",
    source: "https://www.imigrasi.go.id/berita/2022/07/20/how-to-get-visa-on-arrival-in-indonesia?lang=en-US",
    sourceLabel:
      "Directorate General of Immigration, Indonesia (visa on arrival guide, China listed; fee and extension); e-VOA and arrival card rules from its official e-Visa portal (evisa.imigrasi.go.id)",
    lastReviewed: R,
    aliases: ["Bali"],
  },
  {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    base: "evisa",
    days: 90,
    fee: "USD 25 (single entry) or USD 50 (multiple entry)",
    note: "Chinese citizens are not on Vietnam's visa-exempt lists, so a visa is required. The official e-visa is open to all nationalities, valid up to 90 days for single or multiple entry, and must be used at the international airports and land and sea border gates designated by the government.",
    source: "https://vietnam.travel/plan-your-trip/visa-requirements",
    sourceLabel:
      "Vietnam National Authority of Tourism (visa-exempt lists and e-visa policy); fee and validity from the Immigration Department's e-visa portal (evisa.gov.vn)",
    lastReviewed: R,
  },
  {
    code: "KH",
    name: "Cambodia",
    flag: "🇰🇭",
    region: "Southeast Asia",
    base: "visa-on-arrival",
    days: 30,
    fee: "USD 30 (tourist visa)",
    note: "Chinese ordinary passports are not visa-exempt (the exemption is for diplomatic and service passports). A 30-day tourist visa (T) can be bought on arrival at airports and land borders, or as an e-Visa (3 business days). Passport valid 6+ months. Everyone must also submit the free e-Arrival card (arrival.gov.kh) within 7 days before arrival.",
    source: "https://www.tourismcambodia.com/tripplanner/essential-information/visa-passport.htm",
    sourceLabel:
      "Ministry of Tourism of Cambodia; e-Visa and e-Arrival details from the Ministry of Foreign Affairs and International Cooperation e-Visa portal (evisa.gov.kh)",
    lastReviewed: R,
  },
  {
    code: "LA",
    name: "Laos",
    flag: "🇱🇦",
    region: "Southeast Asia",
    base: "visa-on-arrival",
    days: 30,
    fee: "USD 20 on arrival (e-visa USD 35 plus bank charges)",
    note: "Chinese ordinary passports are not visa-exempt. A 30-day visa on arrival costs USD 20 for Chinese citizens at designated checkpoints (not currently at Boten railway station); passport valid 6+ months. The Lao Foreign Ministry's e-visa (laoevisa.gov.la) costs USD 35 plus bank charges and takes about 3 working days.",
    source: "https://luangprabang.china-consulate.gov.cn/lsfw/flwxz/",
    sourceLabel:
      "Consulate-General of China in Luang Prabang (entry guidance of 7 Jan 2026); e-visa fee and processing time from the Lao Ministry of Foreign Affairs eVisa portal (laoevisa.gov.la)",
    lastReviewed: R,
    aliases: ["Lao PDR"],
  },
  {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 14,
    note: "Since 16 Jan 2026 Chinese nationals can enter visa-free for 14 days (tourism or business, non-extendable), only via Manila (NAIA) or Mactan-Cebu airports. Need a passport valid 6+ months, a confirmed hotel booking, a return or onward ticket and no derogatory immigration record. Transit needs a visa. With a valid US, Schengen, Japan, Australia or Canada visa you can instead get 7 days at any port.",
    source: "https://evisa.gov.ph/page/policy",
    sourceLabel:
      "Department of Foreign Affairs of the Philippines — eVisaPH portal (visa policy for Chinese nationals)",
    lastReviewed: R,
  },

  // South Asia
  {
    code: "MV",
    name: "Maldives",
    flag: "🇲🇻",
    region: "South Asia",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 20 May 2022, generally for stays of up to 30 days; the Maldives issues the tourist visa on arrival with no pre-approval. Need a passport valid 1+ month, a return ticket, a prepaid booking at a registered facility and enough funds, plus the free Traveller Declaration within 96 hours before arrival.",
    source: MFA_TABLE,
    sourceLabel:
      "Ministry of Foreign Affairs of China — table of mutual visa exemption agreements (updated 29 May 2026); entry requirements from Maldives Immigration (tourist visa on arrival)",
    lastReviewed: R,
  },
  {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    region: "South Asia",
    base: "eta",
    days: 30,
    fee: "Free of charge",
    note: "Everyone needs an ETA before arrival. China is on Sri Lanka's list of 40 nationalities whose 30-day tourist ETA is free from 25 May 2026, with double entry within the 30 days. Staying longer needs a paid extension.",
    source:
      "https://www.immigration.gov.lk/content/files/visa/Free%20Tourist%20Visas%20for%20Nationals%20of%2040%20Selected%20Countries.pdf",
    sourceLabel:
      "Department of Immigration & Emigration, Sri Lanka — special notice to short-term visitors (free ETA for 40 countries)",
    lastReviewed: R,
  },

  // Central Asia
  {
    code: "KZ",
    name: "Kazakhstan",
    flag: "🇰🇿",
    region: "Central Asia",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 10 Nov 2023: up to 30 days per stay and 90 days in any 180, for private affairs, business, tourism, medical treatment or transit. Work and study are not covered, and the stay cannot be extended.",
    source: "https://www.mfa.gov.cn/wjbzwfwpt/kzx/tzgg/202311/t20231103_11172619.html",
    sourceLabel:
      "Ministry of Foreign Affairs of China — consular notice on the China–Kazakhstan visa exemption agreement; entry tips from the Chinese Consulate-General in Almaty (Jul 2025)",
    lastReviewed: R,
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    flag: "🇺🇿",
    region: "Central Asia",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 1 Jun 2025: up to 30 days per visit and 90 days in any 180. It does not cover work, study or media activity. Foreigners staying more than 3 days in total must register their residence.",
    source: "https://gov.uz/en/mfa/news/view/53659",
    sourceLabel:
      "Ministry of Foreign Affairs of Uzbekistan (gov.uz); registration rule from the Chinese Embassy in Uzbekistan Q&A (May 2025)",
    lastReviewed: R,
  },

  // Caucasus
  {
    code: "GE",
    name: "Georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    base: "visa-free",
    days: 30,
    note: "Citizens of the People's Republic of China may enter and stay in Georgia without a visa for 30 days for tourism only (Georgian Foreign Ministry, since 11 Sep 2023). A bilateral visa-exemption agreement for ordinary passports has also been in force since 28 May 2024 (China's Foreign Ministry).",
    source: "https://china.mfa.gov.ge/en/important-information",
    sourceLabel:
      "Embassy of Georgia in China (Ministry of Foreign Affairs of Georgia); agreement date from the Ministry of Foreign Affairs of China",
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
    note: "Ordinary-passport holders from the People's Republic of China are exempt from visa for up to 90 days in any 180-day period as of 2 January 2026. Longer stays, or work and study, are not covered.",
    source: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa",
    sourceLabel: "Ministry of Foreign Affairs of Türkiye — visa information for foreigners",
    lastReviewed: R,
    aliases: ["Istanbul"],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    base: "visa-free",
    days: 90,
    note: "Chinese ordinary passports valid 6+ months can enter visa-free, with a total stay of up to 90 days in any 180-day period (UAE policy change relayed by the Chinese Embassy in the UAE in April 2025). The 180 days count from your first entry, and each day over 90 costs a fine of AED 50.",
    source: "https://wb.beijing.gov.cn/home/wswm/crjxx/qzxx/qztz/202504/t20250414_4063864.html",
    sourceLabel:
      "Beijing Municipal Foreign Affairs Office, republishing the notice of the Chinese Embassy in the UAE and Consulate-General in Dubai (11 Apr 2025); mutual exemption in force since 16 Jan 2018 per China's Foreign Ministry",
    lastReviewed: R,
    aliases: ["Dubai", "Abu Dhabi"],
  },
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    region: "Middle East",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption for Chinese ordinary passports in force since 21 Dec 2018; stays under these agreements are generally limited to 30 days. Visit Qatar lists China as visa-free: passport valid 3+ months and a confirmed hotel booking on arrival.",
    source: MFA_TABLE,
    sourceLabel:
      "Ministry of Foreign Affairs of China — table of mutual visa exemption agreements (updated 29 May 2026); entry conditions from Qatar Tourism (visitqatar.com)",
    lastReviewed: R,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    region: "Middle East",
    base: "evisa",
    days: 90,
    note: "China (including Hong Kong and Macau) is on Saudi Arabia's eligible list for the tourist eVisa at visa.visitsaudi.com: one year, multiple entry, up to 90 days in the country. It covers tourism, family visits and Umrah (not Hajj), but not study or work.",
    source: "https://visa.visitsaudi.com/",
    sourceLabel: "Saudi Tourism Authority — official Saudi eVisa portal (visa.visitsaudi.com)",
    lastReviewed: R,
  },

  // Europe
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    region: "Europe",
    base: "visa-free",
    days: 30,
    note: "Temporary visa-free regime for Chinese ordinary passports, extended on 20 Jul 2026 to 31 Dec 2027 (Executive Orders No. 872 and No. 499). Up to 30 days for guest or business visits, tourism, scientific, cultural or sports events, or transit. Work, study and similar purposes need a visa. Re-check the end date before booking.",
    source: "https://kremlin.ru/acts/news/80315",
    sourceLabel:
      "President of Russia (kremlin.ru) — extension to 31 Dec 2027; 30-day terms from Executive Order No. 872 of 1 Dec 2025 on kremlin.ru; also notified by the Chinese Embassy in Russia (21 Jul 2026)",
    lastReviewed: R,
  },
  {
    code: "BY",
    name: "Belarus",
    flag: "🇧🇾",
    region: "Europe",
    base: "visa-free",
    days: 30,
    note: "Mutual visa exemption in force since 10 Aug 2018: up to 30 days per stay and no more than 90 days in a calendar year. Foreigners staying more than 10 days must register within 10 days of entry (hotels register guests automatically).",
    source: "https://mfa.gov.by/en/press/news_mfa/e662c863fe6990d4.html",
    sourceLabel:
      "Ministry of Foreign Affairs of Belarus (agreement news, Jul 2018); registration rule from the Chinese Embassy in Belarus (Apr 2023)",
    lastReviewed: R,
  },
  {
    code: "RS",
    name: "Serbia",
    flag: "🇷🇸",
    region: "Europe",
    base: "visa-free",
    days: 30,
    note: "No visa for visits of up to 30 days on a Chinese ordinary passport (mutual abolition of visas in force since 15 Jan 2017).",
    source: "https://www.mfa.gov.rs/en/citizens/travel-serbia/visa-regime/kina",
    sourceLabel:
      "Ministry of Foreign Affairs of Serbia — visa regime for entering Serbia (China); agreement date from China's Ministry of Foreign Affairs",
    lastReviewed: R,
  },
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-required",
    note: "A Schengen visa is required for short stays of up to 90 days in any 180-day period. China is in Annex I of EU Regulation 2018/1806, the list of third countries whose nationals need a visa to cross the EU's external borders.",
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
    note: "The People's Republic of China is on the UK visa national list: you need a visitor visa before you travel, tourism included. Hong Kong SAR and Macao SAR passport holders are exempt, but mainland Chinese passports are not.",
    source: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-visa-national-list",
    sourceLabel: "GOV.UK — Immigration Rules Appendix Visitor: visa national list",
    lastReviewed: R,
    aliases: ["London"],
  },

  // North Africa
  {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    region: "North Africa",
    base: "visa-on-arrival",
    note: "The Chinese Embassy in Egypt (1 Aug 2026) advises Chinese citizens to use Egypt's new digital visa on arrival: pre-register on the official online portal or app, or use VISA KIOSK machines at Cairo airport (pilot from 1 Aug 2026; paper visas stay valid). The notice gives no fee or stay length, so check both before travel.",
    source: "https://eg.china-embassy.gov.cn/lsfw/202608/t20260801_11996650.htm",
    sourceLabel:
      "Embassy of China in Egypt — consular notice on Egypt's digital visa on arrival (1 Aug 2026)",
    lastReviewed: R,
  },
  {
    code: "MA",
    name: "Morocco",
    flag: "🇲🇦",
    region: "North Africa",
    base: "visa-free",
    days: 90,
    note: "China is on Morocco's list of nationalities exempt from an entry visa. The Chinese Embassy gives the limit as 90 days; carry a passport valid 6+ months, a return ticket, a hotel booking (or other proof of address) and enough cash.",
    source:
      "https://www.consulat.ma/index.php/en/list-countries-whose-citizens-are-exempted-entry-visa-morocco",
    sourceLabel:
      "Ministry of Foreign Affairs of Morocco (consular services list of visa-exempt countries); 90-day limit and entry documents from the Chinese Embassy in Morocco (Mar 2024)",
    lastReviewed: R,
  },

  // East Africa
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    base: "eta",
    fee: "From USD 30 (expedited processing +USD 100)",
    processingTime: "Normally up to 72 hours (3 business days)",
    note: "Every visitor needs an approved Kenya eTA before the journey. Chinese ordinary passports are not exempt (only diplomatic, official and service passports, for up to 30 days). Have a passport valid 6+ months, an itinerary, an accommodation booking and a payment card ready.",
    source: "https://etakenya.go.ke/how-to-apply",
    sourceLabel:
      "Directorate of Immigration Services, Kenya (eTA portal); fee and processing time from its FAQs",
    lastReviewed: R,
  },

  // Southern Africa
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    region: "Southern Africa",
    base: "eta",
    days: 90,
    processingTime: "Typically within 24 hours",
    note: "China is one of the visa-required markets served by South Africa's new online ETA (launched 12 Aug 2026), for tourism of up to 90 days. It works only for arrivals at OR Tambo, Cape Town, Lanseria and King Shaka airports; other ports need a visa from a South African mission. Without a valid visa or ETA you may be denied boarding.",
    source: "https://eta.dha.gov.za/faq",
    sourceLabel:
      "Department of Home Affairs, South Africa — official ETA portal (eta.dha.gov.za); China as an initial ETA market from SAnews (12 Aug 2026)",
    lastReviewed: R,
  },

  // North America
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    region: "North America",
    base: "visa-required",
    note: "China is not on the Visa Waiver Program list, so ESTA is not available: you need a US visa (for tourism, normally a B-2) before you travel.",
    source: "https://www.dhs.gov/visa-waiver-program",
    sourceLabel: "U.S. Department of Homeland Security — Visa Waiver Program",
    lastReviewed: R,
    aliases: ["USA", "America"],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    base: "visa-required",
    note: "IRCC lists China among visa-required countries. Chinese citizens are not on its list of visa-required countries whose citizens may use an eTA instead (that route needs a valid US non-immigrant visa or a Canadian visitor visa from the last 10 years), so apply for a visitor visa.",
    source:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html",
    sourceLabel:
      "Immigration, Refugees and Citizenship Canada — entry requirements by country (modified 31 Jul 2026); eTA eligibility for select visa-required countries",
    lastReviewed: R,
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    region: "North America",
    base: "visa-required",
    note: "A Mexican visa is required, and the e-visa is not open to Chinese citizens. You do not need one if you hold a valid multiple-entry visa from, or permanent residence in, the US, Canada, Japan, the UK or a Schengen state (or Pacific Alliance permanent residence, or an approved APEC card).",
    source: "https://consulmex.sre.gob.mx/shanghai/index.php/english/visa-information",
    sourceLabel:
      "Consulate General of Mexico in Shanghai (Secretaría de Relaciones Exteriores) — visa information",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US", "CA", "JP", "UK", "SCHENGEN"],
        residence: ["US", "CA", "JP", "UK", "SCHENGEN"],
        category: "visa-free",
        note: "A valid multiple-entry visa from, or permanent residence in, the US, Canada, Japan, the UK or a Schengen state replaces the Mexican visa (an approved APEC card or Pacific Alliance permanent residence also works). Some airlines require the visa to have been used once to enter the issuing country.",
      },
    ],
  },

  // South America
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    region: "South America",
    base: "visa-free",
    days: 30,
    note: "Temporary visa waiver for Chinese ordinary passports from 11 May 2026 to 31 Dec 2026: up to 30 days, non-extendable, multiple entries allowed but no more than 30 days in total per migration year. Covers tourism, business, transit and artistic or sports activities, not work. Longer stays need a visa via e-Consular. Check the end date before booking.",
    source:
      "https://www.gov.br/mre/pt-br/consulado-toquio/english/news/new-visa-rules-for-chinese-citizens",
    sourceLabel:
      "Ministry of Foreign Affairs of Brazil (Itamaraty) — consular notice on visa rules for Chinese citizens, 12 May 2026",
    lastReviewed: R,
    aliases: ["Brasil", "Rio de Janeiro", "São Paulo"],
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    region: "South America",
    base: "visa-required",
    note: "A consular visa is required for Chinese citizens, except those holding a valid US visa (B1/B2, B2, J, B1, O, P, E or H-1B) or US permanent residence.",
    source: "https://echin.cancilleria.gob.ar/es/visas-y-exenciones",
    sourceLabel:
      "Embassy of Argentina in China (Ministry of Foreign Affairs) — visas and exemptions, updated 16 Mar 2026",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US"],
        residence: ["US"],
        category: "visa-free",
        days: 30,
        note: "Chinese ordinary-passport holders with a valid US visa in the B1/B2, B2, J, B1, O, P, E or H-1B category, or US permanent residence, may enter for tourism or business without an Argentine visa or AVE, for up to 30 days.",
      },
    ],
  },
  {
    code: "PE",
    name: "Peru",
    flag: "🇵🇪",
    region: "South America",
    base: "visa-required",
    note: "A Peruvian visa is required for tourism, business or transit. Exception: with a valid US, Canadian, UK, Australian or Schengen visa, or permanent residence there, you can enter without a Peruvian visa for up to 180 days. The passport and that visa must both be valid for 6+ months on entry.",
    source: "https://pe.china-embassy.gov.cn/mlgk/202607/t20260717_11984582.htm",
    sourceLabel:
      "Embassy of China in Peru — entry guide for Chinese citizens (Jul 2026)",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US", "CA", "UK", "AU", "SCHENGEN"],
        residence: ["US", "CA", "UK", "AU", "SCHENGEN"],
        category: "visa-free",
        days: 180,
        note: "A US, Canadian, UK, Australian or Schengen visa, or permanent residence there, lets Chinese ordinary-passport holders enter Peru without a Peruvian visa for up to 180 days. The passport and that visa must both have 6+ months of validity left on entry.",
      },
    ],
  },

  // Oceania
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    base: "visa-required",
    fee: "From AUD 250",
    note: "PRC passports are not on Australia's eligible list for the Electronic Travel Authority (601), so apply for a Visitor visa (subclass 600) from outside Australia: the tourist stream allows a stay of up to 12 months, and there is an Approved Destination Status stream for organised tours.",
    source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    sourceLabel:
      "Department of Home Affairs, Australia (Visitor visa 600; ETA 601 eligible passports)",
    lastReviewed: R,
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Oceania",
    base: "visa-required",
    fee: "From NZD 441",
    processingTime: "80% decided within about 2 weeks",
    note: "Chinese citizens apply for a Visitor Visa online: multiple-entry for up to 5 years (up to 6 months in each 12 months) or single-entry (up to 9 months in an 18-month period). Applicants in mainland China, Hong Kong or Macau also complete a supplementary form.",
    source:
      "https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/application-guide-for-visitor-visas-for-citizens-of-china/",
    sourceLabel:
      "Immigration New Zealand — application guide for visitor visas for citizens of China",
    lastReviewed: R,
  },
];
