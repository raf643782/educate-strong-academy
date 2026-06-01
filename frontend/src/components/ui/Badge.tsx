type Variant = 'coaching' | 'refereeing' | 'strongkidz' | 'level1' | 'level2' | 'level3' | 'gray' | 'amber' | 'green' | 'blue' | 'red';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  coaching: 'bg-amber-100 text-amber-800 border border-amber-200',
  refereeing: 'bg-blue-100 text-blue-800 border border-blue-200',
  strongkidz: 'bg-green-100 text-green-800 border border-green-200',
  level1: 'bg-gray-100 text-gray-700 border border-gray-200',
  level2: 'bg-amber-100 text-amber-700 border border-amber-200',
  level3: 'bg-gray-900 text-white border border-gray-700',
  gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  amber: 'bg-amber-100 text-amber-800 border border-amber-200',
  green: 'bg-green-100 text-green-800 border border-green-200',
  blue: 'bg-blue-100 text-blue-800 border border-blue-200',
  red: 'bg-red-100 text-red-800 border border-red-200',
};

export function pathwayVariant(pathway: string): Variant {
  if (pathway === 'COACHING') return 'coaching';
  if (pathway === 'REFEREEING') return 'refereeing';
  if (pathway === 'STRONGKIDZ') return 'strongkidz';
  return 'gray';
}

export function levelVariant(level: number): Variant {
  if (level === 1) return 'level1';
  if (level === 2) return 'level2';
  if (level >= 3) return 'level3';
  return 'gray';
}

export default function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
