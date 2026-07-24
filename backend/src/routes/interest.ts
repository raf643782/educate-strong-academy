import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import { sendRegisterInterestNotification, sendRegisterInterestConfirmation } from '../services/emailService';

const router = Router();
const prisma = new PrismaClient();

const registerInterestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this IP. Please try again later.' },
});

// POST /api/register-interest — public, no auth required
router.post('/', registerInterestLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, courseInterest, locationInterest, message, sourcePage } = req.body;
    const isNewsletter = courseInterest === 'newsletter';

    if (!email || (!isNewsletter && (!firstName || !lastName))) {
      res.status(400).json({ error: isNewsletter ? 'Email is required.' : 'First name, last name, and email are required.' });
      return;
    }

    if (
      (firstName && String(firstName).length > 100) ||
      (lastName && String(lastName).length > 100) ||
      String(email).length > 200 ||
      (phone && String(phone).length > 40) ||
      (message && String(message).length > 2000)
    ) {
      res.status(400).json({ error: 'One or more fields exceed the maximum allowed length.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const record = await prisma.registerInterest.create({
      data: {
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || '',
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        courseInterest: courseInterest?.trim() || null,
        locationInterest: locationInterest?.trim() || null,
        message: message?.trim() || null,
        sourcePage: sourcePage?.trim() || null,
        status: 'NEW',
      },
    });

    // The lead is already safely saved above — nothing below this point
    // can lose it. Both emails are best-effort and tracked separately,
    // since one succeeding and the other failing is a normal outcome
    // (e.g. the submitter's address bounces but the owner notification
    // still lands fine). Failures here are never surfaced to the
    // submitter — the response stays the same either way.
    const [ownerResult, submitterResult] = await Promise.all([
      sendRegisterInterestNotification({
        firstName: record.firstName, lastName: record.lastName, email: record.email,
        phone: record.phone, courseInterest: record.courseInterest,
        locationInterest: record.locationInterest, message: record.message, sourcePage: record.sourcePage,
      }),
      sendRegisterInterestConfirmation({
        firstName: record.firstName, lastName: record.lastName, email: record.email,
        phone: record.phone, courseInterest: record.courseInterest,
        locationInterest: record.locationInterest, message: record.message, sourcePage: record.sourcePage,
      }),
    ]);

    try {
      await prisma.registerInterest.update({
        where: { id: record.id },
        data: {
          ownerNotifiedAt: ownerResult.success ? new Date() : null,
          ownerNotificationErrorCode: ownerResult.success ? null : ownerResult.errorCode,
          submitterConfirmationSentAt: submitterResult.success ? new Date() : null,
          submitterConfirmationErrorCode: submitterResult.success ? null : submitterResult.errorCode,
        },
      });
    } catch (trackingErr) {
      // Even if recording the delivery outcome fails, the lead itself
      // is already safely saved — this is observability only.
      console.error('[register-interest] Failed to record delivery tracking:', trackingErr instanceof Error ? trackingErr.message : trackingErr);
    }

    res.status(201).json({ message: 'Your interest has been registered. We will be in touch soon.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
});

// GET /api/register-interest/cohorts — public cohort listing
router.get('/cohorts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const cohorts = await prisma.cohort.findMany({
      where: { status: { not: 'CANCELLED' } },
      orderBy: [{ sortOrder: 'asc' }, { date: 'asc' }],
      include: { course: { select: { id: true, title: true, slug: true, pathway: true } } },
    });
    res.json(cohorts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cohorts' });
  }
});

export default router;
