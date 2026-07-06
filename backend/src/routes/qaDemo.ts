import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// ── Internal QA demo login — TEMPORARY TOOLING ──────────────────────────────
//
// Lets the team log in as any role during handover QA without creating
// accounts by hand in Admin > Users. This router is only mounted (see
// index.ts) when ENABLE_QA_DEMO_LOGIN=true and QA_DEMO_SECRET is set — with
// either missing, /api/auth/qa-demo-login simply doesn't exist (404).
//
// MUST be disabled before public launch: unset ENABLE_QA_DEMO_LOGIN (or set
// it to anything other than "true") in Render's environment settings.

const router = Router();
const prisma = new PrismaClient();

const VALID_ROLES = ['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'] as const;
type DemoRole = typeof VALID_ROLES[number];

function demoEmail(role: DemoRole): string {
  return `qa.demo.${role.toLowerCase()}@educatestrong.test`;
}

function demoLastName(role: DemoRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

router.post('/qa-demo-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const configuredSecret = process.env.QA_DEMO_SECRET;
    if (!configuredSecret) {
      // Defense in depth — index.ts should never mount this router without
      // a configured secret, but fail closed if it somehow is.
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const { secret, role } = req.body;

    if (typeof secret !== 'string' || secret !== configuredSecret) {
      res.status(403).json({ error: 'Invalid QA demo secret.' });
      return;
    }

    if (typeof role !== 'string' || !VALID_ROLES.includes(role as DemoRole)) {
      res.status(400).json({ error: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` });
      return;
    }

    const demoRole = role as DemoRole;
    const email = demoEmail(demoRole);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Password is never used to log into this account — normal /auth/login
      // still requires the real password, this endpoint is the only door in.
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const hashed = await bcrypt.hash(randomPassword, 12);
      user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          firstName: 'QA Demo',
          lastName: demoLastName(demoRole),
          role: demoRole,
          isActive: true,
        },
      });
    } else if (!user.isActive) {
      user = await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
    }

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

export default router;
