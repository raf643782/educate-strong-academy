-- Data correction only — no schema change.
--
-- Corrects BeStrongArticle.scopeOfPracticeNote for slug
-- 'nutrition-conversations-with-athletes'. Every other FREE EatStrong
-- article carries the standard scope-of-practice disclaimer; this one
-- record was seeded with it null from the start (not runtime drift).
-- This migration updates only that one field on that one record.
--
-- Guarded: the UPDATE only matches a row whose slug is exactly
-- 'nutrition-conversations-with-athletes' AND whose current
-- scopeOfPracticeNote IS NULL. If zero rows match (already corrected,
-- or the current value is unexpectedly non-null) or, structurally
-- impossible but checked anyway, more than one row matches, the block
-- raises an exception. An unhandled exception inside a DO block aborts
-- the enclosing transaction, so Postgres rolls back the UPDATE too —
-- this migration either fully applies exactly one corrected row, or
-- fails cleanly with nothing changed.
--
-- Never touches any other "BeStrongArticle" row, and touches no other
-- table.

DO $$
DECLARE
  affected_rows INT;
BEGIN
  UPDATE "BeStrongArticle"
  SET "scopeOfPracticeNote" = 'This article provides general nutritional information for educational purposes. It does not constitute personalised dietary advice. Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support.'
  WHERE "slug" = 'nutrition-conversations-with-athletes'
    AND "scopeOfPracticeNote" IS NULL;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'nutrition-conversations-with-athletes scopeOfPracticeNote correction: 0 rows matched slug ''nutrition-conversations-with-athletes'' with scopeOfPracticeNote IS NULL. Either already corrected or production data has drifted from the expected value. Migration aborted — no changes made.';
  ELSIF affected_rows > 1 THEN
    RAISE EXCEPTION 'nutrition-conversations-with-athletes scopeOfPracticeNote correction: % rows matched instead of exactly 1 — unexpected duplicate slug. Migration aborted and rolled back.', affected_rows;
  END IF;
END $$;
