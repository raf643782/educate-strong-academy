import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface CoachProfile {
  id: string; slug: string; displayName: string; bio: string | null; photoUrl: string | null;
  location: string | null; region: string | null; specialities: string[];
  qualificationSummary: string | null; contactEmail: string | null; contactUrl: string | null;
  sortOrder: number; isVerified: boolean; isPublished: boolean; isArchived: boolean;
  createdAt: string;
  user: { id: string; email: string; firstName: string; lastName: string; role: string } | null;
}

const S = {
  input: { width:'100%', background:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'11px 14px', color:'#fff', fontSize:'14px', outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  label: { display:'block', fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' } as React.CSSProperties,
  btnPrimary: { background:'linear-gradient(135deg,#A41C64,#C0246E)', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:700, fontSize:'13px', cursor:'pointer' } as React.CSSProperties,
  btnGhost: { background:'transparent', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'8px 14px', fontWeight:600, fontSize:'12px', cursor:'pointer' } as React.CSSProperties,
  btnDanger: { background:'transparent', color:'rgba(239,68,68,0.8)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'6px 12px', fontWeight:600, fontSize:'11px', cursor:'pointer' } as React.CSSProperties,
};

const STATUS_FILTERS = [
  { value: '', label: 'All (excl. archived)' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'archived', label: 'Archived' },
];

function statusPills(c: CoachProfile) {
  const pills: { label: string; bg: string; color: string }[] = [];
  pills.push(c.isVerified
    ? { label: 'Verified', bg: 'rgba(164,28,100,0.18)', color: '#C0246E' }
    : { label: 'Unverified', bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' });
  pills.push(c.isPublished
    ? { label: 'Published', bg: 'rgba(225,154,71,0.15)', color: '#E19A47' }
    : { label: 'Unpublished', bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' });
  if (c.isArchived) pills.push({ label: 'Archived', bg: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.7)' });
  return pills;
}

interface CoachForm {
  displayName: string; bio: string; photoUrl: string; location: string; region: string;
  specialities: string; qualificationSummary: string; contactEmail: string; contactUrl: string;
  sortOrder: string; isVerified: boolean; isPublished: boolean;
}
const BLANK: CoachForm = {
  displayName: '', bio: '', photoUrl: '', location: '', region: '',
  specialities: '', qualificationSummary: '', contactEmail: '', contactUrl: '',
  sortOrder: '0', isVerified: false, isPublished: false,
};

function toForm(c: CoachProfile): CoachForm {
  return {
    displayName: c.displayName, bio: c.bio || '', photoUrl: c.photoUrl || '',
    location: c.location || '', region: c.region || '',
    specialities: c.specialities.join(', '),
    qualificationSummary: c.qualificationSummary || '', contactEmail: c.contactEmail || '',
    contactUrl: c.contactUrl || '', sortOrder: String(c.sortOrder),
    isVerified: c.isVerified, isPublished: c.isPublished,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom:'12px' }}><label style={S.label}>{label}</label>{children}</div>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
      <button type="button" onClick={onChange}
        style={{ position:'relative', display:'inline-flex', alignItems:'center', width:'36px', height:'20px', borderRadius:'999px', background: checked ? '#A41C64' : 'rgba(255,255,255,0.12)', border:'none', cursor:'pointer', transition:'background 0.15s', flexShrink:0 }}>
        <span style={{ position:'absolute', left: checked ? '18px' : '2px', width:'16px', height:'16px', borderRadius:'50%', background:'#fff', transition:'left 0.15s' }} />
      </button>
      <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
  );
}

function CoachModal({ initial, isEditing, onSave, onClose, saving, error }:
  { initial: CoachForm; isEditing: boolean; onSave: (f: CoachForm) => void; onClose: () => void; saving: boolean; error: string|null }) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof CoachForm>(k: K, v: CoachForm[K]) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'48px 16px', overflowY:'auto' }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:'560px', background:'#1B1B20', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', overflow:'hidden', marginBottom:'2rem' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:800, fontSize:'15px' }}>{isEditing ? 'Edit Coach Profile' : 'New Coach Profile'}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        <div style={{ padding:'24px' }}>
          {error && <div style={{ marginBottom:'14px', padding:'10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'rgba(239,68,68,0.9)', fontSize:'13px' }}>{error}</div>}

          <Field label="Display name *"><input style={S.input} value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="e.g. Jane Smith" /></Field>
          <Field label="Bio"><textarea style={{ ...S.input, minHeight:'80px', resize:'vertical' as const }} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Short public bio" /></Field>
          <Field label="Photo URL"><input style={S.input} value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)} placeholder="https://…" /></Field>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Location"><input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Sheffield" /></Field>
            <Field label="Region"><input style={S.input} value={form.region} onChange={e => set('region', e.target.value)} placeholder="South Yorkshire" /></Field>
          </div>

          <Field label="Specialities (comma separated)">
            <input style={S.input} value={form.specialities} onChange={e => set('specialities', e.target.value)} placeholder="Level 1 Coaching, Refereeing, StrongKidz" />
          </Field>
          <Field label="Qualification summary"><input style={S.input} value={form.qualificationSummary} onChange={e => set('qualificationSummary', e.target.value)} placeholder="Level 2 Strongman Coach" /></Field>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Contact email"><input style={S.input} value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="coach@example.com" /></Field>
            <Field label="Contact URL"><input style={S.input} value={form.contactUrl} onChange={e => set('contactUrl', e.target.value)} placeholder="https://…" /></Field>
          </div>

          <Field label="Sort order"><input type="number" style={S.input} value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></Field>

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:'8px', paddingTop:'16px' }}>
            <Toggle checked={form.isVerified} onChange={() => set('isVerified', !form.isVerified)} label={form.isVerified ? 'Verified by EducateStrong' : 'Not yet verified'} />
            <Toggle checked={form.isPublished} onChange={() => set('isPublished', !form.isPublished)} label={form.isPublished ? 'Published to public directory' : 'Not published'} />
            <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', margin:'0 0 16px', lineHeight:1.5 }}>
              A profile only appears publicly once it is both verified and published (and not archived).
            </p>
          </div>

          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
            <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoachProfileManager() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState<{ open: boolean; editing: CoachProfile|null }>({ open: false, editing: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string|null>(null);
  const [actionError, setActionError] = useState<string|null>(null);

  const load = useCallback(async (q: string, status: string) => {
    setLoading(true); setError(null);
    try {
      const params: Record<string,string> = {};
      if (q) params.search = q;
      if (status) params.status = status;
      const res = await api.get<CoachProfile[]>('/admin/coach-profiles', { params });
      setCoaches(res.data);
    } catch { setError('Failed to load coach profiles.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(search, statusFilter); }, [statusFilter, load]); // eslint-disable-line

  const saveCoach = async (form: CoachForm) => {
    setSaving(true); setSaveError(null);
    try {
      const body = {
        displayName: form.displayName.trim(),
        bio: form.bio || null,
        photoUrl: form.photoUrl || null,
        location: form.location || null,
        region: form.region || null,
        specialities: form.specialities.split(',').map(s => s.trim()).filter(Boolean),
        qualificationSummary: form.qualificationSummary || null,
        contactEmail: form.contactEmail || null,
        contactUrl: form.contactUrl || null,
        sortOrder: Number(form.sortOrder) || 0,
        isVerified: form.isVerified,
        isPublished: form.isPublished,
      };
      if (modal.editing) {
        const res = await api.put<CoachProfile>(`/admin/coach-profiles/${modal.editing.id}`, body);
        setCoaches(prev => prev.map(c => c.id === modal.editing!.id ? res.data : c));
      } else {
        const res = await api.post<CoachProfile>('/admin/coach-profiles', body);
        setCoaches(prev => [...prev, res.data]);
      }
      setModal({ open: false, editing: null });
    } catch (err: any) { setSaveError(err?.response?.data?.error || 'Failed to save coach profile.'); }
    finally { setSaving(false); }
  };

  const toggleArchive = async (c: CoachProfile) => {
    setActionError(null);
    try {
      const res = await api.put<CoachProfile>(`/admin/coach-profiles/${c.id}`, { isArchived: !c.isArchived });
      setCoaches(prev => prev.map(x => x.id === c.id ? res.data : x));
    } catch (err: any) { setActionError(err?.response?.data?.error || 'Failed to update coach profile.'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050506', color:'#fff' }}>
      <Navbar />
      <div style={{ background:'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom:'1px solid rgba(194,24,106,0.08)', paddingTop:'calc(var(--navbar-height,72px) + 24px)', paddingBottom:'24px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px' }}>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'6px' }}>
            <Link to="/admin" style={{ color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>Admin</Link> › Coach Profiles
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', flexWrap:'wrap' }}>
            <div>
              <h1 style={{ fontSize:'clamp(1.25rem,3vw,1.75rem)', fontWeight:800, margin:'0 0 4px' }}>Coach Profiles</h1>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Manage the public Find a Certified Coach directory.</p>
            </div>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open:true, editing:null }); }}>+ New Coach Profile</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'28px 24px' }}>
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
          <input
            placeholder="Search by name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') load(search, statusFilter); }}
            style={{ ...S.input, maxWidth:'280px' }}
          />
          <button style={S.btnGhost} onClick={() => load(search, statusFilter)}>Search</button>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...S.input, width:'200px' }}>
            {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {actionError && <div style={{ marginBottom:'16px', padding:'12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'rgba(239,68,68,0.9)', fontSize:'13px' }}>{actionError}</div>}

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[...Array(3)].map((_,i) => <div key={i} style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'20px', height:'64px' }} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:'64px' }}><p style={{ color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>{error}</p><button style={S.btnPrimary} onClick={() => load(search, statusFilter)}>Retry</button></div>
        ) : coaches.length === 0 ? (
          <div style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'64px 24px', textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', marginBottom:'20px' }}>No coach profiles yet. Add a profile to start building the public directory.</p>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open:true, editing:null }); }}>+ New Coach Profile</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {coaches.map(c => (
              <div key={c.id} style={{ background:'#151519', border:'1px solid rgba(194,24,106,0.08)', borderRadius:'10px', padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:'14px', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'4px' }}>
                    {statusPills(c).map(p => (
                      <span key={p.label} style={{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'999px', background:p.bg, color:p.color }}>{p.label}</span>
                    ))}
                  </div>
                  <p style={{ fontWeight:700, fontSize:'14px', color:'#fff', margin:'0 0 2px' }}>{c.displayName}</p>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', margin:0 }}>
                    {c.location || 'No location set'}
                    {c.specialities.length > 0 ? ` · ${c.specialities.join(', ')}` : ''}
                    {` · Sort ${c.sortOrder}`}
                  </p>
                </div>
                <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                  <button style={S.btnGhost} onClick={() => { setSaveError(null); setModal({ open:true, editing:c }); }}>Edit</button>
                  <button style={S.btnDanger} onClick={() => toggleArchive(c)}>{c.isArchived ? 'Unarchive' : 'Archive'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <CoachModal
          initial={modal.editing ? toForm(modal.editing) : BLANK}
          isEditing={!!modal.editing}
          onSave={saveCoach}
          onClose={() => setModal({ open:false, editing:null })}
          saving={saving}
          error={saveError}
        />
      )}
    </div>
  );
}
