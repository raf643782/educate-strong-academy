import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    // Re-checked on every request (not just at login) so a disabled account
    // loses access immediately, even with a still-valid 7-day token.
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { isActive: true } });
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'This account has been disabled.' });
      return;
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

/*
 * Soft-gating helper for public routes that show more to logged-in
 * users without requiring login. Unlike authenticate(), this NEVER
 * blocks the request — no token, an expired token, or a disabled
 * account all just fall through as anonymous (req.userId stays
 * undefined). Does not replace or alter authenticate() anywhere it's
 * already used.
 */
export async function optionalAuthenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { isActive: true } });
    if (user && user.isActive) {
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    }
  } catch {
    // Invalid/expired token — proceed as anonymous, don't block.
  }
  next();
}
