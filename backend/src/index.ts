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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Allow multiple origins: local dev + Vercel production
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000',
  'https://educate-strong.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    // Also allow any *.vercel.app preview deployment
    if (origin.includes('vercel.app')) return callback(null, true);
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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Educate.Strong API', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Educate.Strong API running on port ${PORT}`);
});

export default app;
