interface CourseLearningOutcomesProps {
  heading: string;
  intro: string;
  outcomes: string[];
}

export default function CourseLearningOutcomes({ heading, intro, outcomes }: CourseLearningOutcomesProps) {
  return (
    <section className="es-grit" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(164,28,100,0.16) 0%, transparent 65%), #050506',
      borderBottom: '1px solid rgba(194,24,106,0.08)',
      position: 'relative',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="max-w-3xl">
          <p className="es-label mb-2">Outcomes</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          <p className="text-es-muted mb-8">{intro}</p>
          <ul className="space-y-4">
            {outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ background: '#A41C64' }}>
                  {idx + 1}
                </span>
                <span className="text-es-off-white leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
