-- Add optional homepage venue-map + spotlight fields to Cohort.
-- All columns are nullable, or default to a value that preserves the
-- current behaviour of every existing row (in particular
-- "featuredOnHomepage" defaults to false, so no existing cohort starts
-- appearing on the homepage as a result of this migration).
ALTER TABLE "Cohort"
  ADD COLUMN "addressLine"         TEXT,
  ADD COLUMN "postcode"            TEXT,
  ADD COLUMN "latitude"            DOUBLE PRECISION,
  ADD COLUMN "longitude"           DOUBLE PRECISION,
  ADD COLUMN "directionsUrl"       TEXT,
  ADD COLUMN "featuredOnHomepage"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "endDate"             TIMESTAMP(3),
  ADD COLUMN "startTime"           TEXT,
  ADD COLUMN "finishTime"          TEXT,
  ADD COLUMN "price"               DOUBLE PRECISION,
  ADD COLUMN "availableSpaces"     INTEGER,
  ADD COLUMN "registerInterestUrl" TEXT,
  ADD COLUMN "shortDescription"    TEXT;
