import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/register-interest — public, no auth required
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, courseInterest, locationInterest, message, sourcePage } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'First name, last name, and email are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    await prisma.registerInterest.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        courseInterest: courseInterest?.trim() || null,
        locationInterest: locationInterest?.trim() || null,
        message: message?.trim() || null,
        sourcePage: sourcePage?.trim() || null,
        status: 'NEW',
      },
    });

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
