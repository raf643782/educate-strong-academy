# Knowledge Hub — Sanity Migration Map

This document inventories the 21 hardcoded Knowledge Hub articles currently serving at `/knowledge/:slug` against the 9 approved Sanity-backed articles in `frontend/src/lib/approvedKnowledgeArticles.ts`.

**Purpose**: Every URL in the table below must have a resolved decision before the live Sanity cutover is performed. The cutover must not happen while any row is DECISION REQUIRED. See the hard requirement in `cms-guide.md`.

---

## Key

| Decision | Meaning |
|---|---|
| **KEEP** | Hardcoded article remains permanently in the codebase. No Sanity equivalent; no action required. |
| **KEEP — DIFFERENT SCOPE** | Article is in a distinct section (EatStrong/StrongKidz) that is not part of the Sanity Knowledge Hub cutover. Keep as-is. |
| **REDIRECT RECOMMENDED** | A Sanity article covers sufficiently similar ground. After cutover, the old URL should 308-redirect to the Sanity equivalent slug. Kris must confirm before redirect is wired. |
| **MIGRATE SAME SLUG** | Article should be recreated in Sanity at the identical slug to preserve the existing URL. Developer must add the slug to the approved manifest. |
| **DECISION REQUIRED** | No clear recommendation. Owner must decide: migrate into Sanity, keep hardcoded, or retire with a redirect. |

---

## The 21 hardcoded articles (`frontend/src/data/knowledgeArticles.ts`)

| # | Slug | Title | Category | Decision | Closest Sanity slug (if applicable) | Notes |
|---|---|---|---|---|---|---|
| 1 | `teaching-the-hip-hinge` | Teaching the Hip Hinge: A Coach's Framework | coaching | KEEP | — | Highly technical coaching content; no Sanity equivalent |
| 2 | `coaching-cues-that-actually-work` | Coaching Cues That Actually Work | coaching | KEEP | — | Practical coaching delivery content; no Sanity equivalent |
| 3 | `good-lift-vs-no-lift` | Good Lift vs No Lift: Developing Consistency | refereeing | KEEP | — | Refereeing-specific; no Sanity equivalent |
| 4 | `building-your-first-12-week-strongman-block` | Building Your First 12-Week Strongman Block | programming | KEEP | — | Programming depth not covered by Sanity articles |
| 5 | `managing-fatigue-across-a-competition-season` | Managing Fatigue Across a Competition Season | athlete | KEEP | — | Athlete-specific preparation content |
| 6 | `age-appropriate-loading` | Age-Appropriate Loading: What the Evidence Says | strongkidz | KEEP — DIFFERENT SCOPE | — | StrongKidz section; not part of Knowledge Hub Sanity cutover |
| 7 | `competition-day-nutrition` | Competition Day Nutrition: A Practical Guide | eatstrong | KEEP — DIFFERENT SCOPE | — | EatStrong section; not part of Knowledge Hub Sanity cutover |
| 8 | `event-selection-strategy` | Event Selection Strategy for First-Time Competitors | competition | REDIRECT RECOMMENDED | `first-strongman-competition-training` | Both cover competition preparation for first-timers. Kris to confirm. |
| 9 | `risk-assessment-strongman-environments` | Risk Assessment for Strongman Training Environments | coaching | KEEP | — | Safety/risk content; no Sanity equivalent |
| 10 | `briefing-athletes-before-the-event` | Briefing Athletes: Before the Event Starts | refereeing | KEEP | — | Referee procedure content; no Sanity equivalent |
| 11 | `the-six-core-events` | The Six Core Events: An Overview for New Athletes | athlete | REDIRECT RECOMMENDED | `strongman-events-explained` | Both introduce Strongman events to beginners. Kris to confirm. |
| 12 | `atlas-stone-technique` | Atlas Stone Technique: The Stone-to-Lap Phase | coaching | DECISION REQUIRED | `atlas-stones-technique-guide` | Sanity article is a full technique guide; hardcoded article covers a specific phase. Different enough to keep? Or redirect? Kris to confirm. |
| 13 | `safe-carry-event-setup` | Safe Carry Event Setup and Warm-Up | coaching | KEEP | — | Specific event setup content; no Sanity equivalent |
| 14 | `programming-for-competition-final-four-weeks` | Programming for Competition: The Final Four Weeks | programming | REDIRECT RECOMMENDED | `first-strongman-competition-training` | Both cover final competition preparation. Kris to confirm. |
| 15 | `strongkidz-carries-and-rope-work` | StrongKidz: Adapting Carries and Rope Work for Youth | strongkidz | KEEP — DIFFERENT SCOPE | — | StrongKidz section; not part of Knowledge Hub Sanity cutover |
| 16 | `hydration-and-weight-considerations` | Hydration and Weight Considerations for Strongman | eatstrong | KEEP — DIFFERENT SCOPE | — | EatStrong section; not part of Knowledge Hub Sanity cutover |
| 17 | `understanding-lockout-criteria` | Understanding Lockout Criteria Across Events | refereeing | REDIRECT RECOMMENDED | `strongman-competition-rules-explained` | Both explain officiating/judging standards. Kris to confirm. |
| 18 | `competition-weight-classes` | Understanding Competition Weight Classes and Open Categories | competition | REDIRECT RECOMMENDED | `strongman-competition-rules-explained` | Competition format content. Kris to confirm. |
| 19 | `how-to-read-a-strongman-event-sheet` | How to Read a Strongman Event Sheet | competition | REDIRECT RECOMMENDED | `strongman-events-explained` | Event-format content. Kris to confirm. |
| 20 | `start-strongman-safely` | Start Strongman Safely: A Guide for New Athletes | athlete | REDIRECT RECOMMENDED | `strongman-for-beginners` | Both target beginners starting the sport. Kris to confirm. |
| 21 | `rules-vary-strongman-judging` | Rules Vary: How Strongman Judging Standards Work | refereeing | REDIRECT RECOMMENDED | `strongman-competition-rules-explained` | Both explain variation in judging across federations. Kris to confirm. |

