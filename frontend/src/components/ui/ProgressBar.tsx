interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({ value, label, showPercent = true, size = 'md', className = '' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-gray-900">{clampedValue}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className="bg-amber-500 rounded-full h-full transition-all duration-500"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
