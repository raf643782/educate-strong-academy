/**
 * StatsStrip — compact trust strip directly under PartnerLogosMarquee.
 * Deliberately shares the carousel's #080808 background with no top
 * border, so it reads as one continuous strip rather than a separate
 * boxed section. Replaces the old 3-card stats grid inside
 * WhyEducateStrong (that component is no longer rendered on the
 * homepage, but stays in the codebase).
 */

const STATS = [
  { value: '300+', label: 'Graduates' },
  { value: '2', label: 'Active Pathways' },
  { value: 'UK Wide', label: 'Reach' },
];

export default function StatsStrip() {
  return (
    <section
      aria-label="Educate.Strong at a glance"
      style={{
        background: '#080808',
        borderBottom: '1px solid rgba(40,40,40,0.8)',
        padding: '20px 0',
      }}
    >
      <div
        className="es-container flex items-center justify-center flex-wrap"
        style={{ gap: 'clamp(20px, 5vw, 56px)' }}
      >
        {STATS.map((s, i) => (
          <div key={s.label} className="flex items-center" style={{ gap: 'clamp(20px, 5vw, 56px)' }}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}
              />
            )}
            <p className="flex items-baseline gap-1.5" style={{ margin: 0 }}>
              <span className="font-extrabold" style={{ fontSize: '15px', color: '#C2186A' }}>
                {s.value}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                {s.label}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
