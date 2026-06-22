import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Stats ─────────────────────────────────────────────────────────────────────

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

// ── Courses ───────────────────────────────────────────────────────────────────

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

// GET /api/admin/courses/:id
router.get('/courses/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { modules: true, enrolments: true } },
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { lessons: true } },
            lessons: { orderBy: { sortOrder: 'asc' } },
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

// POST /api/admin/courses
router.post('/courses', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, summary, pathway, level, imageUrl, durationHours, prerequisites, isPublished, sortOrder } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Title is required.' });
      return;
    }
    if (!pathway) {
      res.status(400).json({ error: 'Pathway is required.' });
      return;
    }

    const slug = slugify(title.trim());

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ error: `A course with slug "${slug}" already exists. Use a different title.` });
      return;
    }

    const maxSort = await prisma.course.aggregate({ _max: { sortOrder: true } });
    const nextSort = sortOrder ?? (maxSort._max.sortOrder ?? 0) + 10;

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description ?? '',
        summary,
        pathway,
        level: level ?? 1,
        imageUrl,
        durationHours,
        prerequisites,
        isPublished: false, // always draft on creation
        sortOrder: nextSort,
      },
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
    const { title, description, summary, pathway, level, imageUrl, durationHours, prerequisites, isPublished, sortOrder } = req.body;

    // Pre-publish check
    if (isPublished === true) {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          modules: {
            where: { isPublished: true },
            include: { lessons: { where: { isPublished: true }, take: 1 } },
          },
        },
      });
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      const hasPublishedLesson = course.modules.some(m => m.lessons.length > 0);
      if (!hasPublishedLesson) {
        res.status(400).json({
          error: 'Cannot publish: this course needs at least one published module with at least one published lesson.',
        });
        return;
      }
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (summary !== undefined) data.summary = summary;
    if (pathway !== undefined) data.pathway = pathway;
    if (level !== undefined) data.level = level;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (durationHours !== undefined) data.durationHours = durationHours;
    if (prerequisites !== undefined) data.prerequisites = prerequisites;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const course = await prisma.course.update({ where: { id }, data });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const enrolmentCount = await prisma.enrolment.count({ where: { courseId: id } });
    if (enrolmentCount > 0) {
      res.status(409).json({
        error: `Cannot delete: ${enrolmentCount} learner(s) are enrolled. Unpublish the course instead.`,
        suggestion: 'unpublish',
      });
      return;
    }

    // Check for lesson progress in any lesson of this course
    const course = await prisma.course.findUnique({
      where: { id },
      include: { modules: { include: { lessons: { select: { id: true } } } } },
    });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const lessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (lessonIds.length > 0) {
      const progressCount = await prisma.lessonProgress.count({ where: { lessonId: { in: lessonIds } } });
      if (progressCount > 0) {
        res.status(409).json({
          error: 'Cannot delete: learner progress exists for lessons in this course. Unpublish the course instead.',
          suggestion: 'unpublish',
        });
        return;
      }
    }

    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ── Modules ───────────────────────────────────────────────────────────────────

// GET /api/admin/courses/:id/modules
router.get('/courses/:id/modules', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const modules = await prisma.module.findMany({
      where: { courseId: req.params.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { lessons: true } },
        lessons: { orderBy: { sortOrder: 'asc' } },
      },
    });
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// POST /api/admin/courses/:id/modules
router.post('/courses/:id/modules', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const { title, description, sortOrder, isPublished } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Module title is required.' });
      return;
    }

    const maxSort = await prisma.module.aggregate({ where: { courseId }, _max: { sortOrder: true } });
    const nextSort = sortOrder ?? (maxSort._max.sortOrder ?? 0) + 10;

    const module = await prisma.module.create({
      data: {
        courseId,
        title: title.trim(),
        description,
        sortOrder: nextSort,
        isPublished: isPublished ?? false,
      },
      include: { _count: { select: { lessons: true } }, lessons: true },
    });
    res.status(201).json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

