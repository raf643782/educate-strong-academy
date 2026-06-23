import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface CertUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CertCourse {
  id: string;
  title: string;
  pathway: string;
}

interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  expiresAt: string | null;
  user: CertUser;
  course: CertCourse;
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

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      onClick={copy}
      title="Copy certificate code"
      style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.2)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
    >
      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E19A47' }}>{code}</span>
      <span style={{ fontSize: '10px', color: copied ? '#E19A47' : 'rgba(255,255,255,0.3)' }}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

interface IssueModalProps {
  courses: CourseOption[];
  users: UserOption[];
  onClose: () => void;
  onDone: () => void;
}

function IssueModal({ courses, users, onClose, onDone }: IssueModalProps) {
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
      await api.post('/admin/certificates', { userId, courseId });
      onDone();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to issue certificate.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '480px', maxWidth: '95vw', background: '#1A1A1A', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 101, padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>Issue Certificate</span>
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
          <button onClick={submit} disabled={saving} style={S.btnPrimary}>{saving ? 'Issuing...' : 'Issue Certificate'}</button>
        </div>
      </div>
    </>
  );
}

interface ConfirmRevokeProps {
  cert: Certificate;
  onClose: () => void;
  onDone: () => void;
}

function ConfirmRevoke({ cert, onClose, onDone }: ConfirmRevokeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/admin/certificates/${cert.id}`);
      onDone();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to revoke certificate.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '420px', maxWidth: '95vw', background: '#1A1A1A', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 101, padding: '28px' }}>
        <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '12px' }}>Revoke Certificate</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
          Revoke certificate <strong style={{ fontFamily: 'monospace', color: '#E19A47' }}>{cert.certificateCode}</strong> issued to <strong style={{ color: '#fff' }}>{cert.user.firstName} {cert.user.lastName}</strong>? This cannot be undone.
        </div>
        {error && <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: '13px', marginBottom: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '10px 14px' }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={S.btnGhost}>Cancel</button>
          <button onClick={confirm} disabled={loading} style={S.btnDanger}>{loading ? 'Revoking...' : 'Revoke'}</button>
        </div>
      </div>
    </>
  );
}

export default function CertificateManager() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [revoking, setRevoking] = useState<Certificate | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/admin/certificates'),
      api.get('/admin/courses'),
      api.get('/admin/users', { params: { limit: 200 } }),
    ])
      .then(([certRes, courseRes, userRes]) => {
        setCerts(certRes.data);
        setCourses(courseRes.data.courses ?? courseRes.data);
        setUsers(userRes.data.users ?? userRes.data);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = certs.filter(c => {
    const q = search.toLowerCase();
    return (
      `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(q) ||
      c.user.email.toLowerCase().includes(q) ||
      c.course.title.toLowerCase().includes(q) ||
      c.certificateCode.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>Certificates</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#fff' }}>Certificates</h1>
          <button onClick={() => setShowModal(true)} style={S.btnPrimary}>+ Issue Certificate</button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            placeholder="Filter by learner, course, or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, maxWidth: '380px' }}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#1A1A1A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px 100px 80px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span>Learner</span>
            <span>Course</span>
            <span>Code</span>
            <span>Issued</span>
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
              {certs.length === 0 ? 'No certificates issued yet.' : 'No certificates match your filter.'}
            </div>
          )}

          {!loading && !error && filtered.map(c => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px 100px 80px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{c.user.firstName} {c.user.lastName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{c.user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{c.course.title}</div>
                <PathwayPill pathway={c.course.pathway} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                <CopyCode code={c.certificateCode} />
                <a
                  href={`/verify?code=${c.certificateCode}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11px', color: 'rgba(164,28,100,0.8)', textDecoration: 'none' }}
                  onClick={e => e.stopPropagation()}
                >
                  Verify link
                </a>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                {new Date(c.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setRevoking(c)} style={S.btnDanger}>Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <IssueModal
          courses={courses}
          users={users}
          onClose={() => setShowModal(false)}
          onDone={() => { setShowModal(false); fetchAll(); }}
        />
      )}

      {revoking && (
        <ConfirmRevoke
          cert={revoking}
          onClose={() => setRevoking(null)}
          onDone={() => { setRevoking(null); fetchAll(); }}
        />
      )}
    </div>
  );
}
