/**
 * Certificate service — completion trigger.
 *
 * Called after:
 *   - A lesson is marked complete (check if all lessons + assessments done)
 *   - An assessment submission is marked PASSED (check same)
 *
 * Logic:
 *   1. Check all published lessons in the course are complete for this user
 *   2. Check all required assessments for the course are PASSED
 *   3. If both satisfied AND no certificate yet exists → create certificate
 *   4. Returns the new or existing certificate (null if requirements not met)
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function checkAndIssueCertificate(
  userId: string,
  courseId: string
): Promise<{ issued: boolean; certificate: { id: string; certificateCode: string } | null }> {
  try {
    // ── 1. Verify learner is enrolled ──────────────────────────────────
    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrolment) return { issued: false, certificate: null };

    // ── 2. Check existing certificate (prevent duplicates) ────────────
    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) {
      return { issued: false, certificate: { id: existing.id, certificateCode: existing.certificateCode } };
    }

    // ── 3. Check all published lessons are complete ───────────────────
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
        assessments: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });
    if (!course) return { issued: false, certificate: null };

    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));

    if (allLessonIds.length > 0) {
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: { in: allLessonIds },
          completed: true,
        },
      });
      if (completedCount < allLessonIds.length) {
        // Not all lessons complete yet
        return { issued: false, certificate: null };
      }
    }

    // ── 4. Check all required assessments are PASSED ──────────────────
    const requiredAssessmentIds = course.assessments.map(a => a.id);

    if (requiredAssessmentIds.length > 0) {
      const passedCount = await prisma.assessmentSubmission.count({
        where: {
          userId,
          assessmentId: { in: requiredAssessmentIds },
          status: 'PASSED',
        },
      });
      if (passedCount < requiredAssessmentIds.length) {
        // Not all assessments passed yet
        return { issued: false, certificate: null };
      }
    }

    // ── 5. All requirements met — issue certificate ────────────────────
    const code = `ES-${courseId.slice(0, 6).toUpperCase()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateCode: code,
      },
    });

    // Mark enrolment as complete
    await prisma.enrolment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { completedAt: new Date() },
    });

    console.log(`[CertService] Certificate issued: ${code} for user ${userId} on course ${courseId}`);
    return { issued: true, certificate: { id: certificate.id, certificateCode: certificate.certificateCode } };

  } catch (err) {
    console.error('[CertService] Error:', err);
    return { issued: false, certificate: null };
  }
}
