import { describe, expect, it } from "vitest";
import {
  checkVisa,
  COUNTRIES,
  DATASETS,
  findPassport,
  isSupported,
  resolveDestinations,
  resolveRules,
  ruleCodesFor,
  searchDestinations,
  summarise,
  type DestinationRule,
} from "@/lib/visa";

const reviewed = "2026-10-07";

// Synthetic rules keep these tests independent of the research datasets.
const RULES: DestinationRule[] = [
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    base: "evisa",
    days: 30,
    source: "https://example.gov/ae",
    lastReviewed: reviewed,
    overrides: [
      {
        visas: ["US"],
        residence: ["US", "UK", "SCHENGEN"],
        category: "visa-on-arrival",
        days: 14,
        note: "14-day visa on arrival.",
      },
    ],
  },
  {
    code: "GE",
    name: "Georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    base: "visa-required",
    source: "https://example.gov/ge",
    lastReviewed: reviewed,
    overrides: [
      { visas: ["US", "UK"], residence: ["US", "UK", "AE"], category: "evisa" },
      { visas: ["SCHENGEN"], residence: ["SCHENGEN"], category: "visa-free", days: 90 },
    ],
  },
  {
    code: "SCHENGEN",
    name: "Schengen Area (29 countries)",
    flag: "🇪🇺",
    region: "Europe",
    base: "visa-required",
    source: "https://example.gov/schengen",
    lastReviewed: reviewed,
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    base: "visa-required",
    source: "https://example.gov/gb",
    lastReviewed: reviewed,
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    base: "visa-free",
    days: 60,
    source: "https://example.gov/th",
    lastReviewed: reviewed,
  },
];

const byCode = (list: ReturnType<typeof resolveRules>, code: string) =>
  list.find((d) => d.code === code)!;

describe("resolveRules", () => {
  it("keeps the base rule without credentials", () => {
    const resolved = resolveRules(RULES, [], { residence: "NONE" });
    expect(byCode(resolved, "AE").effective).toBe("evisa");
    expect(byCode(resolved, "AE").effectiveDays).toBe(30);
    expect(byCode(resolved, "AE").unlockedBy).toBeUndefined();
  });

  it("applies an override for a qualifying visa", () => {
    const ae = byCode(resolveRules(RULES, ["US"], { residence: "NONE" }), "AE");
    expect(ae.effective).toBe("visa-on-arrival");
    expect(ae.effectiveDays).toBe(14);
    expect(ae.effectiveNote).toBe("14-day visa on arrival.");
    expect(ae.unlocks).toEqual([{ code: "US", via: "visa" }]);
    expect(ae.unlockedBy).toEqual(["US"]);
  });

  it("doesn't let a visa stand in for a residence-only credential", () => {
    const withUkVisa = byCode(resolveRules(RULES, ["UK"], { residence: "NONE" }), "AE");
    expect(withUkVisa.effective).toBe("evisa");

    const asUkResident = byCode(resolveRules(RULES, ["UK"], { residence: "UK" }), "AE");
    expect(asUkResident.effective).toBe("visa-on-arrival");
    expect(asUkResident.unlocks).toEqual([{ code: "UK", via: "residence" }]);
  });

  it("treats every credential as both visa and residence without options (legacy)", () => {
    expect(byCode(resolveRules(RULES, ["UK"]), "AE").effective).toBe("visa-on-arrival");
  });

  it("picks the most permissive override that applies", () => {
    const ge = byCode(resolveRules(RULES, ["US", "SCHENGEN"], { residence: "NONE" }), "GE");
    expect(ge.effective).toBe("visa-free");
    expect(ge.effectiveDays).toBe(90);
    expect(ge.unlockedBy).toEqual(["SCHENGEN"]);
  });

  it("treats the place you live as your residence", () => {
    const resolved = resolveRules(RULES, ["AE"], { residence: "AE" });
    const ae = byCode(resolved, "AE");
    expect(ae.effective).toBe("visa-free");
    expect(ae.residentHere).toBe(true);
    expect(ae.effectiveNote).toMatch(/residence permit/);
    // A UAE residence still unlocks Georgia's residence-based rule.
    expect(byCode(resolved, "GE").effective).toBe("evisa");

    const schengen = byCode(resolveRules(RULES, ["SCHENGEN"], { residence: "SCHENGEN" }), "SCHENGEN");
    expect(schengen.residentHere).toBe(true);
    expect(schengen.effectiveNote).toMatch(/90 days in any 180-day period/);
    expect(schengen.guide).toBeUndefined();
  });

  it("attaches how-to-apply guides only when a visa is needed", () => {
    const none = resolveRules(RULES, [], { residence: "NONE" });
    expect(byCode(none, "SCHENGEN").guide).toBe("schengen");
    expect(byCode(none, "GB").guide).toBe("uk");
    expect(byCode(none, "TH").guide).toBeUndefined();
    expect(byCode(resolveRules(RULES, ["UK"], { residence: "UK" }), "GB").guide).toBeUndefined();
  });

  it("sorts by category, then name", () => {
    const order = resolveRules(RULES, [], { residence: "NONE" }).map((d) => d.code);
    expect(order).toEqual(["TH", "AE", "GE", "SCHENGEN", "GB"]);
  });
});

describe("summarise", () => {
  it("counts categories and easy-access destinations", () => {
    const s = summarise(resolveRules(RULES, ["US"], { residence: "NONE" }));
    expect(s.total).toBe(5);
    expect(s.counts["visa-free"]).toBe(1);
    expect(s.counts["visa-on-arrival"]).toBe(1);
    expect(s.counts.evisa).toBe(1);
    expect(s.counts["visa-required"]).toBe(2);
    expect(s.freedom).toBe(2);
  });
});

