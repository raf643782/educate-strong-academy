import type { JourneyStep } from '../../data/coursePageData';

interface CourseLearningJourneyProps {
  steps: JourneyStep[];
}

export default function CourseLearningJourney({ steps }: CourseLearningJourneyProps) {
  return (
    <section className="es-grit" style={{ background: '#0D0D0D', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="es-label mb-3">The Process</p>
        <h2 className="text-2xl font-black text-white mb-10" style={{ letterSpacing: '-0.03em' }}>Your Learning Journey</h2>

        {/* Desktop */}
        <div className="hidden md:flex items-start">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex-1 flex items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
                    style={{ background: idx === 0 ? '#A41C64' : '#2A2A2A' }}>
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #A41C64, #3C3C3C)' }} />}
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
                  style={{ background: idx === 0 ? '#A41C64' : '#2A2A2A' }}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: '#3C3C3C' }} />}
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
