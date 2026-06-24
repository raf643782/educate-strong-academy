# Educate.Strong Academy — LMS

Professional Strongman coach education platform. Standalone full-stack application.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS |
| Backend | Node.js · Express · TypeScript |
| Database | PostgreSQL · Prisma ORM |
| Auth | JWT (7-day expiry) |
| Ports | Frontend :5174 · Backend :3002 |

---

## Project Structure

```
EducateStrong/
├── docker-compose.yml       ← PostgreSQL via Docker
├── backend/
│   ├── .env                 ← Environment variables (you create this)
│   ├── .env.example         ← Template
│   ├── prisma/
│   │   ├── schema.prisma    ← Full database schema
│   │   └── seed.ts          ← Seed data (courses, modules, exercises, events)
│   └── src/
│       ├── index.ts         ← Express app entry
│       ├── middleware/
│       │   ├── auth.ts      ← JWT middleware + requireRole
│       │   └── errorHandler.ts
│       └── routes/
│           ├── auth.ts      ← /api/auth/* (register, login, me)
│           ├── courses.ts   ← /api/courses/* (list, detail, enrol, my)
│           ├── lessons.ts   ← /api/lessons/:id
│           ├── progress.ts  ← /api/progress/* (start, complete, course)
│           ├── knowledge.ts ← /api/knowledge/*
│           ├── exercises.ts ← /api/exercises/*
│           ├── events.ts    ← /api/events/*
│           ├── assessor.ts  ← /api/assessor/* (placeholder)
│           ├── admin.ts     ← /api/admin/* (stats, courses)
│           ├── certificates.ts ← /api/certificates/*
│           └── cpd.ts       ← /api/cpd/*
└── frontend/
    └── src/
        ├── App.tsx          ← Router with all routes
        ├── context/
        │   └── AuthContext.tsx
        ├── lib/api.ts       ← Axios client (baseURL: localhost:3002/api)
        ├── components/
        │   ├── layout/      ← Navbar, Footer, ProtectedRoute
        │   ├── ui/          ← Button, Card, Badge, ProgressBar
        │   └── recommendations/
        │       └── InlineRecommendation.tsx
        └── pages/
            ├── public/      ← Home, CourseCatalogue, CourseDetail
            ├── auth/        ← Login, Register
            ├── learner/     ← Dashboard, CoursePlayer, Certificates, CPD
            ├── knowledge/   ← KnowledgeHub
            ├── exercises/   ← ExerciseLibrary
            ├── events/      ← EventLibrary
            ├── assessor/    ← AssessorPortal (placeholder)
            └── admin/       ← AdminDashboard, CourseManager
```

---

## Quick Start

### Option A — Docker (recommended, no local Postgres needed)

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install backend dependencies
cd backend
npm install

# 3. Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Start backend (in one terminal)
npm run dev

# 5. Install and start frontend (in another terminal)
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5174

---

### Option B — Existing local PostgreSQL

Update `backend/.env` with your database URL:
```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/educate_strong"
```

Then follow steps 2–5 above.

---

## Environment Variables

`backend/.env`:
```env
DATABASE_URL="postgresql://es_user:es_password@localhost:5433/educate_strong"
JWT_SECRET="es-academy-super-secret-jwt-key-2024-change-in-production"
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

The Docker Compose file uses port **5433** externally (to avoid conflicts with any local Postgres on 5432).

---

## Production Deployment (Render)

Build command: `cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npm run build`

**SMTP — set these manually in the Render dashboard (never commit real values):**

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM="EducateStrong Academy <no-reply@educatestrong.com>"
FRONTEND_URL=https://your-frontend-domain.com
```

If SMTP vars are missing in production the app will still start and operate normally — only password reset emails will silently fail (no crash).

---

## Database Schema — Models

