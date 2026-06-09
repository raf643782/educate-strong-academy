import { Link } from 'react-router-dom';

const STATS = [
  { value: '300+', label: 'Graduates' },
  { value: '2', label: 'Active Pathways' },
  { value: 'UK Wide', label: 'Reach' },
];

const VALUE_CARDS = [
  {
    title: 'Active IQ Accredited',
    body: 'The only Strongman coaching qualification accredited by an Ofqual-regulated awarding organisation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A41C64" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3.333 1.667 8.667 1.667 12 0v-5" />
      </svg>
    ),
  },
  {
    title: 'WHEA.GB Endorsed',
    body: 'The Level 1 Strongman Refereeing Certification is formally endorsed by WHEA.GB.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A41C64" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Armed Forces Recognised',
    body: 'Coaching and refereeing courses endorsed by Armed Forces Strongman.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A41C64" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function WhyEducateStrong() {
  return (
    <section style={{ background: '#090909', padding: '96px 0' }}>
      <div className="es-container">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl text-center py-6 px-4"
              style={{ background: '#111', border: '1px solid #2C2C2C' }}
            >
              <p className="text-3xl font-extrabold mb-1" style={{ color: '#A41C64' }}>
                {s.value}
              </p>
              <p className="text-sm" style={{ color: '#888' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="es-label mb-4">Why Educate.Strong</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-6">
              The Standard Strongman Deserves
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: '#888' }}>
              Educate.Strong Academy is the UK's only accredited pathway for Strongman coaching and refereeing. Our qualifications are recognised by WHEA.GB, Armed Forces Strongman, and are awarded through Active IQ — an Ofqual-regulated awarding organisation.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: '#888' }}>
              Every qualification is designed by active athletes and coaches who compete at the highest level. Theory meets practice from day one.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary">
                View Courses
              </Link>
              <Link to="/about" className="btn-secondary">
                About Us
              </Link>
            </div>
          </div>

          {/* Right — value cards */}
          <div className="flex flex-col gap-5">
            {VALUE_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-6 flex gap-5 items-start"
                style={{ background: '#1A1A1A', border: '1px solid #2C2C2C' }}
              >
                <div className="shrink-0 mt-0.5">{card.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
