-- ──────────────────────────────────────────────────────────────────────────────
-- Init migration: creates all base enums and tables.
-- Must run before 20260622000000, 000001, 000002.
--
-- Excludes:
--   PasswordResetToken       → created in 20260622000000
--   CohortStatus enum        → created in 20260622000002
--   InterestStatus enum      → created in 20260622000002
--   Cohort                   → created in 20260622000002
--   RegisterInterest         → created in 20260622000002
--
-- Role enum is created WITHOUT COACH / TUTOR.
-- Those values are added in 20260622000001_add_coach_tutor_roles.
-- ──────────────────────────────────────────────────────────────────────────────

-- Enums -----------------------------------------------------------------------

CREATE TYPE "Role" AS ENUM ('LEARNER', 'ASSESSOR', 'ADMIN');
CREATE TYPE "Pathway" AS ENUM ('COACHING', 'REFEREEING', 'STRONGKIDZ');
CREATE TYPE "LessonType" AS ENUM ('TEXT', 'VIDEO', 'RESOURCE', 'CASE_STUDY', 'PRACTICAL_TASK');
CREATE TYPE "AssessmentType" AS ENUM ('KNOWLEDGE_EXAM', 'WRITTEN_SCENARIO', 'PROGRAMMING_ASSIGNMENT', 'PRACTICAL_OBSERVATION', 'JUDGING_SCENARIO', 'SESSION_PLAN');
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'PASSED', 'FAILED', 'REFERRED', 'NEEDS_CHANGES');
CREATE TYPE "CPDActivity" AS ENUM ('FORMAL_LEARNING', 'COACHING_EVENT', 'COMPETITION', 'OFFICIATING', 'KNOWLEDGE_CONTRIBUTION', 'MENTORING', 'PEER_LEARNING');
CREATE TYPE "CPDStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ContentType" AS ENUM ('LESSON', 'MODULE', 'COURSE', 'CERTIFICATION', 'KB_ARTICLE', 'EXERCISE', 'EVENT', 'BE_STRONG_ARTICLE', 'BE_STRONG_HUB', 'EXTERNAL_URL');
CREATE TYPE "BeStrongCategory" AS ENUM ('BASICS', 'COMPETITION', 'RECOVERY', 'MAKING_WEIGHT', 'HYDRATION', 'SUPPLEMENTS', 'COACHES_GUIDE', 'YOUTH_NUTRITION', 'DOWNLOADS');
CREATE TYPE "AccessLevel" AS ENUM ('FREE', 'ENROLLED', 'CERTIFIED');
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE');
CREATE TYPE "DocumentType" AS ENUM ('HANDBOOK', 'ASSESSMENT_FORM', 'CHECKLIST', 'RESOURCE', 'CERTIFICATE', 'TEMPLATE', 'OTHER');
CREATE TYPE "DocumentStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'COMING_SOON');

-- User ------------------------------------------------------------------------

