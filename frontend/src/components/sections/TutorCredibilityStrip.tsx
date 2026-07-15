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
  { name: 'Dr Chris Fitzgerald', role: 'Tutor and Programme Lead', credential: 'PhD in Health, Natural WSM Athlete', img: '/assets/chris-fitzgerald.avif', initials: 'CF' },
  { name: 'Laura Hollywood', role: 'StrongKidz Coach', credential: "Britain's Strongest Woman u73", img: '/assets/laura-hollywood.avif', initials: 'LH' },
  { name: 'Victoria Wilson', role: 'StrongKidz Coach', credential: 'Strength and Conditioning Coach', img: '/assets/victoria-wilson.avif', initials: 'VW' },
  { name: 'Kris Herbert', role: 'Digital and Media', credential: 'Natural WSM 2024 Bronze', img: '/assets/krish-herbert.jpg', initials: 'KH' },
];

function TutorCard({ tutor, featured = false }: { tutor: Tutor; featured?: boolean }) {
  return (
    <div className="flex flex-col group">
      {/* Portrait photo */}
      <div
        className="w-full overflow-hidden rounded-xl mb-4 flex items-center justify-center font-bold text-white/40 text-sm select-none"
        style={{ aspectRatio: '3/4', background: '#1B1B20', flexShrink: 0, border: featured ? '1px solid rgba(194,24,106,0.35)' : '1px solid transparent' }}
      >
        <img
          src={tutor.img}
          alt={`${tutor.name}, ${tutor.role}`}
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
      aria-labelledby="tutors-heading"
      style={{
        background: [
          'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(164,28,100,0.16) 0%, transparent 52%)',
          'radial-gradient(ellipse 55% 65% at 4% 80%, rgba(194,24,106,0.09) 0%, transparent 52%)',
          'radial-gradient(ellipse 45% 55% at 96% 55%, rgba(164,28,100,0.08) 0%, transparent 50%)',
          '#050506',
        ].join(', '),
        borderTop: '1px solid rgba(194,24,106,0.08)',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        padding: '96px 0',
      }}
    >
      <div className="es-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div style={{ maxWidth: '640px' }}>
            <p className="es-label mb-3">Taught by People Who Compete</p>
            <h2
              id="tutors-heading"
              className="font-black text-[#F5F5F7] leading-tight mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.035em',
              }}
            >
              Taught by People Who Have Done It
            </h2>
            <p className="text-[#B8B8BE] leading-relaxed" style={{ maxWidth: '580px' }}>
              Every course at Educate Strong is delivered by people who have competed, coached and
              officiated at a serious level, not simply studied it. Lead tutor Paul Smith has won
              UK's Strongest Man three times and has spent years coaching other coaches through the
              armed forces and charity sector. Dr Chris Fitzgerald pairs a PhD in Health with his own
              competition record as a natural World's Strongest Man athlete. Laura Hollywood, Victoria
              Wilson and Kris Herbert lead StrongKidz coaching and the Academy's digital delivery,
              each with their own competition background.
            </p>
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
          {TUTORS.map((tutor, i) => (
            <TutorCard key={tutor.name} tutor={tutor} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
