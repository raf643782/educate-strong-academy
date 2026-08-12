import type { PracticalFeature } from '../../data/coursePageData';

interface CoursePracticalProps {
  heading: string;
  copy: string;
  features: PracticalFeature[];
  mediaUrl?: string;
  mediaAlt?: string;
  mediaPlaceholderLabel?: string;
}

export default function CoursePractical({
  heading, copy, features, mediaUrl, mediaAlt,
  mediaPlaceholderLabel = 'Practical coaching photography — Educate.Strong to provide',
}: CoursePracticalProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
      <div className="es-container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="es-label mb-2">Practical Delivery</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
            <p className="text-es-muted leading-relaxed mb-8">{copy}</p>
            <div className="space-y-5">
              {features.map(f => (
                <div key={f.label} className="flex items-start gap-4">
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: '#A41C64' }} />
                  <div>
                    <p className="font-bold text-white mb-0.5">{f.label}</p>
                    <p className="text-sm text-es-muted leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Media */}
          {mediaUrl ? (
            <div className="rounded-xl aspect-[4/3] overflow-hidden" style={{ background: '#151519' }}>
              <img src={mediaUrl} alt={mediaAlt || ''} aria-hidden={!mediaAlt || undefined} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div className="rounded-xl aspect-[4/3] flex flex-col items-center justify-center"
              style={{ background: '#151519', border: '1px dashed rgba(255,255,255,0.12)' }}>
              <svg className="w-10 h-10 text-es-subtle mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-es-subtle text-center px-6 leading-snug">{mediaPlaceholderLabel}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
