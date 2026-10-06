// How-to-apply guides for destinations that need a visa before travel.
//
// Guides are keyed by destination and attach automatically to visa-required and eVisa
// results for that destination (see GUIDE_BY_DESTINATION). A rule can still point at a
// specific guide with its own `guide` key.

import type { VisaGuide } from "./types";

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
      { label: "EU — short-stay visas", url: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" },
    ],
    lastReviewed: "2026-10-04",
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
