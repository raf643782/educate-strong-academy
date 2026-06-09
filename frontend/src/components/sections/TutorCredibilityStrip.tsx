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
  { name: 'Laura Hollywood', role: 'StrongKidz Coach', credential: "Britain's Strongest Woman u73", img: '/assets/laura-hollywood.avif', initials: 'LH' },
  { name: 'Victoria Wilson', role: 'StrongKidz Coach', credential: 'S&C Coach · Youth Specialist', img: '/assets/victoria-wilson.avif', initials: 'VW' },
  { name: 'Kris Herbert', role: 'Digital & Media', credential: 'Natural WSM 2024 Bronze', img: '/assets/krish-herbert.jpg', initials: 'KH' },
];

function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 group">
      {/* Photo */}
      <div
        className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-white text-sm"
        style={{ background: '#2C2C2C', border: '2px solid #3C3C3C' }}
      >
        <img
          src={tutor.img}
          alt={tutor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) {
              parent.textContent = tutor.initials;
            }
          }}
        />
      </div>

      {/* Info */}
      <div>
        <p className="font-bold text-white text-sm group-hover:underline decoration-[#A41C64] underline-offset-2 transition-all">
          {tutor.name}
        </p>
        <p className="text-xs mb-2" style={{ color: '#888' }}>{tutor.role}</p>
        <span
          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(164,28,100,0.1)', color: '#A41C64' }}
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
        background: '#111111',
        borderTop: '1px solid #2C2C2C',
        borderBottom: '1px solid #2C2C2C',
      }}
      className="py-12"
    >
      <div className="es-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="es-label mb-2">Delivered By</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
              Taught by Athletes Who Have Done It
            </h2>
          </div>
          <Link
            to="/about"
            className="text-sm font-semibold whitespace-nowrap"
            style={{ color: '#888' }}
          >
            Meet the Full Team →
          </Link>
        </div>

        {/* Tutor grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {TUTORS.map((tutor) => (
            <TutorCard key={tutor.name} tutor={tutor} />
          ))}
        </div>
      </div>
    </section>
  );
}
