import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

import authRouter from './routes/auth';
import coursesRouter from './routes/courses';
import lessonsRouter from './routes/lessons';
import progressRouter from './routes/progress';
import knowledgeRouter from './routes/knowledge';
import exercisesRouter from './routes/exercises';
import eventsRouter from './routes/events';
import assessorRouter from './routes/assessor';
import assessmentsRouter from './routes/assessments';
import documentsRouter from './routes/documents';
import adminRouter from './routes/admin';
import certificatesRouter from './routes/certificates';
import cpdRouter from './routes/cpd';
import bestrongRouter from './routes/bestrong';
import interestRouter from './routes/interest';
import coachesRouter from './routes/coaches';
import qaDemoRouter from './routes/qaDemo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Explicit production allowlist. Add to this list if and only if a new
// first-party origin needs credentialed API access. Never use a wildcard
// or substring match in production — it would allow any Vercel project
// or any site that shares a domain suffix to make authenticated requests.
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000',
  'https://educate-strong-academy.vercel.app', // Vercel production (current)
  'https://educatestrong.com',                  // apex — ready for domain cutover
  'https://www.educatestrong.com',              // www — ready for domain cutover
  process.env.FRONTEND_URL,                     // override via Render env var if needed
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/assessor', assessorRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/cpd', cpdRouter);
app.use('/api/be-strong', bestrongRouter);
app.use('/api/register-interest', interestRouter);
app.use('/api/coaches', coachesRouter);

// ── Internal QA demo login — TEMPORARY TOOLING ──────────────────────────────
// Only mounted when explicitly enabled. MUST be disabled before public
// launch — unset ENABLE_QA_DEMO_LOGIN (or set to anything but "true") in
// Render's environment settings. See routes/qaDemo.ts for details.
if (process.env.ENABLE_QA_DEMO_LOGIN === 'true' && process.env.QA_DEMO_SECRET) {
  app.use('/api/auth', qaDemoRouter);
  console.log('[qa-demo] QA demo login is ENABLED — disable before public launch.');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Educate.Strong API', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Educate.Strong API running on port ${PORT}`);
});

export default app;
