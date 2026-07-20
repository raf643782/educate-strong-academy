-- Stage 7: additive editorial attribution, sources and related-content
-- fields for Exercise and Event. Every column is nullable (or an
-- empty-array default) — no data touched or removed. Existing rows
-- gain these columns as NULL/empty, exactly matching their current
-- (absent) state. No author, reviewer, or curated relationship is
-- populated by this migration.
ALTER TABLE "Exercise"
  ADD COLUMN "authorName"            TEXT,
  ADD COLUMN "authorRole"            TEXT,
  ADD COLUMN "reviewerName"          TEXT,
  ADD COLUMN "reviewerQualification" TEXT,
  ADD COLUMN "publishedDate"         TIMESTAMP(3),
  ADD COLUMN "lastReviewedDate"      TIMESTAMP(3),
  ADD COLUMN "sources"               TEXT,
  ADD COLUMN "relatedExerciseSlugs"  TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relatedEventSlugs"     TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relatedArticleSlugs"   TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relevantCourseSlugs"   TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Event gets the same fields, plus ruleReviewDate (Event-only — the
-- date a promoter/federation rule summary was last confirmed current).
ALTER TABLE "Event"
  ADD COLUMN "authorName"            TEXT,
  ADD COLUMN "authorRole"            TEXT,
  ADD COLUMN "reviewerName"          TEXT,
  ADD COLUMN "reviewerQualification" TEXT,
  ADD COLUMN "publishedDate"         TIMESTAMP(3),
  ADD COLUMN "lastReviewedDate"      TIMESTAMP(3),
  ADD COLUMN "ruleReviewDate"        TIMESTAMP(3),
  ADD COLUMN "sources"               TEXT,
  ADD COLUMN "relatedExerciseSlugs"  TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relatedEventSlugs"     TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relatedArticleSlugs"   TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "relevantCourseSlugs"   TEXT[] DEFAULT ARRAY[]::TEXT[];
