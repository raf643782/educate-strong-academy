/**
 * /api/documents
 *
 * GET /                        — all documents for enrolled courses + platform-wide
 * GET /course/:courseId        — documents for a specific course
 * GET /:documentId/download    — signed download URL (Cloudflare R2, Stage 4C)
 *
 * File hosting note:
 *   fileUrl stores a private R2 object key, not a public URL (Stage 4C).
 *   The download endpoint below re-verifies auth/enrolment/lock state on
 *   every request, then returns a short-lived signed GET URL as JSON —
 *   it never redirects to fileUrl directly, and the object key itself is
 *   never exposed to a caller who isn't authorised for this document.
 */

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { isR2Configured, getDownloadUrl } from '../lib/r2';

const router = Router();
const prisma = new PrismaClient();

/*
 * Effective access status for a document.
 * - CERTIFICATE-type documents tied to a course stay LOCKED until that
 *   course's enrolment shows completedAt — course completion (and
 *   therefore certificate issuing) is untouched, this only reads it.
 * - Anything else uses the status an admin set on the document directly.
 * ADMIN bypasses this entirely (see call sites) for content management.
 */
function effectiveStatus(
  doc: { status: string; type: string; courseId: string | null },
  completedAt: Date | null | undefined
): string {
  if (doc.type === 'CERTIFICATE' && doc.courseId && !completedAt) return 'LOCKED';
  return doc.status;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents
// Returns documents for all courses the learner is enrolled in,
// plus any platform-wide documents (courseId = null). fileUrl is only
// ever included for documents the requester can actually access.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const isAdmin = req.userRole === 'ADMIN';
    const { type, courseId } = req.query;

    const enrolments = await prisma.enrolment.findMany({
      where: { userId },
      select: { courseId: true, completedAt: true },
    });
    const enrolledCourseIds = enrolments.map(e => e.courseId);
    const completedAtByCourse = new Map(enrolments.map(e => [e.courseId, e.completedAt]));

    const where: Record<string, unknown> = {
      isPublished: true,
      ...(isAdmin ? {} : {
        OR: [
          { courseId: null },                       // platform-wide
          { courseId: { in: enrolledCourseIds } },  // enrolled courses
        ],
      }),
    };

    if (type) where.type = type;
    if (courseId) where.courseId = courseId;

    const documents = await prisma.courseDocument.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: [{ courseId: 'asc' }, { sortOrder: 'asc' }],
    });

    const result = documents.map(doc => {
      const status = effectiveStatus(doc, doc.courseId ? completedAtByCourse.get(doc.courseId) : null);
      const unlocked = isAdmin || status === 'AVAILABLE';
      return { ...doc, status, fileUrl: unlocked ? doc.fileUrl : null };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/course/:courseId
// Documents for a specific course only. Requires enrolment in that
// course, or ADMIN. fileUrl is only included for unlocked documents.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.userId!;
    const isAdmin = req.userRole === 'ADMIN';

    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrolment && !isAdmin) {
      res.status(403).json({
        error: 'You are not enrolled in this course.',
        message: 'These templates and documents are included inside the full learner pathway.',
      });
      return;
    }

    const documents = await prisma.courseDocument.findMany({
      where: { courseId, isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.json(documents.map(doc => {
      const status = effectiveStatus(doc, enrolment?.completedAt ?? null);
      const unlocked = isAdmin || status === 'AVAILABLE';
      return { ...doc, status, fileUrl: unlocked ? doc.fileUrl : null };
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course documents.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/:documentId/download
// Verifies, server side: the requester is authenticated, is enrolled in
// the document's course (or is ADMIN), and the document's status
// actually allows access — before ever touching fileUrl. Once authorised,
// generates a fresh short-lived signed GET URL and returns it as JSON;
// the object key itself is never returned to the client.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:documentId/download', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.userId!;
    const isAdmin = req.userRole === 'ADMIN';

    const doc = await prisma.courseDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc || !doc.isPublished) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    let completedAt: Date | null = null;
    if (!isAdmin && doc.courseId) {
      const enrolment = await prisma.enrolment.findUnique({
        where: { userId_courseId: { userId, courseId: doc.courseId } },
      });
      if (!enrolment) {
        res.status(403).json({
          error: 'You are not enrolled in this course.',
          message: 'These templates and documents are included inside the full learner pathway. ' +
                   'Register your interest or contact EducateStrong to access the learner pathway.',
        });
        return;
      }
      completedAt = enrolment.completedAt;
    }

    const status = isAdmin ? doc.status : effectiveStatus(doc, completedAt);

    if (!isAdmin && status === 'LOCKED') {
      res.status(403).json({
        error: 'Document locked.',
        message: 'This document is locked until you meet the course requirements.',
      });
      return;
    }

    if (status === 'COMING_SOON' || !doc.fileUrl) {
      res.status(503).json({
        error: 'File not yet available.',
        message: 'This document has not been uploaded yet. ' +
                 'Contact educate.strongltd@gmail.com to request it directly.',
        document: { id: doc.id, title: doc.title, type: doc.type },
      });
      return;
    }

    if (!isR2Configured()) {
      // Shouldn't normally happen (a real fileUrl only exists once the R2
      // upload flow has run), but fail safely rather than leak the object
      // key or throw if storage config is ever removed/misconfigured.
      res.status(503).json({
        error: 'Document storage is temporarily unavailable.',
        message: 'Please try again shortly, or contact educate.strongltd@gmail.com.',
      });
      return;
    }

    // Status AVAILABLE (or ADMIN override) with a real object key —
    // generate a fresh signed URL and return it as JSON. The frontend
    // opens this URL directly; it is never persisted or logged.
    const url = await getDownloadUrl(doc.fileUrl);
    res.json({ url });
  } catch (err) {
    console.error('[documents/download]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Failed to process download.' });
  }
});

export default router;
