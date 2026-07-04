import { Link } from 'react-router-dom';

const COURSE_DETAILS = [
  { label: 'Location', value: 'To be confirmed' },
  { label: 'Format', value: '2-Day In-Person Intensive' },
  { label: 'Capacity', value: 'Max 10 participants' },
  { label: 'Tutors', value: 'Paul Smith & Dr Chris Fitzgerald' },
];

export default function NextCourseSection() {
  return (
    <section
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(164,28,100,0.06) 0%, transparent 70%), #0D0D0D',
        padding: '96px 0',
      }}
    >
      <div className="es-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="es-label mb-4">Next Course Date</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Level 1 Coaching — Next Cohort
            </h2>

            {/* Status badge */}
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(225,154,71,0.15)', color: '#E19A47' }}
            >
              Register Interest
            </span>

            {/* Course details */}
            <ul className="flex flex-col gap-3 mb-6">
              {COURSE_DETAILS.map((d) => (
                <li key={d.label} className="flex items-baseline gap-3 text-sm">
                  <span className="shrink-0 font-semibold" style={{ color: '#555', minWidth: '80px' }}>
                    {d.label}
                  </span>
                  <span style={{ color: '#ccc' }}>{d.value}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed mb-8" style={{ color: '#888' }}>
              New course dates are released throughout the year. Register your interest to be notified when the next location and date is confirmed.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register-interest?type=level-1-coaching"
                className="btn-primary"
              >
                Register Interest
              </Link>
              <Link to="/courses/level-1-coaching-strongman" className="btn-secondary">
                Course Details
              </Link>
            </div>
          </div>

          {/* Right — mini map placeholder */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              height: '280px',
              background: 'linear-gradient(135deg, #111, #0D0D0D)',
            }}
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* UK outline placeholder */}
            <div
              className="absolute"
              aria-hidden="true"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90px',
                height: '130px',
                borderRadius: '38% 62% 55% 45% / 60% 44% 56% 40%',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
            />

            {/* Pulsing marker */}
            <div
              className="absolute"
              style={{
                top: '42%',
                left: '52%',
                transform: 'translate(-50%, -50%)',
              }}
              aria-hidden="true"
            >
              <div
                className="w-4 h-4 rounded-full motion-safe:animate-ping absolute inset-0"
                style={{ background: 'rgba(164,28,100,0.4)' }}
              />
              <div
                className="w-4 h-4 rounded-full relative flex items-center justify-center"
                style={{ background: '#A41C64' }}
              />
            </div>

            {/* Centre label */}
            <div className="absolute top-5 left-0 right-0 flex flex-col items-center">
              <span className="text-2xl" aria-hidden="true">📍</span>
              <span className="text-xs font-semibold mt-1" style={{ color: '#555' }}>Location TBC</span>
            </div>

            {/* Bottom text */}
            <div
              className="absolute bottom-0 inset-x-0 px-4 py-3 text-xs text-center"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#555' }}
            >
              Course location confirmed with each cohort
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
