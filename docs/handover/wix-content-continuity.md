# Wix Content Continuity

This document compares the courses and content currently live on the Wix website against what is in the new Educate Strong Academy platform, so nothing is lost during the migration.

**Last verified**: August 2026

---

## Courses

### Wix live courses (as of handover)

| Course | Dates | Price | Deposit | Max places | Notes |
|---|---|---|---|---|---|
| Level 1 Fundamentals of Coaching Strongman | October 2026, March 2027 | £500 | £100 | 10 | Armed Forces discount available |
| Level 1 Strongman Refereeing Certification | October 2026 | £250 | £100 | — | — |

*Source: Wix website as reviewed at handover. Kris to confirm if any details have changed.*

---

### New platform course pages (`frontend/src/data/coursePageData.ts`)

| Course | Slug | Page exists? | Price | Deposit | Max places | Tutor mention | Armed Forces? |
|---|---|---|---|---|---|---|---|
| Level 1 Fundamentals of Coaching Strongman | `level-1-coaching-strongman` | **YES** | £500 | £100 | 10 | Paul Smith + Dr Chris Fitzgerald | Yes |
| Level 1 Strongman Refereeing Certification | `level-1-strongman-refereeing` | **YES** | £250 | £100 | — (not shown) | Paul Smith + Dr Chris Fitzgerald | Not shown |

---

### Line-by-line comparison

| Detail | Wix | New platform | Status |
|---|---|---|---|
| L1 Coaching — price | £500 | £500 | **MATCH** |
| L1 Coaching — deposit | £100 | £100 | **MATCH** |
| L1 Coaching — max places | 10 | 10 (displayed in keyFacts and pricingNote) | **MATCH** |
| L1 Coaching — Armed Forces discount | Yes | Yes (mentioned in FAQs and pricingNote) | **MATCH** |
| L1 Coaching — Oct 2026 date | Oct 2026 | **Not hardcoded** — date copy says "dates announced throughout the year; register interest" | **PRESENT BUT DIFFERENT** — Wix shows a specific date; new platform uses evergreen copy. Kris confirmation required: add specific Oct 2026 date to the new platform via Admin panel cohorts, or keep evergreen copy. |
| L1 Coaching — Mar 2027 date | Mar 2027 | **Not hardcoded** | **PRESENT BUT DIFFERENT** — as above |
| L1 Refereeing — price | £250 | £250 | **MATCH** |
| L1 Refereeing — deposit | £100 | £100 | **MATCH** |
| L1 Refereeing — Oct 2026 date | Oct 2026 | **Not hardcoded** — evergreen copy | **PRESENT BUT DIFFERENT** — same as coaching dates above |
| L1 Coaching — badge "Active IQ Accredited" | Present on Wix | Present as badge | **MATCH** |
| L1 Refereeing — WHEA.GB endorsement | Present on Wix | Present as badge and in endorsements section | **MATCH** |
| L1 Refereeing — Armed Forces Strongman endorsement | Present on Wix | Present as badge and in endorsements section | **MATCH** |
| Tutor names | Not prominently shown on Wix | Paul Smith + Dr Chris Fitzgerald — prominent tutor section | **PRESENT BUT DIFFERENT** — new platform shows more detail |
| Lunch included (L1 Coaching) | Mentioned on Wix | Mentioned in pricing included items and FAQs | **MATCH** |

---

## Specific dates — action required

The new platform does not hardcode course dates in the marketing page copy. This is intentional (evergreen copy avoids stale content). Dates are entered through the Admin panel → Cohort Manager.

**Kris confirmation required**:

| Course | Date | Action |
|---|---|---|
| Level 1 Fundamentals of Coaching Strongman | October 2026 | Create a cohort in Admin panel → Cohort Manager, or confirm this is superseded |
| Level 1 Fundamentals of Coaching Strongman | March 2027 | Create a cohort in Admin panel → Cohort Manager |
| Level 1 Strongman Refereeing Certification | October 2026 | Create a cohort in Admin panel → Cohort Manager |

Cohorts created in the Admin panel appear in the course listing and on the course detail page without any code changes.

---

## Courses on Wix not yet in the new platform

None identified. Both courses present on Wix have corresponding pages in the new platform.

---

## Courses in the new platform not on Wix

The new platform's course data file (`coursePageData.ts`) covers Level 1 Coaching and Level 1 Refereeing only — matching the Wix offering exactly.

---

## Other Wix content

| Wix content | Status on new platform |
|---|---|
| Blog posts | Not migrated — no blog on new platform. **Decision required**: retire, redirect to Knowledge Hub, or add a blog feature post-launch. |
| About/team page | Present on new platform — verify content matches Wix. |
| Contact information | New platform uses `educate.strongltd@gmail.com` as a placeholder — update to company domain address before launch. |
| Social links / Instagram embed | Present on new platform homepage. |
| Wix booking/payment pages | Replaced by Shopify checkout links — Shopify products not yet created (see `known-limitations.md`). |

---

## Wix redirect requirements

When DNS is migrated from Wix to Vercel, visitors following old Wix URLs must land on the correct new page. Redirects are configured in `frontend/vercel.json`. See `wix-redirect-map.md` for the full list.

Key course redirects to verify:
- Old Wix coaching course URL → `/courses/level-1-coaching-strongman`
- Old Wix refereeing course URL → `/courses/level-1-strongman-refereeing`

Kris should confirm the exact old Wix paths so the correct redirects can be added.
