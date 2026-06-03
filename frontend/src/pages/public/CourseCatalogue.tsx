import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Course {
  id: string; title: string; slug: string;
  description: string; summary?: string;
  pathway: string; level: number; durationHours?: number;
  _count?: { modules: number; enrolments: number };
}

const PATHWAY_META: Record<string, { label: string; badge: string }> = {
  COACHING:   { label: 'Coaching',   badge: 'badge-accent' },
  REFEREEING: { label: 'Refereeing', badge: 'badge-grey' },
  STRONGKIDZ: { label: 'StrongKidz', badge: 'badge-amber' },
};
const FILTERS = ['All', 'Coaching', 'Refereeing', 'StrongKidz'];

export default function CourseCatalogue() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? courses
    : courses.filter(c => PATHWAY_META[c.pathway]?.label === filter);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <section className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Academy</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>All Courses</h1>
          <p className="text-es-muted max-w-xl">Accredited qualifications across coaching, refereeing, and youth development.</p>
        </div>
      </section>
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                filter === f ? 'bg-es-accent text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'
              }`}
            >{f}</button>
          ))}
        </div>
      </div>
      <div className="es-section flex-1">
        <div className="es-container">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => <div key={i} className="es-card h-64 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-es-muted py-20">No courses found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(course => {
                const meta = PATHWAY_META[course.pathway] || { label: course.pathway, badge: 'badge-grey' };
                return (
                  <div key={course.id} className="es-card-hover flex flex-col overflow-hidden">
                    <div className={`h-1 ${meta.label === 'Coaching' ? 'bg-es-accent' : meta.label === 'StrongKidz' ? 'bg-es-amber' : 'bg-es-grey'}`} />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex gap-2 mb-4">
                        <span className={meta.badge}>{meta.label}</span>
                        <span className="badge-grey">Level {course.level}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-2 leading-snug flex-1">{course.title}</h3>
                      <p className="text-es-muted text-sm leading-relaxed mb-5">
                        {(course.summary || course.description).slice(0, 110)}...
                      </p>
                      {course.durationHours && (
                        <p className="text-xs text-es-subtle mb-4">{course.durationHours}h content</p>
                      )}
                      <Link to={`/courses/${course.slug}`} className="btn-secondary text-sm text-center">
                        View Course
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
