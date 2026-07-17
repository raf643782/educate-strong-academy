import type { JourneyStep } from '../../data/coursePageData';

interface CourseLearningJourneyProps {
  steps: JourneyStep[];
  /**
   * Real enrolment status (see CourseDetail's `/courses/:slug/enrolled`
   * check) — not fabricated progress. An enrolled learner has, by
   * definition, already registered interest and received course
   * information, so those first two steps can honestly show as reached.
   * Later steps (attendance, assessment, qualification) have no reliable
   * signal available, so they stay neutral rather than guessed at.
   */
  isEnrolled?: boolean;
}

export default function CourseLearningJourney({ steps, isEnrolled }: CourseLearningJourneyProps) {
  const reachedCount = isEnrolled ? Math.min(2, steps.length) : 1;
  const stepState = (idx: number) => (idx < reachedCount ? 'reached' : 'pending');

  return (
    <section className="es-grit" style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)', position: 'relative' }}>
      <div className="es-container-wide py-14">
        <p className="es-label mb-3">The Process</p>
        <h2 className="text-2xl font-black text-white mb-10" style={{ letterSpacing: '-0.03em' }}>Your Learning Journey</h2>

        {/* Desktop */}
        <div className="hidden md:flex items-start">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex-1 flex items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
                    style={{ background: stepState(idx) === 'reached' ? '#A41C64' : '#1B1B20' }}>
                    {stepState(idx) === 'reached' && idx < reachedCount - 1 ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < steps.length - 1 && <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #A41C64, rgba(255,255,255,0.06))' }} />}
                </div>
                <p className="font-bold text-white text-sm mb-1 pr-4">{step.label}</p>
                <p className="text-xs text-es-subtle leading-relaxed pr-4">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: stepState(idx) === 'reached' ? '#A41C64' : '#1B1B20' }}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: '#1B1B20' }} />}
              </div>
              <div className="pb-5">
                <p className="font-bold text-white text-sm mb-0.5">{step.label}</p>
                <p className="text-xs text-es-subtle leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
