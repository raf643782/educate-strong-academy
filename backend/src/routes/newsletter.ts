import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this IP. Please try again later.' },
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter — public, no auth required
//
// STUB: no persistent storage or email-service integration yet. Validates
// and logs the submission server-side so subscribers are never silently
// lost. Wire this to a real subscribers table (needs a Prisma migration)
// or an external provider (Mailchimp/Buttondown/etc.) once that decision
// is made.
router.post('/', newsletterLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }
    if (email.length > 200) {
      res.status(400).json({ error: 'Email address is too long.' });
      return;
    }
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    console.log(`[newsletter] subscribe request: ${email.trim().toLowerCase()}`);

    res.status(200).json({ message: "You're subscribed — welcome." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

export default router;
