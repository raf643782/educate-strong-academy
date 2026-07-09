/**
 * /api/documents
 *
 * GET /                        — all documents for enrolled courses + platform-wide
 * GET /course/:courseId        — documents for a specific course
 * GET /:documentId/download    — placeholder download endpoint
 *
 * File hosting note:
 *   fileUrl is stored as metadata. Real file download requires S3 or equivalent.
 *   Until storage is configured, the download endpoint returns a safe placeholder
 *   response. When S3 is added, replace with a signed URL generation step.
 */

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

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
// actually allows access — before ever touching fileUrl.
//
// NEXT STEP: When S3 is configured, generate a pre-signed URL here and
// redirect the client to it. Example:
//   const signedUrl = await s3.getSignedUrlPromise('getObject', { Bucket, Key, Expires: 300 });
//   res.redirect(signedUrl);
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
        message: 'Document file hosting is not yet configured. ' +
                 'Contact educate.strongltd@gmail.com to request this document directly. ' +
                 'File storage (S3 or equivalent) will be integrated in Phase 3.',
        document: { id: doc.id, title: doc.title, type: doc.type },
      });
      return;
    }

    // Status AVAILABLE (or ADMIN override) with a real fileUrl — safe to redirect.
    res.redirect(doc.fileUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process download.' });
  }
});

export default router;
