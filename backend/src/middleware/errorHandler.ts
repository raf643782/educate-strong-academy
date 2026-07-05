import { Request, Response, NextFunction } from 'express';

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
  res.status(500).json({ error: err.message || 'Internal server error' });
}
