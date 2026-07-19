# Stage 5 — New Event research and source record (v1)

Internal documentation only — not rendered on the public site. Captures the full
research trail behind the 6 new Events added in Stage 5, and the 3 candidates
deliberately held back. Every source below was checked via live web search
and direct page fetches on **2026-07-19** (the access date for every entry
unless stated otherwise).

This file is the "versioned internal research and source record" referenced
in the Stage 5 report. It also serves as the **Stage 7 handover** — see the
final section — since `author`, `reviewer`, `sources`, `publicationDate`,
`reviewStatus` and `alternativeNames` are not yet real columns on the `Event`
model (that migration is explicitly deferred to Stage 7, per the Stage 4/5
closure decision, so it can be designed compatibly with the future Sanity
migration rather than bolted on early).

---

## Events added (6)

### 1. Tyre Flip — slug `tyre-flip`

**Assessment:** mandatory per the Stage 5 brief ("add the essential Event: Tyre Flip"). Pairs directly with the existing published Exercise `tyre-flip`.

**Verified alternative names (internal only — not exposed publicly this stage):**
- "Tire Flip" — US spelling variant of the identical event. High confidence (BarBend, FitnessVolt, Generation Iron, Wikipedia all use this spelling for the same event).

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Format varies: fixed reps/distance within a time cap; max-flips-in-time-cap; single max-weight record-attempt format | "TIRES FLIPS" / "8 Standard Disciplines" | World Strongman International Union | worldstrongman.org/tires-flips/ ; worldstrongman.org/standard-disciplines/ | n/d | 2026-07-19 |
| 2 | Flip counted only once tyre pushed down and rotated onto opposite face; rolling onto side is not valid; tacky permitted unless rules specify chalk only | "Event- and record rules" | World Heavy Events Association | worldheavyeventsassociation.com/event-and-record-rules/ | n/d | 2026-07-19 |
| 3 | Tire flip "fallen out of fashion somewhat in professional strongman" today, more a conditioning tool than a standard top-tier fixture | "The 10 Best Strongman Exercises (and Alternatives)" by Jake Dickson, NASM-CPT | BarBend | barbend.com/best-strongman-exercises/ | 2024-07-03 | 2026-07-19 |
| 4 | 2025 Shaw Classic combined it into a "Tire Flip Power Stairs Medley" | "2025 Strongest Man on Earth Events Revealed" | BarBend | barbend.com/news/2025-strongest-man-on-earth-events/ | 2025-05-28 | 2026-07-19 |

**Deliberately NOT used (unverified/conflicting, held back from public copy):** exact JF Caron world-record weight (Rogue Fitness says 1,350 lb, Wikipedia says 1,433 lb — conflicting); Douglas Edmunds "inventor" origin story (sourced to one general-interest outlet only, not corroborated by a dedicated strength-sport source); any "Core Six" classification (no source establishes this as a real standardised term for any event set).

---

### 2. Conan's Wheel — slug `conans-wheel`

**Assessment:** currently and commonly used (2002 WSM through 2026 WSM/Strongman Classic), mechanically distinct from every existing carry event on the site.

**Verified alternative names (internal only):**
- "Conan's Bar" — refers to the implement/lever arm itself, not the event.
- "Wheel of Pain" — the film reference (*Conan the Barbarian*, 1982) the event is named after; used colloquially by some media, not an official competition name.
- NOT verified: "Conan's Wheel Press" (does not appear in any source found — do not use), "Cart Circle" as applied to the modern event (see caveat below).

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Zercher-hold carry around a fixed pivot; arm may not sit at/above shoulder height; scored by distance; belt/sleeves/chalk allowed, grip aids prohibited; no time limit at this promoter's event | "Event 1 Conans wheel" | WA Strongman | wastrongman.org/event-1-conans-wheel | n/d | 2026-07-19 |
| 2 | 2023 WSM: 200 kg implement, Zercher carry for max distance, 5 heat groups | "2023 World's Strongest Man Event Four 'Conan's Wheel' Results" | BarBend | barbend.com/news/2023-worlds-strongest-man-conans-wheel-results/ | updated 2025-04-03 | 2026-07-19 |
| 3 | 2024 WSM Final: 250 kg implement, Zercher grip | "2024 World's Strongest Man Finals Event 4 ... Conan's Wheel Results" | BarBend | barbend.com/2024-worlds-strongest-man-conans-wheel-results/ | n/d | 2026-07-19 |
| 4 | Pavlo Kordiyaka set a Conan's Wheel world record of 1,035° at the 2024 Strongman Classic | "Pavlo Kordiyaka Sets Conan's Wheel World Record..." | BarBend | barbend.com/news/conans-wheel-world-record-1035-degrees-pavlo-kordiyaka-2024-strongman-classic/ | updated 2024-07-17 | 2026-07-19 |
| 5 | Named event at 2002 WSM Group 3, 300 kg implement | Contest record | Strongman Archives | strongmanarchives.com/viewContest.php?id=179 | n/d | 2026-07-19 |
| 6 | 60-second time cap variant exists at some promoters; grip shirts/chalk/belts/sleeves permitted, tacky prohibited | "Conan's Wheel" (training explainer) | Grinder Gym | grindergym.com/conans-wheel/ | n/d | 2026-07-19 |
| 7 | SCL rules: "A competitor takes hold of a long pole, walking the distance as far as possible" | "Rules" | Strongman Champions League | strongmancl.com/rules/ | n/d | 2026-07-19 |

