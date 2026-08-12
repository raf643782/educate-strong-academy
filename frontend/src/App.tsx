import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import PageViewTracker from './components/analytics/PageViewTracker';

// ── Eagerly loaded — must be ready on first paint for primary public routes ──
import Home from './pages/public/Home';
import CourseCatalogue from './pages/public/CourseCatalogue';
import NotFound from './pages/public/NotFound';

// ── Secondary public pages ───────────────────────────────────────────────────
const CourseDetail     = lazy(() => import('./pages/public/CourseDetail'));
const About            = lazy(() => import('./pages/public/About'));
const StrongKidz       = lazy(() => import('./pages/public/StrongKidz'));
const CoachingPathway  = lazy(() => import('./pages/public/CoachingPathway'));
const CoachDirectory   = lazy(() => import('./pages/public/CoachDirectory'));
const CoachProfile     = lazy(() => import('./pages/public/CoachProfile'));
const CertificateVerify = lazy(() => import('./pages/public/CertificateVerify'));
const Shop             = lazy(() => import('./pages/public/Shop'));
const RegisterInterest = lazy(() => import('./pages/public/RegisterInterest'));
const Terms            = lazy(() => import('./pages/public/Terms'));
const Privacy          = lazy(() => import('./pages/public/Privacy'));
const RefundPolicy     = lazy(() => import('./pages/public/RefundPolicy'));

// ── Library & content pages — all public ────────────────────────────────────
const KnowledgeHub        = lazy(() => import('./pages/knowledge/KnowledgeHub'));
const KnowledgeArticlePage = lazy(() => import('./pages/knowledge/KnowledgeArticlePage'));
const ExerciseLibrary     = lazy(() => import('./pages/exercises/ExerciseLibrary'));
const ExerciseDetail      = lazy(() => import('./pages/exercises/ExerciseDetail'));
const EventLibrary        = lazy(() => import('./pages/events/EventLibrary'));
const EventDetail         = lazy(() => import('./pages/events/EventDetail'));
const BeStrongHub         = lazy(() => import('./pages/bestrong/BeStrongHub'));
const BeStrongCategory    = lazy(() => import('./pages/bestrong/BeStrongCategory'));
const BeStrongArticlePage = lazy(() => import('./pages/bestrong/BeStrongArticlePage'));

// ── Auth pages ───────────────────────────────────────────────────────────────
const Login           = lazy(() => import('./pages/auth/Login'));
const Register        = lazy(() => import('./pages/auth/Register'));
const ForgotPassword  = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword   = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail     = lazy(() => import('./pages/auth/VerifyEmail'));

// ── Learner pages (protected) ────────────────────────────────────────────────
const Dashboard   = lazy(() => import('./pages/learner/Dashboard'));
const CoursePlayer = lazy(() => import('./pages/learner/CoursePlayer'));
const Certificates = lazy(() => import('./pages/learner/Certificates'));
const CPD         = lazy(() => import('./pages/learner/CPD'));
const Coursework  = lazy(() => import('./pages/learner/Coursework'));
const Documents   = lazy(() => import('./pages/learner/Documents'));
const SkillTree   = lazy(() => import('./pages/learner/SkillTree'));

// ── Coach & Tutor workspaces (role-protected) ────────────────────────────────
const CoachWorkspace      = lazy(() => import('./pages/coach/CoachWorkspace'));
const CoachProfileWorkspace = lazy(() => import('./pages/coach/CoachProfile'));
const TutorWorkspace      = lazy(() => import('./pages/tutor/TutorWorkspace'));
const TutorCourses        = lazy(() => import('./pages/tutor/TutorCourses'));
const TutorProfile        = lazy(() => import('./pages/tutor/TutorProfile'));

// ── Assessor ─────────────────────────────────────────────────────────────────
const AssessorPortal = lazy(() => import('./pages/assessor/AssessorPortal'));

// ── Admin pages (ADMIN role only) ────────────────────────────────────────────
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'));
const CourseManager         = lazy(() => import('./pages/admin/CourseManager'));
const CourseEditor          = lazy(() => import('./pages/admin/CourseEditor'));
const DocumentManager       = lazy(() => import('./pages/admin/DocumentManager'));
const AssessmentManager     = lazy(() => import('./pages/admin/AssessmentManager'));
const BeStrongManager       = lazy(() => import('./pages/admin/BeStrongManager'));
const UserManager           = lazy(() => import('./pages/admin/UserManager'));
const EnrolmentManager      = lazy(() => import('./pages/admin/EnrolmentManager'));
const CertificateManager    = lazy(() => import('./pages/admin/CertificateManager'));
const CohortManager         = lazy(() => import('./pages/admin/CohortManager'));
const CoachProfileManager   = lazy(() => import('./pages/admin/CoachProfileManager'));
const RegisterInterestManager = lazy(() => import('./pages/admin/RegisterInterestManager'));

