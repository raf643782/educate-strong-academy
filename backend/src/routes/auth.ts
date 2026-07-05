import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendPasswordResetEmail } from '../services/emailService';

function makeAuthLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts. Please try again later.' },
  });
}

// Separate instances so a burst on one endpoint (e.g. failed logins)
// doesn't also lock a user out of an unrelated one (e.g. forgot-password).
const loginLimiter = makeAuthLimiter();
const registerLimiter = makeAuthLimiter();
const forgotPasswordLimiter = makeAuthLimiter();

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function isStrongPassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
}

const router = Router();
const prisma = new PrismaClient();

router.post('/register', registerLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters, include an uppercase letter and a number.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName },
    });

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'This account has been disabled. Contact EducateStrong for help.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, bio: true, location: true, createdAt: true },
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

// POST /auth/forgot-password
// Never reveals whether the email exists.
router.post('/forgot-password', forgotPasswordLimiter, async (req: Request, res: Response): Promise<void> => {
  const NEUTRAL = { message: 'If that email address is registered, you will receive a password reset link shortly.' };
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.json(NEUTRAL);
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      res.json(NEUTRAL);
      return;
    }

    // Invalidate any existing unused tokens for this user to prevent token accumulation
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const emailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      toName: user.firstName,
      resetToken: rawToken,
    });

    if (emailResult._devResetLink) {
      res.json({ ...NEUTRAL, _devResetLink: emailResult._devResetLink });
    } else {
      res.json(NEUTRAL);
    }
  } catch (err) {
    console.error('[forgot-password]', err);
    res.json(NEUTRAL);
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      res.status(400).json({ error: 'Token and new password are required.' });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters and contain an uppercase letter and a number.' });
      return;
    }

    const tokenHash = hashToken(token);
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
      res.status(400).json({ error: 'This reset link is invalid or has expired. Please request a new one.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    res.json({ message: 'Password updated successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('[reset-password]', err);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

export default router;
