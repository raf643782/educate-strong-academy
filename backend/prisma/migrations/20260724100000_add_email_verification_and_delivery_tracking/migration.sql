-- Additive only. No column dropped, renamed, or altered in place; no
-- existing row's role, enrolment, access level, password, or reset
-- token is touched. Existing users get emailVerified = false via the
-- column's own DEFAULT (Postgres applies this to every existing row
-- automatically when a NOT NULL column with a DEFAULT is added — no
-- separate backfill statement is needed or has been written).

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RegisterInterest" ADD COLUMN     "ownerNotificationErrorCode" TEXT,
ADD COLUMN     "ownerNotifiedAt" TIMESTAMP(3),
ADD COLUMN     "submitterConfirmationErrorCode" TEXT,
ADD COLUMN     "submitterConfirmationSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
