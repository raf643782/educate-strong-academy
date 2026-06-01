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

// Knowledge, Exercises, Events
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import EventLibrary from './pages/events/EventLibrary';

// Assessor
import AssessorPortal from './pages/assessor/AssessorPortal';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalogue />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/events" element={<EventLibrary />} />

          {/* Protected learner */}
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

          {/* Assessor / Admin */}
          <Route path="/assessor" element={
            <ProtectedRoute roles={['ASSESSOR', 'ADMIN']}><AssessorPortal /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={['ADMIN']}><CourseManager /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
