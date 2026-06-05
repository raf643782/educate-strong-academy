/**
 * /api/assessments
 *
 * Learner endpoints:
 *   GET  /my                          — all submissions for the logged-in learner
 *   GET  /:assessmentId               — single assessment details + learner's submission
 *   POST /:assessmentId/submit        — submit or resubmit coursework
 *
 * Assessor / Admin endpoints:
 *   PATCH /submissions/:submissionId  — update status + feedback (grade)
 *
 * File upload:
 *   fileUrl is stored as metadata only (no binary storage yet).
 *   When S3 or equivalent is configured, replace fileUrl with the
 *   signed upload URL returned from the storage service.
 */

import { Router, Response } from 'express';
import { PrismaClient, SubmissionStatus } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { checkAndIssueCertificate } from '../services/certificateService';

const router = Router();
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// LEARNER — GET /api/assessments/my
// Returns all assessments for courses the learner is enrolled in,
// with the learner's latest submission per assessment.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // Get all courses the learner is enrolled in
    const enrolments = await prisma.enrolment.findMany({
      where: { userId },
      select: { courseId: true },
    });
    const courseIds = enrolments.map(e => e.courseId);

    if (courseIds.length === 0) {
      res.json([]);
      return;
    }

    // Get all active assessments for those courses
    const assessments = await prisma.assessment.findMany({
      where: {
        courseId: { in: courseIds },
        isActive: true,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        submissions: {
          where: { userId },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ courseId: 'asc' }, { createdAt: 'asc' }],
    });

    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// LEARNER — GET /api/assessments/:assessmentId
// Single assessment + learner's submission history
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:assessmentId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assessmentId } = req.params;
    const userId = req.userId!;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        submissions: {
          where: { userId },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// LEARNER — POST /api/assessments/:assessmentId/submit
// Create or resubmit coursework.
// Body: { content: string, fileUrl?: string }
//
// Rules:
//   - Cannot submit if latest submission is PASSED
//   - Cannot submit if latest submission is IN_REVIEW (wait for assessor)
//   - Can submit if no previous submission, or if status is
//     PENDING / NEEDS_CHANGES / FAILED / REFERRED
//   - Counts attempts against maxAttempts
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:assessmentId/submit', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assessmentId } = req.params;
    const userId = req.userId!;
    const { content, fileUrl } = req.body as { content?: string; fileUrl?: string };

    if (!content && !fileUrl) {
      res.status(400).json({ error: 'Submission must include content or a file reference.' });
      return;
    }

    // Load assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        submissions: {
          where: { userId },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!assessment || !assessment.isActive) {
      res.status(404).json({ error: 'Assessment not found or inactive.' });
      return;
    }

    // Check learner is enrolled in this course
    if (assessment.courseId) {
      const enrolment = await prisma.enrolment.findUnique({
        where: { userId_courseId: { userId, courseId: assessment.courseId } },
      });
      if (!enrolment) {
        res.status(403).json({ error: 'You are not enrolled in this course.' });
        return;
      }
    }

    const latestSubmission = assessment.submissions[0];
    const attemptsMade = assessment.submissions.length;

    // Block if already passed
    if (latestSubmission?.status === 'PASSED') {
      res.status(409).json({ error: 'This assessment has already been passed and cannot be resubmitted.' });
      return;
    }

    // Block if currently under review
    if (latestSubmission?.status === 'IN_REVIEW') {
      res.status(409).json({ error: 'Your submission is currently being reviewed. Please wait for feedback before resubmitting.' });
      return;
    }

    // Check attempt limit
    if (attemptsMade >= assessment.maxAttempts) {
      res.status(429).json({
        error: `Maximum attempts (${assessment.maxAttempts}) reached for this assessment.`,
        attemptsMade,
        maxAttempts: assessment.maxAttempts,
      });
      return;
    }

    // Create submission
    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId,
        userId,
        content: content ?? null,
        fileUrl: fileUrl ?? null,
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });

    res.status(201).json({
      message: 'Submission received. Your work is now awaiting assessor review.',
      submission,
      attemptsRemaining: assessment.maxAttempts - (attemptsMade + 1),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create submission.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ASSESSOR / ADMIN — PATCH /api/assessments/submissions/:submissionId
// Grade a submission: update status, feedback, score.
// Body: { status: SubmissionStatus, feedback?: string, score?: number }
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/submissions/:submissionId',
  authenticate,
  requireRole('ASSESSOR', 'ADMIN'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { submissionId } = req.params;
      const gradedById = req.userId!;
      const { status, feedback, score } = req.body as {
        status: SubmissionStatus;
        feedback?: string;
        score?: number;
      };

      const allowedStatuses: SubmissionStatus[] = [
        'IN_REVIEW', 'PASSED', 'FAILED', 'REFERRED', 'NEEDS_CHANGES',
      ];

      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
        });
        return;
      }

      const existing = await prisma.assessmentSubmission.findUnique({
        where: { id: submissionId },
        include: { assessment: { select: { courseId: true } } },
      });

      if (!existing) {
        res.status(404).json({ error: 'Submission not found.' });
        return;
      }

      // Update submission
      const updated = await prisma.assessmentSubmission.update({
        where: { id: submissionId },
        data: {
          status,
          feedback: feedback ?? existing.feedback,
          score: score ?? existing.score,
          gradedAt: new Date(),
          gradedById,
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          assessment: { select: { id: true, title: true, type: true, courseId: true } },
        },
      });

      // If PASSED and assessment is linked to a course — trigger certificate check
      if (status === 'PASSED' && existing.assessment.courseId) {
        const certResult = await checkAndIssueCertificate(
          existing.userId,
          existing.assessment.courseId
        );
        if (certResult.issued) {
          console.log(`[Assessor] Certificate auto-issued for submission ${submissionId}`);
        }
      }

      res.json({
        message: `Submission marked as ${status}.`,
        submission: updated,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update submission.' });
    }
  }
);

export default router;
