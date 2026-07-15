import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface CourseRef { id: string; title: string; slug: string; pathway: string }
interface Cohort {
  id: string; title: string; status: string; city: string | null; venue: string | null;
  date: string | null; capacity: number | null; bookingUrl: string | null;
  isConfirmed: boolean; sortOrder: number; createdAt: string;
  course: CourseRef | null;
  addressLine: string | null; postcode: string | null;
  latitude: number | null; longitude: number | null; directionsUrl: string | null;
  featuredOnHomepage: boolean; endDate: string | null;
  startTime: string | null; finishTime: string | null;
  price: number | null; availableSpaces: number | null;
  registerInterestUrl: string | null; shortDescription: string | null;
}

const STATUSES = ['UPCOMING','CONFIRMED','FULL','COMPLETED','CANCELLED'] as const;

const S = {
  input: { width:'100%', background:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'11px 14px', color:'#fff', fontSize:'14px', outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  label: { display:'block', fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' } as React.CSSProperties,
  btnPrimary: { background:'linear-gradient(135deg,#A41C64,#C0246E)', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:700, fontSize:'13px', cursor:'pointer' } as React.CSSProperties,
  btnGhost: { background:'transparent', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'8px 14px', fontWeight:600, fontSize:'12px', cursor:'pointer' } as React.CSSProperties,
  btnDanger: { background:'transparent', color:'rgba(239,68,68,0.8)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'6px 12px', fontWeight:600, fontSize:'11px', cursor:'pointer' } as React.CSSProperties,
  sectionLabel: { fontSize:'11px', fontWeight:800, color:'#A41C64', textTransform:'uppercase', letterSpacing:'0.08em', margin:'22px 0 10px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.07)' } as React.CSSProperties,
  help: { fontSize:'11.5px', color:'rgba(255,255,255,0.35)', margin:'4px 0 0', lineHeight:1.5 } as React.CSSProperties,
};

function statusPill(s: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    UPCOMING:  { background:'rgba(225,154,71,0.15)', color:'#E19A47' },
    CONFIRMED: { background:'rgba(164,28,100,0.18)', color:'#C0246E' },
    FULL:      { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.5)' },
    COMPLETED: { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.35)' },
    CANCELLED: { background:'rgba(239,68,68,0.08)', color:'rgba(239,68,68,0.7)' },
  };
  return { fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'999px', ...(map[s] || map.UPCOMING) };
}

interface CohortForm {
  courseId: string; title: string; status: string; city: string; venue: string;
  date: string; capacity: string; bookingUrl: string; isConfirmed: boolean; sortOrder: string;
  addressLine: string; postcode: string; latitude: string; longitude: string; directionsUrl: string;
  featuredOnHomepage: boolean; endDate: string; startTime: string; finishTime: string;
  price: string; availableSpaces: string; registerInterestUrl: string; shortDescription: string;
}
const BLANK: CohortForm = {
  courseId:'', title:'', status:'UPCOMING', city:'', venue:'', date:'', capacity:'', bookingUrl:'', isConfirmed:false, sortOrder:'0',
  addressLine:'', postcode:'', latitude:'', longitude:'', directionsUrl:'',
  featuredOnHomepage:false, endDate:'', startTime:'', finishTime:'',
  price:'', availableSpaces:'', registerInterestUrl:'', shortDescription:'',
};

function toForm(c: Cohort): CohortForm {
  return {
    courseId: c.course?.id || '', title: c.title, status: c.status,
    city: c.city || '', venue: c.venue || '',
    date: c.date ? c.date.slice(0,10) : '',
    capacity: c.capacity != null ? String(c.capacity) : '',
    bookingUrl: c.bookingUrl || '', isConfirmed: c.isConfirmed,
    sortOrder: String(c.sortOrder),
    addressLine: c.addressLine || '', postcode: c.postcode || '',
    latitude: c.latitude != null ? String(c.latitude) : '',
    longitude: c.longitude != null ? String(c.longitude) : '',
    directionsUrl: c.directionsUrl || '',
    featuredOnHomepage: c.featuredOnHomepage,
    endDate: c.endDate ? c.endDate.slice(0,10) : '',
    startTime: c.startTime || '', finishTime: c.finishTime || '',
    price: c.price != null ? String(c.price) : '',
    availableSpaces: c.availableSpaces != null ? String(c.availableSpaces) : '',
    registerInterestUrl: c.registerInterestUrl || '',
    shortDescription: c.shortDescription || '',
  };
}

// Non-blocking guidance shown in the modal — the server enforces the
// featuredOnHomepage rule itself, but the admin should see why before saving.
function computeWarnings(form: CohortForm): string[] {
  const warnings: string[] = [];
  const hasLat = form.latitude.trim() !== '';
  const hasLng = form.longitude.trim() !== '';
  if (hasLat !== hasLng) {
    warnings.push('Latitude and longitude should both be set, or both left blank — otherwise no map can show.');
  }
  if (!hasLat && !hasLng && form.featuredOnHomepage) {
    warnings.push('No coordinates set — the homepage will show venue details as text but no map.');
  }
  if (form.featuredOnHomepage && !form.venue && !form.city) {
    warnings.push('No venue or city set — parents will see no location details for this cohort.');
  }
  return warnings;
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'12px' }}>
      <label style={S.label}>{label}</label>
      {children}
      {help && <p style={S.help}>{help}</p>}
    </div>
  );
}

