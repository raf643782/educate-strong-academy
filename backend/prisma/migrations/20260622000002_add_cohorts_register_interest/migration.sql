-- Add CohortStatus enum
CREATE TYPE "CohortStatus" AS ENUM ('UPCOMING', 'CONFIRMED', 'FULL', 'COMPLETED', 'CANCELLED');

-- Add InterestStatus enum
CREATE TYPE "InterestStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED');

-- Create Cohort table
CREATE TABLE "Cohort" (
    "id"          TEXT NOT NULL,
    "courseId"    TEXT,
    "title"       TEXT NOT NULL,
    "status"      "CohortStatus" NOT NULL DEFAULT 'UPCOMING',
    "city"        TEXT,
    "venue"       TEXT,
    "date"        TIMESTAMP(3),
    "capacity"    INTEGER,
    "bookingUrl"  TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create RegisterInterest table
CREATE TABLE "RegisterInterest" (
    "id"               TEXT NOT NULL,
    "firstName"        TEXT NOT NULL,
    "lastName"         TEXT NOT NULL,
    "email"            TEXT NOT NULL,
    "phone"            TEXT,
    "courseInterest"   TEXT,
    "locationInterest" TEXT,
    "message"          TEXT,
    "sourcePage"       TEXT,
    "status"           "InterestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegisterInterest_pkey" PRIMARY KEY ("id")
);
