import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import CourseCatalogue from './pages/public/CourseCatalogue';
import CourseDetail from './pages/public/CourseDetail';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Learner pages
import Dashboard from './pages/learner/Dashboard';
import CoursePlayer from './pages/learner/CoursePlayer';
import Certificates from './pages/learner/Certificates';
import CPD from './pages/learner/CPD';

// Library pages — all public
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import EventLibrary from './pages/events/EventLibrary';

// Be Strong — Nutrition section (all public)
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
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalogue />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Library — all publicly browsable */}
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/events" element={<EventLibrary />} />

          {/* ── Be Strong — Nutrition section ──────────────────────────── */}
          <Route path="/be-strong" element={<BeStrongHub />} />
          <Route path="/be-strong/category/:categorySlug" element={<BeStrongCategory />} />
          <Route path="/be-strong/articles/:slug" element={<BeStrongArticlePage />} />

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
            <ProtectedRoute roles={['ADMIN']}><BeStrongManager /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
