import { Link } from 'react-router-dom';

const FILTERS = ['All Levels', 'Coaching', 'Refereeing', 'StrongKidz'];

export default function CertifiedCoachesSection() {
  return (
    <section style={{ background: '#0A0A0A', padding: '96px 0' }}>
      <div className="es-container">
        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left */}
          <div>
            <p className="es-label mb-4">Coach Directory</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Find a Certified Coach Near You
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: '#888' }}>
              Every coach who completes an Educate.Strong qualification will appear in our verified coach directory. Find certified coaches in your area or browse worldwide.
            </p>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by city or postcode..."
              className="w-full rounded-lg px-4 py-3 mb-4 text-sm text-white outline-none focus:ring-1"
              style={{
                background: '#1A1A1A',
                border: '1px solid #2C2C2C',
                color: '#fff',
              }}
              readOnly
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FILTERS.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: i === 0 ? '#A41C64' : '#1C1C1C',
                    color: i === 0 ? '#fff' : '#888',
                    border: '1px solid',
                    borderColor: i === 0 ? '#A41C64' : '#2C2C2C',
                    cursor: 'default',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-4">
              <Link to="/coaches" className="btn-primary">
                View Coach Directory
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn About Certification
              </Link>
            </div>

            <p className="text-xs" style={{ color: '#555' }}>
              Verified EducateStrong coaches will appear here as the directory grows.
            </p>
          </div>

          {/* Right — map placeholder */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: '#111',
              height: '360px',
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(164,28,100,0.04) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(164,28,100,0.04) 0%, transparent 50%)
              `,
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <span style={{ fontSize: '32px' }}>🎖️</span>
              <p className="text-sm font-semibold" style={{ color: '#555' }}>Certified Coach Map</p>
              <p className="text-xs leading-relaxed" style={{ color: '#3A3A3A' }}>
                Coach locations will appear here once the directory is live
              </p>
            </div>

            {/* Bottom overlay */}
            <div
              className="absolute bottom-0 inset-x-0 px-4 py-3 text-xs text-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#555' }}
            >
              Interactive coach map — launching with directory
            </div>
          </div>
        </div>

        {/* Empty state where coach cards were */}
        <div
          style={{
            background: '#111',
            border: '1px solid #2C2C2C',
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: '#A41C64' }}>
            No certified coaches are live yet
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            EducateStrong certified coaches will appear here once qualifications and verification records are live.
            Complete a Level 1 qualification to be among the first listed.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <a
              href="mailto:info@educate-strong.com?subject=Certified Coach Directory - Register Interest"
              className="btn-primary"
            >
              Register Interest
            </a>
            <Link to="/coaches" className="btn-secondary">
              View Full Directory
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
