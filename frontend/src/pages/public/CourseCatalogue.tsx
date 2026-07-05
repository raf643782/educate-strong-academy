import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { UNLAUNCHED_COURSE_SLUGS } from '../../data/courseLaunchStatus';
import { useDocumentHead } from '../../hooks/useDocumentHead';

interface Course {
  id: string; title: string; slug: string;
  description: string; summary?: string;
  pathway: string; level: number; durationHours?: number;
  _count?: { modules: number; enrolments: number };
}

const PATHWAY_META: Record<string, { label: string; badge: string; accentColor: string }> = {
  COACHING:   { label: 'Coaching',   badge: 'badge-accent', accentColor: '#A41C64' },
  REFEREEING: { label: 'Refereeing', badge: 'badge-grey',   accentColor: '#3D3D44' },
  STRONGKIDZ: { label: 'StrongKidz', badge: 'badge-amber',  accentColor: '#B37A20' },
};
const FILTERS = ['All', 'Coaching', 'Refereeing', 'StrongKidz'];

function CourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);
  const meta = PATHWAY_META[course.pathway] || { label: course.pathway, badge: 'badge-grey', accentColor: '#3D3D44' };
  const comingSoon = UNLAUNCHED_COURSE_SLUGS.has(course.slug);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: '#151519',
        border: `1px solid ${hovered ? 'rgba(194,24,106,0.35)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? '0 8px 40px rgba(164,28,100,0.18)' : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        opacity: comingSoon ? 0.75 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pathway accent strip */}
      <div style={{ height: '3px', background: meta.accentColor, flexShrink: 0 }} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className={meta.badge}>{meta.label}</span>
          <span className="badge-grey">Level {course.level}</span>
          {comingSoon && <span className="badge-amber">Coming Soon</span>}
        </div>
        <h3 className="font-bold text-white text-base mb-2 leading-snug flex-1">{course.title}</h3>
        <p className="text-es-muted text-sm leading-relaxed mb-5">
          {(course.summary || course.description).slice(0, 110)}...
        </p>
        {course.durationHours && (
          <p className="text-xs text-es-subtle mb-4">{course.durationHours}h content</p>
        )}
        <Link to={`/courses/${course.slug}`} className="btn-secondary text-sm text-center">
          {comingSoon ? 'Learn More' : 'View Course'}
        </Link>
      </div>
    </div>
  );
}

export default function CourseCatalogue() {
  useDocumentHead({
    title: 'All Courses',
    description: 'Accredited qualifications across Strongman coaching, refereeing, and youth development.',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slowLoad, setSlowLoad] = useState(false);

  const loadCourses = useCallback(() => {
    setLoading(true);
    setError(null);
    setSlowLoad(false);
    api.get('/courses').then(r => setCourses(r.data)).catch(() => setError('Failed to load courses. Please try again.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlowLoad(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  const filtered = filter === 'All'
    ? courses
    : courses.filter(c => PATHWAY_META[c.pathway]?.label === filter);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#050506' }}
    >
      <Navbar />

      {/* Page header */}
      <section
        className="pt-navbar"
        style={{
          background: [
            'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(164,28,100,0.22) 0%, transparent 55%)',
            'radial-gradient(ellipse 55% 60% at 4% 80%, rgba(194,24,106,0.08) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          borderBottom: '1px solid rgba(194,24,106,0.08)',
          padding: '80px 0 56px',
        }}
      >
        <div className="es-container">
          <p className="es-label mb-4">Academy</p>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.045em', lineHeight: '1.02' }}
          >
            All Courses
          </h1>
          <p className="text-[#B8B8BE] max-w-xl">
            Accredited qualifications across coaching, refereeing, and youth development.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div
        style={{
          background: '#0A0A0D',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="es-container py-4 flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-sm font-semibold transition-all duration-200"
              style={{
                padding: '12px 18px',
                borderRadius: '9999px',
                background: filter === f ? 'rgba(164,28,100,0.20)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filter === f ? 'rgba(194,24,106,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: filter === f ? '#C2186A' : 'rgba(255,255,255,0.45)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div
        className="flex-1"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 88% 20%, rgba(164,28,100,0.08) 0%, transparent 52%)',
            'radial-gradient(ellipse 60% 50% at 8% 75%, rgba(194,24,106,0.06) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          padding: '64px 0 96px',
        }}
      >
        <div className="es-container">
          {loading ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl animate-pulse"
                    style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                ))}
              </div>
              <p className="text-center text-sm mt-8" style={{ color: '#75757D' }}>
                {slowLoad ? 'Waking the server, this can take a few seconds on first load.' : 'Loading courses...'}
              </p>
            </>
          ) : error ? (
            <div className="text-center py-20">
              <p className="mb-4" style={{ color: '#75757D' }}>{error}</p>
              <button onClick={loadCourses} className="btn-primary">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-20" style={{ color: '#75757D' }}>No courses found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