---

## The 9 approved Sanity articles (`frontend/src/lib/approvedKnowledgeArticles.ts`)

These articles are backed by Sanity and will be served from `/knowledge/:slug` after cutover. None of these slugs conflict with the 21 hardcoded slugs above.

| Sanity slug | Title |
|---|---|
| `what-is-strongman` | What Is Strongman? A Clear Guide to the Sport, Events, and Competition Format |
| `strongman-for-beginners` | Strongman for Beginners: How to Start Training Safely and Realistically |
| `strongman-events-explained` | Strongman Events Explained: A Beginner's Guide to the Main Event Types |
| `how-to-become-a-strongman-coach` | How to Become a Strongman Coach: Skills, Knowledge, and Education Pathways |
| `atlas-stones-technique-guide` | Atlas Stones Technique Guide |
| `strongman-competition-rules-explained` | Strongman Competition Rules Explained |
| `what-does-a-strongman-referee-do` | What Does a Strongman Referee Do? |
| `first-strongman-competition-training` | How to Train for Your First Strongman Competition |
| `strongman-vs-powerlifting` | Strongman vs Powerlifting: How the Two Sports Actually Differ |

**Excluded from public access** (hard-coded, enforced at code level):

| Slug | Reason |
|---|---|
| `is-strongman-safe-for-children` | Excluded pending qualified health/safety review |

---

## Cutover checklist

Before the developer performs the 4-file Sanity cutover:

- [ ] All DECISION REQUIRED rows resolved by Kris/owner
- [ ] All REDIRECT RECOMMENDED rows confirmed or rejected by Kris/owner
- [ ] Redirect entries for all confirmed 308 redirects added to `frontend/vercel.json`
- [ ] All KEEP articles verified to remain accessible (may need to survive in parallel with the Sanity system, not be replaced by it)
- [ ] 9 Sanity articles loaded and published in Sanity Studio, reviewed at `/knowledge-hub-preview` (ADMIN login required)
- [ ] Developer confirms architecture: Sanity articles will coexist with kept hardcoded articles, not replace them all

---

## Architecture note

The current cms-guide.md states "The 21 hardcoded articles will no longer be served after cutover." This is only correct for articles classified as **REDIRECT RECOMMENDED** (redirected to Sanity equivalents) or articles deliberately retired. Articles classified as **KEEP** or **KEEP — DIFFERENT SCOPE** must remain served after cutover — either kept in the hardcoded system or migrated into Sanity individually.

**The developer must confirm the post-cutover serving architecture before proceeding.** Removing all 21 hardcoded articles without redirects would cause 21 prerendered pages to 404.
