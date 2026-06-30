interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[#75757D]">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-[#B8B8BE]">{clamped}%</span>}
        </div>
      )}
      <div
        className={`w-full rounded-full ${height} overflow-hidden`}
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="rounded-full h-full transition-all duration-500 progress-fill"
          style={{ width: `${clamped}%`, background: 'linear-gradient(to right, #A41C64, #C2186A)' }}
        />
      </div>
    </div>
  );
}
