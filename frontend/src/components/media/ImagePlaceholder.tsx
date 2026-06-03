/**
 * ImagePlaceholder — styled placeholder for image slots.
 *
 * Use this everywhere an image is planned but not yet available.
 * The placeholder maintains the correct aspect ratio and displays
 * a clear label so Educate.Strong knows exactly what to provide.
 *
 * When real images are supplied, replace this component with a
 * standard <img> tag — the outer container maintains the same
 * dimensions so no layout changes are needed.
 */

interface ImagePlaceholderProps {
  label: string;
  aspectRatio?: '16/9' | '4/3' | '3/2' | '1/1' | '3/4';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const ASPECT_CLASSES: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '3/2':  'aspect-[3/2]',
  '1/1':  'aspect-square',
  '3/4':  'aspect-[3/4]',
};

export default function ImagePlaceholder({
  label,
  aspectRatio = '4/3',
  className = '',
  size,
}: ImagePlaceholderProps) {
  const sizeClass = size === 'full' ? 'w-full' : size === 'lg' ? 'w-full max-w-lg' : size === 'sm' ? 'w-32' : '';
  return (
    <div
      className={`${ASPECT_CLASSES[aspectRatio]} ${sizeClass} bg-gray-100 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center ${className}`}
      role="img"
      aria-label={label}
    >
      <svg
        className="w-8 h-8 text-gray-300 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      <p className="text-xs text-gray-400 text-center px-4 leading-snug">{label}</p>
    </div>
  );
}
