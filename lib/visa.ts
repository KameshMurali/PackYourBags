// Visa intelligence engine.
//
// IMPORTANT: this dataset is *indicative* and for planning only. Visa rules
// change often and depend on nationality, residence, purpose, and the specific
// border. Every record links to an authoritative source; the UI shows a
// prominent "verify before you book" disclaimer. Reviewed: 2026-10.

export type VisaCategory =
  | "visa-free"
  | "visa-on-arrival"
  | "eta"
  | "evisa"
  | "visa-required";

export const CATEGORY_META: Record<
  VisaCategory,
  { label: string; short: string; tone: string; order: number }
> = {
  "visa-free": { label: "Visa-free", short: "No visa", tone: "green", order: 0 },
  "visa-on-arrival": { label: "Visa on arrival", short: "On arrival", tone: "teal", order: 1 },
  eta: { label: "Travel authorisation (ETA)", short: "ETA", tone: "sky", order: 2 },
  evisa: { label: "eVisa", short: "eVisa", tone: "amber", order: 3 },
  "visa-required": { label: "Visa required", short: "Visa needed", tone: "clay", order: 4 },
};

export type Nationality = { code: string; name: string; flag: string; supported: boolean };

// Credentials a traveller can hold that unlock easier access to third countries.
export type CredentialCode = "AE" | "US" | "UK" | "SCHENGEN" | "CA" | "AU";

export const RESIDENCIES: Array<{ code: CredentialCode | "NONE"; name: string; flag: string }> = [
  { code: "NONE", name: "No additional residence", flag: "🌐" },
  { code: "AE", name: "UAE resident (Emirates ID)", flag: "🇦🇪" },
  { code: "US", name: "US resident / Green Card", flag: "🇺🇸" },
  { code: "UK", name: "UK resident", flag: "🇬🇧" },
  { code: "SCHENGEN", name: "EU / Schengen resident", flag: "🇪🇺" },
  { code: "CA", name: "Canada resident", flag: "🇨🇦" },
  { code: "AU", name: "Australia resident", flag: "🇦🇺" },
];

export const HELDVISAS: Array<{ code: CredentialCode; name: string; flag: string }> = [
  { code: "US", name: "Valid US visa", flag: "🇺🇸" },
  { code: "SCHENGEN", name: "Valid Schengen visa", flag: "🇪🇺" },
  { code: "UK", name: "Valid UK visa", flag: "🇬🇧" },
  { code: "CA", name: "Valid Canada visa", flag: "🇨🇦" },
];

export const NATIONALITIES: Nationality[] = [
  { code: "IN", name: "India", flag: "🇮🇳", supported: true },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", supported: false },
  { code: "PH", name: "Philippines", flag: "🇵🇭", supported: false },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", supported: false },
  { code: "EG", name: "Egypt", flag: "🇪🇬", supported: false },
];

type Override = {
  // Holding ANY of these credentials applies this rule.
  credentials: CredentialCode[];
  category: VisaCategory;
  days?: number;
  note?: string;
};

export type DestinationRule = {
  code: string;
  name: string;
  flag: string;
  region: string;
  base: VisaCategory;
  days?: number;
  note?: string;
  source: string;
  overrides?: Override[];
  guide?: string; // key into VISA_GUIDES for visa-required destinations
  aliases?: string[]; // extra searchable terms (member countries, cities, common names)
};

// The Schengen Area is one dataset entry, but travellers search by member country
// or city — so those terms resolve to it.
const SCHENGEN_MEMBERS = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Czechia",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Italy",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
];

const SCHENGEN_CITIES = [
  "Paris",
  "Berlin",
  "Munich",
  "Rome",
  "Milan",
  "Venice",
  "Madrid",
  "Barcelona",
  "Amsterdam",
  "Lisbon",
  "Vienna",
  "Prague",
  "Athens",
  "Zurich",
  "Geneva",
  "Brussels",
  "Copenhagen",
  "Stockholm",
  "Oslo",
  "Reykjavik",
  "Budapest",
  "Nice",
];

