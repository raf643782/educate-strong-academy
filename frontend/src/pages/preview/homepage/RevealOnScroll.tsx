/**
 * RevealOnScroll — preview-only motion helper.
 *
 * One calm fade-up-on-enter per section, nothing more. Uses a single
 * IntersectionObserver per instance, no scroll listeners, no layout
 * shift (the element occupies its final position from first paint,
 * only opacity/transform animate). Fully inert under
 * prefers-reduced-motion, per the project's existing convention in
 * index.css (.animate-fade-up already resolves to no-op there).
 *
 * Local to the homepage preview — not imported anywhere in production.
 */
import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