CREATE TABLE "User" (
    "id"                  TEXT NOT NULL,
    "email"               TEXT NOT NULL,
    "password"            TEXT NOT NULL,
    "firstName"           TEXT NOT NULL,
    "lastName"            TEXT NOT NULL,
    "role"                "Role" NOT NULL DEFAULT 'LEARNER',
    "avatarUrl"           TEXT,
    "bio"                 TEXT,
    "location"            TEXT,
    "externalUserId"      TEXT,
    "sourcePlatform"      TEXT,
    "integrationProvider" TEXT,
    "apiToken"            TEXT,
    "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"           TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Course ----------------------------------------------------------------------

CREATE TABLE "Course" (
    "id"            TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "description"   TEXT NOT NULL,
    "summary"       TEXT,
    "pathway"       "Pathway" NOT NULL,
    "level"         INTEGER NOT NULL DEFAULT 1,
    "imageUrl"      TEXT,
    "durationHours" DOUBLE PRECISION,
    "prerequisites" TEXT,
    "isPublished"   BOOLEAN NOT NULL DEFAULT false,
    "sortOrder"     INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- Module ----------------------------------------------------------------------

CREATE TABLE "Module" (
    "id"          TEXT NOT NULL,
    "courseId"    TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- Lesson ----------------------------------------------------------------------

CREATE TABLE "Lesson" (
    "id"              TEXT NOT NULL,
    "moduleId"        TEXT NOT NULL,
    "title"           TEXT NOT NULL,
    "content"         TEXT,
    "type"            "LessonType" NOT NULL DEFAULT 'TEXT',
    "videoUrl"        TEXT,
    "resourceUrl"     TEXT,
    "durationMinutes" INTEGER,
    "sortOrder"       INTEGER NOT NULL DEFAULT 0,
    "isPublished"     BOOLEAN NOT NULL DEFAULT false,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- LessonProgress --------------------------------------------------------------

CREATE TABLE "LessonProgress" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "lessonId"    TEXT NOT NULL,
    "completed"   BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "startedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- Enrolment -------------------------------------------------------------------

CREATE TABLE "Enrolment" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "courseId"    TEXT NOT NULL,
    "enrolledAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Enrolment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Enrolment_userId_courseId_key" ON "Enrolment"("userId", "courseId");

-- Assessment ------------------------------------------------------------------

CREATE TABLE "Assessment" (
    "id"          TEXT NOT NULL,
    "courseId"    TEXT,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "type"        "AssessmentType" NOT NULL,
    "passMark"    INTEGER NOT NULL DEFAULT 75,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- AssessmentSubmission --------------------------------------------------------

CREATE TABLE "AssessmentSubmission" (
    "id"           TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "content"      TEXT,
    "fileUrl"      TEXT,
    "status"       "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "score"        INTEGER,
    "feedback"     TEXT,
    "submittedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt"     TIMESTAMP(3),
    "gradedById"   TEXT,

    CONSTRAINT "AssessmentSubmission_pkey" PRIMARY KEY ("id")
);

-- Certificate -----------------------------------------------------------------

CREATE TABLE "Certificate" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "courseId"        TEXT NOT NULL,
    "certificateCode" TEXT NOT NULL,
    "issuedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt"       TIMESTAMP(3),
    "webhookStatus"   TEXT,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Certificate_certificateCode_key" ON "Certificate"("certificateCode");

-- CPDLog ----------------------------------------------------------------------

CREATE TABLE "CPDLog" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT NOT NULL,
    "activityType"   "CPDActivity" NOT NULL,
    "description"    TEXT NOT NULL,
    "hoursEarned"    DOUBLE PRECISION NOT NULL,
    "evidenceUrl"    TEXT,
    "status"         "CPDStatus" NOT NULL DEFAULT 'PENDING',
    "loggedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt"     TIMESTAMP(3),
    "approvedById"   TEXT,

    CONSTRAINT "CPDLog_pkey" PRIMARY KEY ("id")
);

-- KnowledgeArticle ------------------------------------------------------------

CREATE TABLE "KnowledgeArticle" (
    "id"             TEXT NOT NULL,
    "title"          TEXT NOT NULL,
    "slug"           TEXT NOT NULL,
    "category"       TEXT NOT NULL,
    "subcategory"    TEXT,
    "summary"        TEXT,
    "content"        TEXT,
    "authorName"     TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "isPublished"    BOOLEAN NOT NULL DEFAULT false,
    "accessLevel"    "AccessLevel" NOT NULL DEFAULT 'FREE',
    "imageUrl"       TEXT,
    "readMinutes"    INTEGER,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "KnowledgeArticle_slug_key" ON "KnowledgeArticle"("slug");

-- Exercise --------------------------------------------------------------------

CREATE TABLE "Exercise" (
    "id"                 TEXT NOT NULL,
    "name"               TEXT NOT NULL,
    "slug"               TEXT NOT NULL,
    "category"           TEXT NOT NULL,
    "difficulty"         "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "description"        TEXT,
    "techniqueNotes"     TEXT,
    "coachingCues"       TEXT,
    "commonMistakes"     TEXT,
    "progressions"       TEXT,
    "regressions"        TEXT,
    "programmingNotes"   TEXT,
    "videoUrl"           TEXT,
    "equipmentNeeded"    TEXT,
    "musclesWorked"      TEXT,
    "safetyNotes"        TEXT,
    "isCompetitionEvent" BOOLEAN NOT NULL DEFAULT false,
    "isPublished"        BOOLEAN NOT NULL DEFAULT false,
    "isLaunchPriority"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Exercise_slug_key" ON "Exercise"("slug");

-- Event -----------------------------------------------------------------------

CREATE TABLE "Event" (
    "id"               TEXT NOT NULL,
    "name"             TEXT NOT NULL,
    "slug"             TEXT NOT NULL,
    "category"         TEXT NOT NULL,
    "description"      TEXT,
    "technicalNotes"   TEXT,
    "coachingNotes"    TEXT,
    "judgingCriteria"  TEXT,
    "programmingNotes" TEXT,
    "commonErrors"     TEXT,
    "videoUrl"         TEXT,
    "isPublished"      BOOLEAN NOT NULL DEFAULT false,
    "isLaunchPriority" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- ContentRelationship ---------------------------------------------------------

CREATE TABLE "ContentRelationship" (
    "id"               TEXT NOT NULL,
    "sourceType"       "ContentType" NOT NULL,
    "sourceId"         TEXT NOT NULL,
    "targetType"       "ContentType" NOT NULL,
    "targetId"         TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "displayLabel"     TEXT,
    "priority"         INTEGER NOT NULL DEFAULT 3,
    "isActive"         BOOLEAN NOT NULL DEFAULT true,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentRelationship_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContentRelationship_sourceType_sourceId_idx" ON "ContentRelationship"("sourceType", "sourceId");
CREATE INDEX "ContentRelationship_targetType_targetId_idx" ON "ContentRelationship"("targetType", "targetId");

-- RecommendationPrompt --------------------------------------------------------

CREATE TABLE "RecommendationPrompt" (
    "id"             TEXT NOT NULL,
    "lessonId"       TEXT,
    "triggerContext" TEXT,
    "promptLabel"    TEXT NOT NULL,
    "targetType"     "ContentType" NOT NULL,
    "targetId"       TEXT,
    "targetUrl"      TEXT,
    "ctaText"        TEXT NOT NULL,
    "position"       TEXT NOT NULL DEFAULT 'end_of_lesson',
    "isActive"       BOOLEAN NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationPrompt_pkey" PRIMARY KEY ("id")
);

-- IntegrationLog --------------------------------------------------------------

CREATE TABLE "IntegrationLog" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT NOT NULL,
    "eventType"      TEXT NOT NULL,
    "targetPlatform" TEXT NOT NULL,
    "payload"        JSONB NOT NULL,
    "status"         TEXT NOT NULL DEFAULT 'pending',
    "sentAt"         TIMESTAMP(3),
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationLog_pkey" PRIMARY KEY ("id")
);

-- BeStrongArticle -------------------------------------------------------------

CREATE TABLE "BeStrongArticle" (
    "id"                     TEXT NOT NULL,
    "title"                  TEXT NOT NULL,
    "slug"                   TEXT NOT NULL,
    "category"               "BeStrongCategory" NOT NULL,
    "subcategory"            TEXT,
    "summary"                TEXT,
    "content"                TEXT,
    "authorName"             TEXT,
    "reviewerName"           TEXT,
    "reviewerQualification"  TEXT,
    "lastReviewedAt"         TIMESTAMP(3),
    "scopeOfPracticeNote"    TEXT,
    "accessLevel"            "AccessLevel" NOT NULL DEFAULT 'FREE',
    "isPremium"              BOOLEAN NOT NULL DEFAULT false,
    "isPublished"            BOOLEAN NOT NULL DEFAULT false,
    "isFeatured"             BOOLEAN NOT NULL DEFAULT false,
    "readMinutes"            INTEGER,
    "imageUrl"               TEXT,
    "tags"                   TEXT,
    "relatedArticleSlugs"    TEXT,
    "relatedCourseSlugs"     TEXT,
    "sortOrder"              INTEGER NOT NULL DEFAULT 0,
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"              TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeStrongArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BeStrongArticle_slug_key" ON "BeStrongArticle"("slug");

-- BeStrongDownload ------------------------------------------------------------

CREATE TABLE "BeStrongDownload" (
    "id"            TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "description"   TEXT,
    "category"      "BeStrongCategory" NOT NULL,
    "fileType"      TEXT NOT NULL DEFAULT 'PDF',
    "fileUrl"       TEXT,
    "thumbnailUrl"  TEXT,
    "accessLevel"   "AccessLevel" NOT NULL DEFAULT 'ENROLLED',
    "isPublished"   BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder"     INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeStrongDownload_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BeStrongDownload_slug_key" ON "BeStrongDownload"("slug");

-- CourseDocument --------------------------------------------------------------

CREATE TABLE "CourseDocument" (
    "id"          TEXT NOT NULL,
    "courseId"    TEXT,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "type"        "DocumentType" NOT NULL DEFAULT 'RESOURCE',
    "status"      "DocumentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "fileUrl"     TEXT,
    "fileType"    TEXT NOT NULL DEFAULT 'PDF',
    "fileSizeMb"  DOUBLE PRECISION,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseDocument_pkey" PRIMARY KEY ("id")
);

-- Foreign keys ----------------------------------------------------------------

ALTER TABLE "Module"               ADD CONSTRAINT "Module_courseId_fkey"               FOREIGN KEY ("courseId")    REFERENCES "Course"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lesson"               ADD CONSTRAINT "Lesson_moduleId_fkey"               FOREIGN KEY ("moduleId")   REFERENCES "Module"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonProgress"       ADD CONSTRAINT "LessonProgress_userId_fkey"         FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonProgress"       ADD CONSTRAINT "LessonProgress_lessonId_fkey"       FOREIGN KEY ("lessonId")   REFERENCES "Lesson"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrolment"            ADD CONSTRAINT "Enrolment_userId_fkey"              FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrolment"            ADD CONSTRAINT "Enrolment_courseId_fkey"            FOREIGN KEY ("courseId")   REFERENCES "Course"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assessment"           ADD CONSTRAINT "Assessment_courseId_fkey"           FOREIGN KEY ("courseId")   REFERENCES "Course"("id")     ON UPDATE CASCADE;
ALTER TABLE "AssessmentSubmission" ADD CONSTRAINT "AssessmentSubmission_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON UPDATE CASCADE;
ALTER TABLE "AssessmentSubmission" ADD CONSTRAINT "AssessmentSubmission_userId_fkey"   FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON UPDATE CASCADE;
ALTER TABLE "Certificate"          ADD CONSTRAINT "Certificate_userId_fkey"            FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON UPDATE CASCADE;
ALTER TABLE "Certificate"          ADD CONSTRAINT "Certificate_courseId_fkey"          FOREIGN KEY ("courseId")   REFERENCES "Course"("id")     ON UPDATE CASCADE;
ALTER TABLE "CPDLog"               ADD CONSTRAINT "CPDLog_userId_fkey"                 FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON UPDATE CASCADE;
ALTER TABLE "IntegrationLog"       ADD CONSTRAINT "IntegrationLog_userId_fkey"         FOREIGN KEY ("userId")     REFERENCES "User"("id")       ON UPDATE CASCADE;
ALTER TABLE "RecommendationPrompt" ADD CONSTRAINT "RecommendationPrompt_lessonId_fkey" FOREIGN KEY ("lessonId")   REFERENCES "Lesson"("id")     ON UPDATE CASCADE;
ALTER TABLE "CourseDocument"       ADD CONSTRAINT "CourseDocument_courseId_fkey"       FOREIGN KEY ("courseId")   REFERENCES "Course"("id")     ON UPDATE CASCADE;
