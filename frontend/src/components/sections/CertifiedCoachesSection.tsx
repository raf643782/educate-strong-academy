/**
 * CertifiedCoachesSection — homepage Find a Coach section.
 *
 * Real data only: calls GET /api/coaches (the same endpoint
 * CoachDirectory.tsx uses, which only ever returns
 * isVerified && isPublished && !isArchived profiles). Search is a real
 * debounced server-side query via the `search` param, not a decorative
 * input. When coaches exist, real cards render with real photos and
 * links to their real /coaches/:slug profile. When none exist yet, the
 * exact existing honest empty state (copy and CTAs) is preserved
 * unchanged. The previous decorative map placeholder is removed since
 * it wasn't backed by any real geodata and would misrepresent
 * unavailable coverage as available.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

interface Coach {
  slug: string;
  displayName: string;
  photoUrl: string | null;
  location: string | null;
  specialities: string[];
  qualificationSummary: string | null;
}

function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Link
      to={`/coaches/${coach.slug}`}
      className="block rounded-xl p-5 transition-colors"
      style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.1)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(164,28,100,0.4)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(194,24,106,0.1)'; }}
    >
      <div className="flex gap-3.5 items-start mb-3.5">
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden font-bold text-sm"
          style={{ background: coach.photoUrl ? undefined : 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.25)', color: '#C0246E' }}
        >
          {coach.photoUrl ? (
            <img src={coach.photoUrl} alt={coach.displayName} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            coach.displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
          )}
        </div>
        <div>
          <p className="font-bold text-[15px] text-white leading-tight">{coach.displayName}</p>
          {coach.location && <p className="text-xs text-white/40 mt-0.5">{coach.location}</p>}
        </div>
      </div>
      {coach.qualificationSummary && <p className="text-[13px] text-white/50 leading-relaxed mb-3">{coach.qualificationSummary}</p>}
      {coach.specialities.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {coach.specialities.map((s) => (
            <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: '#E19A47', background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.25)' }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function CertifiedCoachesSection() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const t = setTimeout(() => {
      setLoading(true);
      api
        .get<Coach[]>('/coaches', { params })
        .then((res) => setCoaches(res.data))
        .catch(() => setCoaches([]))
        .finally(() => setLoading(false));
    }, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <section style={{ background: '#0A0A0A', padding: '96px 0' }}>
      <div className="es-container">
        <div className="mb-10" style={{ maxWidth: '640px' }}>
          <p className="es-label mb-4">Coach Directory</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Find a Certified Coach Near You
          </h2>
          <p className="leading-relaxed mb-6" style={{ color: '#888' }}>
            Every coach who completes an Educate.Strong qualification will appear in our verified coach directory. Find certified coaches in your area or browse worldwide.
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-1"
            style={{ background: '#1A1A1A', border: '1px solid #2C2C2C', color: '#fff' }}
          />
        </div>

        {loading ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[150px] rounded-xl" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : coaches.length > 0 ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {coaches.map((c) => <CoachCard key={c.slug} coach={c} />)}
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #2C2C2C', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#A41C64' }}>
              {search ? 'No coaches match your search' : 'No certified coaches are live yet'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
              {search
                ? 'Try a different name or location, or clear your search to see all published coaches.'
                : 'EducateStrong certified coaches will appear here once qualifications and verification records are live. Complete a Level 1 qualification to be among the first listed.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link to="/register-interest?type=coach-access" className="btn-primary">Register Interest</Link>
              <Link to="/coaches" className="btn-secondary">View Full Directory</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