function CohortModal({ initial, courses, onSave, onClose, saving, error }:
  { initial: CohortForm; courses: CourseRef[]; onSave: (f: CohortForm) => void; onClose: () => void; saving: boolean; error: string|null }) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof CohortForm>(k: K, v: CohortForm[K]) => setForm(f => ({ ...f, [k]: v }));
  const warnings = computeWarnings(form);
  const canFeature = form.isConfirmed && !!form.courseId;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'48px 16px', overflowY:'auto' }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:'620px', background:'#1B1B20', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', overflow:'hidden', marginBottom:'2rem' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:800, fontSize:'15px' }}>{initial.title ? 'Edit Cohort' : 'New Cohort'}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        <div style={{ padding:'24px' }}>
          {error && <div style={{ marginBottom:'14px', padding:'10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'rgba(239,68,68,0.9)', fontSize:'13px' }}>{error}</div>}
          <Field label="Title *"><input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Coaching Certification — Manchester June 2026" /></Field>
          <Field label="Course (optional)">
            <select style={{ ...S.input }} value={form.courseId} onChange={e => set('courseId', e.target.value)}>
              <option value="">— No course linked —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Status">
              <select style={{ ...S.input }} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" style={{ ...S.input, colorScheme:'dark' }} value={form.date} onChange={e => set('date', e.target.value)} />
            </Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="City"><input style={S.input} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Manchester" /></Field>
            <Field label="Capacity"><input type="number" style={S.input} value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="20" /></Field>
          </div>
          <Field label="Venue"><input style={S.input} value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Venue name" /></Field>
          <Field label="Booking URL"><input style={S.input} value={form.bookingUrl} onChange={e => set('bookingUrl', e.target.value)} placeholder="https://…" /></Field>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <button type="button" onClick={() => set('isConfirmed', !form.isConfirmed)}
              style={{ position:'relative', display:'inline-flex', alignItems:'center', width:'36px', height:'20px', borderRadius:'999px', background: form.isConfirmed ? '#A41C64' : 'rgba(255,255,255,0.12)', border:'none', cursor:'pointer', transition:'background 0.15s', flexShrink:0 }}>
              <span style={{ position:'absolute', left: form.isConfirmed ? '18px' : '2px', width:'16px', height:'16px', borderRadius:'50%', background:'#fff', transition:'left 0.15s' }} />
            </button>
            <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>{form.isConfirmed ? 'Confirmed date' : 'Date not yet confirmed'}</span>
          </div>

          <p style={S.sectionLabel}>Schedule (optional)</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="End date" help="Leave blank for a single-day cohort — Date above is used as the start.">
              <input type="date" style={{ ...S.input, colorScheme:'dark' }} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </Field>
            <Field label="Available spaces"><input type="number" style={S.input} value={form.availableSpaces} onChange={e => set('availableSpaces', e.target.value)} placeholder="4" /></Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Start time"><input type="time" style={{ ...S.input, colorScheme:'dark' }} value={form.startTime} onChange={e => set('startTime', e.target.value)} /></Field>
            <Field label="Finish time"><input type="time" style={{ ...S.input, colorScheme:'dark' }} value={form.finishTime} onChange={e => set('finishTime', e.target.value)} /></Field>
          </div>

          <p style={S.sectionLabel}>Venue &amp; map (optional)</p>
          <Field label="Address line"><input style={S.input} value={form.addressLine} onChange={e => set('addressLine', e.target.value)} placeholder="Street address" /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Postcode"><input style={S.input} value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder="S1 2AB" /></Field>
            <Field label="Directions URL" help="Overrides the auto-generated Google Maps link.">
              <input style={S.input} value={form.directionsUrl} onChange={e => set('directionsUrl', e.target.value)} placeholder="https://…" />
            </Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Latitude" help="Required together with Longitude for a homepage map to appear.">
              <input type="number" step="any" style={S.input} value={form.latitude} onChange={e => set('latitude', e.target.value)} placeholder="53.3811" />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" style={S.input} value={form.longitude} onChange={e => set('longitude', e.target.value)} placeholder="-1.4701" />
            </Field>
          </div>

          <p style={S.sectionLabel}>Pricing &amp; interest (optional)</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Price (£)"><input type="number" style={S.input} value={form.price} onChange={e => set('price', e.target.value)} placeholder="500" /></Field>
            <Field label="Register interest URL" help="Overrides the default register-interest link.">
              <input style={S.input} value={form.registerInterestUrl} onChange={e => set('registerInterestUrl', e.target.value)} placeholder="https://…" />
            </Field>
          </div>
          <Field label="Short homepage description" help="A one- or two-sentence summary shown on the homepage card, distinct from the course page.">
            <textarea style={{ ...S.input, minHeight:'64px', resize:'vertical', fontFamily:'inherit' }} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="e.g. Two days of hands-on coaching across the six core Strongman events." />
          </Field>

          <p style={S.sectionLabel}>Homepage feature</p>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
            <button type="button" disabled={!canFeature} onClick={() => set('featuredOnHomepage', !form.featuredOnHomepage)}
              style={{ position:'relative', display:'inline-flex', alignItems:'center', width:'36px', height:'20px', borderRadius:'999px', background: form.featuredOnHomepage ? '#A41C64' : 'rgba(255,255,255,0.12)', border:'none', cursor: canFeature ? 'pointer' : 'not-allowed', opacity: canFeature ? 1 : 0.5, transition:'background 0.15s', flexShrink:0 }}>
              <span style={{ position:'absolute', left: form.featuredOnHomepage ? '18px' : '2px', width:'16px', height:'16px', borderRadius:'50%', background:'#fff', transition:'left 0.15s' }} />
            </button>
            <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>
              {form.featuredOnHomepage ? 'Featured on homepage' : 'Not featured on homepage'}
            </span>
          </div>
          <p style={S.help}>
            Optional — showing a cohort on the homepage is a separate decision from confirming it.{' '}
            {!canFeature && 'Available once this cohort is marked confirmed above and linked to a course.'}
          </p>

          {warnings.length > 0 && (
            <div style={{ marginTop:'16px', padding:'10px 12px', background:'rgba(225,154,71,0.08)', border:'1px solid rgba(225,154,71,0.25)', borderRadius:'8px' }}>
              {warnings.map((w, i) => (
                <p key={i} style={{ fontSize:'12px', color:'#E19A47', margin: i === 0 ? 0 : '6px 0 0', lineHeight:1.5 }}>{w}</p>
              ))}
            </div>
          )}

          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'20px' }}>
            <button style={S.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={() => onSave(form)} disabled={saving}>{saving ? 'Saving…' : 'Save Cohort'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ width:'100%', maxWidth:'380px', background:'#1B1B20', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'28px 24px' }}>
        <p style={{ fontWeight:800, color:'#fff', fontSize:'15px', marginBottom:'10px' }}>Delete cohort?</p>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'13px', lineHeight:1.6, marginBottom:'24px' }}>"{title}" will be permanently deleted.</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
          <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
          <button style={{ ...S.btnPrimary, background:'rgba(239,68,68,0.8)' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function CohortManager() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [modal, setModal] = useState<{ open: boolean; editing: Cohort|null }>({ open: false, editing: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Cohort|null>(null);
  const [deleteError, setDeleteError] = useState<string|null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [cRes, coRes] = await Promise.all([api.get<Cohort[]>('/admin/cohorts'), api.get<CourseRef[]>('/admin/courses')]);
      setCohorts(cRes.data); setCourses(coRes.data);
    } catch { setError('Failed to load cohorts.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveCohort = async (form: CohortForm) => {
    setSaving(true); setSaveError(null);
    try {
      const body = {
        courseId: form.courseId || null, title: form.title.trim(), status: form.status,
        city: form.city || null, venue: form.venue || null,
        date: form.date || null,
        capacity: form.capacity ? Number(form.capacity) : null,
        bookingUrl: form.bookingUrl || null,
        isConfirmed: form.isConfirmed,
        sortOrder: Number(form.sortOrder) || 0,
        addressLine: form.addressLine || null,
        postcode: form.postcode || null,
        latitude: form.latitude !== '' ? Number(form.latitude) : null,
        longitude: form.longitude !== '' ? Number(form.longitude) : null,
        directionsUrl: form.directionsUrl || null,
        featuredOnHomepage: form.featuredOnHomepage,
        endDate: form.endDate || null,
        startTime: form.startTime || null,
        finishTime: form.finishTime || null,
        price: form.price !== '' ? Number(form.price) : null,
        availableSpaces: form.availableSpaces !== '' ? Number(form.availableSpaces) : null,
        registerInterestUrl: form.registerInterestUrl || null,
        shortDescription: form.shortDescription || null,
      };
      if (modal.editing) {
        const res = await api.put<Cohort>(`/admin/cohorts/${modal.editing.id}`, body);
        setCohorts(prev => prev.map(c => c.id === modal.editing!.id ? res.data : c));
      } else {
        const res = await api.post<Cohort>('/admin/cohorts', body);
        setCohorts(prev => [...prev, res.data]);
      }
      setModal({ open: false, editing: null });
    } catch (err: any) { setSaveError(err?.response?.data?.error || 'Failed to save cohort.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/admin/cohorts/${confirmDelete.id}`);
      setCohorts(prev => prev.filter(c => c.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err: any) { setDeleteError(err?.response?.data?.error || 'Failed to delete cohort.'); setConfirmDelete(null); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050506', color:'#fff' }}>
      <Navbar />
      <div style={{ background:'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom:'1px solid rgba(194,24,106,0.08)', paddingTop:'calc(var(--navbar-height,72px) + 24px)', paddingBottom:'24px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px' }}>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'6px' }}>
            <Link to="/admin" style={{ color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>Admin</Link> › Cohorts
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', flexWrap:'wrap' }}>
            <div>
              <h1 style={{ fontSize:'clamp(1.25rem,3vw,1.75rem)', fontWeight:800, margin:'0 0 4px' }}>Cohort Manager</h1>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Manage course dates and event cohorts.</p>
            </div>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open:true, editing:null }); }}>+ New Cohort</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'28px 24px' }}>
        {deleteError && <div style={{ marginBottom:'16px', padding:'12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'rgba(239,68,68,0.9)', fontSize:'13px' }}>{deleteError}</div>}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[...Array(3)].map((_,i) => <div key={i} style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'20px', height:'64px' }} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:'64px' }}><p style={{ color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>{error}</p><button style={S.btnPrimary} onClick={load}>Retry</button></div>
        ) : cohorts.length === 0 ? (
          <div style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'64px 24px', textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', marginBottom:'20px' }}>No cohorts yet. Add a cohort to start managing course dates.</p>
            <button style={S.btnPrimary} onClick={() => { setSaveError(null); setModal({ open:true, editing:null }); }}>+ New Cohort</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {cohorts.map(c => (
              <div key={c.id} style={{ background:'#151519', border:'1px solid rgba(194,24,106,0.08)', borderRadius:'10px', padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:'14px', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'4px', alignItems:'center' }}>
                    <span style={statusPill(c.status)}>{c.status}</span>
                    {c.isConfirmed && <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(164,28,100,0.8)', background:'rgba(164,28,100,0.08)', padding:'1px 6px', borderRadius:'999px' }}>CONFIRMED</span>}
                    {c.featuredOnHomepage && <span style={{ fontSize:'10px', fontWeight:700, color:'#E19A47', background:'rgba(225,154,71,0.1)', padding:'1px 6px', borderRadius:'999px' }}>FEATURED ON HOMEPAGE</span>}
                    {c.featuredOnHomepage && (c.latitude == null || c.longitude == null) && <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(239,68,68,0.85)', background:'rgba(239,68,68,0.08)', padding:'1px 6px', borderRadius:'999px' }}>NO MAP DATA</span>}
                  </div>
                  <p style={{ fontWeight:700, fontSize:'14px', color:'#fff', margin:'0 0 2px' }}>{c.title}</p>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', margin:0 }}>
                    {c.course ? c.course.title : 'No course linked'}
                    {c.city ? ` · ${c.city}` : ''}
                    {c.date ? ` · ${new Date(c.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}` : ''}
                    {c.capacity ? ` · ${c.capacity} places` : ''}
                  </p>
                </div>
                <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                  <button style={S.btnGhost} onClick={() => { setSaveError(null); setModal({ open:true, editing:c }); }}>Edit</button>
                  <button style={S.btnDanger} onClick={() => { setDeleteError(null); setConfirmDelete(c); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <CohortModal
          initial={modal.editing ? toForm(modal.editing) : BLANK}
          courses={courses}
          onSave={saveCohort}
          onClose={() => setModal({ open:false, editing:null })}
          saving={saving}
          error={saveError}
        />
      )}
      {confirmDelete && <ConfirmDelete title={confirmDelete.title} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}
