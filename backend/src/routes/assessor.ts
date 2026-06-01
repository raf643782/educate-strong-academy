import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/assessor/queue
router.get('/queue', authenticate, requireRole('ASSESSOR', 'ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.assessmentSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assessment: { select: { id: true, title: true, type: true } },
      },
      orderBy: { submittedAt: 'asc' },
    });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// GET /api/assessor/submissions
router.get('/submissions', authenticate, requireRole('ASSESSOR', 'ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.assessmentSubmission.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assessment: { select: { id: true, title: true, type: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
