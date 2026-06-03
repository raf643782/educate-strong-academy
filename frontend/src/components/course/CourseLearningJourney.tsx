import type { JourneyStep } from '../../data/coursePageData';

interface CourseLearningJourneyProps {
  steps: JourneyStep[];
}

export default function CourseLearningJourney({ steps }: CourseLearningJourneyProps) {
  return (
    <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Your Learning Journey</h2>
          <p className="text-gray-600 max-w-xl">
            From first contact to qualified — here is what to expect at each stage.
          </p>
        </div>

        {/* Desktop: horizontal flow. Mobile: vertical list */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex-1 flex items-start">
              {/* Step */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300" />
                  )}
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1 pr-4">{step.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed pr-4">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile vertical layout */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gray-300 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="font-semibold text-gray-900 text-sm mb-1">{step.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
