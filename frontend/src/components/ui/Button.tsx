import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ' +
  'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506] whitespace-nowrap';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-[#A41C64] border border-[rgba(194,24,106,0.5)] ' +
    'hover:bg-[#C2186A] hover:shadow-[0_0_28px_rgba(194,24,106,0.4)] hover:-translate-y-px active:translate-y-0 ' +
    'focus-visible:ring-[#C2186A]',
  secondary:
    'text-[#F5F5F7] bg-transparent border border-[rgba(255,255,255,0.12)] ' +
    'hover:border-[#A41C64] hover:text-white hover:bg-[rgba(164,28,100,0.07)] ' +
    'focus-visible:ring-[#C2186A]',
  ghost:
    'text-[#75757D] bg-transparent border border-transparent ' +
    'hover:text-white hover:bg-[rgba(255,255,255,0.06)] ' +
    'focus-visible:ring-[#C2186A]',
  danger:
    'text-white bg-[#EF4444] border border-[rgba(239,68,68,0.5)] ' +
    'hover:bg-[#DC2626] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] ' +
    'focus-visible:ring-[#EF4444]',
  amber:
    'text-[#08080A] bg-[#E19A47] border-none ' +
    'hover:bg-[#EFB060] hover:shadow-[0_0_20px_rgba(225,154,71,0.35)] hover:-translate-y-px active:translate-y-0 ' +
    'focus-visible:ring-[#E19A47]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
