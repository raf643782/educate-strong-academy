import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Interest {
  id: string; firstName: string; lastName: string; email: string;
  phone: string | null; courseInterest: string | null; locationInterest: string | null;
  message: string | null; sourcePage: string | null; status: string; createdAt: string;
}

const STATUSES = ['NEW','CONTACTED','CONVERTED','ARCHIVED'] as const;

const S = {
  input: { width:'100%', background:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'11px 14px', color:'#fff', fontSize:'14px', outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  label: { display:'block', fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' } as React.CSSProperties,
  btnPrimary: { background:'linear-gradient(135deg,#A41C64,#C0246E)', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:700, fontSize:'13px', cursor:'pointer' } as React.CSSProperties,
  btnGhost: { background:'transparent', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'8px 14px', fontWeight:600, fontSize:'12px', cursor:'pointer' } as React.CSSProperties,
};

function statusPill(s: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    NEW:       { background:'rgba(225,154,71,0.15)', color:'#E19A47' },
    CONTACTED: { background:'rgba(164,28,100,0.18)', color:'#C0246E' },
    CONVERTED: { background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)' },
    ARCHIVED:  { background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.3)' },
  };
  return { fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'999px', ...(map[s] || map.NEW) };
}

function DetailPanel({ item, onClose, onStatusChange, saving }:
  { item: Interest; onClose: () => void; onStatusChange: (id: string, status: string) => void; saving: boolean }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'flex-start', justifyContent:'flex-end' }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:'440px', height:'100vh', background:'#1B1B20', borderLeft:'1px solid rgba(194,24,106,0.12)', overflowY:'auto', padding:'28px 24px', display:'flex', flexDirection:'column', gap:'18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:800, fontSize:'15px' }}>Interest Record</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        <div>
          <p style={{ fontWeight:700, fontSize:'16px', color:'#fff', margin:'0 0 2px' }}>{item.firstName} {item.lastName}</p>
          <a href={`mailto:${item.email}`} style={{ fontSize:'13px', color:'#C0246E', textDecoration:'none' }}>{item.email}</a>
          {item.phone && <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', margin:'4px 0 0' }}>{item.phone}</p>}
        </div>
        {item.courseInterest && (
          <div><p style={S.label}>Course Interest</p><p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', margin:0 }}>{item.courseInterest}</p></div>
        )}
        {item.locationInterest && (
          <div><p style={S.label}>Location</p><p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', margin:0 }}>{item.locationInterest}</p></div>
        )}
        {item.message && (
          <div><p style={S.label}>Message</p><p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', margin:0, lineHeight:1.6, whiteSpace:'pre-wrap' }}>{item.message}</p></div>
        )}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <div><p style={S.label}>Submitted</p><p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0 }}>{new Date(item.createdAt).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p></div>
          {item.sourcePage && <div><p style={S.label}>Source Page</p><p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', margin:0 }}>{item.sourcePage}</p></div>}
        </div>
        <div>
          <p style={S.label}>Update Status</p>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {STATUSES.map(s => (
              <button key={s} disabled={saving || item.status===s}
                onClick={() => onStatusChange(item.id, s)}
                style={{ ...statusPill(s), border:'1px solid transparent', cursor: item.status===s || saving ? 'default' : 'pointer', opacity: item.status===s ? 1 : 0.5, padding:'5px 12px', borderRadius:'8px', fontSize:'12px', background: item.status===s ? undefined : 'rgba(255,255,255,0.05)' }}>
                {s === item.status ? `✓ ${s}` : s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterInterestManager() {
  const [items, setItems] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selected, setSelected] = useState<Interest|null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get<Interest[]>('/admin/register-interest');
      setItems(res.data);
    } catch { setError('Failed to load register interest data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: string) => {
    setSaving(true);
    try {
      const res = await api.put<Interest>(`/admin/register-interest/${id}`, { status });
      setItems(prev => prev.map(i => i.id === id ? res.data : i));
      setSelected(prev => prev?.id === id ? res.data : prev);
    } catch { /* keep panel open */ }
    finally { setSaving(false); }
  };

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${i.firstName} ${i.lastName} ${i.email} ${i.courseInterest || ''} ${i.locationInterest || ''}`.toLowerCase().includes(q);
    const matchesStatus = !filterStatus || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: items.filter(i => i.status===s).length }), {});

  return (
    <div style={{ minHeight:'100vh', background:'#050506', color:'#fff' }}>
      <Navbar />
      <div style={{ background:'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom:'1px solid rgba(194,24,106,0.08)', paddingTop:'calc(var(--navbar-height,72px) + 24px)', paddingBottom:'24px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px' }}>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'6px' }}>
            <Link to="/admin" style={{ color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>Admin</Link> › Register Interest
          </p>
          <h1 style={{ fontSize:'clamp(1.25rem,3vw,1.75rem)', fontWeight:800, margin:'0 0 4px' }}>Register Interest</h1>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Manage incoming interest and enquiries from prospective learners.</p>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'28px 24px' }}>
        {/* Stats bar */}
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'24px' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(f => f===s ? '' : s)}
              style={{ background: filterStatus===s ? 'rgba(164,28,100,0.18)' : '#151519', border: filterStatus===s ? '1px solid rgba(164,28,100,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', textAlign:'left' }}>
              <span style={{ display:'block', fontSize:'16px', fontWeight:800, color:'#fff' }}>{counts[s]||0}</span>
              <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s}</span>
            </button>
          ))}
          {filterStatus && (
            <button onClick={() => setFilterStatus('')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px 14px', color:'rgba(255,255,255,0.4)', fontSize:'12px', cursor:'pointer' }}>
              Clear filter ×
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ marginBottom:'20px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, course interest…" style={{ ...S.input, maxWidth:'400px' }} />
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[...Array(4)].map((_,i) => <div key={i} style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', height:'62px' }} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:'64px' }}><p style={{ color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>{error}</p><button style={S.btnPrimary} onClick={load}>Retry</button></div>
        ) : filtered.length === 0 ? (
          <div style={{ background:'#151519', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'64px 24px', textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px' }}>{items.length===0 ? 'No interest records yet.' : 'No records match your filter.'}</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {filtered.map(i => (
              <button key={i.id} onClick={() => setSelected(i)}
                style={{ background:'#151519', border:'1px solid rgba(194,24,106,0.08)', borderRadius:'10px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', textAlign:'left', width:'100%' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'2px', flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:'14px', color:'#fff' }}>{i.firstName} {i.lastName}</span>
                    <span style={statusPill(i.status)}>{i.status}</span>
                  </div>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', margin:0 }}>
                    {i.email}
                    {i.courseInterest ? ` · ${i.courseInterest}` : ''}
                    {i.locationInterest ? ` · ${i.locationInterest}` : ''}
                  </p>
                </div>
                <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', flexShrink:0 }}>
                  {new Date(i.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DetailPanel
          item={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          saving={saving}
        />
      )}
    </div>
  );
}