// ── Internal portal previews (ADMIN-only, never linked in nav) ───────────────
const PortalPreviewHub    = lazy(() => import('./pages/preview/PortalPreviewHub'));
const LearnerPreview      = lazy(() => import('./pages/preview/LearnerPreview'));
const CoachPreview        = lazy(() => import('./pages/preview/CoachPreview'));
const CoachProfilePreview = lazy(() => import('./pages/preview/CoachProfilePreview'));
const TutorPreview        = lazy(() => import('./pages/preview/TutorPreview'));
const TutorCoursesPreview = lazy(() => import('./pages/preview/TutorCoursesPreview'));
const TutorProfilePreview = lazy(() => import('./pages/preview/TutorProfilePreview'));
const AssessorPreview     = lazy(() => import('./pages/preview/AssessorPreview'));
const AdminPreview        = lazy(() => import('./pages/preview/AdminPreview'));
const HomepagePreview     = lazy(() => import('./pages/preview/homepage/HomepagePreview'));

// ── Sanity Knowledge Hub preview — noindex, not linked in nav ─────────────────
const KnowledgeHubSanityPreview = lazy(() => import('./pages/knowledge/KnowledgeHubSanityPreview'));
const KnowledgeArticleSanityPreviewPage = lazy(() => import('./pages/knowledge/KnowledgeArticleSanityPreviewPage'));

// ── Internal QA tooling — gated by VITE_ENABLE_QA_DEMO_LOGIN ─────────────────
const QaDemoLogin = lazy(() => import('./pages/qa/QaDemoLogin'));

