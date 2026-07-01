import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  type: string;
  videoUrl: string | null;
  resourceUrl: string | null;
  durationMinutes: number | null;
  sortOrder: number;
  isPublished: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
  lessons: Lesson[];
  _count: { lessons: number };
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string | null;
  pathway: string;
  level: number;
  imageUrl: string | null;
  durationHours: number | null;
  prerequisites: string | null;
  isPublished: boolean;
  sortOrder: number;
  modules: Module[];
}

const PATHWAYS = ['COACHING', 'REFEREEING', 'STRONGKIDZ'];
const LESSON_TYPES = ['TEXT', 'VIDEO', 'RESOURCE', 'CASE_STUDY', 'PRACTICAL_TASK'];
const LESSON_TYPE_LABELS: Record<string, string> = {
  TEXT: 'Reading',
  VIDEO: 'Video',
  RESOURCE: 'Resource',
  CASE_STUDY: 'Case Study',
  PRACTICAL_TASK: 'Practical Task',
};

// ── Style helpers ─────────────────────────────────────────────────────────────

const S = {
  card: {
    background: '#151519',
    border: '1px solid rgba(194,24,106,0.08)',
    borderRadius: '12px',
    padding: '24px',
  } as React.CSSProperties,
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

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '36px',
        height: '20px',
        borderRadius: '999px',
        background: value ? '#A41C64' : 'rgba(255,255,255,0.12)',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.15s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
      title={value ? 'Published' : 'Draft'}
    >
      <span style={{
        position: 'absolute',
        left: value ? '18px' : '2px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.15s',
      }} />
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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
        width: '100%', maxWidth: '560px',
        background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem',
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ── Lesson Modal ──────────────────────────────────────────────────────────────

interface LessonFormState {
  title: string;
  content: string;
  type: string;
  videoUrl: string;
  resourceUrl: string;
  durationMinutes: string;
  isPublished: boolean;
}

function LessonModal({
  initial,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial: LessonFormState;
  onSave: (data: LessonFormState) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<LessonFormState>(initial);
  const set = (k: keyof LessonFormState, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={initial.title ? 'Edit Lesson' : 'New Lesson'} onClose={onClose}>
      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
          {error}
        </div>
      )}
      <Field label="Title *">
        <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Lesson title" />
      </Field>
      <Field label="Type">
        <select style={{ ...S.input }} value={form.type} onChange={e => set('type', e.target.value)}>
          {LESSON_TYPES.map(t => <option key={t} value={t}>{LESSON_TYPE_LABELS[t]}</option>)}
        </select>
      </Field>
      <Field label="Duration (minutes)">
        <input style={S.input} type="number" min="0" value={form.durationMinutes} onChange={e => set('durationMinutes', e.target.value)} placeholder="e.g. 15" />
      </Field>
      <Field label="Video URL">
        <input style={S.input} value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Resource URL">
        <input style={S.input} value={form.resourceUrl} onChange={e => set('resourceUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Content — plain text only, use line breaks for paragraphs">
        <textarea
          style={{ ...S.input, minHeight: '160px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          value={form.content}
          onChange={e => set('content', e.target.value)}
          placeholder="Write lesson content here. Plain text only — use line breaks to separate paragraphs."
        />
      </Field>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Toggle value={form.isPublished} onChange={v => set('isPublished', v)} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{form.isPublished ? 'Published' : 'Draft'}</span>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
        <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'Saving…' : 'Save Lesson'}
        </button>
      </div>
    </Modal>
  );
}

// ── Module Modal ──────────────────────────────────────────────────────────────

interface ModuleFormState {
  title: string;
  description: string;
  isPublished: boolean;
}

function ModuleModal({
  initial,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial: ModuleFormState;
  onSave: (data: ModuleFormState) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<ModuleFormState>(initial);
  return (
    <Modal title={initial.title ? 'Edit Module' : 'New Module'} onClose={onClose}>
      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
          {error}
        </div>
      )}
      <Field label="Title *">
        <input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Module title" />
      </Field>
      <Field label="Description">
        <textarea
          style={{ ...S.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Optional description"
        />
      </Field>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Toggle value={form.isPublished} onChange={v => setForm(f => ({ ...f, isPublished: v }))} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{form.isPublished ? 'Published' : 'Draft'}</span>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
        <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'Saving…' : 'Save Module'}
        </button>
      </div>
    </Modal>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
        <button
          style={{ ...S.btnPrimary, background: 'rgba(239,68,68,0.8)' }}
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const BLANK_LESSON: LessonFormState = { title: '', content: '', type: 'TEXT', videoUrl: '', resourceUrl: '', durationMinutes: '', isPublished: false };
const BLANK_MODULE: ModuleFormState = { title: '', description: '', isPublished: false };

export default function CourseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', summary: '', pathway: 'COACHING',
    level: 1, imageUrl: '', durationHours: '', prerequisites: '', sortOrder: '',
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [saveCourseError, setSaveCourseError] = useState<string | null>(null);
  const [saveCourseOk, setSaveCourseOk] = useState(false);

  // Expanded modules
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Module modal
  const [moduleModal, setModuleModal] = useState<{ open: boolean; editing: Module | null }>({ open: false, editing: null });
  const [savingModule, setSavingModule] = useState(false);
  const [moduleError, setModuleError] = useState<string | null>(null);

  // Lesson modal
  const [lessonModal, setLessonModal] = useState<{ open: boolean; moduleId: string | null; editing: Lesson | null }>({ open: false, moduleId: null, editing: null });
  const [savingLesson, setSavingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'course' | 'module' | 'lesson'; id: string; label: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Course>(`/admin/courses/${id}`);
      setCourse(res.data);
      const c = res.data;
      setCourseForm({
        title: c.title,
        description: c.description ?? '',
        summary: c.summary ?? '',
        pathway: c.pathway,
        level: c.level,
        imageUrl: c.imageUrl ?? '',
        durationHours: c.durationHours != null ? String(c.durationHours) : '',
        prerequisites: c.prerequisites ?? '',
        sortOrder: String(c.sortOrder),
      });
    } catch {
      setError('Failed to load course. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // ── Course save ─────────────────────────────────────────────────────────────

  const saveCourse = async () => {
    if (!id) return;
    setSavingCourse(true);
    setSaveCourseError(null);
    setSaveCourseOk(false);
    try {
      const res = await api.put<Course>(`/admin/courses/${id}`, {
        title: courseForm.title,
        description: courseForm.description,
        summary: courseForm.summary || null,
        pathway: courseForm.pathway,
        level: Number(courseForm.level),
        imageUrl: courseForm.imageUrl || null,
        durationHours: courseForm.durationHours ? Number(courseForm.durationHours) : null,
        prerequisites: courseForm.prerequisites || null,
        sortOrder: courseForm.sortOrder ? Number(courseForm.sortOrder) : undefined,
      });
      setCourse(prev => prev ? { ...prev, ...res.data } : res.data);
      setSaveCourseOk(true);
      setTimeout(() => setSaveCourseOk(false), 2500);
    } catch (err: any) {
      setSaveCourseError(err?.response?.data?.error ?? 'Failed to save course.');
    } finally {
      setSavingCourse(false);
    }
  };

  const toggleCoursePublish = async (val: boolean) => {
    if (!id || !course) return;
    setSaveCourseError(null);
    try {
      const res = await api.put<Course>(`/admin/courses/${id}`, { isPublished: val });
      setCourse(prev => prev ? { ...prev, isPublished: res.data.isPublished } : prev);
    } catch (err: any) {
      setSaveCourseError(err?.response?.data?.error ?? 'Failed to update publish state.');
    }
  };

  // ── Module actions ──────────────────────────────────────────────────────────

  const saveModule = async (form: ModuleFormState) => {
    setSavingModule(true);
    setModuleError(null);
    try {
      if (moduleModal.editing) {
        const res = await api.put(`/admin/modules/${moduleModal.editing.id}`, form);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => m.id === moduleModal.editing!.id ? { ...m, ...res.data } : m),
        } : prev);
      } else {
        const res = await api.post(`/admin/courses/${id}/modules`, form);
        setCourse(prev => prev ? { ...prev, modules: [...prev.modules, res.data] } : prev);
        setExpanded(e => new Set([...e, res.data.id]));
      }
      setModuleModal({ open: false, editing: null });
    } catch (err: any) {
      setModuleError(err?.response?.data?.error ?? 'Failed to save module.');
    } finally {
      setSavingModule(false);
    }
  };

  const toggleModulePublish = async (mod: Module, val: boolean) => {
    try {
      const res = await api.put(`/admin/modules/${mod.id}`, { isPublished: val });
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => m.id === mod.id ? { ...m, isPublished: res.data.isPublished } : m),
      } : prev);
    } catch { /* silent */ }
  };

  const moveModule = async (mod: Module, direction: 'up' | 'down') => {
    if (!course) return;
    const sorted = [...course.modules].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex(m => m.id === mod.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const aSort = sorted[idx].sortOrder;
    const bSort = sorted[swapIdx].sortOrder;
    try {
      await Promise.all([
        api.put(`/admin/modules/${sorted[idx].id}`, { sortOrder: bSort }),
        api.put(`/admin/modules/${sorted[swapIdx].id}`, { sortOrder: aSort }),
      ]);
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => {
          if (m.id === sorted[idx].id) return { ...m, sortOrder: bSort };
          if (m.id === sorted[swapIdx].id) return { ...m, sortOrder: aSort };
          return m;
        }),
      } : prev);
    } catch { /* silent */ }
  };

  // ── Lesson actions ──────────────────────────────────────────────────────────

  const saveLesson = async (form: LessonFormState) => {
    setSavingLesson(true);
    setLessonError(null);
    try {
      const payload = {
        title: form.title,
        content: form.content || null,
        type: form.type,
        videoUrl: form.videoUrl || null,
        resourceUrl: form.resourceUrl || null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        isPublished: form.isPublished,
      };
      if (lessonModal.editing) {
        const res = await api.put(`/admin/lessons/${lessonModal.editing.id}`, payload);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === lessonModal.editing!.id ? res.data : l),
          })),
        } : prev);
      } else {
        const res = await api.post(`/admin/modules/${lessonModal.moduleId}/lessons`, payload);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => m.id === lessonModal.moduleId ? { ...m, lessons: [...m.lessons, res.data] } : m),
        } : prev);
      }
      setLessonModal({ open: false, moduleId: null, editing: null });
    } catch (err: any) {
      setLessonError(err?.response?.data?.error ?? 'Failed to save lesson.');
    } finally {
      setSavingLesson(false);
    }
  };

  const toggleLessonPublish = async (lesson: Lesson, val: boolean) => {
    try {
      const res = await api.put(`/admin/lessons/${lesson.id}`, { isPublished: val });
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, isPublished: res.data.isPublished } : l),
        })),
      } : prev);
    } catch { /* silent */ }
  };

  const moveLesson = async (moduleId: string, lesson: Lesson, direction: 'up' | 'down') => {
    if (!course) return;
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod) return;
    const sorted = [...mod.lessons].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex(l => l.id === lesson.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const aSort = sorted[idx].sortOrder;
    const bSort = sorted[swapIdx].sortOrder;
    try {
      await Promise.all([
        api.put(`/admin/lessons/${sorted[idx].id}`, { sortOrder: bSort }),
        api.put(`/admin/lessons/${sorted[swapIdx].id}`, { sortOrder: aSort }),
      ]);
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => m.id !== moduleId ? m : {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === sorted[idx].id) return { ...l, sortOrder: bSort };
            if (l.id === sorted[swapIdx].id) return { ...l, sortOrder: aSort };
            return l;
          }),
        }),
      } : prev);
    } catch { /* silent */ }
  };

  // ── Delete actions ──────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleteError(null);
    try {
      if (confirmDelete.type === 'course') {
        await api.delete(`/admin/courses/${confirmDelete.id}`);
        navigate('/admin/courses');
        return;
      }
      if (confirmDelete.type === 'module') {
        await api.delete(`/admin/modules/${confirmDelete.id}`);
        setCourse(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== confirmDelete.id) } : prev);
      }
      if (confirmDelete.type === 'lesson') {
        await api.delete(`/admin/lessons/${confirmDelete.id}`);
        setCourse(prev => prev ? {
          ...prev,
          modules: prev.modules.map(m => ({ ...m, lessons: m.lessons.filter(l => l.id !== confirmDelete.id) })),
        } : prev);
      }
      setConfirmDelete(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Failed to delete.';
      setDeleteError(msg);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050506' }}>
        <Navbar />
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Loading course…
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ minHeight: '100vh', background: '#050506' }}>
        <Navbar />
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '16px' }}>{error ?? 'Course not found'}</p>
          <button style={S.btnPrimary} onClick={load}>Retry</button>
        </div>
      </div>
    );
  }

  const sortedModules = [...course.modules].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)', paddingTop: 'calc(var(--navbar-height,72px) + 24px)', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
            {' › '}
            <Link to="/admin/courses" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Courses</Link>
            {' › '}
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{course.title}</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: '#fff', margin: 0 }}>{course.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' }}>/{course.slug}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle value={course.isPublished} onChange={toggleCoursePublish} />
                <span style={{ fontSize: '12px', color: course.isPublished ? '#A41C64' : 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <a href={`/courses/${course.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnGhost, textDecoration: 'none', display: 'inline-block' }}>
                Preview
              </a>
              <button
                style={{ ...S.btnDanger, padding: '8px 14px', fontSize: '12px' }}
                onClick={() => { setDeleteError(null); setConfirmDelete({ type: 'course', id: course.id, label: course.title }); }}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Course metadata */}
        <div style={{ ...S.card, marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '15px', color: '#fff', marginBottom: '20px' }}>Course Details</h2>

          {saveCourseError && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
              {saveCourseError}
            </div>
          )}
          {saveCourseOk && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', color: '#4ADE80', fontSize: '13px' }}>
              Course saved.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Title *">
                <input style={S.input} value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} />
              </Field>
            </div>
            <Field label="Pathway">
              <select style={{ ...S.input }} value={courseForm.pathway} onChange={e => setCourseForm(f => ({ ...f, pathway: e.target.value }))}>
                {PATHWAYS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Level">
              <input style={S.input} type="number" min="1" max="10" value={courseForm.level} onChange={e => setCourseForm(f => ({ ...f, level: Number(e.target.value) }))} />
            </Field>
            <Field label="Duration (hours)">
              <input style={S.input} type="number" min="0" step="0.5" value={courseForm.durationHours} onChange={e => setCourseForm(f => ({ ...f, durationHours: e.target.value }))} placeholder="e.g. 15" />
            </Field>
            <Field label="Sort order">
              <input style={S.input} type="number" value={courseForm.sortOrder} onChange={e => setCourseForm(f => ({ ...f, sortOrder: e.target.value }))} />
            </Field>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Image URL">
                <input style={S.input} value={courseForm.imageUrl} onChange={e => setCourseForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </Field>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Description">
                <textarea style={{ ...S.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Summary (short)">
                <textarea style={{ ...S.input, minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }} value={courseForm.summary} onChange={e => setCourseForm(f => ({ ...f, summary: e.target.value }))} />
              </Field>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Prerequisites">
                <textarea style={{ ...S.input, minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }} value={courseForm.prerequisites} onChange={e => setCourseForm(f => ({ ...f, prerequisites: e.target.value }))} />
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button style={{ ...S.btnPrimary, opacity: savingCourse ? 0.6 : 1 }} onClick={saveCourse} disabled={savingCourse}>
              {savingCourse ? 'Saving…' : 'Save Course'}
            </button>
          </div>
        </div>

        {/* Modules */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '15px', color: '#fff', margin: 0 }}>
            Modules <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: '13px' }}>({sortedModules.length})</span>
          </h2>
          <button
            style={S.btnPrimary}
            onClick={() => { setModuleError(null); setModuleModal({ open: true, editing: null }); }}
          >
            + New Module
          </button>
        </div>

        {sortedModules.length === 0 && (
          <div style={{ ...S.card, textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
              No modules yet. Add the first module to get started.
            </p>
          </div>
        )}

        {sortedModules.map((mod, modIdx) => {
          const isOpen = expanded.has(mod.id);
          const sortedLessons = [...mod.lessons].sort((a, b) => a.sortOrder - b.sortOrder);
          return (
            <div key={mod.id} style={{ marginBottom: '10px' }}>
              {/* Module row */}
              <div style={{
                background: '#151519',
                border: '1px solid rgba(194,24,106,0.08)',
                borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                {/* Reorder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                  <button
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '2px', fontSize: '12px', lineHeight: 1 }}
                    onClick={() => moveModule(mod, 'up')}
                    disabled={modIdx === 0}
                    title="Move up"
                  >▲</button>
                  <button
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '2px', fontSize: '12px', lineHeight: 1 }}
                    onClick={() => moveModule(mod, 'down')}
                    disabled={modIdx === sortedModules.length - 1}
                    title="Move down"
                  >▼</button>
                </div>

                {/* Expand toggle */}
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'rgba(255,255,255,0.5)', fontSize: '12px', flexShrink: 0 }}
                  onClick={() => setExpanded(e => { const n = new Set(e); n.has(mod.id) ? n.delete(mod.id) : n.add(mod.id); return n; })}
                >
                  {isOpen ? '▾' : '▸'}
                </button>

                {/* Title + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{mod.title}</span>
                  <span style={{ marginLeft: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <Toggle value={mod.isPublished} onChange={v => toggleModulePublish(mod, v)} />
                  <span style={{ fontSize: '11px', color: mod.isPublished ? '#A41C64' : 'rgba(255,255,255,0.3)', fontWeight: 600, minWidth: '42px' }}>
                    {mod.isPublished ? 'Live' : 'Draft'}
                  </span>
                  <button
                    style={S.btnGhost}
                    onClick={() => { setModuleError(null); setModuleModal({ open: true, editing: mod }); }}
                  >Edit</button>
                  <button
                    style={S.btnDanger}
                    onClick={() => { setDeleteError(null); setConfirmDelete({ type: 'module', id: mod.id, label: mod.title }); }}
                  >Delete</button>
                </div>
              </div>

              {/* Lessons panel */}
              {isOpen && (
                <div style={{
                  background: '#0D0D10',
                  border: '1px solid rgba(194,24,106,0.08)',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  padding: '12px 18px 16px',
                }}>
                  {sortedLessons.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', padding: '12px 0' }}>
                      No lessons yet. Add the first lesson to this module.
                    </p>
                  )}

                  {sortedLessons.map((lesson, lessonIdx) => (
                    <div key={lesson.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 0',
                      borderBottom: lessonIdx < sortedLessons.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      {/* Reorder */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                        <button
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '1px', fontSize: '10px', lineHeight: 1 }}
                          onClick={() => moveLesson(mod.id, lesson, 'up')}
                          disabled={lessonIdx === 0}
                        >▲</button>
                        <button
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '1px', fontSize: '10px', lineHeight: 1 }}
                          onClick={() => moveLesson(mod.id, lesson, 'down')}
                          disabled={lessonIdx === sortedLessons.length - 1}
                        >▼</button>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600 }}>{lesson.title}</span>
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                          {LESSON_TYPE_LABELS[lesson.type] ?? lesson.type}
                          {lesson.durationMinutes ? ` · ${lesson.durationMinutes}m` : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                        <Toggle value={lesson.isPublished} onChange={v => toggleLessonPublish(lesson, v)} />
                        <span style={{ fontSize: '11px', color: lesson.isPublished ? '#A41C64' : 'rgba(255,255,255,0.3)', fontWeight: 600, minWidth: '42px' }}>
                          {lesson.isPublished ? 'Live' : 'Draft'}
                        </span>
                        <button
                          style={S.btnGhost}
                          onClick={() => {
                            setLessonError(null);
                            setLessonModal({
                              open: true, moduleId: mod.id, editing: lesson,
                            });
                          }}
                        >Edit</button>
                        <button
                          style={S.btnDanger}
                          onClick={() => { setDeleteError(null); setConfirmDelete({ type: 'lesson', id: lesson.id, label: lesson.title }); }}
                        >Delete</button>
                      </div>
                    </div>
                  ))}

                  <button
                    style={{ ...S.btnGhost, marginTop: '12px', fontSize: '12px' }}
                    onClick={() => { setLessonError(null); setLessonModal({ open: true, moduleId: mod.id, editing: null }); }}
                  >
                    + Add Lesson
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {moduleModal.open && (
        <ModuleModal
          initial={moduleModal.editing
            ? { title: moduleModal.editing.title, description: moduleModal.editing.description ?? '', isPublished: moduleModal.editing.isPublished }
            : BLANK_MODULE}
          onSave={saveModule}
          onClose={() => setModuleModal({ open: false, editing: null })}
          saving={savingModule}
          error={moduleError}
        />
      )}

      {lessonModal.open && (
        <LessonModal
          initial={lessonModal.editing
            ? {
                title: lessonModal.editing.title,
                content: lessonModal.editing.content ?? '',
                type: lessonModal.editing.type,
                videoUrl: lessonModal.editing.videoUrl ?? '',
                resourceUrl: lessonModal.editing.resourceUrl ?? '',
                durationMinutes: lessonModal.editing.durationMinutes != null ? String(lessonModal.editing.durationMinutes) : '',
                isPublished: lessonModal.editing.isPublished,
              }
            : BLANK_LESSON}
          onSave={saveLesson}
          onClose={() => setLessonModal({ open: false, moduleId: null, editing: null })}
          saving={savingLesson}
          error={lessonError}
        />
      )}

      {confirmDelete && (
        <>
          {deleteError ? (
            <Modal title="Cannot Delete" onClose={() => setConfirmDelete(null)}>
              <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>{deleteError}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={S.btnGhost} onClick={() => { setConfirmDelete(null); setDeleteError(null); }}>Close</button>
              </div>
            </Modal>
          ) : (
            <ConfirmDialog
              message={`Delete "${confirmDelete.label}"? This cannot be undone.`}
              onConfirm={handleDelete}
              onCancel={() => setConfirmDelete(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