**Deliberately NOT used:** the "1989 WSM 'Cart Circle', modelled on the Basque Orga Jakoa oxcart game" origin story — this appeared repeatedly in search-engine summaries but could not be confirmed on any directly-fetched page, and Strongman Archives' own 1989 WSM record shows a **different** event named "Cart Carry" scored in linear metres (70 m/68 m/65 m), inconsistent with a rotational/degrees event. Treated as unverified/likely conflated, not published. Martins Licis's reported 119 ft 9 in distance — surfaced only via search summary, never independently fetched, not published.

---

### 3. Loading Race — slug `loading-race`

**Assessment:** genuinely distinct format layer (multi-implement, timed, sequential), not a re-description of any single existing implement's technique. Scoped narrowly: judging content explicitly cross-references the individual implement pages (Keg Loading, Sandbag to Platform, Sandbag Over Bar, Stone to Shoulder) rather than restating their standards, since no independent federation "no-lift" clause specific to the race itself was found.

**Verified alternative names (internal only):**
- "Loading Medley" — well-supported, appears across multiple sources as the umbrella term.
- "Death Medley", "Load and Carry" — reported by one lower-credibility commercial source only; not corroborated elsewhere.

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Five objects, 100–164 kg each, loaded onto a truck bed/platform over ~50 ft; implements vary (anchors, sandbags, anvils, kegs, etc.) | "Loading Race" | The World's Strongest Man (official) | theworldsstrongestman.com/events/loading-race/ | n/d | 2026-07-19 |
| 2 | Dated contest instances 1997–2020: implement count 3–8, course 8–35 m, time cap 60–90 s, varying by year/contest | Events: Loading Race (results database) | Strongman Archives | strongmanarchives.com/viewEvent.php?id=3 | n/d | 2026-07-19 |
| 3 | Also run at Fortissimus (a non-WSM federation), 2009: 8 implements, 90-second cap | Contest record | Strongman Archives | strongmanarchives.com/viewContest.php?id=3 (2009 Fortissimus entry) | n/d | 2026-07-19 |
| 4 | SCL rules list "Loading Race" by name: "Several heavy objects are loaded onto a truck bed or a similar platform" | "Rules" | Strongman Champions League | strongmancl.com/rules/ | n/d | 2026-07-19 |
| 5 | Categorises "multi-implement loading races" as a distinct sub-type alongside (not the same as) single-implement stone/keg loading | "Strongman Event Types" | FitnessVolt | fitnessvolt.com/strongman/event-types/ | n/d | 2026-07-19 |

**Explicit sourcing gap (disclosed, not papered over):** no federation rulebook clause defining formal no-lift/foul criteria specific to Loading Race itself was found — the published `judgingCriteria` field therefore states plainly that per-implement standards apply (see the linked implement pages) rather than asserting an invented independent rule.

---

### 4. Hercules Hold — slug `hercules-hold`

**Assessment:** genuinely distinct (static isometric hold, judged on time-to-failure — mechanically unlike every dynamic carry event already on the site). Strong primary sourcing for the core mechanic.

**Verified alternative names (internal only):**
- "Pillars of Hercules" — used directly in WSM's own mythological framing copy and in the WSM site's 2026-cycle event URL slug.

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Athlete stands on a raised platform holding two chained pillars upright, no time limit, event ends when the athlete can no longer support both (exact quote, directly fetched) | "Hercules Hold" | The World's Strongest Man (official) | theworldsstrongestman.com/events/hercules-hold/ | n/d (evergreen) | 2026-07-19 |
| 2 | Named for the myth of Hercules splitting a mountain to form the Pillars of Hercules | same page | WSM | same URL | n/d | 2026-07-19 |
| 3 | 2025 WSM Finals: 350 kg per pillar (700 kg total); Eddie Williams won at 82.14 s, a new WSM record | "2025 World's Strongest Man Hercules Hold Results" | BarBend | barbend.com/news/2025-worlds-strongest-man-hercules-hold-results/ | 2025-05-28 | 2026-07-19 |
| 4 | Common failure/completion criteria (drop, ground contact, grip loss) and typical grip-aid conventions (chalk allowed, tacky/straps commonly disallowed, hook grip promoter-dependent) | "Hercules Hold Rules, Standards, and Execution" | Grinder Gym | grindergym.com/hercules-hold-rules-standards-and-execution-in-strongman-competitions/ | undated | 2026-07-19 |

