import type { AudienceCard } from '../../data/coursePageData';

interface CourseAudienceProps {
  cards: AudienceCard[];
  prerequisiteStatement: string;
}

export default function CourseAudience({ cards, prerequisiteStatement }: CourseAudienceProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="es-label mb-3">Who Should Attend</p>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>Who This Is For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {cards.map(card => (
            <div key={card.heading} className="es-card p-5" style={{ borderTop: '2px solid rgba(255,255,255,0.08)' }}>
              <h3 className="font-bold text-white text-sm mb-2 uppercase tracking-wide">{card.heading}</h3>
              <p className="text-es-muted text-sm leading-relaxed">{card.copy}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 es-card p-4">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E19A47' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-es-muted leading-relaxed">
            <strong className="text-white">Entry requirements: </strong>{prerequisiteStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