// ---------------------------------------------------------------------------
// Dataset — Indian passport. Reviewed 2026-10. Indicative only.
// ---------------------------------------------------------------------------
const INDIA_DESTINATIONS: DestinationRule[] = [
  // South Asia / neighbours
  { code: "NP", name: "Nepal", flag: "🇳🇵", region: "South Asia", base: "visa-free", days: 0, note: "No visa or permit — open border.", source: "https://www.immigration.gov.np/" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", region: "South Asia", base: "visa-free", note: "Entry permit at border; Sustainable Development Fee applies.", source: "https://www.immi.gov.bt/" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", region: "South Asia", base: "visa-on-arrival", days: 30, note: "Free 30-day visa issued on arrival.", source: "https://immigration.gov.mv/" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", region: "South Asia", base: "visa-free", days: 30, note: "ETA waived for Indian nationals (confirm current status).", source: "https://eta.gov.lk/" },

  // Southeast Asia
  { code: "TH", name: "Thailand", flag: "🇹🇭", region: "Southeast Asia", base: "visa-free", days: 60, note: "Visa exemption for tourism (confirm current duration).", source: "https://www.thaievisa.go.th/" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", region: "Southeast Asia", base: "visa-free", days: 30, note: "Visa exemption extended through 2026 (confirm).", source: "https://malaysiavisa.imi.gov.my/" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", region: "Southeast Asia", base: "visa-on-arrival", days: 30, note: "VOA / e-VOA for Bali and main airports.", source: "https://molina.imigrasi.go.id/" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", region: "Southeast Asia", base: "evisa", note: "Electronic visa required; apply via authorised agent.", source: "https://www.ica.gov.sg/" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", region: "Southeast Asia", base: "evisa", days: 90, note: "e-Visa online before travel.", source: "https://evisa.gov.vn/" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", region: "Southeast Asia", base: "evisa", days: 30, note: "e-Visa or visa on arrival.", source: "https://www.evisa.gov.kh/" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", region: "Southeast Asia", base: "visa-required", note: "Visa required; may be waived with valid US/Schengen/UK/etc. visa.", source: "https://evisa.gov.ph/", overrides: [{ credentials: ["US", "SCHENGEN", "UK", "CA", "AU"], category: "visa-free", days: 14, note: "Visa-free up to 14 days with a valid visa from these countries (confirm conditions)." }] },

  // East Asia
  { code: "JP", name: "Japan", flag: "🇯🇵", region: "East Asia", base: "evisa", note: "eVisa for eligible travellers, else embassy visa.", source: "https://www.evisa.mofa.go.jp/" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", region: "East Asia", base: "visa-required", note: "Visa or K-ETA required.", source: "https://www.k-eta.go.kr/" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", region: "East Asia", base: "visa-free", days: 14, note: "Pre-arrival registration required.", source: "https://www.immd.gov.hk/" },

  // Middle East
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East", base: "evisa", days: 30, note: "eVisa; 14-day VOA if you hold a qualifying US/EU/… visa or residence.", source: "https://www.icp.gov.ae/", aliases: ["UAE", "Dubai", "Abu Dhabi", "Emirates"], overrides: [{ credentials: ["US", "SCHENGEN", "CA", "AU"], category: "visa-on-arrival", days: 14, note: "14-day visa on arrival with qualifying visa/residence (UK no longer qualifies as of 2026 — confirm)." }] },
  { code: "QA", name: "Qatar", flag: "🇶🇦", region: "Middle East", base: "visa-on-arrival", days: 30, note: "VOA / eligible for free waiver for some residents.", source: "https://www.visitqatar.com/" },
  { code: "OM", name: "Oman", flag: "🇴🇲", region: "Middle East", base: "evisa", note: "e-Visa; GCC residents may be eligible for easier entry.", source: "https://evisa.rop.gov.om/" },
  { code: "JO", name: "Jordan", flag: "🇯🇴", region: "Middle East", base: "visa-on-arrival", note: "VOA; free with Jordan Pass.", source: "https://www.visitjordan.com/" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷", region: "Middle East", base: "visa-required", note: "e-Visa available if you hold a valid US/UK/Schengen visa.", source: "https://www.evisa.gov.tr/", aliases: ["Turkey", "Turkiye", "Istanbul"], overrides: [{ credentials: ["US", "UK", "SCHENGEN"], category: "evisa", days: 30, note: "e-Visa eligible with a valid supporting visa/residence (single entry, conditions apply)." }] },

  // Caucasus / Central Asia
  { code: "GE", name: "Georgia", flag: "🇬🇪", region: "Caucasus", base: "visa-required", note: "Visa-free for holders of valid visa/residence of US, EU/Schengen, GCC, etc.", source: "https://www.geoconsul.gov.ge/", overrides: [{ credentials: ["US", "SCHENGEN", "UK", "CA", "AE"], category: "visa-free", days: 90, note: "Visa-free for up to 1 year for holders of qualifying visas/residence (confirm)." }] },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", region: "Caucasus", base: "evisa", days: 30, note: "ASAN e-Visa online.", source: "https://evisa.gov.az/" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", region: "Central Asia", base: "visa-required", note: "Visa required; some exemptions apply.", source: "https://www.vmp.gov.kz/" },

  // Europe (Schengen + others)
  { code: "SCHENGEN", name: "Schengen Area (29 countries)", flag: "🇪🇺", region: "Europe", base: "visa-required", note: "Short-stay (90/180) Schengen visa required — covers Germany, France, Italy, Spain, Netherlands and more.", source: "https://www.schengenvisainfo.com/", guide: "schengen", aliases: [...SCHENGEN_MEMBERS, ...SCHENGEN_CITIES, "Europe", "EU", "Schengen"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", region: "Europe", base: "visa-required", note: "Standard Visitor visa required.", source: "https://www.gov.uk/standard-visitor", guide: "uk", aliases: ["UK", "Britain", "England", "Great Britain", "London", "Scotland"] },
  { code: "RS", name: "Serbia", flag: "🇷🇸", region: "Europe", base: "visa-required", note: "Visa-free with a valid multiple-entry Schengen/US/UK visa.", source: "https://www.mfa.gov.rs/", overrides: [{ credentials: ["SCHENGEN", "US", "UK"], category: "visa-free", days: 90, note: "Visa-free with a valid supporting visa (confirm current rule)." }] },
  { code: "AL", name: "Albania", flag: "🇦🇱", region: "Europe", base: "visa-required", note: "Visa-free with a valid multiple-entry Schengen/US/UK visa.", source: "https://punetejashtme.gov.al/en/", overrides: [{ credentials: ["SCHENGEN", "US", "UK"], category: "visa-free", days: 90, note: "Visa-free with a valid supporting visa (seasonal rules may also apply)." }] },

  // Americas
  { code: "US", name: "United States", flag: "🇺🇸", region: "Americas", base: "visa-required", note: "B1/B2 visitor visa required.", source: "https://travel.state.gov/", guide: "us", aliases: ["USA", "America", "United States", "New York", "Los Angeles"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", region: "Americas", base: "visa-required", note: "Visa-free with a valid US visa.", source: "https://www.gob.mx/inm", overrides: [{ credentials: ["US", "UK", "SCHENGEN", "CA"], category: "visa-free", days: 180, note: "Visa-free with a valid visa of these countries (confirm)." }] },
  { code: "CA", name: "Canada", flag: "🇨🇦", region: "Americas", base: "visa-required", note: "Visitor visa (or eTA if previously issued US/Canada visa — confirm).", source: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", region: "Americas", base: "visa-required", note: "Visitor Visa (VIVIS) required — apply on Brazil's e-Consular portal through the Brazilian mission where you live (UAE residents: Brazil's embassy or consulate in the UAE). Brazil's tourist e-Visa is only for US, Canadian and Australian passports; Indian citizens can use a business e-Visa for business trips.", source: "https://www.gov.br/mre/pt-br/embaixada-nova-delhi/embassy-of-brazil-in-new-delhi/visas", aliases: ["Brasil", "Rio de Janeiro", "São Paulo"] },
  { code: "PA", name: "Panama", flag: "🇵🇦", region: "Americas", base: "visa-required", note: "Visa-free with a valid US/UK/Schengen/Canada visa.", source: "https://www.migracion.gob.pa/", overrides: [{ credentials: ["US", "UK", "SCHENGEN", "CA"], category: "visa-free", days: 90, note: "Visa-free with a used, valid supporting visa (confirm conditions)." }] },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", region: "Americas", base: "visa-free", days: 30, note: "E-ticket required.", source: "https://eticket.migracion.gob.do/" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", region: "Americas", base: "visa-free", days: 90, source: "https://www.gov.bb/" },

  // Africa
  { code: "MU", name: "Mauritius", flag: "🇲🇺", region: "Africa", base: "visa-free", days: 90, source: "https://passport.govmu.org/" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", region: "Africa", base: "eta", days: 30, note: "Travel authorisation before arrival.", source: "https://seychelles.govtas.com/" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", region: "Africa", base: "eta", note: "Electronic travel authorisation required.", source: "https://www.etakenya.go.ke/" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", region: "Africa", base: "visa-required", note: "Visitor visa required (eVisa for tourism).", source: "https://www.dha.gov.za/" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", region: "Africa", base: "evisa", days: 30, note: "e-Visa or VOA.", source: "https://visa2egypt.gov.eg/" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", region: "Africa", base: "evisa", note: "e-Visa; VOA at main airports.", source: "https://eservices.immigration.go.tz/" },

  // Oceania
  { code: "FJ", name: "Fiji", flag: "🇫🇯", region: "Oceania", base: "visa-free", days: 120, source: "https://www.immigration.gov.fj/" },
  { code: "AU", name: "Australia", flag: "🇦🇺", region: "Oceania", base: "visa-required", note: "Visitor visa (subclass 600) required.", source: "https://immi.homeaffairs.gov.au/" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", region: "Oceania", base: "visa-required", note: "Visitor visa required; NZeTA for transit.", source: "https://www.immigration.govt.nz/" },
];

const DATASET: Record<string, DestinationRule[]> = {
  IN: INDIA_DESTINATIONS,
};

// ---------------------------------------------------------------------------
// Documentation guides for visa-required destinations.
// ---------------------------------------------------------------------------
export type VisaGuide = {
  title: string;
  appliesTo: string;
  processingTime: string;
  overview: string;
  documents: string[];
  steps: string[];
  tips: string[];
  officialLinks: Array<{ label: string; url: string }>;
};

export const VISA_GUIDES: Record<string, VisaGuide> = {
  schengen: {
    title: "Schengen short-stay visa (Type C)",
    appliesTo: "Indian passport holders, applying as a UAE resident",
    processingTime: "15 calendar days typical; apply up to 6 months ahead, at least 3 weeks before travel.",
    overview:
      "As a UAE resident you apply at the consulate (via VFS/BLS) of the country that is your main destination, or your first point of entry if the trip is split evenly. You cannot apply from India for a UAE-based application.",
    documents: [
      "Passport valid 3+ months beyond return, issued within the last 10 years, with 2 blank pages.",
      "UAE residence permit / Emirates ID valid 3+ months beyond your return date.",
      "Completed and signed Schengen application form.",
      "Two recent biometric photos to Schengen specification.",
      "Confirmed round-trip flight reservation (reservation, not a paid ticket, until approved).",
      "Accommodation proof for the full stay (hotel bookings or host invitation).",
      "Travel medical insurance covering €30,000 across all Schengen countries.",
      "Personal UAE bank statements (usually last 3–6 months) and salary certificate.",
      "Employer NOC / leave letter, or trade licence if self-employed.",
      "Day-by-day travel itinerary.",
    ],
    steps: [
      "Decide your main destination — that country's consulate handles the application.",
      "Book a VFS/BLS appointment in the UAE for that consulate.",
      "Assemble and attest documents to that consulate's checklist.",
      "Attend the appointment, submit documents, and give biometrics.",
      "Track the application and collect the passport (or opt for courier return).",
    ],
    tips: [
      "Book refundable or dummy reservations until the visa is approved.",
      "Insurance must cover every Schengen country you'll enter, not just the first.",
      "Strong, consistent bank balances reduce refusal risk.",
    ],
    officialLinks: [
      { label: "Schengen Visa Info", url: "https://www.schengenvisainfo.com/" },
      { label: "EU — short-stay visas", url: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" },
    ],
  },
  us: {
    title: "US B1/B2 visitor visa",
    appliesTo: "Indian passport holders (apply from your country of residence)",
    processingTime: "Varies widely — interview wait times can be weeks to months. Apply early.",
    overview:
      "The B1/B2 is a non-immigrant visitor visa for business (B1) or tourism (B2). You complete the DS-160, pay the fee, and attend an in-person interview at a US embassy/consulate.",
    documents: [
      "Passport valid 6+ months beyond your stay.",
      "DS-160 confirmation page.",
      "Visa fee (MRV) payment receipt.",
      "Interview appointment confirmation.",
      "One recent photo to US specification.",
      "Proof of funds and ties to your home/residence (employment, property, family).",
      "Travel itinerary and purpose-of-visit evidence.",
    ],
    steps: [
      "Complete the DS-160 online form.",
      "Pay the MRV visa fee.",
      "Schedule the biometrics and consular interview appointments.",
      "Attend the interview with your documents.",
      "Collect your passport after approval.",
    ],
    tips: [
      "Demonstrate strong ties to your country of residence to show you'll return.",
      "Answer interview questions concisely and consistently with your DS-160.",
    ],
    officialLinks: [
      { label: "US Dept of State — visitor visas", url: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html" },
      { label: "DS-160 form", url: "https://ceac.state.gov/genniv/" },
    ],
  },
  uk: {
    title: "UK Standard Visitor visa",
    appliesTo: "Indian passport holders (apply from your country of residence)",
    processingTime: "About 3 weeks standard; priority services available.",
    overview:
      "The Standard Visitor visa covers tourism, visiting family, and some business. You apply online, pay the fee, and give biometrics at a visa application centre.",
    documents: [
      "Passport valid for the whole of your stay.",
      "Online application and appointment confirmation.",
      "Bank statements and proof of funds (usually last 6 months).",
      "Employment / residence proof and leave approval.",
      "Accommodation and travel itinerary.",
      "Any previous travel history / visas.",
    ],
    steps: [
      "Complete the online application on gov.uk.",
      "Pay the visa fee.",
      "Book and attend a biometrics appointment at the visa centre.",
      "Submit supporting documents (upload or at the centre).",
      "Wait for the decision and collect your passport.",
    ],
    tips: [
      "Show clear funds and a credible, time-bound travel plan.",
      "Consistency between your stated plan and your documents matters.",
    ],
    officialLinks: [{ label: "gov.uk — Standard Visitor visa", url: "https://www.gov.uk/standard-visitor" }],
  },
};

// ---------------------------------------------------------------------------
// Lookup logic.
// ---------------------------------------------------------------------------
const PERMISSIVENESS: VisaCategory[] = [
  "visa-free",
  "visa-on-arrival",
  "eta",
  "evisa",
  "visa-required",
];

export type ResolvedDestination = DestinationRule & {
  effective: VisaCategory;
  effectiveDays?: number;
  effectiveNote?: string;
  unlockedBy?: CredentialCode[];
};

export function isSupported(nationality: string) {
  return Boolean(DATASET[nationality]);
}

export function resolveDestinations(
  nationality: string,
  credentials: CredentialCode[],
): ResolvedDestination[] {
  const held = new Set(credentials);
  const rules = DATASET[nationality] ?? [];

  return rules
    .map((rule) => {
      let effective = rule.base;
      let effectiveDays = rule.days;
      let effectiveNote = rule.note;
      let unlockedBy: CredentialCode[] | undefined;

      for (const override of rule.overrides ?? []) {
        const matched = override.credentials.filter((c) => held.has(c));

        if (
          matched.length > 0 &&
          PERMISSIVENESS.indexOf(override.category) < PERMISSIVENESS.indexOf(effective)
        ) {
          effective = override.category;
          effectiveDays = override.days;
          effectiveNote = override.note ?? rule.note;
          unlockedBy = matched;
        }
      }

      return { ...rule, effective, effectiveDays, effectiveNote, unlockedBy };
    })
    .sort((a, b) => {
      const byCat =
        CATEGORY_META[a.effective].order - CATEGORY_META[b.effective].order;
      return byCat !== 0 ? byCat : a.name.localeCompare(b.name);
    });
}

// Matches a destination against a free-text query across name, region, and aliases
// (so "germany" / "paris" / "dubai" resolve to the right entry).
// Lowercase, strip accents, and turn punctuation into spaces so "turkiye" finds
// "Türkiye", "sao paulo" finds "São Paulo", and "Amsterdam, Netherlands" still
// matches on "amsterdam".
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchesQuery(d: DestinationRule, query: string) {
  const q = normalize(query);
  if (!q) return true;
  if (normalize(d.name).includes(q)) return true;
  if (normalize(d.region).includes(q)) return true;
  const paddedQuery = ` ${q} `;
  return (d.aliases ?? []).some((alias) => {
    const a = normalize(alias);
    // Alias starts with or contains the query ("bras" -> "Brasil"), or the query
    // contains the alias as a whole word ("amsterdam netherlands"), never a
    // fragment (so "jerusalem" doesn't hit "USA").
    return a.includes(q) || paddedQuery.includes(` ${a} `);
  });
}

export function summarise(resolved: ResolvedDestination[]) {
  const counts: Record<VisaCategory, number> = {
    "visa-free": 0,
    "visa-on-arrival": 0,
    eta: 0,
    evisa: 0,
    "visa-required": 0,
  };

  for (const d of resolved) {
    counts[d.effective] += 1;
  }

  const freedom = resolved.filter((d) =>
    ["visa-free", "visa-on-arrival", "eta"].includes(d.effective),
  ).length;

  return { counts, freedom, total: resolved.length };
}
