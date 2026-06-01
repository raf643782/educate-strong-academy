import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/exercises/categories  (must be before /:slug)
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { isPublished: true },
      select: { category: true },
    });
    const categoryCount: Record<string, number> = {};
    for (const e of exercises) {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    }
    res.json(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/exercises
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty } = req.query;
    const exercises = await prisma.exercise.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: String(category) } : {}),
        ...(difficulty ? { difficulty: String(difficulty) as any } : {}),
      },
      orderBy: [{ isLaunchPriority: 'desc' }, { name: 'asc' }],
    });
    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// GET /api/exercises/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { slug: req.params.slug },
    });
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }
    res.json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

export default router;
