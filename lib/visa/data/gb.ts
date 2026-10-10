// British (United Kingdom) passport (ordinary). Indicative only — every record links to its source.
//
// Every record below was checked on 2026-10-10 against an official government page. For most
// destinations that is the UK Foreign, Commonwealth & Development Office's own "Entry requirements"
// guidance for British citizens on GOV.UK (https://www.gov.uk/foreign-travel-advice/<country>/entry-requirements);
// where the destination's own authority states a fee or stay length, the sourceLabel says so.
// A destination that could not be confirmed from an official page is deliberately absent: the app
// then shows an honest "not yet verified" card instead of a guess.
// Fees, processing times and stay lengths are included only where an official page states them.
// GOV.UK entry-requirements pages are for people travelling on a full "British citizen" passport.
// No overrides: none of the cited pages states an easier rule for holders of a US, Schengen,
// Canadian, Australian or Japanese visa, or for UAE residents, except the Canadian eTA exemption
// for US permanent residents.

import type { DestinationRule } from "../types";

const R = "2026-10-10";
const FCDO = "UK Foreign, Commonwealth & Development Office (GOV.UK travel advice)";

export const UNITED_KINGDOM_DESTINATIONS: DestinationRule[] = [
  // Europe
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-free",
    days: 90,
    note: "Visa-free for up to 90 days in any 180-day period across the whole Schengen area (tourism, family visits, business meetings, short study). Passport must be under 10 years old and valid 3+ months after you leave. EES biometric registration applies (free). ETIAS is not yet in operation: the EU says no applications are open and will announce a start date months ahead.",
    source: "https://www.gov.uk/foreign-travel-advice/spain/entry-requirements",
    sourceLabel: `${FCDO} — Schengen rules (same on all 29 members' pages); ETIAS status from the EU's official ETIAS site`,
    lastReviewed: R,
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    region: "Europe",
    base: "visa-free",
    note: "No visa or permit: under the Common Travel Area British nationals can visit, live, work and study in Ireland with no time limit. Ireland is not in Schengen, so the 90/180 rule and EES do not apply. A passport is not legally required, but some airlines and ferry operators insist on one, so check your carrier before you travel.",
    source: "https://www.gov.uk/foreign-travel-advice/ireland/entry-requirements",
    sourceLabel: FCDO,
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
    note: "An approved ESTA (or a visa) is needed before you travel, including at land and sea borders. ESTA is for trips of 90 days or less, needs a selfie photo, and may be unavailable if you have a criminal record, past refusal or overstay, or have been to Cuba since 12 January 2021 (then apply for a visa). Use only the official ESTA site or app.",
    source: "https://www.gov.uk/foreign-travel-advice/usa/entry-requirements",
    sourceLabel: `${FCDO}; fee and 90-day limit from the official ESTA website (esta.cbp.dhs.gov)`,
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
    note: "No visa for short visits (normally up to 6 months), but you need an eTA to fly in. No eTA is needed if you arrive by land or sea, or if you are a British-Canadian dual national (use your Canadian passport). Border officers may ask for a return or onward ticket and proof of funds.",
    source: "https://www.gov.uk/foreign-travel-advice/canada/entry-requirements",
    sourceLabel: `${FCDO}; eTA fee and US permanent-resident exemption from the Government of Canada eTA page (canada.ca)`,
    lastReviewed: R,
    overrides: [
      {
        residence: ["US"],
        category: "visa-free",
        note: "Lawful permanent residents of the United States are exempt from the eTA requirement (Government of Canada). Check which documents Canada requires you to carry.",
      },
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    region: "North America",
    base: "visa-free",
    days: 180,
    note: "No visa for tourism. The officer stamps your passport with the number of days allowed, up to 180 as a tourist; keep the stamp. If you enter by land you must fill in an online immigration form. Be ready to show a return or onward ticket, proof of accommodation and enough money. Tourists cannot do paid or voluntary work.",
    source: "https://www.gov.uk/foreign-travel-advice/mexico/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
  },

  // Caribbean
  {
    code: "DO",
    name: "Dominican Republic",
    flag: "🇩🇴",
    region: "Caribbean",
    base: "visa-free",
    days: 30,
    note: "No visa for tourism for 30 days (extendable up to 120 days through Dominican Immigration). Fill in the online entry and exit form up to 7 days before arrival and keep the QR code. Show proof of onward or return travel. GOV.UK says that until 31 Dec 2026 a passport valid for your visit is enough; rules may change after.",
    source: "https://www.gov.uk/foreign-travel-advice/dominican-republic/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
  },
  {
    code: "JM",
    name: "Jamaica",
    flag: "🇯🇲",
    region: "Caribbean",
    base: "visa-free",
    days: 90,
    note: "No visa. You are usually granted up to 90 days, with the date you must leave stamped in your passport. Passport must be valid for your stay and have 2 blank pages for entry and exit stamps. Apply to the Passport, Immigration and Citizenship Agency to extend; overstaying can mean a fine or arrest.",
    source: "https://www.gov.uk/foreign-travel-advice/jamaica/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
  },
  {
    code: "BB",
    name: "Barbados",
    flag: "🇧🇧",
    region: "Caribbean",
    base: "visa-free",
    note: "No visa. You are told how long you can stay on arrival; extensions are through the Barbados Immigration Department. Complete the online immigration and customs form before you arrive and show an onward or return ticket. Passport must be valid for your planned stay. Overstaying or working without a permit is illegal.",
    source: "https://www.gov.uk/foreign-travel-advice/barbados/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
  },

  // South America
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    region: "South America",
    base: "visa-free",
    days: 90,
    note: "No visa for tourism for up to 90 days (apply to the Federal Police to extend before it expires). Passport must be valid 6+ months after you arrive. Make sure it is stamped on entry or you may be fined on leaving. British-Brazilian dual nationals are often required to travel on their Brazilian passport.",
    source: "https://www.gov.uk/foreign-travel-advice/brazil/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
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
    note: "A visa is needed before you fly, but British citizens can usually get an eVisitor (subclass 651, free) or an ETA (subclass 601, via the Australian ETA app), both applied for online. Each allows stays of up to 3 months per entry. Passport must be valid for your stay. British-Australian dual nationals must use their Australian passport.",
    source: "https://www.gov.uk/foreign-travel-advice/australia/entry-requirements",
    sourceLabel: `${FCDO}; stay length and ETA service charge from the Australian Department of Home Affairs (immi.homeaffairs.gov.au)`,
    lastReviewed: R,
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Oceania",
    base: "eta",
    days: 180,
    note: "Visa-free for up to 6 months, but you must hold an NZeTA before you fly (allow up to 72 hours; valid up to 2 years) and pay the International Visitor Conservation and Tourism Levy when you apply. Complete the free NZ Traveller Declaration (from 24 hours before arrival). Show a return or onward ticket and proof of funds. Passport valid 3+ months after you leave.",
    source: "https://www.gov.uk/foreign-travel-advice/new-zealand/entry-requirements",
    sourceLabel: FCDO,
    lastReviewed: R,
  },
];
