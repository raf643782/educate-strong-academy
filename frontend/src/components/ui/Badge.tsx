export type BadgeVariant = 'magenta' | 'amber' | 'grey' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  magenta: 'text-[#C0246E] bg-[rgba(194,24,106,0.10)] border border-[rgba(194,24,106,0.25)]',
  amber:   'text-[#E19A47] bg-[rgba(225,154,71,0.08)] border border-[rgba(225,154,71,0.2)]',
  grey:    'text-[#888899] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)]',
  success: 'text-[#22C55E] bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.25)]',
  warning: 'text-[#F59E0B] bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.25)]',
  danger:  'text-[#EF4444] bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.25)]',
};

export function pathwayVariant(pathway: string): BadgeVariant {
  if (pathway === 'COACHING')   return 'magenta';
  if (pathway === 'REFEREEING') return 'grey';
  if (pathway === 'STRONGKIDZ') return 'amber';
  return 'grey';
}

export function levelVariant(level: number): BadgeVariant {
  if (level >= 2) return 'magenta';
  return 'grey';
}

export default function Badge({ variant = 'grey', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
