import { useState } from 'react';
import type { SanityFaqItem } from '../../lib/sanity';

export default function FaqAccordion({ items }: { items?: SanityFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="es-card overflow-hidden" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
            >
              <span className="font-semibold text-white text-sm sm:text-base">{item.question}</span>
              <span className="text-es-subtle flex-shrink-0 text-lg leading-none">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-es-muted text-sm leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
