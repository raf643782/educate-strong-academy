import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import InlineRecommendation from '../../components/recommendations/InlineRecommendation';
import api from '../../lib/api';

interface Recommendation {
  id: string;
  promptLabel: string;
  ctaText: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  position: string;
}

interface LessonRef {
  id: string;
  title: string;
  type: string;
  durationMinutes?: number;
  sortOrder: number;
}

interface Module {
  id: string;
  title: string;
  sortOrder: number;
  course: { id: string; title: string; slug: string };
  lessons: LessonRef[];
}

interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: string;
  durationMinutes?: number;
  sortOrder: number;
  moduleId: string;
  module: Module;
  recommendations: Recommendation[];
}

interface ProgressRecord {
  lessonId: string;
  completed: boolean;
}

interface CourseDoc {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  fileUrl: string | null;
  fileType: string;
}

interface CourseAssessment {
  id: string;
  title: string;
  description: string | null;
  type: string;
  passMark: number;
  maxAttempts: number;
}

const lessonTypeLabel: Record<string, string> = {
  TEXT: 'Reading',
  VIDEO: 'Video',
  RESOURCE: 'Resource',
  CASE_STUDY: 'Case Study',
  PRACTICAL_TASK: 'Practical Task',
};

export default function CoursePlayer() {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'lesson' | 'resources' | 'assessments'>('lesson');
  const [courseDocs, setCourseDocs] = useState<CourseDoc[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [courseAssessments, setCourseAssessments] = useState<CourseAssessment[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const res = await api.get(`/lessons/${lessonId}`);
      setLesson(res.data);
      await api.post(`/progress/start/${lessonId}`);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  // Fetch full course structure, progress, documents, and enrolment check
  useEffect(() => {
    if (!courseSlug) return;
    api.get(`/courses/${courseSlug}/enrolled`)
      .then(res => setEnrolled(res.data.enrolled))
      .catch(() => setEnrolled(false));
    api.get(`/courses/${courseSlug}`).then(res => {
      setAllModules(res.data.modules || []);
      const courseId = res.data.id;
      api.get(`/progress/course/${courseId}`).then(progRes => {
        setProgress(progRes.data.progress || []);
      }).catch(() => {});
      setDocsLoading(true);
      api.get<CourseDoc[]>(`/documents/course/${courseId}`)
        .then(docRes => setCourseDocs(docRes.data))
        .catch(() => setCourseDocs([]))
        .finally(() => setDocsLoading(false));
      setAssessmentsLoading(true);
      api.get<CourseAssessment[]>(`/assessments/course/${courseId}`)
        .then(aRes => setCourseAssessments(aRes.data))
        .catch(() => setCourseAssessments([]))
        .finally(() => setAssessmentsLoading(false));
    }).catch(() => {});
  }, [courseSlug]);

  useEffect(() => {
    if (lesson && progress.length >= 0) {
      const rec = progress.find(p => p.lessonId === lesson.id);
      setCompleted(rec?.completed || false);
    }
  }, [lesson, progress]);

  const handleComplete = async () => {
    if (!lessonId) return;
    setCompleting(true);
    try {
      await api.post(`/progress/complete/${lessonId}`);
      setCompleted(true);
      setProgress(prev => {
        const existing = prev.findIndex(p => p.lessonId === lessonId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], completed: true };
          return updated;
        }
        return [...prev, { lessonId: lessonId!, completed: true }];
      });
    } catch {
      // ignore
    } finally {
      setCompleting(false);
    }
  };

  // Find adjacent lessons for navigation
  const getAllLessons = (): { lesson: LessonRef; moduleTitle: string }[] => {
    return allModules.flatMap(mod =>
      mod.lessons.map((l: LessonRef) => ({ lesson: l, moduleTitle: mod.title }))
    );
  };

  const allLessons = getAllLessons();
  const currentIdx = allLessons.findIndex(l => l.lesson.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const isLessonCompleted = (id: string) => progress.some(p => p.lessonId === id && p.completed);

  if (enrolled === false) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <p style={{ fontWeight: 800, fontSize: '20px', marginBottom: '10px' }}>Not enrolled</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
              You are not enrolled in this course. Enrol first to access lesson content.
            </p>
            <Link
              to={`/courses/${courseSlug}`}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#A41C64,#C0246E)', color: '#fff', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
            >
              Go to course page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson not found</h2>
            <Link to="/courses" className="text-amber-600 hover:text-amber-700">Back to courses</Link>
          </div>
        </div>
      </div>
    );
  }

  const endRecommendations = lesson.recommendations.filter(r => r.position === 'end_of_lesson');
  const inlineRecommendations = lesson.recommendations.filter(r => r.position === 'inline');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} hidden md:block flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-200`}>
          <div className="p-4 border-b border-gray-200">
            <Link
              to={`/courses/${courseSlug}`}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 mb-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to course
            </Link>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{lesson.module.course.title}</h3>
          </div>
          <nav className="py-2">
            {allModules.map((mod, mi) => (
              <div key={mod.id}>
                <div className="px-4 py-2.5 bg-gray-50 border-y border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {mi + 1}. {mod.title}
                  </p>
                </div>
                {mod.lessons.map((l: LessonRef) => (
                  <Link
                    key={l.id}
                    to={`/learn/${courseSlug}/lessons/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      l.id === lessonId
                        ? 'bg-amber-50 text-amber-700 font-medium border-r-2 border-amber-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isLessonCompleted(l.id)
                        ? 'bg-green-500 text-white'
                        : l.id === lessonId
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                      {isLessonCompleted(l.id) ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </span>
                    <span className="leading-snug">{l.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex text-gray-500 hover:text-gray-700 p-1"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">
                {lesson.module.course.title} &rsaquo; {lesson.module.title}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{currentIdx + 1} of {allLessons.length}</span>
            </div>
          </div>

          {/* Tab pills */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-1">
            {([
              { key: 'lesson' as const, label: 'Lesson Content' },
              { key: 'resources' as const, label: 'Resources' },
              { key: 'assessments' as const, label: 'Assessments' },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white border border-b-white border-gray-200 text-amber-700 -mb-px'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Lesson content */}
          <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                {lessonTypeLabel[lesson.type] || lesson.type}
              </span>
              {lesson.durationMinutes && (
                <span className="text-xs text-gray-400">{lesson.durationMinutes} min read</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">{lesson.title}</h1>

            {/* Resources tab panel */}
            {activeTab === 'resources' && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Course Resources</h2>
                {docsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />)}
                  </div>
                ) : courseDocs.length === 0 ? (
                  <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center">
                    <p className="text-sm text-gray-400">
                      Course resources will appear here once they have been published by the EducateStrong team.
                    </p>
                    <Link to="/documents" className="text-sm font-semibold text-amber-600 hover:text-amber-700 mt-3 inline-block">
                      View all documents →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {courseDocs.map(doc => {
                        const isLocked = doc.status === 'LOCKED';
                        const isComingSoon = doc.status === 'COMING_SOON' || !doc.fileUrl;
                        return (
                          <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 min-w-0">
                              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div className="min-w-0">
                                <span className="text-sm text-gray-700 font-medium block truncate">{doc.title}</span>
                                {isComingSoon && !isLocked && (
                                  <span className="text-xs text-gray-400">Coming soon</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{doc.fileType}</span>
                              {!isLocked && !isComingSoon && doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                                >
                                  Download
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <Link to="/documents" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                        View all documents →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Assessments tab panel */}
            {activeTab === 'assessments' && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Course Assessments</h2>
                {assessmentsLoading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : courseAssessments.length === 0 ? (
                  <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">No assessments have been assigned to this course yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later or contact your assessor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courseAssessments.map((a) => (
                      <div key={a.id} className="flex items-start justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                          {a.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">Pass mark: {a.passMark}% · Max attempts: {a.maxAttempts}</p>
                        </div>
                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">Not yet available</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link to="/coursework" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                    Go to coursework →
                  </Link>
                </div>
              </div>
            )}

            {/* Lesson tab content */}
            {activeTab === 'lesson' && (
              <>
                {/* Inline recommendations before content */}
                {inlineRecommendations.map(rec => (
                  <InlineRecommendation
                    key={rec.id}
                    promptLabel={rec.promptLabel}
                    ctaText={rec.ctaText}
                    targetType={rec.targetType}
                    targetId={rec.targetId}
                    targetUrl={rec.targetUrl}
                    position="inline"
                  />
                ))}

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {lesson.content ? (
                    <p className="whitespace-pre-wrap">{lesson.content}</p>
                  ) : (
                    <p className="text-gray-400 italic">Content coming soon.</p>
                  )}
                </div>

                {/* Knowledge check placeholder */}
                <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-blue-900 text-sm">Knowledge Check</span>
                  </div>
                  <p className="text-blue-700 text-sm">Interactive knowledge check questions will be available here.</p>
                </div>

                {/* End-of-lesson recommendations */}
                {endRecommendations.map(rec => (
                  <InlineRecommendation
                    key={rec.id}
                    promptLabel={rec.promptLabel}
                    ctaText={rec.ctaText}
                    targetType={rec.targetType}
                    targetId={rec.targetId}
                    targetUrl={rec.targetUrl}
                    position="end_of_lesson"
                  />
                ))}
              </>
            )}

            {/* Complete button */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              {completed ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lesson complete
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-6 disabled:opacity-50"
                >
                  {completing ? 'Marking complete...' : 'Mark as Complete'}
                </button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link
                    to={`/learn/${courseSlug}/lessons/${prevLesson.lesson.id}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="max-w-xs truncate">{prevLesson.lesson.title}</span>
                  </Link>
                ) : <div />}

                {nextLesson && (
                  <Link
                    to={`/learn/${courseSlug}/lessons/${nextLesson.lesson.id}`}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span className="max-w-xs truncate">{nextLesson.lesson.title}</span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
