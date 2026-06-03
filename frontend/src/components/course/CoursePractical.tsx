import type { PracticalFeature } from '../../data/coursePageData';

interface CoursePracticalProps {
  heading: string;
  copy: string;
  features: PracticalFeature[];
  mediaPlaceholderLabel?: string;
}

export default function CoursePractical({
  heading,
  copy,
  features,
  mediaPlaceholderLabel = 'Practical coaching photography — Educate.Strong to provide',
}: CoursePracticalProps) {
  return (
    <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{heading}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{copy}</p>

            {/* Feature list */}
            <div className="space-y-5">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-start gap-4">
                  <div className="w-1 self-stretch bg-amber-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">{feature.label}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — media placeholder */}
          <div className="bg-gray-200 rounded-xl aspect-[4/3] flex items-center justify-center">
            <div className="text-center px-8">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 leading-snug">{mediaPlaceholderLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
