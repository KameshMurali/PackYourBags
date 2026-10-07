# Visa Intelligence upgrade plan

_Branch: `feature/visa-upgrade` · Written 2026-10-07 · Owner: visa-upgrade orchestrator_

This plan covers the `/visa` explorer, the visa engine (`lib/visa`), and the visa tools of the
MCP server (`check_visa`, `list_visa_free`). It is written so each item can be checked off
against an explicit acceptance criterion.

## 1. Findings (state of `main` at f46cf67)

### Engine and data (`lib/visa.ts`, 423 lines, no imports)

| # | Finding | Impact |
| --- | --- | --- |
| F1 | Only the Indian passport has data (42 destinations). Pakistan, Philippines, Nigeria and Egypt are listed but disabled ("coming soon"). | Most of the passport picker is a dead end. |
| F2 | No per-record review date; the file header says "Reviewed: 2026-10". | Users can't tell how fresh a rule is; stale rules can't be found automatically. |
| F3 | Several Indian records look wrong or out of date and must be re-verified: Canada says an eTA may apply (India isn't eTA-eligible); South Korea says "Visa or K-ETA" (K-ETA is only for visa-exempt nationals); the Philippines is still "visa required" (a visa-free entry scheme for Indians was announced in 2025); the UAE note claims "UK no longer qualifies as of 2026", which can't be traced to a source; Georgia says "up to 1 year" while `days` is 90; Nepal has `days: 0`; Sri Lanka is "visa-free" although an ETA is still needed; the Dominican Republic and NZ transit notes need checking; the Schengen source is a commercial site (schengenvisainfo.com), and the Indonesia source points at an old portal. | Accuracy is the product. A wrong "no visa" can strand a traveller at check-in. |
| F4 | The override model can't tell a held **visa** from a **residence permit** (both map to one code). Several real rules accept only one of them, e.g. UAE visa on arrival for Indians accepts a US visa but only UK or EU *residence*. | Over- or under-grants access for some combinations. |
| F5 | A traveller's own country of residence is treated like any other destination: a UAE resident sees "UAE: eVisa". | Confusing, wrong answer on the default profile (India + UAE). |
| F6 | Search only knows the 42 dataset entries. Any other real country ("Morocco", "Deutschland", "Brasil" for a non-Brazil entry, "germny") falls through to a generic message. Substring matching also over-matches: "oman" returns the Schengen card via "Romania", "eden" via "Sweden", and "us" returns six destinations (Mauritius, Australia, the Caucasus…). | P0: every real country should be recognised and get an honest answer. |
| F7 | `VISA_GUIDES` cover only Schengen, US and UK, and the Schengen guide is written for one persona (an Indian passport holder applying from the UAE). | Visa-required results for Australia, Canada, Japan and others have no how-to-apply guidance. |

### UI (`app/visa/page.tsx`, client component)

| # | Finding |
| --- | --- |
| U1 | State isn't in the URL: a result can't be shared, bookmarked, or opened from another surface with the right passport and residence. |
| U2 | No "not yet verified" state: an unknown country shows a generic empty state that echoes the query, without a country-specific official source. |
| U3 | Cards don't show stay length consistently, fees, processing time, or when the rule was last reviewed. |
| U4 | A Schengen match gives no member-specific guidance: which consulate to apply to, or the 90/180-day rule. |
| U5 | Accessibility: visa pills lack `aria-pressed`, the guide toggle lacks `aria-expanded`/`aria-controls`, the result count isn't announced, and clay text (#c9834f on cream, about 2.9:1) fails WCAG AA contrast for body-size text. |
| U6 | The page is a client component, so it can't export page metadata. |

### MCP (`app/api/mcp/route.ts`)

| # | Finding |
| --- | --- |
| M1 | `check_visa` answers "No visa record" for any country outside the dataset, even real ones, without pointing to an official source. |
| M2 | Output has no review date. Unsupported passports get "currently: India / IN" hard-coded. |

### Tooling

| # | Finding |
| --- | --- |
| T1 | There's no test runner. Search behaviours that have regressed before (Schengen members, accents, "jerusalem" vs "USA") aren't protected. |

### Current best practice for visa-planning tools (what good looks like)

- Rules are passport-specific, conditional on residence and held visas, and change often, so
  every rule carries a source and a review date, and the UI says when it was last checked.
- Airlines check eligibility against IATA Timatic at boarding. The IATA Travel Centre is the
  public view of it and the right fallback when a rule hasn't been verified.
- Never present a guess as fact. "We haven't verified this yet, and here's the official
  source" is better than a confident wrong answer.
- Schengen: one uniform short-stay visa. Apply at the consulate of the main destination (or
  the first entry if stays are equal), limited to 90 days in any 180-day period. The EES
  biometric entry/exit system has been running since October 2025.
- Pre-travel digital arrival cards (Thailand TDAC, Malaysia MDAC, Indonesia's All Indonesia
  card, Hong Kong pre-arrival registration) aren't visas, but travellers must know about
  them, so they go in the notes.

## 2. Target architecture

```
lib/visa/
  index.ts            public API: re-exports every name lib/visa.ts exported, plus new ones
  types.ts            VisaCategory, CredentialCode, Override, DestinationRule, VisaGuide, Country…
  meta.ts             CATEGORY_META, RESIDENCIES, HELDVISAS, NATIONALITIES, credential labels
  countries.ts        index of ~250 countries and territories (ISO code, name, region, aliases, cities, Schengen flag)
  country-sources.ts  official immigration/visa source per country, used by "not yet verified" cards
  search.ts           normalize, typo-tolerant country search, matchesQuery
  engine.ts           resolveDestinations, summarise, searchDestinations, checkVisa
  guides.ts           VISA_GUIDES (how-to-apply guides) and destination-to-guide map
  schengen.ts         Schengen membership, the 90/180 rule, and where to apply
  url-state.ts        parse/serialise the explorer's shareable URL state
  data/index.ts       DATASETS registry (passport → rules)
  data/in.ts, pk.ts, ph.ts, ng.ts, eg.ts   one verified dataset per passport
  __tests__/          Vitest suites (engine, search, data validation, MCP formatting)
```

The engine stays framework-free (no package imports), so Vitest and scripts can load it
directly. `@/lib/visa` keeps every existing export name.

### Data contract (summary)

- `DestinationRule`: `code` (ISO 3166-1 alpha-2 or `SCHENGEN`), `name`/`flag`/`region` (must
  match the country index), `base` category, optional `days`, `note`, `fee`,
  `processingTime`, required `source` (https, official or authoritative) and `lastReviewed`
  (YYYY-MM-DD), and optional `overrides`.
- `Override`: `visas?: CredentialCode[]` (a valid visa from any of these) and
  `residence?: CredentialCode[]` (a residence permit in any of these). This fixes F4.
- Credentials: AE, US, UK, SCHENGEN, CA, AU, JP (Japan added; Australia added as a held visa).
- Categories: `visa-free` (nothing before travel; arrival cards go in the note);
  `visa-on-arrival`; `eta` (mandatory online authorisation that isn't a visa); `evisa`
  (visa issued online); `visa-required` (embassy, consulate or visa centre). When more than one
  route exists, `base` is the most permissive route open to every holder of that passport;
  conditional routes become overrides.

### Data policy

1. **Never invent a rule.** A destination is included only when an official government source
   (destination immigration authority, foreign ministry, embassy or consulate, official e-visa
   portal, or the passport country's own foreign ministry) confirms it. The IATA Travel Centre
   is the last-resort authoritative source. Wikipedia, visa agencies and blogs may be used as
   leads but never as the `source`.
2. Every record has an https `source` and a `lastReviewed` date. `fee`, `processingTime` and
   `days` appear only when the source states them.
3. If a rule can't be verified, it's left out. The "Rule not yet verified" card covers it.
4. Re-review cadence: records older than 180 days are flagged for review (P2: surface in the
   UI).

## 3. Prioritised backlog

### P0 (required in this delivery)

| ID | Item | Acceptance criteria |
| --- | --- | --- |
| P0.1 | **Every real country is recognised.** Index of all UN members, observers, Taiwan, Kosovo and major territories (~250), with ISO code, English name, region, native and alternate names (Brasil, Deutschland, España, Italia, Nederland/Holland, Türkiye/Turkey, Czechia/Czech Republic, Côte d'Ivoire/Ivory Coast, UAE/Emirates, UK/Britain/England, USA/America…) and major cities. Typo tolerance: edit distance ≤ 1 for 4–6 characters and ≤ 2 for 7 or more, used only when there's no exact or substring hit. Word-boundary matching instead of raw substrings. | Tests: "Brasil" → Brazil; "germny" → Germany → Schengen; "turkiye" → Türkiye; "deutschland" → Schengen; "jerusalem" doesn't match the US; "oman" doesn't match Schengen; all 193 UN members are present. |
| P0.2 | **No dead ends.** A recognised country with no verified rule for the selected passport shows a "Rule not yet verified for your passport" card with that country's official source (or the IATA Travel Centre) and the disclaimer. Searching your own passport country says so. The MCP `check_visa` returns the same honest answer. | Tests: an unverified country returns `status: "unverified"` with an https source; MCP text for an unverified country contains "not yet verified" and a URL; UI shows the card for e.g. "Mongolia". |
| P0.3 | **More passports, verified.** Add Pakistan, Philippines, Nigeria and Egypt from official sources. Re-verify all 42 Indian records (fix F3) and broaden India to the most-searched destinations. Every record has `source` and `lastReviewed`. | All five passports are selectable and resolve. The data-validation suite passes. Each dataset's coverage and exclusions are recorded in the delivery report. |
| P0.4 | **Tests.** Vitest (`npm test`) with engine unit tests and a data-validation suite over every dataset: unique codes, valid categories, overrides referencing known credentials, https sources, `lastReviewed` present and valid, name/region/flag consistent with the country index, and guides that exist. | `npm test` passes; `npm run lint` passes with zero warnings; `npm run build` succeeds. |
| P0.5 | **Correctness fixes in the engine.** Separate visa and residence credentials (F4); treat the destination you live in as "Your residence" (F5). | Tests: a UK visa alone doesn't unlock a rule that requires UK residence; a UAE resident sees the UAE as their residence. |

### P1 (after P0 is committed)

| ID | Item | Acceptance criteria |
| --- | --- | --- |
| P1.1 | Restructure `lib/visa.ts` into `lib/visa/` (done first, as the enabler for parallel work). | `@/lib/visa` imports unchanged; all existing export names still exported. |
| P1.2 | How-to-apply guides for Australia, Canada, New Zealand, Japan, South Korea, South Africa, Brazil (and refreshed Schengen/US/UK), each with documents, steps, processing time, fees when verified, official links and `lastReviewed`. Guides attach automatically to visa-required and eVisa results for that destination. | Validation suite covers guides; each guide has ≥ 3 documents, ≥ 3 steps and ≥ 1 official https link. |
| P1.3 | URL-synced state: `?passport=IN&residence=AE&visas=US,UK&q=germany`, shareable, and invalid values fall back safely. | Unit tests for parse/serialise round-trip; browser check: reload restores state. |
| P1.4 | Richer cards: stay length, fees and processing time when verified, `lastReviewed`, source label. | Visible on every verified card; no fake values. |
| P1.5 | Schengen per-country detail: when a member country is searched, explain which consulate to apply to (main destination or first entry), the 90/180-day rule, and link the member's official visa page. | "germany" shows a German-specific Schengen panel with official links. |
| P1.6 | Accessibility pass: labels, `aria-pressed`/`aria-expanded`, a live region for the result count, visible focus, AA contrast for text, full keyboard use. | Manual keyboard pass; contrast ≥ 4.5:1 for text. |
| P1.7 | Mobile layout at 375px: no overlapping or clipped elements, and no horizontal scroll. | Browser check at 375px and desktop. |
| P1.8 | MCP: `check_visa`/`list_visa_free` support every passport, accept a passport name or code, and include `lastReviewed`, source and the disclaimer. | Tests on the shared formatting helpers. |

### P2 (deferred; next iterations)

- Live data behind the same model (IATA Timatic / Sherpa API), with the curated set as a fallback.
- Staleness surfacing: a "review due" badge and a CI check when `lastReviewed` is older than 180 days.
- More residence types (Saudi Arabia/GCC, Singapore, New Zealand, Ireland) and more passports.
- Traveller profile persisted to the account (needs the auth work), feeding the concierge and MCP.
- Visa task → itinerary checklist with appointment reminders.
- Transit rules (airside transit visas), which differ from entry rules.

## 4. Delivery workstreams and file ownership

Sub-agents work in this worktree on strictly disjoint files. Only the orchestrator commits.

| Workstream | Owner | Files |
| --- | --- | --- |
| Plan, restructure, engine, search, URL state, Schengen rules, tests, P0 UI, MCP, integration, gates | Orchestrator | `docs/VISA_PLAN.md`, `lib/visa/{index,types,meta,search,engine,schengen,url-state}.ts`, `lib/visa/data/index.ts`, `lib/visa/__tests__/*`, `vitest.config.ts`, `package.json`, `app/api/mcp/route.ts` (visa parts only) |
| Country index | Sub-agent | `lib/visa/countries.ts` |
| Official source per country | Sub-agent | `lib/visa/country-sources.ts` |
| India audit + broaden | Sub-agent | `lib/visa/data/in.ts` |
| Pakistan | Sub-agent | `lib/visa/data/pk.ts` |
| Philippines | Sub-agent | `lib/visa/data/ph.ts` |
| Nigeria | Sub-agent | `lib/visa/data/ng.ts` |
| Egypt | Sub-agent | `lib/visa/data/eg.ts` |
| Guides (P1) | Sub-agent | `lib/visa/guides.ts` |
| Explorer UI (P1) | Sub-agent | `app/visa/*`, `components/visa-*.tsx` |

Out of bounds (parallel auth work): the MCP auth wrapper, dashboard, concierge, trips,
connect, sign-in/register, admin, layout, `lib/local-auth.ts`, `lib/connection.ts`,
`lib/store.ts`, `auth*.ts`, `middleware.ts`, and the session/sign-in components.

## 5. Quality gates

`npm run lint` (zero warnings), `npm run build`, `npm test`. Then a browser check of `/visa` on
port 3100 at 375px and desktop: no overlaps; "germany", "Brasil", "dubai", "usa" and "germny"
resolve; URL state round-trips.
