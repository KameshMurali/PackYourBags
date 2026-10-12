import { describe, expect, it } from "vitest";
import {
  describeSelectionImpact,
  heldVisaOptionsFor,
  HELDVISAS,
  resolveRules,
  selectionImpact,
  summarise,
  type CredentialUnlock,
  type DestinationRule,
} from "@/lib/visa";

const reviewed = "2026-10-12";

// Synthetic rules keep these tests independent of the research datasets.
function rule(partial: Pick<DestinationRule, "code" | "name" | "base"> & Partial<DestinationRule>): DestinationRule {
  return {
    flag: "🏳️",
    region: "Test",
    source: "https://example.gov/rule",
    lastReviewed: reviewed,
    ...partial,
  };
}

const residence = (code: CredentialUnlock["code"]): CredentialUnlock => ({ code, via: "residence" });
const visa = (code: CredentialUnlock["code"]): CredentialUnlock => ({ code, via: "visa" });

/** Resolve with a residence and held visas the way the explorer does. */
function run(rules: DestinationRule[], selection: CredentialUnlock[], demonym = "Testish") {
  const home = selection.find((s) => s.via === "residence");
  const credentials = selection.map((s) => s.code);
  const resolved = resolveRules(rules, credentials, { residence: home ? home.code : "NONE" });
  const reachableBefore = summarise(resolveRules(rules, [], { residence: "NONE" })).freedom;
  return { resolved, reachableBefore, result: describeSelectionImpact({ selection, demonym, resolved, reachableBefore }) };
}

const WEAK: DestinationRule[] = [
  rule({
    code: "GE",
    name: "Georgia",
    base: "visa-required",
    overrides: [{ visas: ["UK"], residence: ["AE"], category: "evisa" }],
  }),
  rule({
    code: "AM",
    name: "Armenia",
    base: "evisa",
    overrides: [{ residence: ["AE"], category: "visa-free", days: 180 }],
  }),
  rule({ code: "TH", name: "Thailand", base: "visa-free", days: 30 }),
  rule({ code: "AE", name: "United Arab Emirates", base: "visa-on-arrival", days: 30 }),
  rule({ code: "ZZ", name: "Zedland", base: "visa-required" }),
];

