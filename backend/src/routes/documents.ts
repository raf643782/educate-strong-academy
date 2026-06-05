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

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents
// Returns documents for all courses the learner is enrolled in,
// plus any platform-wide documents (courseId = null).
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { type, courseId } = req.query;

    // Get enrolled courses
    const enrolments = await prisma.enrolment.findMany({
      where: { userId },
      select: { courseId: true },
    });
    const enrolledCourseIds = enrolments.map(e => e.courseId);

    // Build filter
    const where: Record<string, unknown> = {
      isPublished: true,
      OR: [
        { courseId: null },                                    // platform-wide
        { courseId: { in: enrolledCourseIds } },              // enrolled courses
      ],
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

    // Lock certificate documents if course not completed
    const completedCourseIds = new Set(
      enrolments.filter(async () => {
        // We'll check completedAt in a simpler way below
        return false;
      }).map(e => e.courseId)
    );

    // Get completed enrolments for cert-locking logic
    const completedEnrolments = await prisma.enrolment.findMany({
      where: { userId, completedAt: { not: null } },
      select: { courseId: true },
    });
    const completedSet = new Set(completedEnrolments.map(e => e.courseId));

    const result = documents.map(doc => ({
      ...doc,
      // Certificate docs only available if course is completed
      status: doc.type === 'CERTIFICATE' && doc.courseId && !completedSet.has(doc.courseId)
        ? 'LOCKED'
        : doc.status,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/course/:courseId
// Documents for a specific course only.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.userId!;

    // Verify enrolled
    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrolment) {
      res.status(403).json({ error: 'You are not enrolled in this course.' });
      return;
    }

    const documents = await prisma.courseDocument.findMany({
      where: { courseId, isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.json(documents.map(doc => ({
      ...doc,
      status: doc.type === 'CERTIFICATE' && !enrolment.completedAt ? 'LOCKED' : doc.status,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course documents.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/:documentId/download
// Placeholder download endpoint.
// Returns the fileUrl if available; otherwise a clear error with next steps.
//
// NEXT STEP: When S3 is configured, generate a pre-signed URL here and
// redirect the client to it. Example:
//   const signedUrl = await s3.getSignedUrlPromise('getObject', { Bucket, Key, Expires: 300 });
//   res.redirect(signedUrl);
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:documentId/download', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;

    const doc = await prisma.courseDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc || !doc.isPublished) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    if (doc.fileUrl) {
      // If a real URL exists, redirect to it
      res.redirect(doc.fileUrl);
      return;
    }

    // No file stored yet
    res.status(503).json({
      error: 'File not yet available.',
      message: 'Document file hosting is not yet configured. ' +
               'Contact educate.strongltd@gmail.com to request this document directly. ' +
               'File storage (S3 or equivalent) will be integrated in Phase 3.',
      document: { id: doc.id, title: doc.title, type: doc.type },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process download.' });
  }
});

export default router;
