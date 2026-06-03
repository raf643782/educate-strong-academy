import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Enrolment {
  id: string; enrolledAt: string; completedAt: string | null;
  course: { id: string; title: string; slug: string; pathway: string; level: number; durationHours?: number; modules: { lessons: { id: string }[] }[] };
  progress: { total: number; completed: number; percent: number };
}

const pathwayColour: Record<string, string> = {
  COACHING: '#A41C64', REFEREEING: '#3C3C3C', STRONGKIDZ: '#E19A47',
};
const pathwayLabel: Record<string, string> = {
  COACHING: 'Coaching', REFEREEING: 'Refereeing', STRONGKIDZ: 'StrongKidz',
};

const QUICK = [
  { to: '/knowledge', label: 'Knowledge Hub', desc: 'Articles and references' },
  { to: '/exercises', label: 'Exercise Library', desc: 'Technique and cues' },
  { to: '/events', label: 'Event Library', desc: 'Competition events' },
  { to: '/cpd', label: 'CPD Log', desc: 'Track professional development' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/my').then(r => setEnrolments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const continueUrl = (e: Enrolment) => {
    const id = e.course.modules[0]?.lessons[0]?.id;
    return id ? `/learn/${e.course.slug}/lessons/${id}` : `/courses/${e.course.slug}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      {/* Header */}
      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-8">
          <p className="es-label mb-1">Dashboard</p>
          <h1 className="text-2xl font-black text-white">Welcome back, {user?.firstName}</h1>
          <p className="text-es-muted text-sm mt-1">Continue your professional development.</p>
        </div>
      </div>

      <div className="es-section flex-1">
        <div className="es-container">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white">My Courses</h2>
                  <Link to="/courses" className="text-sm text-es-accent hover:text-es-accent-mid">Browse catalogue →</Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2].map(i => <div key={i} className="es-card h-20 animate-pulse" />)}
                  </div>
                ) : enrolments.length === 0 ? (
                  <div className="es-card p-8 text-center">
                    <p className="text-es-muted mb-4">You are not enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn-primary text-sm">Explore Courses</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolments.map(e => (
                      <div key={e.id} className="es-card-hover p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2 mb-2">
                              <span className="badge-accent">{pathwayLabel[e.course.pathway] || e.course.pathway}</span>
                              <span className="badge-grey">Level {e.course.level}</span>
                            </div>
                            <h3 className="font-bold text-white text-sm leading-snug mb-2">{e.course.title}</h3>
                            {/* Progress bar */}
                            <div className="h-1.5 bg-es-grey rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${e.progress.percent}%`, background: pathwayColour[e.course.pathway] || '#A41C64' }}
                              />
                            </div>
                            <p className="text-xs text-es-subtle">{e.progress.completed}/{e.progress.total} lessons</p>
                          </div>
                          <Link to={continueUrl(e)} className="btn-primary text-xs py-2 px-4 flex-shrink-0">
                            {e.progress.percent > 0 ? 'Continue' : 'Start'}
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
                  <h2 className="text-lg font-bold text-white mb-4">Recommended Start</h2>
                  <div className="es-card p-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.3)' }}>
                        <svg className="w-6 h-6 text-es-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="badge-accent mb-2 inline-block">Coaching</span>
                        <h3 className="font-bold text-white mb-1">Level 1 Fundamentals of Coaching Strongman</h3>
                        <p className="text-es-muted text-sm mb-4">The recommended starting point. Active IQ accredited. Practical, hands-on, 15 hours.</p>
                        <Link to="/courses/level-1-coaching-strongman" className="btn-primary text-sm">View Course</Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* EatStrong */}
              <Link to="/eatstrong" className="block es-card p-5 hover:border-green-700 transition-colors" style={{ borderTop: '2px solid #166534' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-1">EatStrong</p>
                <p className="font-bold text-white text-sm mb-1">Nutrition Education</p>
                <p className="text-xs text-es-muted">Performance nutrition for Strongman coaches and athletes.</p>
              </Link>

              {/* Quick links */}
              <div>
                <p className="es-label mb-3">Quick Links</p>
                <div className="space-y-2">
                  {QUICK.map(l => (
                    <Link key={l.to} to={l.to} className="flex items-center justify-between es-card p-3.5 hover:border-es-accent transition-colors group">
                      <div>
                        <p className="text-sm font-semibold text-white">{l.label}</p>
                        <p className="text-xs text-es-subtle">{l.desc}</p>
                      </div>
                      <svg className="w-4 h-4 text-es-subtle group-hover:text-es-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CPD */}
              <div className="es-card p-5">
                <p className="es-label mb-3">CPD Overview</p>
                <p className="text-3xl font-black text-white mb-1">0</p>
                <p className="text-xs text-es-muted mb-3">CPD hours logged</p>
                <div className="h-1.5 bg-es-grey rounded-full mb-2" />
                <p className="text-xs text-es-subtle mb-3">Complete a certification to start logging CPD</p>
                <Link to="/cpd" className="text-xs text-es-accent hover:text-es-accent-mid font-semibold">View CPD log →</Link>
              </div>

              {/* Certificates */}
              <div className="es-card p-5">
                <p className="es-label mb-3">Certificates</p>
                <p className="text-3xl font-black text-white mb-1">0</p>
                <p className="text-xs text-es-muted mb-3">certificates earned</p>
                <Link to="/certificates" className="text-xs text-es-accent hover:text-es-accent-mid font-semibold">View certificates →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
