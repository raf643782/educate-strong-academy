import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Course {
  id: string;
  title: string;
  slug: string;
  pathway: string;
  level: number;
  isPublished: boolean;
  durationHours?: number;
  sortOrder: number;
  _count: { modules: number; enrolments: number };
  modules: { _count: { lessons: number } }[];
}

const PATHWAYS = ['COACHING', 'REFEREEING', 'STRONGKIDZ'];

const pathwayLabel: Record<string, string> = {
  COACHING: 'Coaching',
  REFEREEING: 'Refereeing',
  STRONGKIDZ: 'StrongKidz',
};

const pathwayPill: Record<string, React.CSSProperties> = {
  COACHING: { background: 'rgba(164,28,100,0.15)', color: '#C0246E' },
  REFEREEING: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' },
  STRONGKIDZ: { background: 'rgba(225,154,71,0.15)', color: '#E19A47' },
};

const S = {
  input: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  } as React.CSSProperties,
  btnPrimary: {
    background: 'linear-gradient(135deg,#A41C64,#C0246E)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  btnGhost: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '8px 14px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function NewCourseModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [form, setForm] = useState({ title: '', pathway: 'COACHING', level: '1', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post<{ id: string }>('/admin/courses', {
        title: form.title.trim(),
        pathway: form.pathway,
        level: Number(form.level),
        description: form.description,
      });
      onCreated(res.data.id);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '80px 16px', overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '480px',
        background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>New Course</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <Field label="Title *">
            <input
              style={S.input}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Level 2 Advanced Coaching"
              autoFocus
            />
          </Field>
          <Field label="Pathway">
            <select style={{ ...S.input }} value={form.pathway} onChange={e => setForm(f => ({ ...f, pathway: e.target.value }))}>
              {PATHWAYS.map(p => <option key={p} value={p}>{pathwayLabel[p]}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <input style={S.input} type="number" min="1" max="10" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea
              style={{ ...S.input, minHeight: '72px', resize: 'vertical', fontFamily: 'inherit' }}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional — can be edited later"
            />
          </Field>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
            Course is created as a draft. You will be taken to the editor to add modules and lessons.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? 'Creating…' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseManager() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<{ id: string; msg: string } | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const loadCourses = () => {
    setLoading(true);
    setError(null);
    api.get<Course[]>('/admin/courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Unable to load courses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const togglePublish = async (course: Course) => {
    setUpdating(course.id);
    setToggleError(null);
    try {
      const res = await api.put<Course>(`/admin/courses/${course.id}`, { isPublished: !course.isPublished });
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: res.data.isPublished } : c));
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Failed to update.';
      setToggleError({ id: course.id, msg });
    } finally {
      setUpdating(null);
    }
  };

  const totalLessons = (course: Course) => course.modules.reduce((sum, m) => sum + (m._count?.lessons || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)', paddingTop: 'calc(var(--navbar-height,72px) + 24px)', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
            {' › '}
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Courses</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: '#fff', margin: 0 }}>Course Manager</h1>
            <button style={S.btnPrimary} onClick={() => setShowNewModal(true)}>
              + New Course
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {error ? (
          <div style={{ background: '#151519', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(239,68,68,0.8)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{error}</p>
            <button style={S.btnPrimary} onClick={loadCourses}>Retry</button>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px', animation: 'pulse 1.5s infinite' }}>
                <div style={{ height: '16px', width: '240px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '12px', width: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile cards (< md) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {courses.map(course => (
                <div key={course.id} style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '12px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                          ...(pathwayPill[course.pathway] ?? { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }),
                        }}>
                          {pathwayLabel[course.pathway] ?? course.pathway}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Level {course.level}</span>
                        {course.durationHours ? <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{course.durationHours}h</span> : null}
                      </div>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{course.title}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        {course._count.modules} module{course._count.modules !== 1 ? 's' : ''} · {totalLessons(course)} lesson{totalLessons(course) !== 1 ? 's' : ''} · {course._count.enrolments} enrolled
                      </p>
                      {toggleError?.id === course.id && (
                        <p style={{ fontSize: '11px', color: 'rgba(239,68,68,0.8)', marginTop: '6px' }}>{toggleError.msg}</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      {/* Publish toggle */}
                      <button
                        onClick={() => togglePublish(course)}
                        disabled={updating === course.id}
                        title={course.isPublished ? 'Published — click to unpublish' : 'Draft — click to publish'}
                        style={{
                          position: 'relative', display: 'inline-flex', alignItems: 'center',
                          width: '36px', height: '20px', borderRadius: '999px',
                          background: course.isPublished ? '#A41C64' : 'rgba(255,255,255,0.12)',
                          border: 'none', cursor: updating === course.id ? 'default' : 'pointer',
                          transition: 'background 0.15s', opacity: updating === course.id ? 0.5 : 1,
                        }}
                      >
                        <span style={{
                          position: 'absolute', left: course.isPublished ? '18px' : '2px',
                          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                          transition: 'left 0.15s',
                        }} />
                      </button>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: course.isPublished ? '#A41C64' : 'rgba(255,255,255,0.35)', minWidth: '36px' }}>
                        {course.isPublished ? 'Live' : 'Draft'}
                      </span>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        style={{ ...S.btnPrimary, textDecoration: 'none', display: 'inline-block', padding: '8px 14px', fontSize: '12px' }}
                      >
                        Edit
                      </Link>
                      <a
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...S.btnGhost, textDecoration: 'none', display: 'inline-block' }}
                      >
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div style={{
                  background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px', padding: '64px 24px', textAlign: 'center',
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '20px' }}>
                    No courses yet. Create the first course to get started.
                  </p>
                  <button style={S.btnPrimary} onClick={() => setShowNewModal(true)}>
                    + New Course
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showNewModal && (
        <NewCourseModal
          onClose={() => setShowNewModal(false)}
          onCreated={(id) => navigate(`/admin/courses/${id}`)}
        />
      )}
    </div>
  );
}
