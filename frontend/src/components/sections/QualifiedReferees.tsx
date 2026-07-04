import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../../lib/contact';

/**
 * QualifiedReferees — showcases the referee cohort with a group photo.
 *
 * The qualified referees group photo (showing certified officials with
 * British Army banners) should be placed at:
 * /public/assets/qualified-referees.jpg
 *
 * Until that file is provided by Educate.Strong, a branded placeholder
 * with strong copy is shown.
 */

const STATS = [
  { value: 'WHEA.GB', label: 'Endorsed' },
  { value: 'Armed Forces', label: 'Strongman' },
  { value: 'Active IQ', label: 'Standards' },
  { value: 'UK', label: 'Wide' },
];

export default function QualifiedReferees() {
  // Check if the image file exists — use it if it does
  const hasGroupPhoto = false; // Set to true when /assets/qualified-referees.jpg is provided

  return (
    <section
      className="es-grit relative overflow-hidden"
      style={{
        background: '#0D0D0D',
        borderTop: '1px solid #2C2C2C',
        position: 'relative',
      }}
    >
      <div className="es-container py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Group photo or placeholder */}
          <div className="relative">
            {hasGroupPhoto ? (
              <img
                src="/assets/qualified-referees.jpg"
                alt="Educate.Strong Qualified Referees cohort"
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: '420px', border: '1px solid #3C3C3C' }}
              />
            ) : (
              /* Branded placeholder maintaining the visual space */
              <div
                className="rounded-xl relative overflow-hidden"
                style={{
                  height: '380px',
                  background: 'linear-gradient(135deg, #1A1A1A, #141414)',
                  border: '1px solid #2C2C2C',
                }}
              >
                {/* Background grid */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(164,28,100,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(164,28,100,0.04) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                {/* Centered content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {/* Owl mark watermark */}
                  <img src="/assets/logo_owl.svg" alt="" className="w-20 h-20 opacity-10 mb-6" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/es-logo.png'; }} />
                  <p className="text-sm font-bold" style={{ color: '#A41C64' }}>EDUCATE.STRONG</p>
                  <p className="text-xs text-es-subtle mt-2">Qualified Referees cohort photography</p>
                  <p className="text-xs text-es-subtle">Army banners · Certificates · Real outcomes</p>
                  <p className="text-xs mt-4" style={{ color: 'rgba(164,28,100,0.4)' }}>
                    Provide: /assets/qualified-referees.jpg
                  </p>
                </div>
                {/* Corner accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, transparent, #A41C64, transparent)' }} />
              </div>
            )}

            {/* Overlay badge */}
            <div
              className="absolute bottom-4 left-4 right-4 rounded-lg px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(164,28,100,0.3)' }}
            >
              <img src="/assets/partner-british-army.webp" alt="British Army" className="h-6 w-auto opacity-80" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/british-army-logo.webp'; }} />
              <div>
                <p className="text-xs font-bold text-white">Armed Forces Strongman Partner</p>
                <p className="text-xs text-es-subtle">Serving and veteran personnel welcome</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="es-label mb-3">Certified Officials</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Qualified Referees.<br />
              <span style={{ color: '#A41C64' }}>Officiating Across the UK.</span>
            </h2>
            <p className="text-es-muted leading-relaxed mb-6">
              Every official below holds a Level 1 Strongman Refereeing Certification from
              Educate.Strong — the only formal refereeing programme in the UK endorsed by WHEA.GB
              and Armed Forces Strongman.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {STATS.map(stat => (
                <div key={stat.label} className="es-card p-3 text-center">
                  <p className="text-xs font-black text-white mb-0.5" style={{ color: '#A41C64' }}>{stat.value}</p>
                  <p className="text-xs text-es-subtle">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/courses/level-1-strongman-refereeing" className="btn-primary text-sm">
                View Refereeing Course
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Register Interest — Refereeing')}`}
                className="btn-secondary text-sm"
              >
                Register Interest
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
