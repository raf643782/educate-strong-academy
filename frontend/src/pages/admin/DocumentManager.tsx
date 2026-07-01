import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CourseRef { id: string; title: string; slug: string }

interface AdminDocument {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  courseId: string | null;
  fileUrl: string | null;
  fileType: string;
  fileSizeMb: number | null;
  sortOrder: number;
  isPublished: boolean;
  course: CourseRef | null;
}

const DOC_TYPES = ['HANDBOOK', 'ASSESSMENT_FORM', 'CHECKLIST', 'RESOURCE', 'CERTIFICATE', 'TEMPLATE', 'OTHER'];
const DOC_STATUSES = ['COMING_SOON', 'AVAILABLE', 'LOCKED'];
const FILE_TYPES = ['PDF', 'Excel', 'Word', 'ZIP', 'Image', 'Other'];

const statusPill: Record<string, React.CSSProperties> = {
  AVAILABLE: { background: 'rgba(74,222,128,0.1)', color: '#4ADE80' },
  COMING_SOON: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' },
  LOCKED: { background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.7)' },
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

// ── Doc form ──────────────────────────────────────────────────────────────────

interface DocForm {
  title: string;
  description: string;
  type: string;
  status: string;
  courseId: string;
  fileUrl: string;
  fileType: string;
  fileSizeMb: string;
  sortOrder: string;
  isPublished: boolean;
}

const BLANK: DocForm = {
  title: '', description: '', type: 'RESOURCE', status: 'COMING_SOON',
  courseId: '', fileUrl: '', fileType: 'PDF', fileSizeMb: '', sortOrder: '', isPublished: false,
};

function docToForm(doc: AdminDocument): DocForm {
  return {
    title: doc.title,
    description: doc.description ?? '',
    type: doc.type,
    status: doc.status,
    courseId: doc.courseId ?? '',
    fileUrl: doc.fileUrl ?? '',
    fileType: doc.fileType,
    fileSizeMb: doc.fileSizeMb != null ? String(doc.fileSizeMb) : '',
    sortOrder: String(doc.sortOrder),
    isPublished: doc.isPublished,
  };
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function DocModal({
  initial,
  courses,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial: DocForm;
  courses: CourseRef[];
  onSave: (data: DocForm) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<DocForm>(initial);
  const set = (k: keyof DocForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const needsFileUrl = form.status === 'AVAILABLE';

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
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{initial.title ? 'Edit Document' : 'New Document'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <Field label="Title *">
            <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Level 1 Course Handbook" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Type">
              <select style={{ ...S.input }} value={form.type} onChange={e => set('type', e.target.value)}>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={{ ...S.input }} value={form.status} onChange={e => set('status', e.target.value)}>
                {DOC_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Course (optional — leave blank for platform-wide)">
            <select style={{ ...S.input }} value={form.courseId} onChange={e => set('courseId', e.target.value)}>
              <option value="">— Platform-wide resource —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>

          <Field label={`File URL${needsFileUrl ? ' *' : ' (optional)'}`}>
            <input
              style={{ ...S.input, borderColor: needsFileUrl && !form.fileUrl ? 'rgba(239,68,68,0.4)' : undefined }}
              value={form.fileUrl}
              onChange={e => set('fileUrl', e.target.value)}
              placeholder="https://..."
            />
            {needsFileUrl && <p style={{ fontSize: '11px', color: 'rgba(239,68,68,0.6)', marginTop: '4px' }}>Required when status is AVAILABLE</p>}
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <Field label="File type">
              <select style={{ ...S.input }} value={form.fileType} onChange={e => set('fileType', e.target.value)}>
                {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Size (MB)">
              <input style={S.input} type="number" min="0" step="0.1" value={form.fileSizeMb} onChange={e => set('fileSizeMb', e.target.value)} placeholder="e.g. 1.2" />
            </Field>
            <Field label="Sort order">
              <input style={S.input} type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} placeholder="auto" />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              style={{ ...S.input, minHeight: '64px', resize: 'vertical', fontFamily: 'inherit' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional short description shown to learners"
            />
          </Field>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => set('isPublished', !form.isPublished)}
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center',
                width: '36px', height: '20px', borderRadius: '999px',
                background: form.isPublished ? '#A41C64' : 'rgba(255,255,255,0.12)',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0,
              }}
            >
              <span style={{ position: 'absolute', left: form.isPublished ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
            </button>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{form.isPublished ? 'Published' : 'Draft'}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>
              {saving ? 'Saving…' : 'Save Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm ───────────────────────────────────────────────────────────────────

function ConfirmDelete({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px 24px' }}>
        <p style={{ fontWeight: 800, color: '#fff', fontSize: '15px', marginBottom: '10px' }}>Delete document?</p>
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

export default function DocumentManager() {
  const [docs, setDocs] = useState<AdminDocument[]>([]);
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{ open: boolean; editing: AdminDocument | null }>({ open: false, editing: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<AdminDocument | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, coursesRes] = await Promise.all([
        api.get<AdminDocument[]>('/admin/documents'),
        api.get<{ id: string; title: string; slug: string }[]>('/admin/courses'),
      ]);
      setDocs(docsRes.data);
      setCourses(coursesRes.data);
    } catch {
      setError('Failed to load documents. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveDoc = async (form: DocForm) => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        type: form.type,
        status: form.status,
        courseId: form.courseId || null,
        fileUrl: form.fileUrl.trim() || null,
        fileType: form.fileType,
        fileSizeMb: form.fileSizeMb ? Number(form.fileSizeMb) : null,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
        isPublished: form.isPublished,
      };
      if (modal.editing) {
        const res = await api.put<AdminDocument>(`/admin/documents/${modal.editing.id}`, payload);
        setDocs(prev => prev.map(d => d.id === modal.editing!.id ? res.data : d));
      } else {
        const res = await api.post<AdminDocument>('/admin/documents', payload);
        setDocs(prev => [...prev, res.data]);
      }
      setModal({ open: false, editing: null });
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? 'Failed to save document.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleteError(null);
    try {
      await api.delete(`/admin/documents/${confirmDelete.id}`);
      setDocs(prev => prev.filter(d => d.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.error ?? 'Failed to delete document.');
      setConfirmDelete(null);
    }
  };

  const togglePublish = async (doc: AdminDocument) => {
    setActionError(null);
    try {
      const res = await api.put<AdminDocument>(`/admin/documents/${doc.id}`, { isPublished: !doc.isPublished });
      setDocs(prev => prev.map(d => d.id === doc.id ? res.data : d));
    } catch { setActionError('Unable to save changes. Please try again.'); }
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
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Documents</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: '#fff', margin: 0 }}>Document Manager</h1>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open: true, editing: null }); }}>
              + New Document
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
              <div key={i} style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px', animation: 'pulse 1.5s infinite' }}>
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
        ) : docs.length === 0 ? (
          <div style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '64px 24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '20px' }}>
              No documents yet. Create the first document record to get started.
            </p>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open: true, editing: null }); }}>
              + New Document
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docs.map(doc => (
              <div key={doc.id} style={{
                background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '10px',
                padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {doc.type.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', ...(statusPill[doc.status] ?? statusPill.COMING_SOON) }}>
                      {doc.status.replace('_', ' ')}
                    </span>
                    {doc.fileType && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{doc.fileType}</span>}
                  </div>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{doc.title}</p>
                  {doc.course && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{doc.course.title}</p>
                  )}
                  {!doc.course && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Platform-wide</p>
                  )}
                  {doc.fileUrl && (
                    <p style={{ fontSize: '11px', color: 'rgba(164,28,100,0.7)', marginTop: '4px', wordBreak: 'break-all' }}>{doc.fileUrl}</p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => togglePublish(doc)}
                    style={{
                      position: 'relative', display: 'inline-flex', alignItems: 'center',
                      width: '36px', height: '20px', borderRadius: '999px',
                      background: doc.isPublished ? '#A41C64' : 'rgba(255,255,255,0.12)',
                      border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    title={doc.isPublished ? 'Published' : 'Draft'}
                  >
                    <span style={{ position: 'absolute', left: doc.isPublished ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
                  </button>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: doc.isPublished ? '#A41C64' : 'rgba(255,255,255,0.35)', minWidth: '36px' }}>
                    {doc.isPublished ? 'Live' : 'Draft'}
                  </span>
                  <button
                    style={S.btnGhost}
                    onClick={() => { setSaveError(null); setModal({ open: true, editing: doc }); }}
                  >Edit</button>
                  <button
                    style={S.btnDanger}
                    onClick={() => { setDeleteError(null); setConfirmDelete(doc); }}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <DocModal
          initial={modal.editing ? docToForm(modal.editing) : BLANK}
          courses={courses}
          onSave={saveDoc}
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
