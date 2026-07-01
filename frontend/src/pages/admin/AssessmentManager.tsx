import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CourseRef { id: string; title: string; slug: string }

interface Assessment {
  id: string;
  courseId: string | null;
  title: string;
  description: string | null;
  type: string;
  passMark: number;
  maxAttempts: number;
  isActive: boolean;
  course: CourseRef | null;
  _count: { submissions: number };
}

const ASSESSMENT_TYPES = [
  'KNOWLEDGE_EXAM',
  'WRITTEN_SCENARIO',
  'PROGRAMMING_ASSIGNMENT',
  'PRACTICAL_OBSERVATION',
  'JUDGING_SCENARIO',
  'SESSION_PLAN',
];

const TYPE_LABELS: Record<string, string> = {
  KNOWLEDGE_EXAM: 'Knowledge Exam',
  WRITTEN_SCENARIO: 'Written Scenario',
  PROGRAMMING_ASSIGNMENT: 'Programming Assignment',
  PRACTICAL_OBSERVATION: 'Practical Observation',
  JUDGING_SCENARIO: 'Judging Scenario',
  SESSION_PLAN: 'Session Plan',
};

// ── Style helpers ─────────────────────────────────────────────────────────────

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
  btnDanger: {
    background: 'transparent',
    color: 'rgba(239,68,68,0.8)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontWeight: 600,
    fontSize: '11px',
    cursor: 'pointer',
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

// ── Form state ────────────────────────────────────────────────────────────────

interface AssessmentForm {
  courseId: string;
  title: string;
  description: string;
  type: string;
  passMark: string;
  maxAttempts: string;
  isActive: boolean;
}

const BLANK: AssessmentForm = {
  courseId: '', title: '', description: '',
  type: 'KNOWLEDGE_EXAM', passMark: '75', maxAttempts: '3', isActive: false,
};

function assessmentToForm(a: Assessment): AssessmentForm {
  return {
    courseId: a.courseId ?? '',
    title: a.title,
    description: a.description ?? '',
    type: a.type,
    passMark: String(a.passMark),
    maxAttempts: String(a.maxAttempts),
    isActive: a.isActive,
  };
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function AssessmentModal({
  initial,
  courses,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial: AssessmentForm;
  courses: CourseRef[];
  onSave: (data: AssessmentForm) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<AssessmentForm>(initial);
  const set = (k: keyof AssessmentForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '48px 16px', overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '520px',
        background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{initial.title ? 'Edit Assessment' : 'New Assessment'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <Field label="Course *">
            <select style={{ ...S.input }} value={form.courseId} onChange={e => set('courseId', e.target.value)}>
              <option value="">— Select a course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>

          <Field label="Title *">
            <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Written Coaching Scenario" />
          </Field>

          <Field label="Type *">
            <select style={{ ...S.input }} value={form.type} onChange={e => set('type', e.target.value)}>
              {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Pass mark (%)">
              <input style={S.input} type="number" min="0" max="100" value={form.passMark} onChange={e => set('passMark', e.target.value)} />
            </Field>
            <Field label="Max attempts">
              <input style={S.input} type="number" min="1" value={form.maxAttempts} onChange={e => set('maxAttempts', e.target.value)} />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              style={{ ...S.input, minHeight: '72px', resize: 'vertical', fontFamily: 'inherit' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional — what learners need to know about this assessment"
            />
          </Field>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center',
                width: '36px', height: '20px', borderRadius: '999px',
                background: form.isActive ? '#A41C64' : 'rgba(255,255,255,0.12)',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0,
              }}
            >
              <span style={{ position: 'absolute', left: form.isActive ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
            </button>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{form.isActive ? 'Active — visible to enrolled learners' : 'Inactive — hidden from learners'}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>
              {saving ? 'Saving…' : 'Save Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm delete ────────────────────────────────────────────────────────────

function ConfirmDelete({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px 24px' }}>
        <p style={{ fontWeight: 800, color: '#fff', fontSize: '15px', marginBottom: '10px' }}>Delete assessment?</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
          "{title}" will be permanently deleted. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
          <button style={{ ...S.btnPrimary, background: 'rgba(239,68,68,0.8)' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AssessmentManager() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{ open: boolean; editing: Assessment | null }>({ open: false, editing: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Assessment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, cRes] = await Promise.all([
        api.get<Assessment[]>('/admin/assessments'),
        api.get<CourseRef[]>('/admin/courses'),
      ]);
      setAssessments(aRes.data);
      setCourses(cRes.data);
    } catch {
      setError('Failed to load assessments. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveAssessment = async (form: AssessmentForm) => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        courseId: form.courseId || null,
        title: form.title.trim(),
        description: form.description || null,
        type: form.type,
        passMark: Number(form.passMark),
        maxAttempts: Number(form.maxAttempts),
        isActive: form.isActive,
      };
      if (modal.editing) {
        const res = await api.put<Assessment>(`/admin/assessments/${modal.editing.id}`, payload);
        setAssessments(prev => prev.map(a => a.id === modal.editing!.id ? res.data : a));
      } else {
        const res = await api.post<Assessment>('/admin/assessments', payload);
        setAssessments(prev => [...prev, res.data]);
      }
      setModal({ open: false, editing: null });
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? 'Failed to save assessment.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (assessment: Assessment) => {
    setActionError(null);
    try {
      const res = await api.put<Assessment>(`/admin/assessments/${assessment.id}`, { isActive: !assessment.isActive });
      setAssessments(prev => prev.map(a => a.id === assessment.id ? res.data : a));
    } catch { setActionError('Unable to save changes. Please try again.'); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleteError(null);
    try {
      await api.delete(`/admin/assessments/${confirmDelete.id}`);
      setAssessments(prev => prev.filter(a => a.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.error ?? 'Failed to delete assessment.');
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)', paddingTop: 'calc(var(--navbar-height,72px) + 24px)', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
            {' › '}
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Assessments</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: '#fff', margin: 0 }}>Assessment Manager</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' }}>
                Manage assessment records. The full exam engine, question banks, and practical observation forms will be built in a later stage.
              </p>
            </div>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open: true, editing: null }); }}>
              + New Assessment
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {deleteError && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
            {deleteError}
          </div>
        )}

        {actionError && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px' }}>
                <div style={{ height: '14px', width: '200px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '11px', width: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
            <button style={S.btnPrimary} onClick={load}>Retry</button>
          </div>
        ) : assessments.length === 0 ? (
          <div style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '64px 24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '20px' }}>
              No assessments yet. Create the first assessment record to get started.
            </p>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open: true, editing: null }); }}>
              + New Assessment
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assessments.map(a => (
              <div key={a.id} style={{
                background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '10px',
                padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {TYPE_LABELS[a.type] ?? a.type}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                      background: a.isActive ? 'rgba(164,28,100,0.15)' : 'rgba(255,255,255,0.06)',
                      color: a.isActive ? '#C0246E' : 'rgba(255,255,255,0.35)',
                    }}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {a._count.submissions > 0 && (
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                        {a._count.submissions} submission{a._count.submissions !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{a.title}</p>
                  {a.course && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{a.course.title}</p>
                  )}
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>
                    Pass: {a.passMark}% · Max attempts: {a.maxAttempts}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => toggleActive(a)}
                    style={{
                      position: 'relative', display: 'inline-flex', alignItems: 'center',
                      width: '36px', height: '20px', borderRadius: '999px',
                      background: a.isActive ? '#A41C64' : 'rgba(255,255,255,0.12)',
                      border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    title={a.isActive ? 'Active' : 'Inactive'}
                  >
                    <span style={{ position: 'absolute', left: a.isActive ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
                  </button>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: a.isActive ? '#A41C64' : 'rgba(255,255,255,0.35)', minWidth: '42px' }}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    style={S.btnGhost}
                    onClick={() => { setSaveError(null); setModal({ open: true, editing: a }); }}
                  >Edit</button>
                  <button
                    style={S.btnDanger}
                    onClick={() => { setDeleteError(null); setConfirmDelete(a); }}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <AssessmentModal
          initial={modal.editing ? assessmentToForm(modal.editing) : BLANK}
          courses={courses}
          onSave={saveAssessment}
          onClose={() => setModal({ open: false, editing: null })}
          saving={saving}
          error={saveError}
        />
      )}

      {confirmDelete && (
        <ConfirmDelete
          title={confirmDelete.title}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
