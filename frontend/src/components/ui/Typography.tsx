import { HTMLAttributes, ReactNode } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode };
type ParaProps   = HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode };
type SpanProps   = HTMLAttributes<HTMLSpanElement> & { children?: ReactNode };

/** Small uppercase magenta label above a title. */
export function Kicker({ children, className = '', ...props }: ParaProps) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.12em] text-[#C2186A] ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

/** Hero / page-level h1. */
export function PageTitle({ children, className = '', ...props }: HeadingProps) {
  return (
    <h1
      className={`text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F7] leading-[1.05] tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

/** Section h2. */
export function SectionTitle({ children, className = '', ...props }: HeadingProps) {
  return (
    <h2
      className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5F7] leading-tight tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

/** Card / group h3. */
export function CardTitle({ children, className = '', ...props }: HeadingProps) {
  return (
    <h3
      className={`text-lg sm:text-xl font-bold text-[#F5F5F7] leading-snug tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

/** Body copy — primary. */
export function Body({ children, className = '', ...props }: ParaProps) {
  return (
    <p className={`text-sm text-[#B8B8BE] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

/** Caption / supporting text. */
export function Caption({ children, className = '', ...props }: SpanProps) {
  return (
    <span className={`text-xs text-[#75757D] ${className}`} {...props}>
      {children}
    </span>
  );
}
