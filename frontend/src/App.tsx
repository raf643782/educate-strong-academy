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

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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
import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import EventLibrary from './pages/events/EventLibrary';

// EatStrong — Nutrition section (all public)
// Internal file names remain "BeStrong" to avoid a database migration.
// User-facing routes and labels use "EatStrong".
import BeStrongHub from './pages/bestrong/BeStrongHub';
import BeStrongCategory from './pages/bestrong/BeStrongCategory';
import BeStrongArticlePage from './pages/bestrong/BeStrongArticlePage';

// Assessor
import AssessorPortal from './pages/assessor/AssessorPortal';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import BeStrongManager from './pages/admin/BeStrongManager';

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
          <Route path="/register" element={<Register />} />

          {/* Library & public pages */}
          <Route path="/about" element={<About />} />
          <Route path="/strongkidz" element={<StrongKidz />} />
          <Route path="/coaching" element={<CoachingPathway />} />
          <Route path="/coaches" element={<CoachDirectory />} />
          <Route path="/coaches/:slug" element={<CoachProfile />} />
          <Route path="/verify/:code" element={<CertificateVerify />} />
          <Route path="/verify" element={<CertificateVerify />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/events" element={<EventLibrary />} />

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
          <Route path="/admin/be-strong" element={
            <Navigate to="/admin/eatstrong" replace />
          } />
          <Route path="/admin/eatstrong" element={
            <ProtectedRoute roles={['ADMIN']}><BeStrongManager /></ProtectedRoute>
          } />
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