// PUT /api/admin/modules/:id
router.put('/modules/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, sortOrder, isPublished } = req.body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const module = await prisma.module.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { lessons: true } }, lessons: { orderBy: { sortOrder: 'asc' } } },
    });
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// DELETE /api/admin/modules/:id
router.delete('/modules/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mod = await prisma.module.findUnique({
      where: { id: req.params.id },
      include: { lessons: { select: { id: true } } },
    });
    if (!mod) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    const lessonIds = mod.lessons.map(l => l.id);
    if (lessonIds.length > 0) {
      const progressCount = await prisma.lessonProgress.count({ where: { lessonId: { in: lessonIds } } });
      if (progressCount > 0) {
        res.status(409).json({
          error: 'Cannot delete: learner progress exists for lessons in this module. Unpublish the module instead.',
          suggestion: 'unpublish',
        });
        return;
      }
    }

    await prisma.module.delete({ where: { id: req.params.id } });
    res.json({ message: 'Module deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// ── Lessons ───────────────────────────────────────────────────────────────────

// GET /api/admin/modules/:id/lessons
router.get('/modules/:id/lessons', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId: req.params.id },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// POST /api/admin/modules/:id/lessons
router.post('/modules/:id/lessons', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const moduleId = req.params.id;
    const { title, content, type, videoUrl, resourceUrl, durationMinutes, sortOrder, isPublished } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Lesson title is required.' });
      return;
    }

    const maxSort = await prisma.lesson.aggregate({ where: { moduleId }, _max: { sortOrder: true } });
    const nextSort = sortOrder ?? (maxSort._max.sortOrder ?? 0) + 10;

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title: title.trim(),
        content,
        type: type ?? 'TEXT',
        videoUrl,
        resourceUrl,
        durationMinutes,
        sortOrder: nextSort,
        isPublished: isPublished ?? false,
      },
    });
    res.status(201).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, type, videoUrl, resourceUrl, durationMinutes, sortOrder, isPublished } = req.body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (type !== undefined) data.type = type;
    if (videoUrl !== undefined) data.videoUrl = videoUrl;
    if (resourceUrl !== undefined) data.resourceUrl = resourceUrl;
    if (durationMinutes !== undefined) data.durationMinutes = durationMinutes;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// DELETE /api/admin/lessons/:id
router.delete('/lessons/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lessonId = req.params.id;
    const progressCount = await prisma.lessonProgress.count({ where: { lessonId } });
    if (progressCount > 0) {
      res.status(409).json({
        error: 'Cannot delete: learner progress exists for this lesson. Unpublish the lesson instead.',
        suggestion: 'unpublish',
      });
      return;
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    res.json({ message: 'Lesson deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// ── Documents ─────────────────────────────────────────────────────────────────

// GET /api/admin/documents
router.get('/documents', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documents = await prisma.courseDocument.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/admin/documents
router.post('/documents', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, type, status, courseId, fileUrl, fileType, fileSizeMb, sortOrder, isPublished } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Title is required.' });
      return;
    }

    const resolvedStatus = status ?? 'COMING_SOON';

    if (resolvedStatus === 'AVAILABLE' && (!fileUrl || !fileUrl.trim())) {
      res.status(400).json({ error: 'A file URL is required when status is AVAILABLE.' });
      return;
    }

    const maxSort = await prisma.courseDocument.aggregate({ _max: { sortOrder: true } });
    const nextSort = sortOrder ?? (maxSort._max.sortOrder ?? 0) + 10;

    const doc = await prisma.courseDocument.create({
      data: {
        title: title.trim(),
        description: description ?? null,
        type: type ?? 'RESOURCE',
        status: resolvedStatus,
        courseId: courseId || null,
        fileUrl: fileUrl?.trim() || null,
        fileType: fileType ?? 'PDF',
        fileSizeMb: fileSizeMb ? Number(fileSizeMb) : null,
        sortOrder: nextSort,
        isPublished: isPublished ?? false,
      },
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// PUT /api/admin/documents/:id
router.put('/documents/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, type, status, courseId, fileUrl, fileType, fileSizeMb, sortOrder, isPublished } = req.body;

    if (status === 'AVAILABLE' && fileUrl !== undefined && (!fileUrl || !fileUrl.trim())) {
      res.status(400).json({ error: 'A file URL is required when status is AVAILABLE.' });
      return;
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (courseId !== undefined) data.courseId = courseId || null;
    if (fileUrl !== undefined) data.fileUrl = fileUrl?.trim() || null;
    if (fileType !== undefined) data.fileType = fileType;
    if (fileSizeMb !== undefined) data.fileSizeMb = fileSizeMb ? Number(fileSizeMb) : null;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const doc = await prisma.courseDocument.update({
      where: { id: req.params.id },
      data,
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /api/admin/documents/:id
router.delete('/documents/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.courseDocument.delete({ where: { id: req.params.id } });
    res.json({ message: 'Document deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
