import { useState } from 'react';
import type { FAQ } from '../../data/coursePageData';

interface CourseFAQProps {
  faqs: FAQ[];
}

export default function CourseFAQ({ faqs }: CourseFAQProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>Frequently Asked Questions</h2>
          <div className="space-y-1">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors"
                  style={{ background: open === idx ? '#1B1B20' : '#151519' }}
                >
                  <span className="font-semibold text-white text-sm leading-snug">{faq.question}</span>
                  <svg className={`w-5 h-5 text-es-muted flex-shrink-0 mt-0.5 transition-transform duration-200 ${open === idx ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open === idx && (
                  <div className="px-5 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#1B1B20' }}>
                    <p className="text-sm text-es-muted leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
