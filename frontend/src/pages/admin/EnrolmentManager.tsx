import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface EnrolmentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface EnrolmentCourse {
  id: string;
  title: string;
  slug: string;
  pathway: string;
}

interface Enrolment {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  user: EnrolmentUser;
  course: EnrolmentCourse;
}

interface CourseOption {
  id: string;
  title: string;
  pathway: string;
}

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const S = {
  input: { width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const },
  label: { display: 'block' as const, fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '6px' },
  btnPrimary: { background: 'linear-gradient(135deg,#A41C64,#C0246E)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' as const },
  btnGhost: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' as const },
  btnDanger: { background: 'transparent', color: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 12px', fontWeight: 600, fontSize: '11px', cursor: 'pointer' as const },
};

function PathwayPill({ pathway }: { pathway: string }) {
  return (
    <span style={{ background: 'rgba(225,154,71,0.15)', color: '#E19A47', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
      {pathway}
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: 1, height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
          <div style={{ width: '120px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
          <div style={{ width: '80px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
        </div>
      ))}
    </>
  );
}

interface EnrolModalProps {
  courses: CourseOption[];
  users: UserOption[];
  onClose: () => void;
  onDone: () => void;
}

function EnrolModal({ courses, users, onClose, onDone }: EnrolModalProps) {
  const [userId, setUserId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  async function submit() {
    if (!userId || !courseId) { setError('Please select a learner and a course.'); return; }
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/enrolments', { userId, courseId });
      onDone();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to enrol learner.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '480px', maxWidth: '95vw', background: '#1B1B20', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 101, padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>Enrol Learner</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer' }}>x</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={S.label}>Search Learner</label>
          <input
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            placeholder="Type name or email..."
            style={{ ...S.input, marginBottom: '8px' }}
          />
          <select value={userId} onChange={e => setUserId(e.target.value)} style={S.input} size={4}>
            {filteredUsers.map(u => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={S.label}>Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)} style={S.input}>
            <option value="">Select a course...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({c.pathway})</option>
            ))}
          </select>
        </div>

        {error && <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: '13px', marginBottom: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '10px 14px' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={S.btnGhost}>Cancel</button>
          <button onClick={submit} disabled={saving} style={S.btnPrimary}>{saving ? 'Enrolling...' : 'Enrol'}</button>
        </div>
      </div>
    </>
  );
}

interface ConfirmRemoveProps {
  enrolment: Enrolment;
  onClose: () => void;
  onDone: () => void;
}

function ConfirmRemove({ enrolment, onClose, onDone }: ConfirmRemoveProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/admin/enrolments/${enrolment.id}`);
      onDone();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? 'Failed to remove enrolment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '420px', maxWidth: '95vw', background: '#1B1B20', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 101, padding: '28px' }}>
        <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '12px' }}>Remove Enrolment</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
          Remove <strong style={{ color: '#fff' }}>{enrolment.user.firstName} {enrolment.user.lastName}</strong> from <strong style={{ color: '#fff' }}>{enrolment.course.title}</strong>? This cannot be undone.
        </div>
        {error && <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: '13px', marginBottom: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '10px 14px' }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={S.btnGhost}>Cancel</button>
          <button onClick={confirm} disabled={loading} style={S.btnDanger}>{loading ? 'Removing...' : 'Remove'}</button>
        </div>
      </div>
    </>
  );
}

export default function EnrolmentManager() {
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [removing, setRemoving] = useState<Enrolment | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/admin/enrolments'),
      api.get('/admin/courses'),
      api.get('/admin/users', { params: { limit: 200 } }),
    ])
      .then(([enrRes, courseRes, userRes]) => {
        setEnrolments(enrRes.data);
        setCourses(courseRes.data.courses ?? courseRes.data);
        const ud = userRes.data.users ?? userRes.data;
        setUsers(ud);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = enrolments.filter(e => {
    const q = search.toLowerCase();
    return (
      `${e.user.firstName} ${e.user.lastName}`.toLowerCase().includes(q) ||
      e.user.email.toLowerCase().includes(q) ||
      e.course.title.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>Enrolments</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#fff' }}>Enrolments</h1>
          <button onClick={() => setShowModal(true)} style={S.btnPrimary}>+ Enrol Learner</button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            placeholder="Filter by learner or course..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, maxWidth: '360px' }}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#151519', borderRadius: '12px', border: '1px solid rgba(194,24,106,0.08)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 130px 80px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span>Learner</span>
            <span>Course</span>
            <span>Enrolled</span>
            <span>Status</span>
            <span />
          </div>

          {loading && <SkeletonRows />}

          {!loading && error && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(239,68,68,0.8)', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
              <button onClick={fetchAll} style={S.btnGhost}>Retry</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
              {enrolments.length === 0
                ? 'No enrolments yet. Use the button above to enrol a learner.'
                : 'No enrolments match your filter.'}
            </div>
          )}

          {!loading && !error && filtered.map(e => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 130px 80px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{e.user.firstName} {e.user.lastName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{e.user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{e.course.title}</div>
                <PathwayPill pathway={e.course.pathway} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                {new Date(e.enrolledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
              </div>
              <div>
                {e.completedAt ? (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '3px 8px' }}>
                    Completed {new Date(e.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#E19A47', background: 'rgba(225,154,71,0.12)', borderRadius: '6px', padding: '3px 8px' }}>
                    In Progress
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setRemoving(e)} style={S.btnDanger}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <EnrolModal
          courses={courses}
          users={users}
          onClose={() => setShowModal(false)}
          onDone={() => { setShowModal(false); fetchAll(); }}
        />
      )}

      {removing && (
        <ConfirmRemove
          enrolment={removing}
          onClose={() => setRemoving(null)}
          onDone={() => { setRemoving(null); fetchAll(); }}
        />
      )}
    </div>
  );
}
