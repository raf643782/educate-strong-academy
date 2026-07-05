import { Router, Response } from 'express';
import { PrismaClient, InterestStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

const VALID_ROLES = ['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStrongPassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
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

// ── Assessments ───────────────────────────────────────────────────────────────

// GET /api/admin/assessments
router.get('/assessments', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: [{ courseId: 'asc' }, { createdAt: 'asc' }],
      include: {
        course: { select: { id: true, title: true, slug: true } },
        _count: { select: { submissions: true } },
      },
    });
    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// POST /api/admin/assessments
router.post('/assessments', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, description, type, passMark, maxAttempts, isActive } = req.body;

    if (!courseId) {
      res.status(400).json({ error: 'courseId is required.' });
      return;
    }
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Title is required.' });
      return;
    }
    if (!type) {
      res.status(400).json({ error: 'Type is required.' });
      return;
    }

    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        title: title.trim(),
        description: description ?? null,
        type,
        passMark: passMark != null ? Number(passMark) : 75,
        maxAttempts: maxAttempts != null ? Number(maxAttempts) : 3,
        isActive: isActive ?? false,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        _count: { select: { submissions: true } },
      },
    });
    res.status(201).json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

// PUT /api/admin/assessments/:id
router.put('/assessments/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, description, type, passMark, maxAttempts, isActive } = req.body;
    const data: Record<string, unknown> = {};
    if (courseId !== undefined) data.courseId = courseId;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    if (passMark !== undefined) data.passMark = Number(passMark);
    if (maxAttempts !== undefined) data.maxAttempts = Number(maxAttempts);
    if (isActive !== undefined) data.isActive = isActive;

    const assessment = await prisma.assessment.update({
      where: { id: req.params.id },
      data,
      include: {
        course: { select: { id: true, title: true, slug: true } },
        _count: { select: { submissions: true } },
      },
    });
    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

// DELETE /api/admin/assessments/:id
router.delete('/assessments/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissionCount = await prisma.assessmentSubmission.count({ where: { assessmentId: req.params.id } });
    if (submissionCount > 0) {
      res.status(409).json({
        error: `Cannot delete: ${submissionCount} learner submission(s) exist. Set this assessment to inactive instead.`,
        suggestion: 'deactivate',
      });
      return;
    }
    await prisma.assessment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Assessment deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete assessment' });
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

// ── Users (Stage 3) ───────────────────────────────────────────────────────────

// GET /api/admin/users?role=&search=&page=&limit=
router.get('/users', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, avatarUrl: true, createdAt: true,
          _count: { select: { enrolments: true, certificates: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, avatarUrl: true, bio: true, location: true, createdAt: true,
        enrolments: {
          include: { course: { select: { id: true, title: true, slug: true, pathway: true } } },
          orderBy: { enrolledAt: 'desc' },
        },
        certificates: {
          include: { course: { select: { id: true, title: true } } },
          orderBy: { issuedAt: 'desc' },
        },
        _count: { select: { lessonProgress: true, assessmentSubmissions: true } },
      },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/admin/users — create a user with any role (admin-only)
//
// This is the only way a COACH, TUTOR, ASSESSOR, or ADMIN account can be
// created. Public registration (POST /api/auth/register) always creates
// LEARNER accounts and never reads a role from the request body.
router.post('/users', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      res.status(400).json({ error: 'First name, last name, email, password, and role are all required.' });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!VALID_ROLES.includes(role)) {
      res.status(400).json({ error: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters, include an uppercase letter and a number.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        role,
      },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// PUT /api/admin/users/:id  — update firstName, lastName, role only
router.put('/users/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.userId!;
    const targetId = req.params.id;
    const { firstName, lastName, role } = req.body;

    // Prevent admin from removing their own admin role
    if (role && role !== 'ADMIN' && adminId === targetId) {
      res.status(400).json({ error: 'You cannot change your own role.' });
      return;
    }

    const validRoles = ['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'];
    if (role && !validRoles.includes(role)) {
      res.status(400).json({ error: `Invalid role. Allowed: ${validRoles.join(', ')}` });
      return;
    }

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (role !== undefined) data.role = role;

    const user = await prisma.user.update({
      where: { id: targetId },
      data,
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ── Enrolments (Stage 4) ──────────────────────────────────────────────────────

// GET /api/admin/enrolments
router.get('/enrolments', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrolments = await prisma.enrolment.findMany({
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { select: { id: true, title: true, slug: true, pathway: true } },
      },
    });
    res.json(enrolments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enrolments' });
  }
});

// POST /api/admin/enrolments — enrol a learner onto a course
router.post('/enrolments', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      res.status(400).json({ error: 'userId and courseId are required.' });
      return;
    }

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, firstName: true, lastName: true } }),
      prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } }),
    ]);
    if (!user) { res.status(404).json({ error: 'User not found.' }); return; }
    if (!course) { res.status(404).json({ error: 'Course not found.' }); return; }

    const existing = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      res.status(409).json({ error: 'Learner is already enrolled in this course.' });
      return;
    }

    const enrolment = await prisma.enrolment.create({
      data: { userId, courseId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
    });
    res.status(201).json(enrolment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enrol learner' });
  }
});

