import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export default function Card({ children, className = '', padding = 'md', hoverable = false }: CardProps) {
  return (
    <div
      className={[
        'bg-[#1B1B20] border border-[rgba(255,255,255,0.10)] rounded-xl',
        'shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]',
        hoverable
          ? 'transition-all duration-200 cursor-pointer hover:border-[#C2186A] hover:shadow-[0_0_28px_rgba(194,24,106,0.2),0_8px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5'
          : '',
        paddings[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
