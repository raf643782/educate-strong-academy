import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/cpd/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.cPDLog.findMany({
      where: { userId: req.userId },
      orderBy: { loggedAt: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch CPD logs' });
  }
});

// POST /api/cpd/log
router.post('/log', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { activityType, description, hoursEarned, evidenceUrl } = req.body;
    if (!activityType || !description || !hoursEarned) {
      res.status(400).json({ error: 'activityType, description, and hoursEarned are required' });
      return;
    }

    const log = await prisma.cPDLog.create({
      data: {
        userId: req.userId!,
        activityType,
        description,
        hoursEarned: parseFloat(hoursEarned),
        evidenceUrl,
        status: 'PENDING',
      },
    });

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log CPD activity' });
  }
});

// GET /api/cpd/summary
router.get('/summary', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.cPDLog.findMany({
      where: { userId: req.userId },
    });

    const totalHours = logs.reduce((sum, l) => sum + l.hoursEarned, 0);
    const approvedHours = logs.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + l.hoursEarned, 0);
    const pendingCount = logs.filter(l => l.status === 'PENDING').length;

    const byActivity: Record<string, number> = {};
    for (const log of logs) {
      byActivity[log.activityType] = (byActivity[log.activityType] || 0) + log.hoursEarned;
    }

    res.json({ totalHours, approvedHours, pendingCount, byActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch CPD summary' });
  }
});

export default router;
