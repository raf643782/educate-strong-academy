import type { PricingData } from '../../data/coursePageData';

interface CoursePricingCardProps {
  pricing: PricingData;
  contactEmail: string;
}

export default function CoursePricingCard({ pricing, contactEmail }: CoursePricingCardProps) {
  const securePlaceHref = `mailto:${contactEmail}?subject=Secure%20My%20Place%20—%20${encodeURIComponent(pricing.title)}`;
  const armedForcesHref = `mailto:${contactEmail}?subject=Armed%20Forces%20Discount%20Enquiry`;

  return (
    <section className="es-grit" style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="max-w-2xl">
          <p className="es-label mb-3">Investment</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>Course Fee</h2>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
            {/* Header */}
            <div className="px-6 py-5" style={{
              background: 'linear-gradient(135deg, #1B1B20, #151519)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <p className="text-xs text-es-muted mb-1">{pricing.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">£{pricing.totalFee}</span>
                <span className="text-es-muted text-sm">total course fee</span>
              </div>
            </div>

            {/* Deposit */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#1B1B20' }}>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-es-muted">Deposit to secure your place</span>
                <span className="text-sm font-bold text-white">£{pricing.deposit}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-es-muted">Remaining balance</span>
                <span className="text-sm font-bold text-white">£{pricing.totalFee - pricing.deposit}</span>
              </div>
              <p className="text-xs text-es-subtle mt-1">{pricing.balanceTiming}</p>
            </div>

            {/* Included */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#151519' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-es-muted mb-3">What is included</p>
              <ul className="space-y-2">
                {pricing.included.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-es-muted">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Group size */}
            {pricing.groupSizeNote && (
              <div className="px-6 py-3" style={{ background: 'rgba(164,28,100,0.06)', borderBottom: '1px solid rgba(164,28,100,0.15)' }}>
                <p className="text-sm font-semibold" style={{ color: '#A41C64' }}>{pricing.groupSizeNote}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="px-6 py-5" style={{ background: '#1B1B20' }}>
              <a href={securePlaceHref} className="btn-primary w-full text-center block text-sm mb-3">
                Secure Your Place
              </a>
              <p className="text-xs text-es-subtle text-center mb-4">
                Secure your place by contacting Educate.Strong directly. Booking details confirmed on reply.
              </p>
              {pricing.armedForcesNote && (
                <a href={armedForcesHref} className="btn-secondary w-full text-center block text-sm">
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
