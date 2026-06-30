import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

const labelCls =
  'block text-[11px] font-bold uppercase tracking-[0.08em] text-[#75757D] mb-1.5';

const fieldBase =
  'w-full px-3 py-2.5 rounded-lg text-sm text-[#F5F5F7] placeholder-[#5A5A62] ' +
  'bg-[#08080A] border border-[rgba(255,255,255,0.12)] ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus:border-[#C2186A] focus:ring-1 focus:ring-[#C2186A] ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const fieldError =
  'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]';

/* ── Input ────────────────────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  helper?: string;
}

export function Input({ label, id, error, helper, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={labelCls}>{label}</label>}
      <input
        id={id}
        className={`${fieldBase} ${error ? fieldError : ''} ${className}`}
        {...props}
      />
      {error  && <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[#5A5A62]">{helper}</p>}
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  error?: string;
  helper?: string;
}

export function Textarea({ label, id, error, helper, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={labelCls}>{label}</label>}
      <textarea
        id={id}
        className={`${fieldBase} resize-y min-h-[80px] ${error ? fieldError : ''} ${className}`}
        {...props}
      />
      {error  && <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[#5A5A62]">{helper}</p>}
    </div>
  );
}

/* ── Select ───────────────────────────────────────────────────────── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}

export function Select({ label, id, error, helper, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={labelCls}>{label}</label>}
      <select
        id={id}
        className={`${fieldBase} ${error ? fieldError : ''} ${className}`}
        style={{ colorScheme: 'dark' }}
        {...props}
      >
        {children}
      </select>
      {error  && <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[#5A5A62]">{helper}</p>}
    </div>
  );
}

export default Input;
