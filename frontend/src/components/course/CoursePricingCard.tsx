import type { PricingData } from '../../data/coursePageData';

interface CoursePricingCardProps {
  pricing: PricingData;
  contactEmail: string;
}

export default function CoursePricingCard({ pricing, contactEmail }: CoursePricingCardProps) {
  const securePlaceHref = `mailto:${contactEmail}?subject=Secure%20My%20Place%20—%20${encodeURIComponent(pricing.title)}`;
  const armedForcesHref = `mailto:${contactEmail}?subject=Armed%20Forces%20Discount%20Enquiry`;

  return (
    <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Course Fee</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-5">
              <p className="text-sm text-gray-400 mb-1">{pricing.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">£{pricing.totalFee}</span>
                <span className="text-gray-400 text-sm">total course fee</span>
              </div>
            </div>

            {/* Deposit structure */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Deposit to secure your place</span>
                <span className="text-sm font-semibold text-gray-900">£{pricing.deposit}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Remaining balance</span>
                <span className="text-sm font-semibold text-gray-900">
                  £{pricing.totalFee - pricing.deposit}
                </span>
              </div>
              <div className="flex items-start justify-between py-2">
                <span className="text-sm text-gray-500">{pricing.balanceTiming}</span>
              </div>
            </div>

            {/* What is included */}
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                What is included
              </p>
              <ul className="space-y-2">
                {pricing.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Group size note */}
            {pricing.groupSizeNote && (
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                <p className="text-sm text-amber-800 font-medium">{pricing.groupSizeNote}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="px-6 py-5">
              <a
                href={securePlaceHref}
                className="block w-full text-center bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm mb-3"
              >
                Secure Your Place
              </a>
              <p className="text-xs text-gray-500 text-center mb-4">
                Secure your place by contacting Educate.Strong. Payment and booking details will be confirmed directly.
              </p>

              {pricing.armedForcesNote && (
                <a
                  href={armedForcesHref}
                  className="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  Ask About Armed Forces Discount
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
