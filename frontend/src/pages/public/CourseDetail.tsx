import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Badge, { pathwayVariant, levelVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationMinutes?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary?: string;
  pathway: string;
  level: number;
  durationHours?: number;
  prerequisites?: string;
  modules: Module[];
}

const pathwayLabel = (p: string) =>
  p === 'COACHING' ? 'Coaching' : p === 'REFEREEING' ? 'Refereeing' : 'StrongKidz';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!slug) return;
    api.get(`/courses/${slug}`)
      .then(res => setCourse(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnrol = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      await api.post(`/courses/enrol/${course.id}`);
      setEnrolled(true);
    } catch {
      // already enrolled or error
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
            <Link to="/courses" className="text-amber-600 hover:text-amber-700">Back to catalogue</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const firstLessonId = course.modules[0]?.lessons[0]?.id;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex gap-2 flex-wrap">
            <Badge variant={pathwayVariant(course.pathway)}>{pathwayLabel(course.pathway)}</Badge>
            <Badge variant={levelVariant(course.level)}>Level {course.level}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl leading-tight">{course.title}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8">{course.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            {course.durationHours && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.durationHours} hours
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.modules.length} modules
            </span>
          </div>

          {enrolled ? (
            <div className="flex gap-3 flex-wrap">
              <span className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg text-sm">
                Enrolled
              </span>
              {firstLessonId && (
                <Link
                  to={`/learn/${course.slug}/lessons/${firstLessonId}`}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  Go to First Lesson
                </Link>
              )}
            </div>
          ) : (
            <Button
              onClick={handleEnrol}
              disabled={enrolling}
              size="lg"
            >
              {enrolling ? 'Enrolling...' : 'Enrol Now — Free'}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* What you'll learn */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.modules.map(mod => (
                  <div key={mod.id} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{mod.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course curriculum */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              <div className="space-y-3">
                {course.modules.map((mod, idx) => (
                  <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{mod.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{mod.lessons.length} lessons</p>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${openModules.has(mod.id) ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModules.has(mod.id) && (
                      <div className="border-t border-gray-100 divide-y divide-gray-100">
                        {mod.lessons.map(lesson => (
                          <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span className="text-sm text-gray-700">{lesson.title}</span>
                            </div>
                            <span className="text-xs text-gray-400">{lesson.durationMinutes}m</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.durationHours} hours of content</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{course.modules.length} modules, {course.modules.reduce((t, m) => t + m.lessons.length, 0)} lessons</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>Certificate on completion</span>
                </div>
                {course.prerequisites && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prerequisites: {course.prerequisites}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={handleEnrol}
                disabled={enrolling || enrolled}
                size="lg"
                className="w-full justify-center"
              >
                {enrolled ? 'Already Enrolled' : enrolling ? 'Enrolling...' : 'Enrol Now'}
              </Button>
              {enrolled && firstLessonId && (
                <Link
                  to={`/learn/${course.slug}/lessons/${firstLessonId}`}
                  className="mt-3 w-full block text-center border border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold px-4 py-3 rounded-lg transition-colors text-sm"
                >
                  Start Learning
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
