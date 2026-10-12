// A sentence about what a traveller's residence and held visas changed.
//
// Without it the explorer goes quiet when they change nothing. That is the normal case for
// passports that already travel almost everywhere (no rule for a US, UK or Italian passport
// depends on where you live or which visas you hold), and a quiet page looks like a broken control.

import { summarise } from "./engine";
import { describeUnlocks } from "./format";
import type { CredentialUnlock, ResolvedDestination } from "./types";

export type SelectionImpact = {
  /** "easier": at least one destination got easier. "unchanged": none did. */
  kind: "easier" | "unchanged";
  text: string;
};

/** Names listed before the rest are summarised as "and N more". */
const NAMES_SHOWN = 4;
/** At this share of destinations reachable without a prior visa there is little left to unlock. */
const STRONG_PASSPORT_SHARE = 0.75;

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function nameList(names: string[]) {
  // "and 1 more" reads oddly, so a list one over the limit is shown in full.
  if (names.length <= NAMES_SHOWN + 1) {
    return names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  }
  return `${names.slice(0, NAMES_SHOWN).join(", ")} and ${names.length - NAMES_SHOWN} more`;
}

/** Destinations a residence or held visa made easier, and the country you live in (if it has a rule). */
export function selectionImpact(resolved: ResolvedDestination[]) {
  return {
    improved: resolved.filter((d) => !d.residentHere && (d.unlocks?.length ?? 0) > 0),
    home: resolved.find((d) => d.residentHere) ?? null,
  };
}

/**
 * What the chosen residence and visas did for this passport, or null when nothing is chosen
 * or the passport has no verified rules.
 *
 * @param selection the residence (via "residence") and every held visa (via "visa") the traveller chose.
 * @param demonym how the passport is named in a sentence: "Indian", "American".
 * @param resolved the passport's destinations with the selection applied.
 * @param reachableBefore "Reachable without a prior visa" with no residence and no held visas.
 */
export function describeSelectionImpact(input: {
  selection: CredentialUnlock[];
  demonym: string;
  resolved: ResolvedDestination[];
  reachableBefore: number;
}): SelectionImpact | null {
  const { selection, demonym, resolved, reachableBefore } = input;
  const chosen = describeUnlocks(selection);
  const total = resolved.length;
  if (!chosen || total === 0) return null;

  const subject = `${chosen.charAt(0).toUpperCase()}${chosen.slice(1)}`;
  const several = selection.length > 1;
  const { improved, home } = selectionImpact(resolved);
  const reachable = summarise(resolved).freedom;

  if (improved.length > 0) {
    const names = nameList(improved.map((d) => d.name));
    const verb = several ? "make" : "makes";
    // The country you live in can lift the count too, so name it or the numbers won't add up.
    const living = home ? ` Where you live (${home.name}), you also enter on your residence permit.` : "";
    const effect =
      reachable > reachableBefore
        ? ` That lifts “Reachable without a prior visa” from ${reachableBefore} to ${reachable}.`
        : ` “Reachable without a prior visa” stays at ${reachable}.`;
    return {
      kind: "easier",
      text: `${subject} ${verb} ${plural(improved.length, "destination")} easier: ${names}.${living}${effect}`,
    };
  }

  const verb = several ? "don’t" : "doesn’t";
  const strong = reachable / total >= STRONG_PASSPORT_SHARE;
  let text = `${subject} ${verb} make any of the ${total} destinations we’ve verified for ${demonym} passports easier.`;
  text += strong
    ? ` ${demonym} passports already reach ${reachable} of them without a prior visa.`
    : " None of the rules we’ve checked for this passport depend on it yet.";
  if (home) {
    text += ` The only change is where you live (${home.name}): you enter on your residence permit.`;
  }
  return { kind: "unchanged", text };
}
