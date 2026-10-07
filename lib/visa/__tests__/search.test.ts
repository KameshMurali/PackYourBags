import { describe, expect, it } from "vitest";
import {
  DATASETS,
  editDistance,
  findCountry,
  fuzzyCountries,
  matchCountries,
  matchesQuery,
  nearestCountries,
  normalize,
  resolveDestinations,
  searchCountries,
  typoAllowance,
} from "@/lib/visa";

const codesOf = (query: string) => searchCountries(query).map((m) => m.country.code);

describe("normalize", () => {
  it("strips accents, apostrophes and punctuation", () => {
    expect(normalize("Türkiye")).toBe("turkiye");
    expect(normalize("São Paulo")).toBe("sao paulo");
    expect(normalize("Côte d'Ivoire")).toBe("cote divoire");
    expect(normalize("Amsterdam, Netherlands")).toBe("amsterdam netherlands");
    expect(normalize("  Guinea-Bissau  ")).toBe("guinea bissau");
  });

  it("folds letters that don't decompose", () => {
    expect(normalize("Straße")).toBe("strasse");
    expect(normalize("Łódź")).toBe("lodz");
    expect(normalize("Færøerne")).toBe("faeroerne");
    expect(normalize("İstanbul")).toBe("istanbul");
  });

  it("keeps letters from other scripts", () => {
    expect(normalize("日本")).toBe("日本");
    expect(normalize("Россия!")).toBe("россия");
  });

  it("returns an empty string for punctuation only", () => {
    expect(normalize(" ,.- ")).toBe("");
  });
});

describe("editDistance", () => {
  it("counts insertions, deletions, substitutions and transpositions", () => {
    expect(editDistance("germny", "germany")).toBe(1);
    expect(editDistance("dubia", "dubai")).toBe(1);
    expect(editDistance("kitten", "sitting")).toBe(3);
    expect(editDistance("same", "same")).toBe(0);
    expect(editDistance("", "abc")).toBe(3);
  });

  it("stops early past the limit", () => {
    expect(editDistance("abcdef", "uvwxyz", 1)).toBe(2);
    expect(editDistance("a", "abcdef", 2)).toBe(3);
  });
});

describe("typoAllowance", () => {
  it("allows no typos below 4 characters, 1 up to 6, and 2 from 7", () => {
    expect([3, 4, 6, 7, 12].map(typoAllowance)).toEqual([0, 1, 1, 2, 2]);
  });
});

describe("country search", () => {
  it.each([
    ["Brasil", "BR"],
    ["brazil", "BR"],
    ["Deutschland", "DE"],
    ["España", "ES"],
    ["espana", "ES"],
    ["Italia", "IT"],
    ["Nederland", "NL"],
    ["Holland", "NL"],
    ["turkiye", "TR"],
    ["Türkiye", "TR"],
    ["Turkey", "TR"],
    ["Czechia", "CZ"],
    ["Czech Republic", "CZ"],
    ["Côte d'Ivoire", "CI"],
    ["cote divoire", "CI"],
    ["Ivory Coast", "CI"],
    ["UAE", "AE"],
    ["Emirates", "AE"],
    ["dubai", "AE"],
    ["UK", "GB"],
    ["Britain", "GB"],
    ["England", "GB"],
    ["USA", "US"],
    ["America", "US"],
    ["us", "US"],
    ["de", "DE"],
    ["flights to germany", "DE"],
  ])("recognises %s as %s", (query, code) => {
    expect(codesOf(query)[0]).toBe(code);
  });

  it("matches word prefixes, never fragments inside a word", () => {
    expect(codesOf("bras")).toContain("BR");
    expect(codesOf("oman")).toEqual(["OM"]);
    expect(codesOf("jerusalem")).not.toContain("US");
    expect(codesOf("eden")).not.toContain("SE");
  });

  it("needs three characters before matching prefixes", () => {
    expect(matchCountries("ge").map((m) => m.country.code)).toEqual(["GE"]);
    expect(matchCountries("g")).toEqual([]);
  });

  it("keeps close alternatives and drops weak ones", () => {
    expect(codesOf("niger")).toEqual(["NE", "NG"]);
    expect(codesOf("korea")).toEqual(["KR"]);
  });

  it.each([
    ["germny", "DE"],
    ["brazl", "BR"],
    ["itly", "IT"],
    ["phillipines", "PH"],
    ["new zeland", "NZ"],
    ["zeland", "NZ"],
    ["dubia", "AE"],
    ["switzerlnd", "CH"],
  ])("tolerates the typo %s → %s", (query, code) => {
    expect(matchCountries(query)).toEqual([]);
    expect(fuzzyCountries(query)[0]?.country.code).toBe(code);
    expect(findCountry(query)?.code).toBe(code);
  });

  it("only uses typo tolerance when nothing matches directly", () => {
    expect(searchCountries("india").every((m) => m.kind !== "fuzzy")).toBe(true);
  });

  it("doesn't guess for short or unrelated queries", () => {
    expect(fuzzyCountries("abc")).toEqual([]);
    expect(searchCountries("xyzzyq")).toEqual([]);
  });

  it("suggests the nearest names when even typo tolerance fails", () => {
    expect(searchCountries("grmnyy")).toEqual([]);
    expect(nearestCountries("grmnyy").map((c) => c.code)).toContain("DE");
  });
});

describe("matchesQuery (destination rules)", () => {
  const india = resolveDestinations("IN", []);
  const matching = (query: string) =>
    india.filter((d) => matchesQuery(d, query)).map((d) => d.code);

  it("matches everything for an empty query", () => {
    expect(matching("")).toHaveLength(DATASETS.IN.length);
  });

  it("normalises accents and punctuation", () => {
    expect(matching("turkiye")).toEqual(["TR"]);
    expect(matching("Sao Paulo")).toEqual(["BR"]);
    expect(matching("Brasil")).toEqual(["BR"]);
    expect(matching("Amsterdam, Netherlands")).toEqual(["SCHENGEN"]);
  });

  it("routes Schengen member countries and native names to the Schengen rule", () => {
    expect(matching("germany")).toEqual(["SCHENGEN"]);
    expect(matching("deutschland")).toEqual(["SCHENGEN"]);
    expect(matching("paris")).toEqual(["SCHENGEN"]);
  });

  it("only matches an alias inside a query as a whole word", () => {
    expect(matching("jerusalem")).not.toContain("US");
    expect(matching("oman")).toEqual(["OM"]);
    const us = matching("us");
    expect(us).toContain("US");
    for (const noise of ["MU", "AU", "GE", "AZ", "SCHENGEN"]) expect(us).not.toContain(noise);
  });

  it("matches regions", () => {
    const europe = matching("europe");
    expect(europe).toContain("SCHENGEN");
    expect(europe).toContain("GB");
  });
});
