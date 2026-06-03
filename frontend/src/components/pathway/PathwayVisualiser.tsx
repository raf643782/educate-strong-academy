import { Link } from 'react-router-dom';
import type { Pathway, PathwayStep } from '../../data/pathwayData';

interface PathwayVisualiserProps {
  pathway: Pathway;
  compact?: boolean; // compact = homepage strip; false = full pathway page
}

function StepStatusBadge({ status }: { status: PathwayStep['status'] }) {
  if (status === 'available') return (
    <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium">
      Available now
    </span>
  );
  if (status === 'coming-soon') return (
    <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded font-medium">
      Coming soon
    </span>
  );
  return (
    <span className="text-xs bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded font-medium">
      Future
    </span>
  );
}

export default function PathwayVisualiser({ pathway, compact = false }: PathwayVisualiserProps) {
  return (
    <div>
      {!compact && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{pathway.name}</h3>
          <p className="text-gray-600 text-sm max-w-2xl">{pathway.description}</p>
        </div>
      )}

      {/* Desktop: horizontal flow. Mobile: vertical */}
      <div className="hidden md:flex items-start">
        {pathway.steps.map((step, idx) => (
          <div key={step.id} className="flex-1 flex items-start">
            <div className="flex-1 pr-4">
              {/* Step circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                step.status === 'available' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <span className="text-sm font-bold">{idx + 1}</span>
              </div>

              <StepStatusBadge status={step.status} />

              <p className="font-bold text-gray-900 text-sm mt-2 mb-0.5">{step.label}</p>
              {step.sublabel && (
                <p className="text-xs text-gray-500 mb-2 leading-snug">{step.sublabel}</p>
              )}
              {!compact && (
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.description}</p>
              )}
              {step.price && (
                <p className="text-xs text-amber-700 font-semibold">{step.price}</p>
              )}
              {step.courseSlug && step.status === 'available' && (
                <Link
                  to={`/courses/${step.courseSlug}`}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block"
                >
                  View course →
                </Link>
              )}
            </div>
            {/* Connector arrow */}
            {idx < pathway.steps.length - 1 && (
              <div className="flex items-center pt-5 flex-shrink-0">
                <div className="w-8 h-px bg-gray-300" />
                <svg className="w-3 h-3 text-gray-300 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden space-y-0">
        {pathway.steps.map((step, idx) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.status === 'available' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <span className="text-sm font-bold">{idx + 1}</span>
              </div>
              {idx < pathway.steps.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 my-2" />
              )}
            </div>
            <div className="pb-6">
              <StepStatusBadge status={step.status} />
              <p className="font-bold text-gray-900 text-sm mt-1.5 mb-0.5">{step.label}</p>
              {step.sublabel && (
                <p className="text-xs text-gray-500 mb-1">{step.sublabel}</p>
              )}
              {step.price && (
                <p className="text-xs text-amber-700 font-semibold">{step.price}</p>
              )}
              {step.courseSlug && step.status === 'available' && (
                <Link
                  to={`/courses/${step.courseSlug}`}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-1 inline-block"
                >
                  View course →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