| Model | Purpose |
|---|---|
| `User` | Learners, assessors, admins. Includes VIRES integration placeholder fields |
| `Course` | Coaching, Refereeing, or StrongKidz course |
| `Module` | Course section |
| `Lesson` | Individual lesson (TEXT, VIDEO, RESOURCE, CASE_STUDY, PRACTICAL_TASK) |
| `LessonProgress` | Per-user lesson completion tracking |
| `Enrolment` | User → Course enrolment |
| `Assessment` | Assessment definition linked to a course |
| `AssessmentSubmission` | Learner submission for assessor review |
| `Certificate` | Issued on course completion. Has public verification code |
| `CPDLog` | CPD activity entries (PENDING → APPROVED by admin) |
| `KnowledgeArticle` | Knowledge Hub articles |
| `Exercise` | Exercise library entries |
| `Event` | Competition event library entries |
| `ContentRelationship` | Links content items (lesson→article, event→exercise etc.) |
| `RecommendationPrompt` | Inline learning prompts attached to lessons |
| `IntegrationLog` | Future VIRES integration event log |

---

## Seed Data

Running `npm run db:seed` creates:

**Users:**
- Admin: `admin@educate-strong.com` / `AdminPass123!`
- Learner: `coach@example.com` / `CoachPass123!`

**Courses (5, all published):**
1. Level 1 Fundamentals of Coaching Strongman (7 modules, 28 lessons)
2. Level 2 Coaching Strongman (7 modules, 28 lessons)
3. Level 3 Advanced Coaching Strongman (7 modules, 28 lessons)
4. Level 1 Strongman Refereeing (6 modules, 24 lessons)
5. StrongKidz Coach Education (5 modules, 20 lessons)

**Events (6 — Core Six, all published):**
Log Press · Axle Press · Deadlift · Farmer's Walk · Yoke Walk · Atlas Stones

**Exercises (12 launch-priority):**
Log Press · Log Clean · Axle Press · Conventional Deadlift · Romanian Deadlift · Hip Hinge Drill · Farmer's Walk · Yoke Walk · Atlas Stone to Lap · Atlas Stone to Platform · Sandbag Carry · Plank

**Knowledge Articles (6, launch categories):**
Event Technique · Safe Practice · Programming · Competition Preparation

**Content Relationships:** Events linked to exercises and courses

**Recommendation Prompts:** 4 inline prompts on key lessons

---

## API Routes

### Auth
```
POST   /api/auth/register        Create account
POST   /api/auth/login           Login, returns JWT
GET    /api/auth/me              Current user (auth required)
```

### Courses
```
GET    /api/courses              All published courses
GET    /api/courses/my           User's enrolments + progress (auth)
GET    /api/courses/:slug        Course detail with modules and lessons
POST   /api/courses/enrol/:id    Enrol in a course (auth)
```

### Lessons & Progress
```
GET    /api/lessons/:id          Lesson detail + recommendations
POST   /api/progress/start/:id   Mark lesson started (auth)
POST   /api/progress/complete/:id Mark lesson complete (auth)
GET    /api/progress/course/:id  Progress for all lessons in course (auth)
```

### Reference Libraries
```
GET    /api/knowledge            All published articles
GET    /api/knowledge/categories Article categories with counts
GET    /api/knowledge/:slug      Single article
GET    /api/exercises            All exercises (filter: ?category= ?difficulty=)
GET    /api/exercises/categories Exercise categories
GET    /api/exercises/:slug      Single exercise
GET    /api/events               All events (filter: ?category=)
GET    /api/events/categories    Event categories
GET    /api/events/:slug         Single event
```

### Admin (requires ADMIN role)
```
GET    /api/admin/stats          Platform stats
GET    /api/admin/courses        All courses (published + unpublished)
POST   /api/admin/courses        Create course
PUT    /api/admin/courses/:id    Update course (publish/unpublish)
```

### Assessor (requires ASSESSOR or ADMIN role)
```
GET    /api/assessor/queue       Pending submissions
GET    /api/assessor/submissions All submissions
```

### Other
```
GET    /api/certificates/my      User's certificates (auth)
GET    /api/certificates/verify/:code  Public verification (no auth)
GET    /api/cpd/my              User's CPD logs (auth)
POST   /api/cpd/log             Log CPD activity (auth)
GET    /api/cpd/summary         CPD summary (auth)
GET    /api/health              API health check
```

---

## Frontend Routes

