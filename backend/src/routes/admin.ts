import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/stats
router.get('/stats', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [users, courses, enrolments, certificates, submissions] = await Promise.all([
      prisma.user.count({ where: { role: 'LEARNER' } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrolment.count(),
      prisma.certificate.count(),
      prisma.assessmentSubmission.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({ users, courses, enrolments, certificates, pendingSubmissions: submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/courses
router.get('/courses', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { modules: true, enrolments: true } },
        modules: { include: { _count: { select: { lessons: true } } } },
      },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// POST /api/admin/courses
router.post('/courses', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, description, summary, pathway, level, durationHours, isPublished, sortOrder } = req.body;
    const course = await prisma.course.create({
      data: { title, slug, description, summary, pathway, level, durationHours, isPublished: isPublished ?? false, sortOrder: sortOrder ?? 0 },
    });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/admin/courses/:id
router.put('/courses/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, summary, isPublished, durationHours, sortOrder } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: { title, description, summary, isPublished, durationHours, sortOrder },
    });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

export default router;
