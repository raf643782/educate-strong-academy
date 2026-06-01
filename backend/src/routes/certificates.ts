import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/certificates/my
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.userId },
      include: {
        course: { select: { id: true, title: true, pathway: true, level: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
    res.json(certificates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /api/certificates/verify/:code — public
router.get('/verify/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateCode: req.params.code },
      include: {
        user: { select: { firstName: true, lastName: true } },
        course: { select: { title: true, pathway: true, level: true } },
      },
    });
    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }
    res.json(certificate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

export default router;
