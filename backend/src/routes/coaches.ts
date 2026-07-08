import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Only ever return coaches that are verified, published, and not
// archived. Public users can never see draft/unverified/archived
// profiles — that's controlled entirely by admin.ts.
const PUBLIC_WHERE = { isVerified: true, isPublished: true, isArchived: false } as const;

const PUBLIC_SELECT = {
  id: true,
  slug: true,
  displayName: true,
  bio: true,
  photoUrl: true,
  location: true,
  region: true,
  specialities: true,
  qualificationSummary: true,
  contactEmail: true,
  contactUrl: true,
} as const;

// GET /api/coaches — public directory. Optional ?search=, ?location=, ?speciality=
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, location, speciality } = req.query as Record<string, string>;

    const where: Record<string, unknown> = { ...PUBLIC_WHERE };
    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (location) {
      where.OR = [
        ...(Array.isArray(where.OR) ? where.OR : []),
        { location: { contains: location, mode: 'insensitive' } },
        { region: { contains: location, mode: 'insensitive' } },
      ];
    }
    if (speciality) {
      where.specialities = { has: speciality };
    }

    const coaches = await prisma.coachProfile.findMany({
      where,
      select: PUBLIC_SELECT,
      orderBy: [{ sortOrder: 'asc' }, { displayName: 'asc' }],
    });

    res.json(coaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coaches' });
  }
});

// GET /api/coaches/:slug — public single profile
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const coach = await prisma.coachProfile.findFirst({
      where: { slug: req.params.slug, ...PUBLIC_WHERE },
      select: PUBLIC_SELECT,
    });

    if (!coach) {
      res.status(404).json({ error: 'Coach not found' });
      return;
    }

    res.json(coach);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coach' });
  }
});

export default router;
