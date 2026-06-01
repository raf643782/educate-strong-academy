import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/progress/start/:lessonId
router.post('/start/:lessonId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const userId = req.userId!;

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, startedAt: new Date() },
      update: {},
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start lesson' });
  }
});

// POST /api/progress/complete/:lessonId
router.post('/complete/:lessonId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const userId = req.userId!;

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// GET /api/progress/course/:courseId
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.userId!;

    // Get all lessons for this course
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: { select: { id: true } },
      },
    });

    const lessonIds = modules.flatMap(m => m.lessons.map(l => l.id));

    const progressRecords = await prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
    });

    const totalLessons = lessonIds.length;
    const completedLessons = progressRecords.filter(p => p.completed).length;
    const percentComplete = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      percentComplete,
      progress: progressRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
