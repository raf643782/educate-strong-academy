import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/events/categories  (must be before /:slug)
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      select: { category: true },
    });
    const categoryCount: Record<string, number> = {};
    for (const e of events) {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    }
    res.json(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/events
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: String(category) } : {}),
      },
      orderBy: [{ isLaunchPriority: 'desc' }, { name: 'asc' }],
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: req.params.slug },
    });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;
