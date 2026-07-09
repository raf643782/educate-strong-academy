import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, optionalAuthenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/*
 * Soft-paywall access tiers for EatStrong content.
 * - FREE content is always visible, logged in or not.
 * - ENROLLED content needs at least one Enrolment (any course) — being
 *   an admin-granted learner is what "enrolled" means today; there is
 *   no separate paid-vs-free enrolment distinction yet.
 * - CERTIFIED content needs at least one issued Certificate. Certificate
 *   issuing is already owner-managed and admin-only (see
 *   certificateService.ts) — this only ever checks for a real, already
 *   -issued certificate. It never issues one and never fakes the check.
 * ADMIN always sees everything, for content management/preview.
 */
type AccessTier = 'CERTIFIED' | 'ENROLLED' | null;

async function getAccessTier(req: AuthRequest): Promise<AccessTier> {
  if (!req.userId) return null;
  if (req.userRole === 'ADMIN') return 'CERTIFIED';

  const [certCount, enrolCount] = await Promise.all([
    prisma.certificate.count({ where: { userId: req.userId } }),
    prisma.enrolment.count({ where: { userId: req.userId } }),
  ]);
  if (certCount > 0) return 'CERTIFIED';
  if (enrolCount > 0) return 'ENROLLED';
  return null;
}

function canAccess(required: string, tier: AccessTier): boolean {
  if (required === 'FREE') return true;
  if (required === 'ENROLLED') return tier === 'ENROLLED' || tier === 'CERTIFIED';
  if (required === 'CERTIFIED') return tier === 'CERTIFIED';
  return false;
}

// Category metadata — label, slug, description, icon colour
const CATEGORY_META: Record<string, { label: string; description: string; colour: string }> = {
  BASICS: {
    label: 'Strongman Nutrition Basics',
    description: 'Energy balance, macronutrients, protein, and the foundations of fuelling for strength sport.',
    colour: 'green',
  },
  COMPETITION: {
    label: 'Competition Nutrition',
    description: 'What to eat before, between, and after events on competition day.',
    colour: 'amber',
  },
  RECOVERY: {
    label: 'Recovery Nutrition',
    description: 'Post-training nutrition strategies to support adaptation and reduce soreness.',
    colour: 'blue',
  },
  MAKING_WEIGHT: {
    label: 'Making Weight',
    description: 'Weight category management, healthy cutting strategies, and scope-of-practice awareness.',
    colour: 'purple',
  },
  HYDRATION: {
    label: 'Hydration',
    description: 'Daily hydration, competition-day fluid management, and heat illness prevention.',
    colour: 'cyan',
  },
  SUPPLEMENTS: {
    label: 'Supplements and Scope of Practice',
    description: 'Evidence-based supplement review and the coach\'s responsibilities when discussing supplementation.',
    colour: 'red',
  },
  COACHES_GUIDE: {
    label: 'Nutrition for Coaches',
    description: 'How to have effective nutrition conversations with athletes without crossing professional boundaries.',
    colour: 'indigo',
  },
  YOUTH_NUTRITION: {
    label: 'Youth Nutrition',
    description: 'Age-appropriate nutritional guidance for StrongKidz coaches and young athletes.',
    colour: 'teal',
  },
  DOWNLOADS: {
    label: 'Templates and Downloads',
    description: 'Practical templates, trackers, and checklists for coaches and athletes.',
    colour: 'gray',
  },
};

// GET /api/be-strong/categories
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.beStrongArticle.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { id: true },
    });
    const downloads = await prisma.beStrongDownload.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { id: true },
    });

    const downloadCounts: Record<string, number> = {};
    for (const d of downloads) {
      downloadCounts[d.category] = d._count.id;
    }

    const categories = Object.entries(CATEGORY_META).map(([key, meta]) => {
      const articleCount = articles.find(a => a.category === key)?._count.id || 0;
      const downloadCount = downloadCounts[key] || 0;
      return {
        key,
        ...meta,
        articleCount,
        downloadCount,
        totalCount: articleCount + downloadCount,
      };
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/be-strong/featured — featured articles for hub landing
router.get('/featured', optionalAuthenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tier = await getAccessTier(req);
    const articles = await prisma.beStrongArticle.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
      select: {
        id: true, title: true, slug: true, category: true,
        summary: true, readMinutes: true, accessLevel: true, imageUrl: true,
      },
    });
    res.json(articles.map(a => ({ ...a, locked: !canAccess(a.accessLevel, tier) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// GET /api/be-strong/articles?category=BASICS
router.get('/articles', optionalAuthenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const tier = await getAccessTier(req);
    const articles = await prisma.beStrongArticle.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: String(category) as any } : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true, title: true, slug: true, category: true,
        summary: true, readMinutes: true, accessLevel: true,
        imageUrl: true, isFeatured: true, reviewerName: true,
        reviewerQualification: true, lastReviewedAt: true,
      },
    });
    res.json(articles.map(a => ({ ...a, locked: !canAccess(a.accessLevel, tier) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/be-strong/articles/:slug
// FREE articles: full content, logged in or not.
// ENROLLED/CERTIFIED articles: metadata + summary only unless the
// requester's access tier covers it — content is never sent to a
// requester who shouldn't see it, not just hidden client-side.
router.get('/articles/:slug', optionalAuthenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await prisma.beStrongArticle.findUnique({
      where: { slug: req.params.slug },
    });
    if (!article || !article.isPublished) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    const tier = await getAccessTier(req);
    const unlocked = canAccess(article.accessLevel, tier);
    res.json({ ...article, content: unlocked ? article.content : null, locked: !unlocked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// GET /api/be-strong/downloads?category=DOWNLOADS
// Free public page shows what resources exist either way; fileUrl is
// only ever included for a requester whose access tier covers it.
router.get('/downloads', optionalAuthenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const tier = await getAccessTier(req);
    const downloads = await prisma.beStrongDownload.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: String(category) as any } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(downloads.map(d => {
      const unlocked = canAccess(d.accessLevel, tier);
      return { ...d, fileUrl: unlocked ? d.fileUrl : null, locked: !unlocked };
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

// ── Admin routes ───────────────────────────────────────────────────────────────

// GET /api/be-strong/admin/articles
router.get('/admin/articles', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await prisma.beStrongArticle.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST /api/be-strong/admin/articles
router.post('/admin/articles', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await prisma.beStrongArticle.create({ data: req.body });
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// PUT /api/be-strong/admin/articles/:id
router.put('/admin/articles/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await prisma.beStrongArticle.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// GET /api/be-strong/admin/downloads
router.get('/admin/downloads', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const downloads = await prisma.beStrongDownload.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(downloads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

// GET /api/be-strong/admin/stats
router.get('/admin/stats', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalArticles, publishedArticles, totalDownloads, featuredArticles] = await Promise.all([
      prisma.beStrongArticle.count(),
      prisma.beStrongArticle.count({ where: { isPublished: true } }),
      prisma.beStrongDownload.count(),
      prisma.beStrongArticle.count({ where: { isFeatured: true } }),
    ]);
    res.json({ totalArticles, publishedArticles, totalDownloads, featuredArticles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