// Minimal loading fallback — matches app background; avoids layout flash.
function PageSkeleton() {
  return <div style={{ minHeight: '100vh', background: '#0D0D0D' }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageViewTracker />
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* ── Public ─────────────────────────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseCatalogue />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            {/* Internal QA tooling — never linked in nav. Renders "not available" unless VITE_ENABLE_QA_DEMO_LOGIN=true. */}
            <Route path="/qa-demo" element={<QaDemoLogin />} />
            {/* Internal portal previews — ADMIN-only, never linked in nav. */}
            <Route path="/portal-preview" element={
              <ProtectedRoute roles={['ADMIN']}><PortalPreviewHub /></ProtectedRoute>
            } />
            <Route path="/portal-preview/learner" element={
              <ProtectedRoute roles={['ADMIN']}><LearnerPreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/coach" element={
              <ProtectedRoute roles={['ADMIN']}><CoachPreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/coach/profile" element={
              <ProtectedRoute roles={['ADMIN']}><CoachProfilePreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/tutor" element={
              <ProtectedRoute roles={['ADMIN']}><TutorPreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/tutor/courses" element={
              <ProtectedRoute roles={['ADMIN']}><TutorCoursesPreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/tutor/profile" element={
              <ProtectedRoute roles={['ADMIN']}><TutorProfilePreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/assessor" element={
              <ProtectedRoute roles={['ADMIN']}><AssessorPreview /></ProtectedRoute>
            } />
            <Route path="/portal-preview/admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminPreview /></ProtectedRoute>
            } />
            <Route path="/homepagepreview" element={<HomepagePreview />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Library & public pages */}
            <Route path="/about" element={<About />} />
            <Route path="/strongkidz" element={<StrongKidz />} />
            <Route path="/coaching" element={<CoachingPathway />} />
            <Route path="/coaches" element={<CoachDirectory />} />
            <Route path="/coaches/:slug" element={<CoachProfile />} />
            <Route path="/verify/:code" element={<CertificateVerify />} />
            <Route path="/verify" element={<CertificateVerify />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/register-interest" element={<RegisterInterest />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/knowledge/:slug" element={<KnowledgeArticlePage />} />
            {/* Internal Sanity preview — noindex, not linked in nav. See docs/handover/cms-guide.md */}
            <Route path="/knowledge-hub-preview" element={<KnowledgeHubSanityPreview />} />
            <Route path="/knowledge-hub-preview/:slug" element={<KnowledgeArticleSanityPreviewPage />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/exercises/:slug" element={<ExerciseDetail />} />
            <Route path="/events" element={<EventLibrary />} />
            <Route path="/events/:slug" element={<EventDetail />} />

            {/* ── EatStrong — canonical routes ───────────────────────────── */}
            <Route path="/eatstrong" element={<BeStrongHub />} />
            <Route path="/eatstrong/category/:categorySlug" element={<BeStrongCategory />} />
            <Route path="/eatstrong/articles/:slug" element={<BeStrongArticlePage />} />

            {/* ── /be-strong redirects — keep old links working ──────────── */}
            <Route path="/be-strong" element={<Navigate to="/eatstrong" replace />} />
            <Route path="/be-strong/category/:categorySlug" element={<RedirectCategory />} />
            <Route path="/be-strong/articles/:slug" element={<RedirectArticle />} />

            {/* ── Protected learner ───────────────────────────────────────── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/learn/:courseSlug/lessons/:lessonId" element={
              <ProtectedRoute><CoursePlayer /></ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute><Certificates /></ProtectedRoute>
            } />
            <Route path="/cpd" element={
              <ProtectedRoute><CPD /></ProtectedRoute>
            } />
            <Route path="/coursework" element={
              <ProtectedRoute><Coursework /></ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute><Documents /></ProtectedRoute>
            } />
            <Route path="/dashboard/pathway" element={
              <ProtectedRoute><SkillTree /></ProtectedRoute>
            } />
            {import.meta.env.DEV && <Route path="/dev/skilltree" element={<SkillTree />} />}

            {/* ── Coach & Tutor workspaces ───────────────────────────────── */}
            <Route path="/coach" element={
              <ProtectedRoute roles={['COACH', 'ADMIN']}><CoachWorkspace /></ProtectedRoute>
            } />
            <Route path="/coach/profile" element={
              <ProtectedRoute roles={['COACH', 'ADMIN']}><CoachProfileWorkspace /></ProtectedRoute>
            } />
            <Route path="/tutor" element={
              <ProtectedRoute roles={['TUTOR', 'ADMIN']}><TutorWorkspace /></ProtectedRoute>
            } />
            <Route path="/tutor/courses" element={
              <ProtectedRoute roles={['TUTOR', 'ADMIN']}><TutorCourses /></ProtectedRoute>
            } />
            <Route path="/tutor/profile" element={
              <ProtectedRoute roles={['TUTOR', 'ADMIN']}><TutorProfile /></ProtectedRoute>
            } />

            {/* ── Assessor / Admin ────────────────────────────────────────── */}
            <Route path="/assessor" element={
              <ProtectedRoute roles={['ASSESSOR', 'ADMIN']}><AssessorPortal /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute roles={['ADMIN']}><CourseManager /></ProtectedRoute>
            } />
            <Route path="/admin/courses/:id" element={
              <ProtectedRoute roles={['ADMIN']}><CourseEditor /></ProtectedRoute>
            } />
            <Route path="/admin/documents" element={
              <ProtectedRoute roles={['ADMIN']}><DocumentManager /></ProtectedRoute>
            } />
            <Route path="/admin/assessments" element={
              <ProtectedRoute roles={['ADMIN']}><AssessmentManager /></ProtectedRoute>
            } />
            <Route path="/admin/be-strong" element={
              <Navigate to="/admin/eatstrong" replace />
            } />
            <Route path="/admin/eatstrong" element={
              <ProtectedRoute roles={['ADMIN']}><BeStrongManager /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['ADMIN']}><UserManager /></ProtectedRoute>
            } />
            <Route path="/admin/enrolments" element={
              <ProtectedRoute roles={['ADMIN']}><EnrolmentManager /></ProtectedRoute>
            } />
            <Route path="/admin/certificates" element={
              <ProtectedRoute roles={['ADMIN']}><CertificateManager /></ProtectedRoute>
            } />
            <Route path="/admin/cohorts" element={
              <ProtectedRoute roles={['ADMIN']}><CohortManager /></ProtectedRoute>
            } />
            <Route path="/admin/coaches" element={
              <ProtectedRoute roles={['ADMIN']}><CoachProfileManager /></ProtectedRoute>
            } />
            <Route path="/admin/register-interest" element={
              <ProtectedRoute roles={['ADMIN']}><RegisterInterestManager /></ProtectedRoute>
            } />

            {/* ── 404 ──────────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

// ── Redirect helpers for legacy /be-strong/* routes ──────────────────────────

function RedirectCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  return <Navigate to={`/eatstrong/category/${categorySlug}`} replace />;
}

function RedirectArticle() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/eatstrong/articles/${slug}`} replace />;
}