describe("searchDestinations", () => {
  const resolved = resolveRules(RULES, [], { residence: "NONE" });

  it("returns every rule for an empty query", () => {
    const s = searchDestinations("IN", resolved, "  ");
    expect(s.rules).toHaveLength(RULES.length);
    expect(s.notices).toEqual([]);
  });

  it("routes a misspelt Schengen member to the Schengen rule and says what it matched", () => {
    const s = searchDestinations("IN", resolved, "germny");
    expect(s.rules.map((r) => r.code)).toEqual(["SCHENGEN"]);
    expect(s.correctedTo).toBe("Germany");
    expect(s.via.SCHENGEN?.map((c) => c.code)).toEqual(["DE"]);
  });

  it("records which member led to the Schengen rule", () => {
    const s = searchDestinations("IN", resolved, "Deutschland");
    expect(s.rules.map((r) => r.code)).toEqual(["SCHENGEN"]);
    expect(s.correctedTo).toBeNull();
    expect(s.via.SCHENGEN?.map((c) => c.code)).toEqual(["DE"]);
  });

  it("gives an unverified country a notice with a source instead of a dead end", () => {
    const s = searchDestinations("IN", resolved, "Morocco");
    expect(s.rules).toEqual([]);
    expect(s.notices).toHaveLength(1);
    expect(s.notices[0].kind).toBe("unverified");
    expect(s.notices[0].country.code).toBe("MA");
    expect(s.notices[0].source.url).toMatch(/^https:\/\//);
  });

  it("recognises the passport's own country", () => {
    const s = searchDestinations("IN", resolved, "India");
    expect(s.notices.map((n) => [n.kind, n.country.code])).toEqual([["passport", "IN"]]);
  });

  it("recognises the residence country when it has no rule", () => {
    const s = searchDestinations("IN", resolved, "Canada", { residence: "CA" });
    expect(s.notices.map((n) => [n.kind, n.country.code])).toEqual([["residence", "CA"]]);
  });

  it("matches cities through the country index", () => {
    expect(searchDestinations("IN", resolved, "dubai").rules.map((r) => r.code)).toEqual(["AE"]);
  });

  it("suggests the nearest names when nothing matches", () => {
    const s = searchDestinations("IN", resolved, "grmnyy");
    expect(s.rules).toEqual([]);
    expect(s.notices).toEqual([]);
    expect(s.suggestions.map((c) => c.code)).toContain("DE");
  });
});

describe("findPassport", () => {
  it.each([
    ["IN", "IN"],
    ["in", "IN"],
    ["India", "IN"],
    ["Indian", "IN"],
    ["Pakistan", "PK"],
    ["Filipino", "PH"],
    ["Narnia", undefined],
    ["Philippines", "PH"],
    ["nigerian", "NG"],
    ["Egypt", "EG"],
  ])("finds %s", (value, code) => {
    expect(findPassport(value)?.code).toBe(code);
  });
});

describe("checkVisa (live datasets)", () => {
  it("answers with the Schengen rule for a misspelt member", () => {
    const check = checkVisa({ passport: "IN", destination: "germny" });
    expect(check.status).toBe("verified");
    if (check.status !== "verified") return;
    expect(check.destination.code).toBe("SCHENGEN");
    expect(check.via?.code).toBe("DE");
    expect(check.correctedTo).toBe("Germany");
    expect(check.destination.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("finds Brazil from its native name", () => {
    const check = checkVisa({ passport: "India", destination: "Brasil" });
    expect(check.status === "verified" && check.destination.code).toBe("BR");
  });

  it("finds Türkiye without the accent", () => {
    const check = checkVisa({ passport: "IN", destination: "turkiye" });
    expect(check.status === "verified" && check.destination.code).toBe("TR");
  });

  it("returns 'unverified' with an official or IATA source for a country without a rule", () => {
    const covered = new Set(DATASETS.IN.map((r) => r.code));
    const uncovered = COUNTRIES.find(
      (c) => c.code !== "IN" && !ruleCodesFor(c).some((code) => covered.has(code)),
    );
    expect(uncovered).toBeDefined();
    const check = checkVisa({ passport: "IN", destination: uncovered!.name });
    expect(check.status).toBe("unverified");
    if (check.status !== "unverified") return;
    expect(check.country.code).toBe(uncovered!.code);
    expect(check.source.url).toMatch(/^https:\/\//);
  });

  it("recognises the traveller's own passport country", () => {
    expect(checkVisa({ passport: "IN", destination: "Bharat" }).status).toBe("passport");
  });

  it("returns not-found with suggestions for unknown places", () => {
    const check = checkVisa({ passport: "IN", destination: "Atlantis" });
    expect(check.status).toBe("not-found");
  });

  it("refuses unsupported passports and lists the supported ones", () => {
    const check = checkVisa({ passport: "Narnia", destination: "Japan" });
    expect(check.status).toBe("unsupported-passport");
    if (check.status !== "unsupported-passport") return;
    expect(check.supported.map((n) => n.code)).toContain("IN");
  });

  it("supports exactly the passports with data", () => {
    for (const code of Object.keys(DATASETS)) {
      expect(isSupported(code)).toBe(DATASETS[code].length > 0);
    }
    expect(resolveDestinations("in", []).length).toBe(DATASETS.IN.length);
  });
});
