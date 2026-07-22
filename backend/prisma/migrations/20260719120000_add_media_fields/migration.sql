-- Stage 6: additive media fields for Exercise and Event.
-- Every column is nullable — no default, no NOT NULL constraint, no
-- data touched or removed. Existing rows are completely unaffected;
-- every one of the 49 currently-published records simply gains these
-- columns as NULL, exactly matching their current (absent) state.
ALTER TABLE "Exercise"
  ADD COLUMN "imageUrl"          TEXT,
  ADD COLUMN "imageAlt"          TEXT,
  ADD COLUMN "videoProvider"     TEXT,
  ADD COLUMN "videoThumbnailUrl" TEXT,
  ADD COLUMN "videoTitle"        TEXT,
  ADD COLUMN "videoDescription"  TEXT,
  ADD COLUMN "videoUploadDate"   TIMESTAMP(3),
  ADD COLUMN "videoDuration"     TEXT,
  ADD COLUMN "videoTranscript"   TEXT,
  ADD COLUMN "captionsUrl"       TEXT;

ALTER TABLE "Event"
  ADD COLUMN "imageUrl"          TEXT,
  ADD COLUMN "imageAlt"          TEXT,
  ADD COLUMN "videoProvider"     TEXT,
  ADD COLUMN "videoThumbnailUrl" TEXT,
  ADD COLUMN "videoTitle"        TEXT,
  ADD COLUMN "videoDescription"  TEXT,
  ADD COLUMN "videoUploadDate"   TIMESTAMP(3),
  ADD COLUMN "videoDuration"     TEXT,
  ADD COLUMN "videoTranscript"   TEXT,
  ADD COLUMN "captionsUrl"       TEXT;
