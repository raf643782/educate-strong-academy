import { Link } from 'react-router-dom';

const COACHES = [
  { name: 'Tom Bradley', location: 'Sheffield, UK', level: 'Level 1 Coaching', speciality: 'Strength & Conditioning', initials: 'TB', colour: '#A41C64' },
  { name: 'Jessica Park', location: 'Manchester, UK', level: 'Level 1 Coaching', speciality: 'Gym Owner', initials: 'JP', colour: '#C0246E' },
  { name: 'Daniel Ross', location: 'Birmingham, UK', level: 'Level 1 Refereeing', speciality: 'Competition Official', initials: 'DR', colour: '#E19A47' },
];

const FILTERS = ['All Levels', 'Coaching', 'Refereeing', 'StrongKidz'];

const MARKERS: { top: string; left: string }[] = [
  { top: '25%', left: '33%' },
  { top: '50%', left: '65%' },
  { top: '33%', left: '75%' },
  { top: '65%', left: '42%' },
  { top: '20%', left: '55%' },
  { top: '72%', left: '22%' },
];

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
              Every coach who completes an Educate.Strong qualification appears in our verified coach directory. Find certified coaches in your area or browse worldwide.
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
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: i === 0 ? '#A41C64' : '#1C1C1C',
                    color: i === 0 ? '#fff' : '#888',
                    border: '1px solid',
                    borderColor: i === 0 ? '#A41C64' : '#2C2C2C',
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold" style={{ color: '#444' }}>Map</span>
            </div>

            {/* Markers */}
            {MARKERS.map((m, i) => (
              <div
                key={i}
                className="absolute"
                style={{ top: m.top, left: m.left, transform: 'translate(-50%, -50%)' }}
                aria-hidden="true"
              >
                <div
                  className="w-3 h-3 rounded-full motion-safe:animate-ping absolute"
                  style={{ background: 'rgba(164,28,100,0.4)' }}
                />
                <div
                  className="w-3 h-3 rounded-full relative"
                  style={{ background: '#A41C64' }}
                />
              </div>
            ))}

            {/* Bottom overlay */}
            <div
              className="absolute bottom-0 inset-x-0 px-4 py-3 text-xs text-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#666' }}
            >
              Interactive coach map — coming soon
            </div>
          </div>
        </div>

        {/* Coach cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COACHES.map((coach) => {
            const slug = coach.name.toLowerCase().replace(' ', '-');
            return (
              <div
                key={coach.name}
                className="rounded-xl p-5"
                style={{ background: '#111', border: '1px solid #2C2C2C' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ background: coach.colour }}
                  >
                    {coach.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{coach.name}</p>
                    <p className="text-xs" style={{ color: '#888' }}>{coach.location}</p>
                  </div>
                </div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                  style={{ background: `${coach.colour}22`, color: coach.colour }}
                >
                  {coach.level}
                </span>
                <p className="text-xs mb-4" style={{ color: '#666' }}>{coach.speciality}</p>
                <Link
                  to={`/coaches/${slug}`}
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#A41C64' }}
                >
                  View Profile →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
