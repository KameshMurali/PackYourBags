// Indian passport (ordinary): additional destinations beyond the original set in ./in.ts.
// Indicative only — every record links to its source. Merged into DATASETS.IN.
//
// Added 2026-10-08 under the same policy as ./in.ts: a record stays only when an official
// government source (immigration authority, foreign ministry, embassy, official e-visa portal or
// India's MEA) confirms it. Not added because the rule could not be confirmed from a readable
// official page: Saudi Arabia, Kuwait, Israel, Taiwan, Laos, Kyrgyzstan, Rwanda.

import type { DestinationRule } from "../types";

const R = "2026-10-08";

export const INDIA_EXTRA_DESTINATIONS: DestinationRule[] = [
  // East Asia
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    region: "East Asia",
    base: "visa-required",
    note: "Visa required; India is not on China's visa-free lists. Apply through the Chinese Visa Application Service Centre in India; the online application system for the form and uploads has been live since 22 December 2025. First-time applicants are generally issued a single-entry visa.",
    source: "https://in.china-embassy.gov.cn/eng/lsfw/qz/",
    sourceLabel: "Embassy of the People's Republic of China in India",
    lastReviewed: R,
  },
  {
    code: "MO",
    name: "Macau",
    flag: "🇲🇴",
    region: "East Asia",
    base: "visa-free",
    days: 30,
    note: "India is on Macao's list of visa-exempt nationalities: up to 30 days on arrival. Needs a passport valid 90+ days beyond your stay, an onward or return ticket, and proof of funds (MOP 5,000 for up to 7 days, MOP 10,000 for 8-14 days, MOP 15,000 for 15-21 days, MOP 20,000 beyond).",
    source: "https://www.gov.mo/en/services/ps-1474/ps-1474b/",
    sourceLabel: "Macao SAR Government — Public Security Police Force",
    lastReviewed: R,
  },

  // Central Asia / Caucasus
  {
    code: "UZ",
    name: "Uzbekistan",
    flag: "🇺🇿",
    region: "Central Asia",
    base: "evisa",
    fee: "USD 20",
    note: "Apply for an e-visa at e-visa.gov.uz (USD 20), at least 3 working days before travel. Indian passports also qualify for a 5-day visa-free airport transit if you hold an air ticket to a third country (flight within 5 days of arrival).",
    source: "https://www.uzbekembassy.in/consular-section/",
    sourceLabel: "Embassy of Uzbekistan in India",
    lastReviewed: R,
  },
  {
    code: "AM",
    name: "Armenia",
    flag: "🇦🇲",
    region: "Caucasus",
    base: "evisa",
    note: "Visa required. Apply for an e-Visa at evisa.mfa.am with travel insurance plus either a return ticket, an invitation and proof of funds, or a valid visa or residence permit from the EU/Schengen states, USA, Australia, New Zealand, South Korea, UK, Canada, Russia or Japan (or residence in a GCC state). Processing takes about 3 working days.",
    source: "https://india.mfa.am/en/visaforindians/",
    sourceLabel: "Embassy of Armenia to India (Ministry of Foreign Affairs)",
    lastReviewed: R,
    overrides: [
      {
        visas: ["US", "SCHENGEN", "AU", "UK", "CA", "JP"],
        residence: ["US", "SCHENGEN", "AU", "UK", "CA", "JP", "AE"],
        category: "visa-on-arrival",
        note: "Visa at the border with a valid visa or residence permit from the EU/Schengen states, USA, Australia, New Zealand, South Korea, UK, Canada, Russia or Japan, or a residence permit (card or sticker) from the UAE, Saudi Arabia, Kuwait, Qatar, Bahrain or Oman.",
      },
      {
        residence: ["US", "SCHENGEN", "AE"],
        category: "visa-free",
        days: 180,
        note: "Temporary exemption from 1 July 2026 to 1 July 2027: visa-free for up to 180 days in a year with a residence permit from the US, an EU/Schengen state, the UAE, Bahrain, Qatar, Saudi Arabia, Kuwait or Oman, valid 6+ months on entry, shown as a physical card or sticker.",
      },
    ],
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    region: "Europe",
    base: "evisa",
    days: 30,
    note: "Unified single-entry e-visa: valid 120 days from issue, stay up to 30 days from entry. Apply on electronic-visa.kdmid.ru at least 4 calendar days before entry with a photo and a passport scan; a fee applies and no invitation or hotel proof is needed.",
    source: "https://warsaw.kdmid.ru/en/russian-visa/On%20the%20issuance%20of%20unified%20electronic%20visas/",
    sourceLabel: "Ministry of Foreign Affairs of Russia — unified e-visa (Consular Section, Embassy of Russia in Poland)",
    lastReviewed: R,
  },

  // Middle East
  {
    code: "BH",
    name: "Bahrain",
    flag: "🇧🇭",
    region: "Middle East",
    base: "evisa",
    note: "Apply for a visit eVisa on the official NPRA portal (evisa.gov.bh); India is on its eligible-countries list.",
    source: "https://www.evisa.gov.bh/list-of-online-visa-country.html",
    sourceLabel: "Nationality, Passports and Residence Affairs (NPRA), Bahrain — eVisa portal (visa on arrival: MEA)",
    lastReviewed: R,
    overrides: [
      {
        visas: ["AE", "UK", "US", "SCHENGEN"],
        residence: ["US"],
        category: "visa-on-arrival",
        note: "Visa on arrival (visit visa, 2 weeks single entry or 3 months multiple entry) for Indians holding a valid UAE, UK, US, Saudi (not Hajj or Umrah) or Schengen visit visa, or a US Green Card (MEA). NPRA says terms apply: check them before relying on it.",
      },
    ],
  },

  // Europe
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    region: "Europe",
    base: "visa-required",
    note: "Visa required: apply online (AVATS) for a Short Stay 'C' visa up to 3 months before travel. Indians living in India can use a British-Irish Visa Scheme visa for both Ireland and the UK. If you first enter the UK on a UK short-stay visa you may visit Ireland without a separate visa (Short Stay Visa Waiver Programme).",
    source: "https://www.irishimmigration.ie/coming-to-visit-ireland/short-stay-visa-waiver-programme/",
    sourceLabel: "Immigration Service Delivery, Ireland (FAQ: Coming to visit Ireland)",
    lastReviewed: R,
  },

  // Africa
  {
    code: "MA",
    name: "Morocco",
    flag: "🇲🇦",
    region: "North Africa",
    base: "evisa",
    days: 30,
    processingTime: "72 hours standard, 24 hours express (working days)",
    note: "Apply for the e-visa at acces-maroc.ma (tourism or business): single entry, valid up to 180 days, stay up to 30 days. Indian ordinary passports qualify (Category A) if valid for at least 90 days from the application date.",
    source: "https://www.acces-maroc.ma/assets/docs/Conditions%20utilisation%20eVisa%20-%20An.pdf",
    sourceLabel: "Kingdom of Morocco — eVisa portal (acces-maroc.ma)",
    lastReviewed: R,
  },
  {
    code: "ET",
    name: "Ethiopia",
    flag: "🇪🇹",
    region: "East Africa",
    base: "visa-on-arrival",
    days: 30,
    note: "Visa on arrival at Addis Ababa Bole airport (valid 30 days; passport valid 6+ months; fee payable), or an e-Tourist visa at evisa.gov.et, which usually takes about 3 working days (MEA).",
    source: "https://www.mea.gov.in/vffin",
    sourceLabel: "Ministry of External Affairs (India) — visa facility for Indian nationals",
    lastReviewed: R,
  },
];
