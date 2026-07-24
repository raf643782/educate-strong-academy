import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/lessons/:id
// Requires authentication. Full lesson content (including videoUrl/resourceUrl)
// is only returned to an ADMIN or a user enrolled in the course that contains
// this lesson — the same enrolment rule already enforced for course documents
// in documents.ts. There is no separate lesson-level lock concept in the data
// model today (unlike CourseDocument.status), so enrolment is the only gate.
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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

    const isAdmin = req.userRole === 'ADMIN';
    if (!isAdmin) {
      const enrolment = await prisma.enrolment.findUnique({
        where: { userId_courseId: { userId: req.userId!, courseId: lesson.module.course.id } },
      });
      if (!enrolment) {
        res.status(403).json({
          error: 'You are not enrolled in this course.',
          message: 'This lesson is included inside the full learner pathway. ' +
                   'Register your interest or contact EducateStrong to access the learner pathway.',
        });
        return;
      }
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router;
