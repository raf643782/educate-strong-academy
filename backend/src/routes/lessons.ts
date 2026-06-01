import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/lessons/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        module: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
            lessons: {
              where: { isPublished: true },
              orderBy: { sortOrder: 'asc' },
              select: { id: true, title: true, type: true, durationMinutes: true, sortOrder: true },
            },
          },
        },
        recommendations: {
          where: { isActive: true },
        },
      },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router;
