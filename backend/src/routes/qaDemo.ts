import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// ── Internal QA demo login + demo data — TEMPORARY TOOLING ──────────────────
//
// Lets the team log in as any role, and prepare a small labelled set of
// course content, during handover QA — without creating accounts or test
// content by hand. This router is only mounted (see index.ts) when
// ENABLE_QA_DEMO_LOGIN=true and QA_DEMO_SECRET is set — with either
// missing, none of these routes exist (404).
//
// MUST be disabled before public launch: unset ENABLE_QA_DEMO_LOGIN (or set
// it to anything other than "true") in Render's environment settings.

const router = Router();
const prisma = new PrismaClient();

const VALID_ROLES = ['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'] as const;
type DemoRole = typeof VALID_ROLES[number];

const QA_COURSE_SLUG = 'qa-demo-course';
const QA_LABEL = '[QA DEMO]';

function demoEmail(role: DemoRole): string {
  return `qa.demo.${role.toLowerCase()}@educatestrong.test`;
}

function demoLastName(role: DemoRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

// Shared by both routes below — returns null (and writes the response)
// if the secret is missing/wrong, so callers can `if (!checkSecret(...)) return;`.
function checkSecret(req: Request, res: Response): boolean {
  const configuredSecret = process.env.QA_DEMO_SECRET;
  if (!configuredSecret) {
    // Defense in depth — index.ts should never mount this router without
    // a configured secret, but fail closed if it somehow is.
    res.status(404).json({ error: 'Not found' });
    return false;
  }
  const { secret } = req.body;
  if (typeof secret !== 'string' || secret !== configuredSecret) {
    res.status(403).json({ error: 'Invalid QA demo secret.' });
    return false;
  }
  return true;
}

// Finds or creates the demo account for a role. Never touches the real
// password field beyond an unusable random hash — this endpoint (and the
// login endpoint below) is the only door into these accounts.
async function ensureDemoUser(role: DemoRole) {
  const email = demoEmail(role);
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const randomPassword = crypto.randomBytes(24).toString('hex');
    const hashed = await bcrypt.hash(randomPassword, 12);
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: 'QA Demo',
        lastName: demoLastName(role),
        role,
        isActive: true,
      },
    });
  } else if (!user.isActive) {
    user = await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
  }

  return user;
}

router.post('/qa-demo-login', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!checkSecret(req, res)) return;

    const { role } = req.body;

    if (typeof role !== 'string' || !VALID_ROLES.includes(role as DemoRole)) {
      res.status(400).json({ error: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` });
      return;
    }

    const user = await ensureDemoUser(role as DemoRole);

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err) {
    console.error('[qa-demo-login]', err);
    res.status(500).json({ error: 'Demo login failed.' });
  }
});

// POST /qa-demo-setup — create or repair the minimum demo content needed to
// actually test learner/assessor functionality, not just role access.
//
// Idempotent: every step finds-or-creates by a fixed label, so clicking
// this twice never creates duplicates. It deliberately does NOT touch an
// existing QA demo submission's status — re-running "prepare" must never
// undo an assessor's grading decision made during testing.
//
// Everything created here is prefixed "[QA DEMO]", uses no real emails,
// issues no certificates, and the course is left unpublished so it never
// appears on the public course catalogue.
router.post('/qa-demo-setup', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!checkSecret(req, res)) return;

    const learner = await ensureDemoUser('LEARNER');

    const course = await prisma.course.upsert({
      where: { slug: QA_COURSE_SLUG },
      update: {},
      create: {
        title: `${QA_LABEL} Course`,
        slug: QA_COURSE_SLUG,
        description: 'Internal QA testing course. Not a real EducateStrong course — contains no real business content.',
        summary: 'Used to test learner and assessor functionality during handover QA.',
        pathway: 'COACHING',
        level: 1,
        isPublished: false, // never shows on the public /courses catalogue
        sortOrder: 0,
      },
    });

    let module = await prisma.module.findFirst({
      where: { courseId: course.id, title: `${QA_LABEL} Module 1` },
    });
    if (!module) {
      module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: `${QA_LABEL} Module 1`,
          description: 'Internal QA testing module.',
          sortOrder: 0,
          isPublished: true,
        },
      });
    }

    let lesson = await prisma.lesson.findFirst({
      where: { moduleId: module.id, title: `${QA_LABEL} Lesson 1` },
    });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: `${QA_LABEL} Lesson 1`,
          content: 'This is a QA demo lesson used for internal testing only. It contains no real coursework content.',
          type: 'TEXT',
          sortOrder: 0,
          isPublished: true,
        },
      });
    }

    let document = await prisma.courseDocument.findFirst({
      where: { courseId: course.id, title: `${QA_LABEL} Resource` },
    });
    if (!document) {
      document = await prisma.courseDocument.create({
        data: {
          courseId: course.id,
          title: `${QA_LABEL} Resource`,
          description: 'Internal QA testing resource — no real file attached.',
          type: 'RESOURCE',
          status: 'AVAILABLE',
          fileUrl: null,
          isPublished: true,
          sortOrder: 0,
        },
      });
    }

    let assessment = await prisma.assessment.findFirst({
      where: { courseId: course.id, title: `${QA_LABEL} Assessment` },
    });
    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          courseId: course.id,
          title: `${QA_LABEL} Assessment`,
          description: 'Internal QA testing assessment for the assessor review queue.',
          type: 'WRITTEN_SCENARIO',
          passMark: 75,
          maxAttempts: 3,
          isActive: true,
        },
      });
    }

    const enrolment = await prisma.enrolment.upsert({
      where: { userId_courseId: { userId: learner.id, courseId: course.id } },
      update: {},
      create: { userId: learner.id, courseId: course.id },
    });

    let submission = await prisma.assessmentSubmission.findFirst({
      where: { assessmentId: assessment.id, userId: learner.id },
    });
    if (!submission) {
      submission = await prisma.assessmentSubmission.create({
        data: {
          assessmentId: assessment.id,
          userId: learner.id,
          content: `${QA_LABEL} Sample submission for testing the assessor review queue. Not real coursework.`,
          status: 'PENDING',
        },
      });
    }

    res.json({
      message: 'QA demo data is ready.',
      course: { id: course.id, slug: course.slug, title: course.title },
      module: { id: module.id, title: module.title },
      lesson: { id: lesson.id, title: lesson.title },
      document: { id: document.id, title: document.title },
      assessment: { id: assessment.id, title: assessment.title },
      enrolment: { id: enrolment.id },
      submission: { id: submission.id, status: submission.status },
      learnerEmail: learner.email,
    });
  } catch (err) {
    console.error('[qa-demo-setup]', err);
    res.status(500).json({ error: 'Failed to prepare QA demo data.' });
  }
});

export default router;
