/**
 * TestimonialsSection — grid of coach/referee testimonials.
 * Hover reveals name, role, and quote overlay.
 * Uses real assets where available; branded placeholders elsewhere.
 */
interface Testimonial {
  id: string;
  name: string;
  role: string;
  course: string;
  quote: string;
  photo?: string;
  initials: string;
  accentColour: string;
  consentConfirmed?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Stephanie Mackey',
    role: 'Level 1 Certified Referee',
    course: 'Level 1 Strongman Refereeing',
    quote: 'Not taking any prisoners with her down calls. Stephanie judges with exactly the composure and consistency the sport needs.',
    photo: undefined, // Provide /assets/testimonials/stephanie.jpg when available
    initials: 'SM',
    accentColour: '#A41C64',
  },
  {
    id: 't2',
    name: 'James Hargreaves',
    role: 'Personal Trainer → Strongman Coach',
    course: 'Level 1 Fundamentals of Coaching',
    quote: 'After completing Level 1, I now run Strongman sessions as part of my PT offering. Two of the best professional development days I\'ve had.',
    photo: undefined,
    initials: 'JH',
    accentColour: '#C0246E',
  },
  {
    id: 't3',
    name: 'Sarah Mitchell',
    role: 'Gym Owner',
    course: 'Level 1 Fundamentals of Coaching',
    quote: 'The course gave our gym the credibility and structure to offer real Strongman coaching. Paul and Chris deliver something genuinely special.',
    photo: undefined,
    initials: 'SM',
    accentColour: '#A41C64',
  },
  {
    id: 't4',
    name: 'Ryan Thompson',
    role: 'Strength Coach, Armed Forces',
    course: 'Level 1 Fundamentals of Coaching',
    quote: 'Outstanding course for anyone serious about Strongman coaching. The practical focus and quality of delivery set it apart from anything else available.',
    photo: undefined,
    initials: 'RT',
    accentColour: '#E19A47',
  },
  {
    id: 't5',
    name: 'Marcus Webb',
    role: 'Level 1 Certified Referee',
    course: 'Level 1 Strongman Refereeing',
    quote: 'I came in with competition experience but left with a completely different understanding of what consistent officiating looks like at every level.',
    photo: undefined,
    initials: 'MW',
    accentColour: '#C0246E',
  },
  {
    id: 't6',
    name: 'Lauren Briggs',
    role: 'Youth Strength Coach',
    course: 'StrongKidz Coach Education',
    quote: 'The safeguarding-first approach and age-appropriate programming gave me total confidence to run youth sessions. Parents trust it. Kids love it.',
    photo: undefined,
    initials: 'LB',
    accentColour: '#E19A47',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="group relative rounded-2xl overflow-hidden cursor-default"
      style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.07)', aspectRatio: '1/1' }}
      aria-labelledby={`testimonial-name-${testimonial.id}`}
    >
      {/* Photo / initials background */}
      <div className="absolute inset-0">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          /* Branded placeholder */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${testimonial.accentColour}30 0%, #0D0D0D 70%)`,
            }}
          >
            <span
              className="text-5xl font-black select-none"
              style={{ color: testimonial.accentColour + '30' }}
            >
              {testimonial.initials}
            </span>
          </div>
        )}
      </div>

      {/* Default state — name visible at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 group-hover:opacity-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
      >
        <h3
          id={`testimonial-name-${testimonial.id}`}
          className="font-bold text-white text-sm leading-tight"
        >
          {testimonial.name}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: testimonial.accentColour }}>
          {testimonial.role}
        </p>
      </div>

      {/* Hover overlay — full quote */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ background: `linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 50%, transparent 100%)` }}
      >
        {/* Quote mark */}
        <div
          className="text-4xl font-serif leading-none mb-3 select-none"
          style={{ color: testimonial.accentColour, opacity: 0.7 }}
          aria-hidden="true"
        >
          "
        </div>
        <blockquote className="text-white/85 text-sm leading-relaxed mb-4 italic">
          {testimonial.quote}
        </blockquote>
        <div>
          <p className="font-bold text-white text-sm">{testimonial.name}</p>
          <p className="text-xs mt-0.5" style={{ color: testimonial.accentColour }}>
            {testimonial.role}
          </p>
          <p className="text-xs text-white/35 mt-0.5">{testimonial.course}</p>
        </div>
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${testimonial.accentColour}, transparent)` }}
        aria-hidden="true"
      />
    </article>
  );
}

export default function TestimonialsSection() {
  const confirmed = TESTIMONIALS.filter(t => t.consentConfirmed === true);

  return (
    <section
      style={{ background: '#0A0A0A', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      aria-labelledby="testimonials-heading"
    >
      <div className="es-container-wide">
        {/* Heading */}
        <div className="mb-12" style={{ maxWidth: '640px' }}>
          <p className="es-label mb-3">What Coaches and Referees Say</p>
          <h2
            id="testimonials-heading"
            className="font-black text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.035em' }}
          >
            Hear From Our Graduates
          </h2>
          <p className="text-white/45 max-w-lg text-base">
            Testimonials from certified coaches and referees will appear here as the community grows.
          </p>
        </div>

        {confirmed.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {confirmed.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '72px 32px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px' }}>
              No testimonials have been published yet.
              <br />
              Verified coach and referee feedback will appear here once consent is confirmed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
