import { Link } from 'react-router-dom';

interface Tutor {
  name: string;
  role: string;
  credential: string;
  img: string;
  initials: string;
}

const TUTORS: Tutor[] = [
  { name: 'Paul Smith', role: 'Lead Tutor', credential: "3× UK's Strongest Man", img: '/assets/paul-smith.avif', initials: 'PS' },
  { name: 'Dr Chris Fitzgerald', role: 'Tutor & Programme Lead', credential: 'PhD · Natural WSM Athlete', img: '/assets/chris-fitzgerald.avif', initials: 'CF' },
  { name: 'Kris Herbert', role: 'Digital & Media', credential: 'Natural WSM 2024 Bronze', img: '/assets/krish-herbert.jpg', initials: 'KH' },
  { name: 'Laura Hollywood', role: 'StrongKidz Coach', credential: "Britain's Strongest Woman u73", img: '/assets/laura-hollywood.avif', initials: 'LH' },
  { name: 'Victoria Wilson', role: 'StrongKidz Coach', credential: 'S&C Coach · Youth Specialist', img: '/assets/victoria-wilson.avif', initials: 'VW' },
];

function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="flex flex-col group">
      {/* Portrait photo */}
      <div
        className="w-full overflow-hidden rounded-xl mb-4 flex items-center justify-center font-bold text-white/40 text-sm select-none"
        style={{ aspectRatio: '3/4', background: '#1B1B20', flexShrink: 0 }}
      >
        <img
          src={tutor.img}
          alt={tutor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) parent.textContent = tutor.initials;
          }}
        />
      </div>

      {/* Info */}
      <div>
        <p className="font-bold text-[#F5F5F7] text-sm mb-0.5">{tutor.name}</p>
        <p className="text-xs text-[#75757D] mb-2.5">{tutor.role}</p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full leading-none"
          style={{
            background: 'rgba(164,28,100,0.12)',
            color: '#C2186A',
            border: '1px solid rgba(194,24,106,0.20)',
          }}
        >
          {tutor.credential}
        </span>
      </div>
    </div>
  );
}

export default function TutorCredibilityStrip() {
  return (
    <section
      style={{
        background: '#0D0D0F',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '96px 0',
      }}
    >
      <div className="es-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="es-label mb-3">Tutor Credibility</p>
            <h2
              className="font-black text-[#F5F5F7] leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.035em',
              }}
            >
              Taught by Coaches
              <br />
              Who Compete
            </h2>
          </div>
          <Link
            to="/about"
            className="text-sm font-semibold whitespace-nowrap transition-colors duration-200 hover:text-[#C2186A]"
            style={{ color: '#75757D' }}
          >
            Meet the Full Team →
          </Link>
        </div>

        {/* Tutor grid — portrait cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {TUTORS.map((tutor) => (
            <TutorCard key={tutor.name} tutor={tutor} />
          ))}
        </div>
      </div>
    </section>
  );
}
