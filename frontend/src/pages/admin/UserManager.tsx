import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

type Role = 'LEARNER' | 'COACH' | 'TUTOR' | 'ASSESSOR' | 'ADMIN';

interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  _count: { enrolments: number; certificates: number };
}

interface Enrolment {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  course: { id: string; title: string; pathway: string };
}

interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  course: { id: string; title: string; pathway: string };
}

interface UserDetail extends UserSummary {
  enrolments: Enrolment[];
  certificates: Certificate[];
}

const S = {
  input: { width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const },
  label: { display: 'block' as const, fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '6px' },
  btnPrimary: { background: 'linear-gradient(135deg,#A41C64,#C0246E)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' as const },
  btnGhost: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' as const },
  btnDanger: { background: 'transparent', color: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 12px', fontWeight: 600, fontSize: '11px', cursor: 'pointer' as const },
};

function rolePill(role: Role) {
  const map: Record<Role, { bg: string; color: string }> = {
    ADMIN: { bg: 'rgba(164,28,100,0.25)', color: '#C0246E' },
    ASSESSOR: { bg: 'rgba(225,154,71,0.2)', color: '#E19A47' },
    COACH: { bg: 'rgba(164,28,100,0.15)', color: 'rgba(192,36,110,0.9)' },
    TUTOR: { bg: 'rgba(164,28,100,0.08)', color: 'rgba(192,36,110,0.65)' },
    LEARNER: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' },
  };
  const { bg, color } = map[role] ?? map.LEARNER;
  return (
    <span style={{ background: bg, color, borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
      {role}
    </span>
  );
}

function isQaDemoEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@educatestrong.test');
}

function qaDemoTag() {
  return (
    <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', marginLeft: '6px' }}>
      QA DEMO
    </span>
  );
}

function statusPill(isActive: boolean) {
  return isActive ? (
    <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
      Active
    </span>
  ) : (
    <span style={{ background: 'rgba(225,154,71,0.18)', color: '#E19A47', borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
      Disabled
    </span>
  );
}

function pathwayPill(pathway: string) {
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
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: 1, height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
          <div style={{ width: '80px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
          <div style={{ width: '60px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
        </div>
      ))}
    </>
  );
}

interface DrawerProps {
  userId: string;
  currentUserId: string;
  onClose: () => void;
  onRoleChanged: () => void;
}

function UserDrawer({ userId, currentUserId, onClose, onRoleChanged }: DrawerProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('LEARNER');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const isSelf = userId === currentUserId;

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/admin/users/${userId}`)
      .then(r => {
        setUser(r.data);
        setSelectedRole(r.data.role);
      })
      .catch(() => setError('Failed to load user details.'))
      .finally(() => setLoading(false));
  }, [userId]);

  async function saveRole() {
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await api.put(`/admin/users/${userId}`, { role: selectedRole });
      setUser(prev => prev ? { ...prev, role: selectedRole } : prev);
      setSaveMsg('Role updated.');
      onRoleChanged();
    } catch {
      setSaveMsg('Failed to update role.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!user) return;
    const nextActive = !user.isActive;
    if (!nextActive) {
      const confirmed = window.confirm(
        `Disable ${user.firstName} ${user.lastName}? They will be signed out immediately and unable to log in until reactivated.`
      );
      if (!confirmed) return;
    }
    setStatusSaving(true);
    setStatusMsg('');
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: nextActive });
      setUser(prev => prev ? { ...prev, isActive: nextActive } : prev);
      onRoleChanged();
    } catch (err: any) {
      setStatusMsg(err?.response?.data?.error || 'Failed to update account status.');
    } finally {
      setStatusSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, width: '480px', maxWidth: '95vw', height: '100vh', background: '#1B1B20', borderLeft: '1px solid rgba(194,24,106,0.12)', zIndex: 101, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>User Detail</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>x</button>
        </div>
        <div style={{ padding: '24px', flex: 1 }}>
          {loading && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading...</div>}
          {error && <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: '14px' }}>{error}</div>}
          {user && !loading && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{user.firstName} {user.lastName}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>
                  {user.email}
                  {isQaDemoEmail(user.email) && qaDemoTag()}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {rolePill(user.role)}
                  {statusPill(user.isActive)}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', alignSelf: 'center' }}>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div style={{ background: '#111', borderRadius: '10px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Account Status</div>
                {isSelf ? (
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                    You cannot disable your own account.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', flex: 1 }}>
                      {user.isActive ? 'This account can log in normally.' : 'This account is disabled and cannot log in.'}
                    </span>
                    <button
                      onClick={toggleStatus}
                      disabled={statusSaving}
                      style={user.isActive ? S.btnDanger : S.btnPrimary}
                    >
                      {statusSaving ? 'Saving...' : user.isActive ? 'Disable User' : 'Reactivate User'}
                    </button>
                  </div>
                )}
                {statusMsg && <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>{statusMsg}</div>}
              </div>

              <div style={{ background: '#111', borderRadius: '10px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Change Role</div>
                {isSelf ? (
                  <div style={{ fontSize: '13px', color: '#E19A47', background: 'rgba(225,154,71,0.1)', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(225,154,71,0.2)' }}>
                    You cannot change your own role.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value as Role)}
                      style={{ ...S.input, flex: 1 }}
                    >
                      {(['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'] as Role[]).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button onClick={saveRole} disabled={saving} style={{ ...S.btnPrimary, whiteSpace: 'nowrap' }}>
                      {saving ? 'Saving...' : 'Save Role'}
                    </button>
                  </div>
                )}
                {saveMsg && <div style={{ marginTop: '8px', fontSize: '12px', color: saveMsg.startsWith('Failed') ? 'rgba(239,68,68,0.8)' : '#E19A47' }}>{saveMsg}</div>}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Enrolments ({user.enrolments.length})
                </div>
                {user.enrolments.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No enrolments.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {user.enrolments.map(e => (
                      <div key={e.id} style={{ background: '#111116', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{e.course.title}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {pathwayPill(e.course.pathway)}
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                            {e.completedAt ? `Completed ${new Date(e.completedAt).toLocaleDateString('en-GB')}` : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Certificates ({user.certificates.length})
                </div>
                {user.certificates.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No certificates issued.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {user.certificates.map(c => (
                      <div key={c.id} style={{ background: '#111116', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{c.course.title}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {pathwayPill(c.course.pathway)}
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#E19A47', background: 'rgba(225,154,71,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{c.certificateCode}</span>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{new Date(c.issuedAt).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

const EMPTY_CREATE_FORM: CreateUserForm = { firstName: '', lastName: '', email: '', password: '', role: 'LEARNER' };

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateUserForm>(EMPTY_CREATE_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const set = <K extends keyof CreateUserForm>(k: K, v: CreateUserForm[K]) => setForm(f => ({ ...f, [k]: v }));

  function validate(): string {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password) {
      return 'First name, last name, email, and password are all required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return 'Password must be at least 8 characters and include an uppercase letter and a number.';
    }
    return '';
  }

  async function handleSave() {
    const v = validate();
    setValidationError(v);
    if (v) return;
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/users', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 16px', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: '480px', background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>Create User</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>x</button>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: 0, marginBottom: '20px' }}>
            Create a user account for an approved learner, coach, tutor, assessor or admin. Share login details securely outside the platform.
          </p>

          <Field label="First name">
            <input style={S.input} value={form.firstName} onChange={e => set('firstName', e.target.value)} />
          </Field>
          <Field label="Last name">
            <input style={S.input} value={form.lastName} onChange={e => set('lastName', e.target.value)} />
          </Field>
          <Field label="Email">
            <input style={S.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Temporary password">
            <input style={S.input} value={form.password} onChange={e => set('password', e.target.value)} />
          </Field>
          <Field label="Role">
            <select style={S.input} value={form.role} onChange={e => set('role', e.target.value as Role)}>
              {(['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'] as Role[]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          {validationError && (
            <div style={{ fontSize: '13px', color: '#E19A47', background: 'rgba(225,154,71,0.1)', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(225,154,71,0.2)', marginBottom: '14px' }}>
              {validationError}
            </div>
          )}
          {error && (
            <div style={{ fontSize: '13px', color: 'rgba(239,68,68,0.9)', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={onClose} style={S.btnGhost}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={S.btnPrimary}>
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback((q: string, role: string) => {
    setLoading(true);
    setError('');
    const params: Record<string, string> = {};
    if (q) params.search = q;
    if (role) params.role = role;
    api.get('/admin/users', { params })
      .then(r => {
        setUsers(r.data.users ?? r.data);
        setTotal(r.data.total ?? (r.data.users ?? r.data).length);
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers(search, roleFilter);
  }, [roleFilter, fetchUsers]); // eslint-disable-line

  function handleSearchChange(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(val, roleFilter), 400);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>Users</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#fff' }}>Users</h1>
            {!loading && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{total} {total === 1 ? 'user' : 'users'} total</div>}
          </div>
          <button onClick={() => setShowCreateModal(true)} style={S.btnPrimary}>+ New User</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ ...S.input, maxWidth: '320px' }}
          />
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); fetchUsers(search, e.target.value); }}
            style={{ ...S.input, width: '160px' }}
          >
            <option value="">All Roles</option>
            {(['LEARNER', 'COACH', 'TUTOR', 'ASSESSOR', 'ADMIN'] as Role[]).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: '#151519', borderRadius: '12px', border: '1px solid rgba(194,24,106,0.08)', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 100px 90px 80px 90px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span>Name / Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Enrolments</span>
            <span>Certs</span>
            <span style={{ textAlign: 'right' }}>Joined</span>
            <span />
          </div>

          {loading && <SkeletonRows />}

          {!loading && error && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(239,68,68,0.8)', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
              <button onClick={() => fetchUsers(search, roleFilter)} style={S.btnGhost}>Retry</button>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
              No users found.
            </div>
          )}

          {!loading && !error && users.map(u => (
            <div
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              style={{ display: 'grid', gridTemplateColumns: '1fr 130px 100px 90px 80px 90px 100px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{u.firstName} {u.lastName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                  {u.email}
                  {isQaDemoEmail(u.email) && qaDemoTag()}
                </div>
              </div>
              <div>{rolePill(u.role)}</div>
              <div>{statusPill(u.isActive)}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{u._count.enrolments}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{u._count.certificates}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>View</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUserId && currentUser && (
        <UserDrawer
          userId={selectedUserId}
          currentUserId={currentUser.id}
          onClose={() => setSelectedUserId(null)}
          onRoleChanged={() => fetchUsers(search, roleFilter)}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchUsers(search, roleFilter)}
        />
      )}
    </div>
  );
}