**Confidence note:** facts #1–2 are primary (direct official fetch); #3 is a fully-fetched, dated result; #4 is a single secondary blog with no independent corroboration — published copy frames this as general practice, not an official universal rule, and no historical record claims (e.g. Mark Felix's reported times) that could only be sourced via search-summary (not direct fetch) were published.

---

### 5. Fingal's Fingers — slug `fingals-fingers`

**Assessment:** genuinely distinct (hinged-pole flip, no overlap with any existing event). Real but intermittent — flagged in the public copy as appearing occasionally rather than being a competition fixture, since it does not appear in the confirmed 2026 WSM event list and its WSM Final-stage presence between 2009–2023 is disputed between sources.

**Verified alternative names (internal only):**
- "Fingal's Finger" (singular) — used as a page title by one reference site.
- "Fingal Finger(s)" (no apostrophe) — used by IronMind and a commercial equipment listing.

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Five hinged poles, progressively heavier/longer, flipped from horizontal to the opposite side; launched 2000; named after the mythological figure Fingal | "Fingal's Fingers" | The World's Strongest Man (official) | theworldsstrongestman.com/events/fingals-fingers/ | n/d (evergreen) | 2026-07-19 |
| 2 | 5 wooden poles, 200–441 lb, 3.5–5.5 m long, hinged at ground level, flipped 180° | Fingal's Fingers record entry | Guinness World Records | guinnessworldrecords.com/world-records/87571 | n/d | 2026-07-19 |
| 3 | Scored by time to clear all poles; partial completions ranked by count flipped | same as #1 | WSM | same URL | n/d | 2026-07-19 |
| 4 | US Strongman Nationals 2016 variant: 60-second cap, 5 flips, incomplete reps scored as partial, tacky not allowed | "Strongman's Guide to Odd Objects" | BarBend | barbend.com/news/strongman-fingals-fingers-hold/ | undated | 2026-07-19 |
| 5 | 2026 WSM's full confirmed event list does not include Fingal's Fingers | "2026 World's Strongest Man Shares Full List Of Events" | Generation Iron | generationiron.com/2026-worlds-strongest-man-full-list-events/ | 2026 | 2026-07-19 |

**Confidence note:** no-lift/fault detail (rushed transition, rounded-back lift, losing stability) is sourced only to a single secondary coaching site (Grinder Gym) — presented in published copy as coaching-relevant description of common faults, not an official rulebook clause.

---

### 6. Block Press — slug `block-press`

**Assessment:** genuinely distinct by implement (steel block vs. log/axle/dumbbell/Viking apparatus), on exactly the same basis the site already separates its other 4 overhead-press events from each other. Solid multi-decade sourcing.

**Verified alternative names (internal only):**
- None found at the event-name level. Implement brand names vary ("Mouser block", "Block Brothers", "Big Open Block") — these are equipment names, not event synonyms.

**Sources:**
| # | Claim | Source | Publisher | URL | Pub. date | Access date |
|---|---|---|---|---|---|---|
| 1 | Contested at 2010 WSM Final: 4 implements, 110–150 kg, 75-second cap | Contest record | Strongman Archives | strongmanarchives.com/viewContest.php?id=136 | n/d | 2026-07-19 |
| 2 | Contested at 2021 SCL World Finals: 4 implements, 100–130 kg | Contest record | Strongman Archives | strongmanarchives.com/viewContest.php?id=1043 | n/d | 2026-07-19 |
| 3 | Contested at 2006 IFSA World Championships: 4 implements, 90-second cap, 105–135 kg | Contest record | Strongman Archives | strongmanarchives.com/viewContest.php?id=199 | n/d | 2026-07-19 |
| 4 | 2025 Atlas Strongman Classic: Block Press Medley, 75 s, four blocks (110/120/100/100 kg) | "2025 Atlas Strongman Classic Results" | BarBend | barbend.com/news/2025-atlas-strongman-classic-results/ | 2025 | 2026-07-19 |
| 5 | Jessica Fithen set a 100 kg women's Block Press world record, Jan 2021 | "Strongwoman Jessica Fithen Smashed a 100-Kilogram..." | BarBend | barbend.com/strongwoman-jessica-fithen-block-press-world-record/ | Jan 2021 | 2026-07-19 |

**Confidence note:** SCL's own published rules page does not define a specific "Block Press" clause, so the judging standard is presented as the same overhead-lockout convention already documented on the site's other press pages, not attributed to a specific rulebook citation.

---

## Events assessed and held back (3)

