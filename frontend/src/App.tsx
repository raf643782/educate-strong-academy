import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';

// Public pages
import Home from './pages/public/Home';
import CourseCatalogue from './pages/public/CourseCatalogue';
import CourseDetail from './pages/public/CourseDetail';
import About from './pages/public/About';
import StrongKidz from './pages/public/StrongKidz';
import CoachDirectory from './pages/public/CoachDirectory';
import CoachProfile from './pages/public/CoachProfile';
import CoachingPathway from './pages/public/CoachingPathway';
import CertificateVerify from './pages/public/CertificateVerify';
import Shop from './pages/public/Shop';
import NotFound from './pages/public/NotFound';
import RegisterInterest from './pages/public/RegisterInterest';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import RefundPolicy from './pages/public/RefundPolicy';

// Internal QA tooling — not linked in any nav, gated by VITE_ENABLE_QA_DEMO_LOGIN
import QaDemoLogin from './pages/qa/QaDemoLogin';

// Internal portal previews — not linked in any nav. Read-only, no auth,
// no API calls. See pages/preview/*.
import PortalPreviewHub from './pages/preview/PortalPreviewHub';
import LearnerPreview from './pages/preview/LearnerPreview';
import CoachPreview from './pages/preview/CoachPreview';
import CoachProfilePreview from './pages/preview/CoachProfilePreview';
import TutorPreview from './pages/preview/TutorPreview';
import TutorCoursesPreview from './pages/preview/TutorCoursesPreview';
import TutorProfilePreview from './pages/preview/TutorProfilePreview';
import AssessorPreview from './pages/preview/AssessorPreview';
import AdminPreview from './pages/preview/AdminPreview';

// Private homepage concept preview — not linked in any nav, noindex,
// separate from pages/public/Home.tsx. See pages/preview/homepage/.
import HomepagePreview from './pages/preview/homepage/HomepagePreview';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Learner pages
import Dashboard from './pages/learner/Dashboard';
import CoursePlayer from './pages/learner/CoursePlayer';
import Certificates from './pages/learner/Certificates';
import CPD from './pages/learner/CPD';
import Coursework from './pages/learner/Coursework';
import Documents from './pages/learner/Documents';
import SkillTree from './pages/learner/SkillTree';

// Library pages — all public
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import KnowledgeArticlePage from './pages/knowledge/KnowledgeArticlePage';

// Knowledge Hub / Sanity Stage 1 proof-of-concept — not linked in any nav.
// Renders content from Sanity in parallel with the live, hardcoded /knowledge
// pages above. See frontend/src/lib/sanity.ts and /sanity/README.md.
// Named "...Sanity..." to avoid clashing with the unrelated homepage
// section component at components/sections/KnowledgeHubPreview.tsx.
import KnowledgeHubSanityPreview from './pages/knowledge/KnowledgeHubSanityPreview';
import KnowledgeArticleSanityPreviewPage from './pages/knowledge/KnowledgeArticleSanityPreviewPage';

import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import ExerciseDetail from './pages/exercises/ExerciseDetail';
import EventLibrary from './pages/events/EventLibrary';
import EventDetail from './pages/events/EventDetail';

// EatStrong — Nutrition section (all public)
// Internal file names remain "BeStrong" to avoid a database migration.
// User-facing routes and labels use "EatStrong".
import BeStrongHub from './pages/bestrong/BeStrongHub';
import BeStrongCategory from './pages/bestrong/BeStrongCategory';
import BeStrongArticlePage from './pages/bestrong/BeStrongArticlePage';

// Coach & Tutor workspaces (placeholders — COACH/TUTOR roles pending schema update)
import CoachWorkspace from './pages/coach/CoachWorkspace';
import CoachProfileWorkspace from './pages/coach/CoachProfile';
import TutorWorkspace from './pages/tutor/TutorWorkspace';
import TutorCourses from './pages/tutor/TutorCourses';
import TutorProfile from './pages/tutor/TutorProfile';

// Assessor
import AssessorPortal from './pages/assessor/AssessorPortal';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import CourseEditor from './pages/admin/CourseEditor';
import DocumentManager from './pages/admin/DocumentManager';
import AssessmentManager from './pages/admin/AssessmentManager';
import BeStrongManager from './pages/admin/BeStrongManager';
import UserManager from './pages/admin/UserManager';
import EnrolmentManager from './pages/admin/EnrolmentManager';
import CertificateManager from './pages/admin/CertificateManager';
import CohortManager from './pages/admin/CohortManager';
import CoachProfileManager from './pages/admin/CoachProfileManager';
import RegisterInterestManager from './pages/admin/RegisterInterestManager';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalogue />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          {/* Internal QA tooling — never linked in nav. Renders "not available" unless VITE_ENABLE_QA_DEMO_LOGIN=true. */}
          <Route path="/qa-demo" element={<QaDemoLogin />} />
          {/* Internal portal previews — never linked in nav (except a removed
              public Login link, now gone). Read-only, no API calls, but
              ADMIN-only: retained for internal review, not a public journey. */}
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
          <Route path="/knowledge/start-strongman-safely" element={<Navigate to="/knowledge/strongman-for-beginners" replace />} />
          <Route path="/knowledge/:slug" element={<KnowledgeArticlePage />} />
          {/* Sanity Stage 1 proof-of-concept — never linked in nav. Does not
              affect /knowledge above. See /sanity/README.md for Stage 2 plan. */}
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
