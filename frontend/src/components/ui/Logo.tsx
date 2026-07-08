interface LogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const owlHeight: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

const wordmarkSize: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const academySize: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-[7px]',
  md: 'text-[8px]',
  lg: 'text-[9px]',
};

export default function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/logo_owl.svg"
        alt=""
        aria-hidden="true"
        className={`flex-shrink-0 w-auto ${owlHeight[size]}`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      {variant === 'full' && (
        <div className="flex flex-col leading-none select-none">
          <span className={`font-black tracking-[-0.03em] ${wordmarkSize[size]}`}>
            <span style={{ color: '#F5F5F7' }}>EDUCATE.</span>
            <span style={{ color: '#C2186A' }}>STRONG</span>
          </span>
          <span
            className={`font-bold tracking-[0.2em] ${academySize[size]}`}
            style={{ color: '#75757D', marginTop: '2px' }}
          >
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
}