| Route | Page | Auth |
|---|---|---|
| `/` | Home — landing page with courses | Public |
| `/courses` | Course catalogue with pathway filter | Public |
| `/courses/:slug` | Course detail with module accordion | Public |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/knowledge` | Knowledge Hub with categories | Public |
| `/exercises` | Exercise Library with filters | Public |
| `/events` | Event Library with Core Six featured | Public |
| `/dashboard` | Learner dashboard with enrolments + CPD | Auth |
| `/learn/:courseSlug/lessons/:lessonId` | Lesson player with sidebar + recommendations | Auth |
| `/certificates` | Certificate list + verification | Auth |
| `/cpd` | CPD tracker (placeholder) | Auth |
| `/assessor` | Assessor portal (placeholder) | ASSESSOR/ADMIN |
| `/admin` | Admin dashboard with stats | ADMIN |
| `/admin/courses` | Course manager with publish toggle | ADMIN |

---

## What Works Now (Stage 1)

✅ Full authentication (register, login, JWT, persistent session)
✅ Course catalogue with pathway filtering (Coaching / Refereeing / StrongKidz)
✅ Course detail page with module accordion and lesson list
✅ Lesson player with:
  - Full module/lesson sidebar
  - Lesson completion (Mark as Complete)
  - Previous/Next lesson navigation
  - Progress tracking per user
  - Inline recommendation prompts
✅ Learner dashboard with enrolled courses and progress bars
✅ Exercise Library with category + difficulty filters
✅ Event Library with Core Six featured section
✅ Knowledge Hub with category cards and article listing
✅ Admin dashboard with live platform stats
✅ Admin course manager with publish/unpublish toggle
✅ Assessor portal placeholder
✅ Certificate page placeholder
✅ CPD page placeholder
✅ Educate.Strong branding (charcoal + amber)
✅ Mobile-responsive throughout
✅ Public certificate verification endpoint
✅ Inline recommendation component (InlineRecommendation)
✅ Content relationships model (seeded)
✅ VIRES integration placeholder fields on User model
✅ IntegrationLog model for future webhooks

---

## What Is Placeholder (Stage 2+)

⏳ Assessment submission workflow (written, video, exam)
⏳ Assessor review interface (queue, rubric, feedback)
⏳ Certificate generation and PDF download
⏳ CPD manual log submission and admin approval
⏳ CPD renewal tracking and alerts
⏳ Knowledge Hub article detail pages
⏳ Exercise detail pages (/exercises/:slug)
⏳ Event detail pages (/events/:slug)
⏳ Full admin course/module/lesson editor
⏳ User management in admin
⏳ Organisation/cohort management
⏳ Email notifications
⏳ VIRES API integration (certification webhooks, prompts)

---

## VIRES Integration Readiness

The following fields/models are in place for future integration — no integration is built yet:

**User model fields:**
- `externalUserId` — VIRES user ID when linked
- `sourcePlatform` — platform of origin (e.g. "vires_coach")
- `integrationProvider` — provider name
- `apiToken` — future API token for cross-platform auth

**IntegrationLog model:**
- Logs outbound events (certification_completed, enrolment_started etc.)
- `targetPlatform` field (vires_coach / vires_athlete)
- `payload` (JSON) + `status` + `sentAt`

**Future integration points:**
1. `POST /api/integrations/vires/certification-complete` → sends cert data to VIRES Coach
2. `GET /api/integrations/vires/verify-user` → VIRES can verify an ES certification
3. `POST /api/integrations/webhooks/vires` → receive signals from VIRES apps

---

## Recommended Next Steps (Stage 2)

1. **Assessment system** — knowledge exam (auto-graded question bank), written submission (text editor + file upload), assessor review interface
2. **Certificate generation** — PDF template (React-PDF or Puppeteer), certificate detail page, download + share
3. **CPD system** — manual log form, admin approval queue, renewal progress tracking
4. **Content detail pages** — exercise/:slug, event/:slug, knowledge/:slug with full content
5. **Admin content editor** — create/edit modules and lessons, rich text editor (Tiptap or similar)
6. **Email notifications** — enrolment confirmation, assessment result, certificate issued (Resend or Nodemailer)
7. **Organisation dashboard** — bulk enrol, cohort tracking, progress reports
