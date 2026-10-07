import { describe, expect, it } from "vitest";
import {
  checkVisa,
  COUNTRIES,
  DATASETS,
  describeUnlocks,
  easyAccessAnswer,
  formatEasyAccess,
  formatVisaCheck,
  latestReview,
  NATIONALITIES,
  resolveRules,
  reviewDateLabel,
  ruleCodesFor,
  VISA_DISCLAIMER,
  visaCheckAnswer,
  type DestinationRule,
} from "@/lib/visa";

const india = NATIONALITIES.find((n) => n.code === "IN")!;

describe("describeUnlocks", () => {
  it("names each credential and whether it's a visa or a residence permit", () => {
    expect(describeUnlocks(undefined)).toBeNull();
    expect(describeUnlocks([{ code: "US", via: "visa" }])).toBe("your US visa");
    expect(
      describeUnlocks([
        { code: "US", via: "visa" },
        { code: "UK", via: "residence" },
        { code: "SCHENGEN", via: "visa" },
      ]),
    ).toBe("your US visa, UK residence permit and Schengen visa");
  });
});

describe("formatVisaCheck", () => {
  it("explains a Schengen member match with source, review date and disclaimer", () => {
    const text = formatVisaCheck(checkVisa({ passport: "IN", destination: "germny" }));
    expect(text).toContain("Germany (Schengen Area");
    expect(text).toContain("Visa required");
    expect(text).toContain("Closest match: Germany.");
    expect(text).toContain("90 days in any 180-day period");
    expect(text).toMatch(/Source: .*https:\/\//);
    expect(text).toMatch(/Last reviewed: \d{4}-\d{2}-\d{2}/);
    expect(text.endsWith(VISA_DISCLAIMER)).toBe(true);
  });

  it("is honest about destinations without a verified rule", () => {
    const covered = new Set(DATASETS.IN.map((r) => r.code));
    const uncovered = COUNTRIES.find(
      (c) => c.code !== "IN" && !ruleCodesFor(c).some((code) => covered.has(code)),
    )!;
    const text = formatVisaCheck(checkVisa({ passport: "IN", destination: uncovered.name }));
    expect(text).toContain(`${uncovered.name}: rule not yet verified for Indian passport holders.`);
    expect(text).toMatch(/https:\/\//);
    expect(text.endsWith(VISA_DISCLAIMER)).toBe(true);
  });

  it("handles the passport country, unknown places and unsupported passports", () => {
    expect(formatVisaCheck(checkVisa({ passport: "IN", destination: "India" }))).toContain(
      "own passport country",
    );
    expect(formatVisaCheck(checkVisa({ passport: "IN", destination: "Atlantis" }))).toContain(
      `Couldn't identify "Atlantis"`,
    );
    const unsupported = formatVisaCheck(checkVisa({ passport: "Narnia", destination: "Japan" }));
    expect(unsupported).toContain("IN (India)");
    expect(unsupported).toContain("https://www.iatatravelcentre.com/");
  });
});

describe("formatEasyAccess", () => {
  const rules: DestinationRule[] = [
    {
      code: "TH",
      name: "Thailand",
      flag: "🇹🇭",
      region: "Southeast Asia",
      base: "visa-free",
      days: 30,
      source: "https://example.gov/th",
      lastReviewed: "2026-10-07",
    },
    {
      code: "GE",
      name: "Georgia",
      flag: "🇬🇪",
      region: "Caucasus",
      base: "visa-required",
      source: "https://example.gov/ge",
      lastReviewed: "2026-10-01",
      overrides: [{ visas: ["US"], residence: ["US"], category: "visa-free", days: 90 }],
    },
    {
      code: "GB",
      name: "United Kingdom",
      flag: "🇬🇧",
      region: "Europe",
      base: "visa-required",
      source: "https://example.gov/gb",
      lastReviewed: "2026-10-01",
    },
  ];

  it("lists easy-access destinations with how they were unlocked, sources and review dates", () => {
    const resolved = resolveRules(rules, ["US"], { residence: "NONE" });
    const text = formatEasyAccess(india, resolved, { residence: "NONE", visas: ["US"] });
    expect(text).toContain("India passport (holding US visas): 2 of 3 verified destinations");
    expect(text).toContain("• Thailand — No visa · up to 30 days · reviewed 2026-10-07 · https://example.gov/th");
    expect(text).toContain("• Georgia — No visa · up to 90 days (via your US visa) · reviewed 2026-10-01");
    expect(text).not.toContain("United Kingdom");
    expect(text.endsWith(VISA_DISCLAIMER)).toBe(true);
  });
});

describe("MCP answers", () => {
  it("treats the residence country as home and keeps the disclaimer", () => {
    const text = visaCheckAnswer({
      passport: "IN",
      destination: "Dubai",
      residence: "AE",
      credentials: ["AE"],
    });
    expect(text).toContain("United Arab Emirates: Visa-free");
    expect(text).toContain("You live here");
    expect(text.endsWith(VISA_DISCLAIMER)).toBe(true);
  });

  it("lists easy-access destinations for a resident with held visas", () => {
    const text = easyAccessAnswer({ passport: "india", residence: "AE", credentials: ["AE", "US"] });
    expect(text).toContain("India passport (UAE resident, holding US visas)");
    expect(text).toMatch(/reviewed \d{4}-\d{2}-\d{2} · https:\/\//);
    expect(text.endsWith(VISA_DISCLAIMER)).toBe(true);
  });

  it("explains unsupported passports", () => {
    expect(easyAccessAnswer({ passport: "Narnia" })).toContain(`Passport "Narnia" isn't covered yet`);
  });
});

describe("review dates", () => {
  it("formats ISO dates without depending on the locale", () => {
    expect(reviewDateLabel("2026-10-07")).toBe("7 Oct 2026");
    expect(reviewDateLabel("2025-01-31")).toBe("31 Jan 2025");
    expect(reviewDateLabel("not a date")).toBe("not a date");
  });

  it("finds the latest review date", () => {
    expect(latestReview([])).toBeNull();
    expect(latestReview([{ lastReviewed: "2026-10-01" }, { lastReviewed: "2026-10-07" }])).toBe("2026-10-07");
  });
});