describe("describeSelectionImpact", () => {
  it("says nothing when nothing is chosen or the passport has no rules", () => {
    expect(run(WEAK, []).result).toBeNull();
    expect(
      describeSelectionImpact({ selection: [residence("AE")], demonym: "Testish", resolved: [], reachableBefore: 0 }),
    ).toBeNull();
  });

  it("names the destinations a residence made easier and the new reachable count", () => {
    const { result } = run(WEAK, [residence("AE")]);
    expect(result?.kind).toBe("easier");
    // Armenia and Georgia improve; the UAE itself is the country you live in, so it is not counted.
    expect(result?.text).toBe(
      "Your UAE residence permit makes 2 destinations easier: Armenia and Georgia. " +
        "Where you live (United Arab Emirates), you also enter on your residence permit. " +
        "That lifts “Reachable without a prior visa” from 2 to 3.",
    );
  });

  it("accounts for the country you live in when it lifts the count too", () => {
    // For this passport the UAE needs a visa, but you live there, so it joins the reachable count
    // on top of Armenia. Naming it keeps "1 destination easier" from contradicting "0 to 2".
    const rules = [
      rule({ code: "AE", name: "United Arab Emirates", base: "visa-required" }),
      rule({
        code: "AM",
        name: "Armenia",
        base: "evisa",
        overrides: [{ residence: ["AE"], category: "visa-free" }],
      }),
    ];
    const { result, resolved, reachableBefore } = run(rules, [residence("AE")]);
    expect(selectionImpact(resolved).improved).toHaveLength(1);
    expect(summarise(resolved).freedom - reachableBefore).toBe(2);
    expect(result?.text).toBe(
      "Your UAE residence permit makes 1 destination easier: Armenia. " +
        "Where you live (United Arab Emirates), you also enter on your residence permit. " +
        "That lifts “Reachable without a prior visa” from 0 to 2.",
    );
  });

  it("uses the plural verb for several credentials and the singular count for one destination", () => {
    const one = run(WEAK, [visa("UK")]).result;
    expect(one?.text).toMatch(/^Your UK visa makes 1 destination easier: Georgia\./);

    const both = run(WEAK, [residence("AE"), visa("UK")]).result;
    expect(both?.text).toMatch(/^Your UAE residence permit and UK visa make 2 destinations easier/);
  });

  it("says when the reachable count stays put", () => {
    // Georgia moves from visa required to e-visa: better, but still needs an application first.
    const { result, resolved, reachableBefore } = run(WEAK, [visa("UK")]);
    expect(summarise(resolved).freedom).toBe(reachableBefore);
    expect(result?.text).toContain("“Reachable without a prior visa” stays at 2.");
  });

  it("explains an unchanged result for a passport that already travels freely", () => {
    const strong = [
      rule({ code: "TH", name: "Thailand", base: "visa-free" }),
      rule({ code: "FR", name: "France", base: "visa-free" }),
      rule({ code: "JP", name: "Japan", base: "visa-free" }),
      rule({ code: "MX", name: "Mexico", base: "visa-free" }),
      rule({ code: "ZZ", name: "Zedland", base: "visa-required" }),
    ];
    const { result } = run(strong, [visa("UK")], "American");
    expect(result?.kind).toBe("unchanged");
    expect(result?.text).toBe(
      "Your UK visa doesn’t make any of the 5 destinations we’ve verified for American passports easier. " +
        "American passports already reach 4 of them without a prior visa.",
    );
  });

  it("explains an unchanged result for a passport with no rule that depends on the choice", () => {
    const { result } = run(WEAK, [visa("JP"), visa("CA")]);
    expect(result?.kind).toBe("unchanged");
    expect(result?.text).toBe(
      "Your Japan visa and Canada visa don’t make any of the 5 destinations we’ve verified for Testish passports easier. " +
        "None of the rules we’ve checked for this passport depend on it yet.",
    );
  });

  it("points out the country you live in when that is the only change", () => {
    const { result } = run(WEAK.filter((r) => r.code !== "GE" && r.code !== "AM"), [residence("AE")]);
    expect(result?.kind).toBe("unchanged");
    expect(result?.text).toContain(
      "The only change is where you live (United Arab Emirates): you enter on your residence permit.",
    );
  });

  it("lists at most four names, but never says “and 1 more”", () => {
    const many = (n: number) =>
      Array.from({ length: n }, (_, i) =>
        rule({
          code: `X${i}`,
          name: `Country ${i + 1}`,
          base: "visa-required",
          overrides: [{ visas: ["JP"], category: "evisa" }],
        }),
      );

    const five = run(many(5), [visa("JP")]).result?.text ?? "";
    expect(five).toContain("5 destinations easier: Country 1, Country 2, Country 3, Country 4 and Country 5.");

    const six = run(many(6), [visa("JP")]).result?.text ?? "";
    expect(six).toContain("6 destinations easier: Country 1, Country 2, Country 3, Country 4 and 2 more.");
  });
});

describe("selectionImpact", () => {
  it("separates destinations that got easier from the country you live in", () => {
    const { resolved } = run(WEAK, [residence("AE")]);
    const { improved, home } = selectionImpact(resolved);
    expect(improved.map((d) => d.code).sort()).toEqual(["AM", "GE"]);
    expect(home?.code).toBe("AE");
  });
});

describe("heldVisaOptionsFor", () => {
  it("hides the visa a passport's own country would never issue to its citizens", () => {
    expect(heldVisaOptionsFor("US").map((v) => v.code)).not.toContain("US");
    expect(heldVisaOptionsFor("GB").map((v) => v.code)).not.toContain("UK");
    expect(heldVisaOptionsFor("IT").map((v) => v.code)).not.toContain("SCHENGEN");
    expect(heldVisaOptionsFor("us")).toHaveLength(HELDVISAS.length - 1);
  });

  it("offers every visa to other passports", () => {
    expect(heldVisaOptionsFor("IN")).toEqual(HELDVISAS);
    expect(heldVisaOptionsFor("PK")).toEqual(HELDVISAS);
  });
});
