import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface EnrolmentWithProgress {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    pathway: string;
    level: number;
    durationHours?: number;
    modules: { lessons: { id: string }[] }[];
  };
  progress: {
    total: number;
    completed: number;
    percent: number;
  };
}

const pathwayVariant = (p: string) =>
  p === 'COACHING' ? 'coaching' : p === 'REFEREEING' ? 'refereeing' : ('strongkidz' as any);

const pathwayLabel = (p: string) =>
  p === 'COACHING' ? 'Coaching' : p === 'REFEREEING' ? 'Refereeing' : 'StrongKidz';

const QUICK_LINKS = [
  { to: '/knowledge', label: 'Knowledge Hub', icon: '📚', desc: 'Articles and coaching resources' },
  { to: '/exercises', label: 'Exercise Library', icon: '💪', desc: 'Technique guides and cues' },
  { to: '/events', label: 'Event Library', icon: '🏆', desc: 'Competition event reference' },
  { to: '/cpd', label: 'CPD Log', icon: '📊', desc: 'Track your professional development' },
];

// Be Strong card is kept separate so it has its own green treatment
const BE_STRONG_HIGHLIGHT = {
  to: '/be-strong',
  label: 'Be Strong',
  desc: 'Nutrition education for Strongman coaches and athletes',
  categories: ['Nutrition Basics', 'Competition Nutrition', 'Recovery', 'Making Weight', 'Hydration', 'Supplements'],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolments, setEnrolments] = useState<EnrolmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/my')
      .then(res => setEnrolments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Get the first uncompleted lesson for a course
  const getContinueUrl = (enrolment: EnrolmentWithProgress) => {
    const firstLesson = enrolment.course.modules[0]?.lessons[0];
    if (!firstLesson) return `/courses/${enrolment.course.slug}`;
    return `/learn/${enrolment.course.slug}/lessons/${firstLesson.id}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-gray-500 mt-1">Continue your professional development journey.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* My Courses */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                  <Link to="/courses" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                    Browse catalogue →
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                        <div className="h-4 w-48 bg-gray-100 rounded mb-3" />
                        <div className="h-2.5 bg-gray-100 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : enrolments.length === 0 ? (
                  <Card>
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Start your learning journey</h3>
                      <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
                        Enrol in a course to begin. Your progress will appear here.
                      </p>
                      <Link
                        to="/courses"
                        className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm inline-block"
                      >
                        Explore Courses
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {enrolments.map(enrolment => (
                      <div key={enrolment.id} className="bg-white rounded-xl border border-gray-200 hover:border-amber-200 hover:shadow-sm transition-all p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={pathwayVariant(enrolment.course.pathway)}>
                                {pathwayLabel(enrolment.course.pathway)}
                              </Badge>
                              <span className="text-xs text-gray-400">Level {enrolment.course.level}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3 leading-snug">
                              {enrolment.course.title}
                            </h3>
                            <ProgressBar value={enrolment.progress.percent} />
                            <p className="text-xs text-gray-500 mt-1.5">
                              {enrolment.progress.completed} of {enrolment.progress.total} lessons complete
                            </p>
                          </div>
                          <Link
                            to={getContinueUrl(enrolment)}
                            className="flex-shrink-0 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            {enrolment.progress.percent > 0 ? 'Continue' : 'Start'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Recommended */}
              {enrolments.length === 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Recommended Start</h2>
                  <Card>
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                        🏋️
                      </div>
                      <div className="flex-1">
                        <Badge variant="coaching" className="mb-2">Coaching</Badge>
                        <h3 className="font-bold text-gray-900 mb-1">Level 1 Fundamentals of Coaching Strongman</h3>
                        <p className="text-gray-500 text-sm mb-4">The recommended starting point for all new coaches. 15 hours across 7 modules.</p>
                        <Link
                          to="/courses/level-1-coaching-strongman"
                          className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm inline-block"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </Card>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick links */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
                <div className="space-y-2">
                  {QUICK_LINKS.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:shadow-sm hover:border-amber-200 transition-all"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                        <p className="text-xs text-gray-500">{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Be Strong card */}
              <section>
                <Link
                  to={BE_STRONG_HIGHLIGHT.to}
                  className="block bg-green-900 rounded-xl p-5 hover:bg-green-800 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💚</span>
                    <h3 className="text-base font-bold text-white">Be Strong</h3>
                    <span className="ml-auto text-green-300 text-xs font-medium">Nutrition</span>
                  </div>
                  <p className="text-green-200 text-xs leading-relaxed mb-3">{BE_STRONG_HIGHLIGHT.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {BE_STRONG_HIGHLIGHT.categories.slice(0, 4).map(c => (
                      <span key={c} className="text-xs bg-green-800/60 border border-green-700/40 text-green-200 px-2 py-0.5 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="text-green-400 text-xs font-medium mt-3">Explore Be Strong →</p>
                </Link>
              </section>

              {/* CPD Snapshot */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">CPD Overview</h2>
                <Card>
                  <div className="text-center py-2">
                    <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-500 mb-4">CPD hours logged</p>
                    <ProgressBar value={0} showPercent={false} />
                    <p className="text-xs text-gray-400 mt-2">Complete a certification to start logging CPD</p>
                    <Link to="/cpd" className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-3 inline-block">
                      View CPD log →
                    </Link>
                  </div>
                </Card>
              </section>

              {/* Certificates */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Certificates</h2>
                <Card>
                  <div className="text-center py-2">
                    <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
                    <p className="text-sm text-gray-500 mb-3">certificates earned</p>
                    <Link to="/certificates" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                      View certificates →
                    </Link>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
