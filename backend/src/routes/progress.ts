import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { checkAndIssueCertificate } from '../services/certificateService';

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
// After marking complete, runs the certificate trigger asynchronously.
router.post('/complete/:lessonId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const userId = req.userId!;

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    // Find which course this lesson belongs to, then check for certificate
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    });

    let certificateIssued = false;
    if (lesson?.module?.courseId) {
      const certResult = await checkAndIssueCertificate(userId, lesson.module.courseId);
      certificateIssued = certResult.issued;
    }

    res.json({ progress, certificateIssued });
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

    // Only count published lessons — unpublished lessons must not inflate or deflate progress
    const modules = await prisma.module.findMany({
      where: { courseId, isPublished: true },
      include: { lessons: { where: { isPublished: true }, select: { id: true } } },
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
