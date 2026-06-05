import { Router, Response } from 'express';
import { PrismaClient, SubmissionStatus } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/assessor/queue
// Returns pending submissions (status = PENDING or IN_REVIEW)
router.get('/queue', authenticate, requireRole('ASSESSOR', 'ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const whereStatus: SubmissionStatus[] = status
      ? [status as SubmissionStatus]
      : ['PENDING', 'IN_REVIEW'];

    const submissions = await prisma.assessmentSubmission.findMany({
      where: { status: { in: whereStatus } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assessment: {
          select: { id: true, title: true, type: true, courseId: true },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });

    res.json({
      count: submissions.length,
      submissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// GET /api/assessor/submissions
// Returns all submissions with optional status filter
router.get('/submissions', authenticate, requireRole('ASSESSOR', 'ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, courseId } = req.query;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (courseId) {
      // filter submissions for a specific course via assessment
      where.assessment = { courseId };
    }

    const submissions = await prisma.assessmentSubmission.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assessment: {
          select: { id: true, title: true, type: true, courseId: true },
          include: { course: { select: { title: true, slug: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    // Count by status for dashboard stats
    const stats = await prisma.assessmentSubmission.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    res.json({
      submissions,
      stats: Object.fromEntries(stats.map(s => [s.status, s._count.id])),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/assessor/submissions/:submissionId
// Single submission full detail
router.get('/submissions/:submissionId', authenticate, requireRole('ASSESSOR', 'ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.assessmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assessment: {
          include: { course: { select: { id: true, title: true, slug: true } } },
        },
      },
    });

    if (!submission) {
      res.status(404).json({ error: 'Submission not found.' });
      return;
    }

    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submission.' });
  }
});

export default router;
