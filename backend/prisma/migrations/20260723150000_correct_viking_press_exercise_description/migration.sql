-- Data correction only — no schema change.
--
-- Corrects Exercise.description for slug 'viking-press-exercise'. The
-- Section 4 content audit found this record's description worded as
-- the competition event itself rather than as training for it (seeded
-- that way from the start, not a runtime drift). This migration
-- updates only that one field on that one record.
--
-- Guarded: the UPDATE only matches a row whose slug is exactly
-- 'viking-press-exercise' AND whose current description exactly
-- equals the known-incorrect value below. If zero rows match (already
-- corrected, or the current value is unexpected) or, structurally
-- impossible but checked anyway, more than one row matches, the block
-- raises an exception. An unhandled exception inside a DO block aborts
-- the enclosing transaction, so Postgres rolls back the UPDATE too —
-- this migration either fully applies exactly one corrected row, or
-- fails cleanly with nothing changed.
--
-- Never touches the "Event" table or any other "Exercise" row.

DO $$
DECLARE
  affected_rows INT;
BEGIN
  UPDATE "Exercise"
  SET "description" = 'A fixed lever overhead pressing exercise that develops the pressing rhythm, timing and overhead endurance used in the Viking Press competition event.'
  WHERE "slug" = 'viking-press-exercise'
    AND "description" = 'A fixed-lever overhead pressing event where the athlete presses a pivoting frame overhead for repetitions. Common in amateur and international Strongman competition. Demands pressing rhythm, timing, and overhead endurance rather than a single maximal effort.';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'Viking Press Exercise correction: 0 rows matched the expected known-incorrect description for slug ''viking-press-exercise''. Either already corrected or production data has drifted from the expected value. Migration aborted — no changes made.';
  ELSIF affected_rows > 1 THEN
    RAISE EXCEPTION 'Viking Press Exercise correction: % rows matched instead of exactly 1 — unexpected duplicate slug. Migration aborted and rolled back.', affected_rows;
  END IF;
END $$;
