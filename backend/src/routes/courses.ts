import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/courses — all published courses
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { modules: true, enrolments: true } },
        modules: {
          include: { _count: { select: { lessons: true } } },
        },
      },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/my — user's enrolments with progress (must be before /:slug)
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const enrolments = await prisma.enrolment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    // For each course, calculate progress
    const result = await Promise.all(enrolments.map(async enrolment => {
      const lessonIds = enrolment.course.modules.flatMap(m => m.lessons.map(l => l.id));
      const completed = await prisma.lessonProgress.count({
        where: { userId, lessonId: { in: lessonIds }, completed: true },
      });
      return {
        ...enrolment,
        progress: {
          total: lessonIds.length,
          completed,
          percent: lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0,
        },
      };
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enrolments' });
  }
});

// GET /api/courses/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        modules: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { sortOrder: 'asc' },
              select: { id: true, title: true, type: true, durationMinutes: true, sortOrder: true },
            },
          },
        },
      },
    });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// GET /api/courses/:slug/enrolled — check if current user is enrolled
router.get('/:slug/enrolled', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await prisma.course.findUnique({ where: { slug: req.params.slug }, select: { id: true } });
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: course.id } },
      select: { id: true },
    });
    res.json({ enrolled: !!enrolment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check enrolment' });
  }
});

// POST /api/courses/enrol/:courseId
//
// Public self-enrolment is intentionally disabled. Educate.Strong's
// courses are paid qualifications — course access must be granted by
// an admin (see POST /api/admin/enrolments), not created freely by an
// authenticated visitor. This route stays in place (rather than being
// removed) so it fails predictably with a clear message instead of a
// generic 404, and so it can be safely re-enabled later on a
// per-course basis if a genuinely free course is introduced.
router.post('/enrol/:courseId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.userId!;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const existing = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      res.json({ message: 'Already enrolled', enrolment: existing });
      return;
    }

    res.status(403).json({
      error: 'Course access is granted by Educate.Strong. Please register your interest and the team will confirm your enrolment.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check enrolment' });
  }
});

export default router;
