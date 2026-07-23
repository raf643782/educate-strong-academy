# EatStrong — Content Ownership Handover

Prepared as part of Priority 3 (Knowledge Hub and EatStrong editorial completion). This document exists to support a future handover of EatStrong content ownership to another person, as the owner has indicated will happen. No production changes were made to produce this document — all data below was read directly from the live production API on 2026-07-23.

## 1. Current article inventory (11 total)

| Title | Slug | Category | Access level |
|---|---|---|---|
| Energy Balance for Strongman Athletes | `energy-balance-strongman` | BASICS | FREE |
| Protein for Strength Athletes: What Coaches Need to Know | `protein-strength-athletes-coaches` | BASICS | FREE |
| Carbohydrates and Strongman Performance | `carbohydrates-strongman-performance` | BASICS | FREE |
| Competition Day Nutrition: A Practical Guide | `competition-day-nutrition-guide` | COMPETITION | FREE |
| Post-Training Nutrition for Strongman Recovery | `post-training-nutrition-strongman` | RECOVERY | FREE |
| Weight Categories in Strongman: A Coach's Awareness Guide | `weight-categories-coaches-awareness` | MAKING_WEIGHT | FREE |
| Hydration for Strongman Training and Competition | `hydration-strongman-training-competition` | HYDRATION | FREE |
| Supplements for Strongman: Evidence and Scope of Practice | `supplements-strongman-evidence-scope` | SUPPLEMENTS | FREE |
| How to Have Nutrition Conversations with Athletes | `nutrition-conversations-with-athletes` | COACHES_GUIDE | FREE |
| Nutrition for Young Strongman Athletes | `nutrition-young-strongman-athletes` | YOUTH_NUTRITION | FREE |
| Managing Long Competition Days | `managing-long-competition-days` | COMPETITION | ENROLLED |

## 2. Access levels

10 FREE, 1 ENROLLED, 0 CERTIFIED. Access control is enforced server-side (confirmed: an unauthenticated request to the ENROLLED article returns `content: null, locked: true`).

## 3. Current authors

Every article's `authorName` field reads **"EatStrong Editorial Team"** — an institutional byline, not a named individual. No specific person is currently attributed as author for any article.

## 4. Current reviewers

Every article's `reviewerName` field reads **"Victoria Wilson"**, `reviewerQualification`: **"Strength and Conditioning Coach"**. Victoria Wilson is a real, named individual already listed elsewhere on the site (About page, StrongKidz coaching team). Her review of this specific EatStrong content has not been separately confirmed by the owner in this conversation — flagged, not assumed. `lastReviewedAt` is `2026-01-01` for all 11 articles; no article has a distinct `publishedDate` set.

## 5. Outstanding reviews

- **`nutrition-conversations-with-athletes`** is missing its `scopeOfPracticeNote` disclaimer in the **live production database** — every other FREE article has one, this one still has `null` there. **Update 2026-07-23:** the repository's own source of truth (`backend/prisma/seed.ts`) has been corrected to include the standard disclaimer, but this does **not** change the already-seeded production row. A guarded, data-only migration (same pattern as the Viking Press Exercise correction) has been drafted and is ready for review, but has not been created as a branch/PR or executed, pending separate explicit approval — production writes are never made without a dedicated gate, even when the underlying decision has already been approved. See `docs/LAUNCH_READINESS.md`'s Priority 3 section and the chat report for the exact guarded SQL text.
- **No admin-panel path exists for this kind of correction.** The EatStrong admin UI (`frontend/src/pages/admin/BeStrongManager.tsx`) was inspected 2026-07-23 and confirmed to expose only publish/unpublish and feature/unfeature toggles — there is no field for editing `scopeOfPracticeNote` or any other article text. Any future content correction of this kind will need the same guarded-migration route, not an admin-panel edit, until a proper content-editing UI is built.
- Several articles carry specific nutrition claims (protein dosage ranges, hydration/dehydration percentages, caffeine dosage) reviewed only by a Strength and Conditioning Coach credential, not a registered dietitian or nutritionist — see the claims classification table in the Priority 3 report for exactly which claims this applies to.

## 6. Disclaimer requirements

All FREE articles except `nutrition-conversations-with-athletes` currently carry: *"This article provides general nutritional information for educational purposes. It does not constitute personalised dietary advice. Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support."* This should remain the baseline disclaimer for all EatStrong content going forward.

## 7. Download requirements

EatStrong-linked downloads (Competition Day Nutrition Planner, Supplement Checklist, Recovery Week Nutrition Template) all have `fileUrl: null` — no files are hosted yet. This is a known, separately-tracked item (see `docs/LAUNCH_READINESS.md`).

## 8. Future content ownership

The owner has indicated another person will take over EatStrong content ownership. This document, plus the live API and `backend/prisma/seed.ts`, are the current sources of truth for what exists. The incoming owner should be given:
- Read access to this document
- The exact list above of what's published and at what access level
- The outstanding review items (section 5)
- The workflow and role guidance below

## 9. Recommended publishing workflow

1. **Draft** — new or amended article content prepared by the content owner.
2. **Subject-matter review** — a suitably qualified reviewer (see role guidance below) checks factual and scope-of-practice accuracy.
3. **Owner approval** — Educate Strong signs off before publication.
4. **Publish** — access level set (FREE/ENROLLED/CERTIFIED) and article made live.
5. **Scheduled review** — re-reviewed on the cadence below, or immediately if underlying evidence changes.

## 10. Review frequency

Recommend an annual re-review at minimum for all FREE nutrition content, and immediately upon any change to underlying guidance (e.g. updated sports nutrition body position statements). Articles touching medical symptoms (e.g. heat illness recognition) should be reviewed whenever the incoming content owner becomes aware of updated clinical guidance.

## 11. Who may approve medical or nutrition claims

Recommend this sit with whoever holds the most relevant professional qualification available to Educate Strong — a registered dietitian or registered nutritionist for nutrition-specific dosage claims, or a medical professional for symptom-recognition content (e.g. heat illness). Absent such a reviewer, claims should stay in the "general education, no specific dosage" register rather than be published as precise clinical guidance. This is a recommendation, not a decision made on Educate Strong's behalf.

## 12. Who may change access levels

Recommend this remains an Educate Strong owner/administrator decision only — access-level changes affect what paying enrolled/certified learners are entitled to, so this shouldn't be a routine content-editor permission.

## 13. How future articles should be added

Recommend the incoming content owner uses the existing admin article-management tooling (confirmed to exist: `backend/src/routes/bestrong.ts` has `/admin/articles` endpoints) rather than direct database edits, so publication status, access level, and review metadata are all set consistently through the same interface the rest of the platform uses.

## 14. How outdated advice should be reviewed

Recommend a simple log (even a shared spreadsheet) recording: article, date flagged, reason, reviewer, resolution. This doesn't need to be built into the platform immediately — it can start as a manual process during handover.

## 15. How article changes should be logged

The `lastReviewedAt` field already exists on every article and should be updated every time a review occurs, whether or not the content changes. Recommend also recording *why* a review happened (routine cadence vs a specific concern) somewhere the incoming owner can see — this document or a shared log, not necessarily a new database field.
