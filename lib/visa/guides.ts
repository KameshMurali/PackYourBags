// How-to-apply guides for destinations that need a visa before travel.
//
// Guides are keyed by destination and attach automatically to visa-required and eVisa
// results for that destination (see GUIDE_BY_DESTINATION). A rule can still point at a
// specific guide with its own `guide` key.

import type { VisaGuide } from "./types";

export const VISA_GUIDES: Record<string, VisaGuide> = {
  schengen: {
    title: "Schengen short-stay visa (Type C)",
    appliesTo: "Passport holders who need a Schengen visa, applying in the country where they legally live",
    processingTime:
      "15 days normally, up to 45 if more checks are needed. Apply at least 15 days and no more than 6 months before you travel.",
    fee: "€90 for adults, €45 for children aged 6–12",
    overview:
      "One short-stay visa covers all 29 Schengen countries for up to 90 days in any 180-day period. Apply at the consulate (or its visa centre) of the country you'll visit; if you'll visit several, the one where you'll spend the longest, or the first you'll enter if the stays are equal.",
    documents: [
      "Passport valid at least 3 months beyond your planned departure from the Schengen Area, issued within the last 10 years, with 2 blank pages.",
      "Residence permit for the country you're applying from, if you aren't a citizen there.",
      "Completed and signed Schengen visa application form.",
      "A recent passport photo to the consulate's specification.",
      "Travel medical insurance covering at least €30,000, valid in every Schengen country.",
      "Flight reservation and accommodation for the whole stay (or an invitation from your host).",
      "Proof of funds (recent bank statements) and of your job, studies or business at home.",
    ],
    steps: [
      "Work out your main destination: that country's consulate handles your application.",
      "Book an appointment with that consulate or its visa centre where you live.",
      "Prepare documents to that consulate's checklist (requirements vary slightly by country).",
      "Attend the appointment, submit documents, pay the fee, and give fingerprints.",
      "Track the application and collect your passport.",
    ],
    tips: [
      "Use refundable bookings until the visa is approved.",
      "Your insurance must cover every Schengen country you'll enter, not just the first.",
      "Count your days: the 90-day limit applies across all Schengen countries combined.",
    ],
    officialLinks: [
      {
        label: "EU — applying for a Schengen visa",
        url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
      },
      {
        label: "EU — 90/180-day calculator",
        url: "https://home-affairs.ec.europa.eu/policies/schengen/border-crossing/short-stay-calculator_en",
      },
    ],
    lastReviewed: "2026-10-07",
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
    lastReviewed: "2026-10-04",
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
    lastReviewed: "2026-10-04",
  },
};

/** Destination rule code → guide key, applied when the traveller needs a visa or eVisa. */
export const GUIDE_BY_DESTINATION: Record<string, string> = {
  SCHENGEN: "schengen",
  US: "us",
  GB: "uk",
};
