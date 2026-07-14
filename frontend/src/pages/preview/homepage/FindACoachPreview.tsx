/**
 * FindACoachPreview — restored, clearly-labelled preview of a future
 * Find a Coach homepage section.
 *
 * Every name, location and distance here is invented for
 * demonstration and is labelled as such throughout — none of it
 * reuses real tutor names or photos, so nothing here could be
 * mistaken for a real, certified coach. The location search is a real
 * client-side filter over the demo array (typing "Leeds" genuinely
 * narrows the list), not a fixed result standing in for a real search.
 *
 * The mini-map is a static, illustrative panel, not a real geocoded
 * map — three fictional people do not have real coordinates to plot,
 * and plotting invented pins at precise-looking positions would be
 * more misleading here than useful. An accessible text list is the
 * primary way to read coach locations; the panel is a visual aid,
 * not the source of the information.
 *
 * "View Profile" is intentionally inert (no navigation) since no real
 * individual profile exists yet; it stays a real, focusable button so
 * keyboard users can reach it, and reveals a plain, permanently
 * visible note on click/Enter rather than only on hover. "View Full
 * Directory" is a real link to the actual /coaches page, which is
 * honest today even in its current empty state.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

interface DemoCoach {
  id: string;
  displayName: string;
  areas: string[];
  city: string;
  distance: string;
  top: string; // illustrative panel position, percent
  left: string;
}

const DEMO_COACHES: DemoCoach[] = [
  { id: 'a', displayName: 'Example Coach A', areas: ['Coaching'], city: 'Sheffield', distance: 'Approximately 2 miles from Sheffield city centre', top: '38%', left: '46%' },
  { id: 'b', displayName: 'Example Coach B', areas: ['Refereeing', 'Coaching'], city: 'Leeds', distance: 'Approximately 1 mile from Leeds city centre', top: '20%', left: '58%' },
  { id: 'c', displayName: 'Example Coach C', areas: ['StrongKidz'], city: 'Manchester', distance: 'Approximately 3 miles from Manchester city centre', top: '55%', left: '18%' },
];

function CoachPin({ coach }: { coach: DemoCoach }) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ top: coach.top, left: coach.left, transform: 'translate(-50%, -100%)' }}
      aria-hidden="true"
    >
      <div className="w-3 h-3 rounded-full" style={{ background: '#C2186A', boxShadow: '0 0 0 4px rgba(194,24,106,0.22)' }} />
    </div>
  );
}

export default function FindACoachPreview() {
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_COACHES;
    return DEMO_COACHES.filter((c) => c.city.toLowerCase().includes(q) || c.areas.some((a) => a.toLowerCase().includes(q)));
  }, [query]);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-labelledby="find-coach-heading"
      style={{ background: '#050506', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="es-container">
        <RevealOnScroll>
          <div className="mb-8" style={{ maxWidth: '720px' }}>
            <div
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(225,154,71,0.14)', border: '1px solid rgba(225,154,71,0.35)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E19A47' }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.10em]" style={{ color: '#E19A47' }}>
                Preview example only, not real or certified coaches
              </span>
            </div>
            <p className="es-label mb-3">Coach Directory</p>
            <h2 id="find-coach-heading" className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.035em' }}>
              Find a Coach Near You
            </h2>
            <p className="text-white/45 text-base leading-relaxed">
              Once coaches are certified and verified, they will appear here by location. The example
              below shows how that search will work.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.06}>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-5 md:p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <label htmlFor="coach-search" className="block text-xs font-semibold text-white/60 mb-2">
                Search by city or coaching area
              </label>
              <input
                id="coach-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try Sheffield, Leeds, Manchester, or Coaching"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
              {/* Illustrative panel, not a geocoded map */}
              <div className="p-5 md:p-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[11px] text-white/30 mb-3">Illustrative only, positions are not precise locations</p>
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{ height: '220px', background: 'linear-gradient(135deg, #1B1B20 0%, #151519 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
                  role="img"
                  aria-label="Illustrative map showing approximate example coach areas"
                >
                  {filtered.map((c) => <CoachPin key={c.id} coach={c} />)}
                </div>
              </div>

              {/* Accessible text list — the real source of the information */}
              <ul className="p-5 md:p-6 space-y-4">
                {filtered.length === 0 && (
                  <li className="text-sm text-white/40">No example coaches match that search.</li>
                )}
                {filtered.map((coach) => (
                  <li key={coach.id} className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white/70 text-sm flex-shrink-0"
                      style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)' }}
                      aria-hidden="true"
                    >
                      {coach.displayName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{coach.displayName}</p>
                      <p className="text-xs text-white/40 mt-0.5">{coach.city}, {coach.areas.join(', ')}</p>
                      <p className="text-xs text-white/30 mt-0.5">{coach.distance}</p>
                      {revealed.has(coach.id) && (
                        <p className="text-xs mt-2" style={{ color: '#E19A47' }}>
                          Real coach profiles will appear here once certified and verified.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleReveal(coach.id)}
                      className="btn-secondary flex-shrink-0"
                      aria-expanded={revealed.has(coach.id)}
                    >
                      View Profile
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="flex justify-center mt-8">
            <Link to="/coaches" className="btn-primary">View Full Directory</Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
