// Schengen short-stay rules, shown when a traveller searches a member country.
// Source: European Commission, "Applying for a Schengen visa" (reviewed 2026-10-07).

import type { OfficialSource } from "./types";

export const SCHENGEN_FACTS: {
  whereToApply: string;
  stayRule: string;
  timing: string;
  fee: string;
  sources: OfficialSource[];
  lastReviewed: string;
} = {
  whereToApply:
    "Apply at the consulate of the country you'll visit. Visiting several? Apply to the one where you'll spend the longest, or, if the stays are equal, the first one you'll enter. As a rule you apply in the country where you legally live.",
  stayRule:
    "A short-stay Schengen visa allows up to 90 days in any 180-day period, counted across all Schengen countries together.",
  timing:
    "Apply at least 15 days and no more than 6 months before you travel. Decisions normally take 15 days, and up to 45 if more checks are needed.",
  fee: "€90 for adults, €45 for children aged 6–12.",
  sources: [
    {
      label: "European Commission — applying for a Schengen visa",
      url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
    },
    {
      label: "European Commission — 90/180-day short-stay calculator",
      url: "https://home-affairs.ec.europa.eu/policies/schengen/border-crossing/short-stay-calculator_en",
    },
  ],
  lastReviewed: "2026-10-07",
};
