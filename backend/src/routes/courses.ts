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

// POST /api/courses/enrol/:courseId
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

    const enrolment = await prisma.enrolment.create({
      data: { userId, courseId },
    });

    res.status(201).json({ message: 'Enrolled successfully', enrolment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enrol' });
  }
});

export default router;