// DELETE /api/admin/enrolments/:id — remove enrolment (blocked if progress exists)
router.delete('/enrolments/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrolment = await prisma.enrolment.findUnique({
      where: { id: req.params.id },
      include: { course: { include: { modules: { include: { lessons: { select: { id: true } } } } } } },
    });
    if (!enrolment) { res.status(404).json({ error: 'Enrolment not found.' }); return; }

    const lessonIds = enrolment.course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (lessonIds.length > 0) {
      const progressCount = await prisma.lessonProgress.count({
        where: { userId: enrolment.userId, lessonId: { in: lessonIds } },
      });
      if (progressCount > 0) {
        res.status(409).json({
          error: `Cannot remove: learner has recorded progress on this course (${progressCount} lesson${progressCount !== 1 ? 's' : ''} started or completed).`,
        });
        return;
      }
    }

    await prisma.enrolment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Enrolment removed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove enrolment' });
  }
});

// ── Certificates (Stage 6) ────────────────────────────────────────────────────

// GET /api/admin/certificates
router.get('/certificates', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const certs = await prisma.certificate.findMany({
      orderBy: { issuedAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { select: { id: true, title: true, pathway: true } },
      },
    });
    res.json(certs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// POST /api/admin/certificates — manually issue a certificate
router.post('/certificates', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      res.status(400).json({ error: 'userId and courseId are required.' });
      return;
    }

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } }),
    ]);
    if (!user) { res.status(404).json({ error: 'User not found.' }); return; }
    if (!course) { res.status(404).json({ error: 'Course not found.' }); return; }

    const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
    if (existing) {
      res.status(409).json({ error: 'A certificate for this learner and course already exists.' });
      return;
    }

    const { v4: uuidv4 } = await import('uuid');
    const code = `ES-${courseId.slice(0, 4).toUpperCase()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const cert = await prisma.certificate.create({
      data: { userId, courseId, certificateCode: code, issuedAt: new Date() },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { select: { id: true, title: true, pathway: true } },
      },
    });
    res.status(201).json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

// DELETE /api/admin/certificates/:id — revoke a certificate
router.delete('/certificates/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cert = await prisma.certificate.findUnique({ where: { id: req.params.id } });
    if (!cert) { res.status(404).json({ error: 'Certificate not found.' }); return; }
    await prisma.certificate.delete({ where: { id: req.params.id } });
    res.json({ message: 'Certificate revoked.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to revoke certificate' });
  }
});

// ── Register Interest (Stage 7) ───────────────────────────────────────────────

// GET /api/admin/register-interest
router.get('/register-interest', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query as Record<string, string>;
    const validStatuses = ['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'];
    const where = status && validStatuses.includes(status) ? { status: status as InterestStatus } : {};
    const submissions = await prisma.registerInterest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch register interest submissions' });
  }
});

// PUT /api/admin/register-interest/:id
router.put('/register-interest/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
      return;
    }
    const submission = await prisma.registerInterest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// ── Cohorts (Stage 7) ─────────────────────────────────────────────────────────

// GET /api/admin/cohorts
router.get('/cohorts', authenticate, requireRole('ADMIN'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cohorts = await prisma.cohort.findMany({
      orderBy: [{ sortOrder: 'asc' }, { date: 'asc' }],
      include: { course: { select: { id: true, title: true, slug: true, pathway: true } } },
    });
    res.json(cohorts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cohorts' });
  }
});

// POST /api/admin/cohorts
router.post('/cohorts', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, status, city, venue, date, capacity, bookingUrl, isConfirmed, sortOrder } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Title is required.' });
      return;
    }
    const maxSort = await prisma.cohort.aggregate({ _max: { sortOrder: true } });
    const cohort = await prisma.cohort.create({
      data: {
        courseId: courseId || null,
        title: title.trim(),
        status: status ?? 'UPCOMING',
        city: city || null,
        venue: venue || null,
        date: date ? new Date(date) : null,
        capacity: capacity ? Number(capacity) : null,
        bookingUrl: bookingUrl || null,
        isConfirmed: isConfirmed ?? false,
        sortOrder: sortOrder ?? (maxSort._max.sortOrder ?? 0) + 10,
      },
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
    res.status(201).json(cohort);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create cohort' });
  }
});

// PUT /api/admin/cohorts/:id
router.put('/cohorts/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, status, city, venue, date, capacity, bookingUrl, isConfirmed, sortOrder } = req.body;
    const data: Record<string, unknown> = {};
    if (courseId !== undefined) data.courseId = courseId || null;
    if (title !== undefined) data.title = title;
    if (status !== undefined) data.status = status;
    if (city !== undefined) data.city = city || null;
    if (venue !== undefined) data.venue = venue || null;
    if (date !== undefined) data.date = date ? new Date(date) : null;
    if (capacity !== undefined) data.capacity = capacity ? Number(capacity) : null;
    if (bookingUrl !== undefined) data.bookingUrl = bookingUrl || null;
    if (isConfirmed !== undefined) data.isConfirmed = isConfirmed;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const cohort = await prisma.cohort.update({
      where: { id: req.params.id },
      data,
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
    res.json(cohort);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cohort' });
  }
});

// DELETE /api/admin/cohorts/:id
router.delete('/cohorts/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.cohort.delete({ where: { id: req.params.id } });
    res.json({ message: 'Cohort deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cohort' });
  }
});

export default router;
