import { Request, Response, NextFunction } from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err.message?.startsWith('CORS:')) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }
  console.error(err.stack);
  // Never expose internal error details (Prisma messages, stack frames,
  // column names, etc.) to clients in production — log server-side only.
  res.status(500).json({ error: IS_PRODUCTION ? 'Internal server error' : (err.message || 'Internal server error') });
}