- **Overhead Medley** — a timed-relay *format* applied to implements already covered (Log Press, Axle Press, Circus Dumbbell, Viking Press); no independent equipment or judging spec exists distinct from those pages; a dedicated coaching-standards source (Grinder Gym) itself labels medley standards "guidelines only, vary by event setup." No dedicated official WSM event page exists for it (confirmed by direct navigation), unlike Hercules Hold/Fingal's Fingers/Log Press which do.
- **Natural Stones** — real and current at elite level (2025–2026 WSM "Natural Stone Medley"), but structurally a chained medley (press + shoulder + carry + load) whose individual segments substantially duplicate the site's existing Atlas Stones, Stone to Shoulder and Husafell Carry pages. Outside WSM/Giants Live it is not a separately codified discipline (Strongman Archives, USS and World's Ultimate Strongman all fold stone events under "Atlas Stones"). Grip-rule sourcing (tacky allowed vs. disallowed on natural stones) is directly contradicted between two real sources with no primary document to adjudicate.
- **Keg Press** — overlaps with the same objective/completion criteria already covered by Log Press/Axle Press/Circus Dumbbell/Viking Press (clean-to-shoulder-then-press-overhead), varying only by implement. Strongman Archives returns zero contests with a "Keg Press" named event; SCL's official rules define "Keg Toss" (a distinct, well-documented throw-for-height event) but no keg press; the only genuine competition-level source found was a single regional/club event (Brawn & Brews, Kansas City), not a national/international federation event.

**Explicitly out of scope for Stage 5** (per the original programme's "do not add" list, unchanged): Eighteen Inch Deadlift as separate from Silver Dollar Deadlift; Duck Walk as a separate Event; Car Walk as a separate Event; Truck Pull as a separate Event from Vehicle Pull; Sled Drag as a separate Event.

---

## Stage 7 handover

The `Event` Prisma model does not yet have `alternativeNames`, `sources`, `publicationDate`, `reviewStatus`, `author`, or `reviewer` columns. This file is the interim record of that information for the 6 new Events until that migration happens.

**Every name below is recorded for Stage 7 to evaluate, not to publish automatically.** None of these have been exposed on any public page. The future schema should decide, per value, whether it is public, internal-only, or rejected — this record only classifies how confident the research is that each value genuinely refers to the same event, not whether it should ever be shown to a visitor. In particular, do not have Stage 7 publish **Conan's Bar, Wheel of Pain, Death Medley, or Load and Carry** as public Event alternative names without its own independent review — they are recorded below at low confidence or as non-event names, not as ready-to-publish aliases.

### `tyre-flip`
- **Confirmed alias (spelling variant):** "Tire Flip" — US spelling of the identical event; high confidence (BarBend, FitnessVolt, Generation Iron, Wikipedia all use this spelling for the same event).
- Sources: 4, listed above.

### `conans-wheel`
- **Implement name, not an event alias:** "Conan's Bar" — refers to the lever-arm apparatus itself, not the event. Should not be published as an alternative name for the event.
- **Informal reference:** "Wheel of Pain" — the film scene (*Conan the Barbarian*, 1982) the event is named after; used colloquially by some media, not an official competition name. Low priority for public display even if Stage 7 adds an aliasing feature.
- **Rejected (not verified anywhere in research):** "Conan's Wheel Press" — no source, primary or secondary, uses this term. "Cart Circle" as a name for the modern event — this appeared in unreliable search-summary text only and is contradicted by the primary historical-results record (which shows a different, linear-distance event called "Cart Carry" at the cited 1989 contest). Do not use either.
- Sources: 7, listed above.

### `loading-race`
- **Confirmed alias:** "Loading Medley" — well-supported, appears as the umbrella/interchangeable term across multiple independent sources.
- **Lower-confidence search terms:** "Death Medley", "Load and Carry" — reported by a single lower-credibility commercial source only, not corroborated anywhere else. Should not be published without independent corroboration.
- Sources: 5, listed above.

### `hercules-hold`
- **Confirmed alias:** "Pillars of Hercules" — used directly in WSM's own official mythological framing copy and in the WSM site's current event URL slug. High confidence.
- Sources: 4, listed above.

### `fingals-fingers`
- **Confirmed spelling/formatting variants:** "Fingal's Finger" (singular, used as a page title by one reference site), "Fingal Finger(s)" (no apostrophe, used by IronMind and a commercial equipment listing). Same event in both cases, formatting only.
- Sources: 5, listed above.

### `block-press`
- No alternative event name found at all. Implement/equipment brand names exist ("Mouser block", "Block Brothers", "Big Open Block") but these name products, not the event, and should not be treated as event aliases.
- Sources: 5, listed above.

---

No author, reviewer, publication date, or review status has been invented for any of the 6 records above — this file exists so Stage 7 has a ready-made, confidence-graded source list to migrate, not to pre-empt that stage's schema design or its own editorial judgement on what becomes public.
