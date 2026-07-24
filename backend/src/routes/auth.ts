import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/emailService';
import { JWT_SECRET } from '../config/jwtSecret';

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
const verifyEmailLimiter = makeAuthLimiter();
const resendVerificationLimiter = makeAuthLimiter();

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function isStrongPassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
}

const router = Router();
const prisma = new PrismaClient();

// Same generation/storage discipline as password reset: a 32-byte
// random token, only ever persisted as its SHA-256 hash. Deletes any
// existing unused token for the user first, so only the latest link is
// ever valid. Soft verification only — never touches role, enrolment,
// or access level.
async function issueEmailVerificationToken(userId: string): Promise<string> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId, usedAt: null } });
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await prisma.emailVerificationToken.create({ data: { userId, tokenHash, expiresAt } });
  return rawToken;
}

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

    // Best-effort — registration succeeds regardless of whether this
    // send works. Soft verification: never blocks login, dashboard
    // access, or account creation itself.
    try {
      const verificationToken = await issueEmailVerificationToken(user.id);
      await sendVerificationEmail({ toEmail: user.email, toName: user.firstName, verificationToken });
    } catch (err) {
      console.error('[register] Failed to issue/send verification email:', err instanceof Error ? err.message : err);
    }

    const secret = JWT_SECRET;
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: user.emailVerified },
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

    const secret = JWT_SECRET;
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: user.emailVerified },
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
      select: { id: true, email: true, firstName: true, lastName: true, role: true, emailVerified: true, avatarUrl: true, bio: true, location: true, createdAt: true },
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

// POST /auth/verify-email
// Public (not authenticated) — the token itself is the credential,
// exactly like reset-password. Requires an explicit request from the
// frontend (a button click), not a bare GET, so email-client link
// scanners can't silently burn the single-use token before the real
// user opens the message. Soft verification only: sets emailVerified
// and nothing else — no role, enrolment, or access-level change.
router.post('/verify-email', verifyEmailLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const tokenHash = hashToken(token);
    const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
      res.status(400).json({ error: 'This verification link is invalid or has expired. Please request a new one.' });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
      prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('[verify-email]', err);
    res.status(500).json({ error: 'Failed to verify email. Please try again.' });
  }
});

// POST /auth/resend-verification
// Authenticated — the caller must already be logged in as the account
// in question, which is itself a safeguard against spamming someone
// else's inbox with verification emails (that would require already
// knowing their password).
router.post('/resend-verification', resendVerificationLimiter, authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.emailVerified) {
      res.json({ message: 'Your email is already verified.' });
      return;
    }

    const verificationToken = await issueEmailVerificationToken(user.id);
    const emailResult = await sendVerificationEmail({ toEmail: user.email, toName: user.firstName, verificationToken });

    if (!emailResult.success) {
      console.error('[resend-verification] Failed to send verification email, code:', emailResult.errorCode);
    }

    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    console.error('[resend-verification]', err);
    res.status(500).json({ error: 'Failed to resend verification email. Please try again.' });
  }
});

export default router;
