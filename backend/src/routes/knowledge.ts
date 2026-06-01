import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/knowledge
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: String(category) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/knowledge/categories
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.knowledgeArticle.findMany({
      where: { isPublished: true },
      select: { category: true },
    });

    const categoryCount: Record<string, number> = {};
    for (const a of articles) {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    }

    res.json(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/knowledge/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug: req.params.slug },
    });
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

export default router;
