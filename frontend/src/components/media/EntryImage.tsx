/**
 * EntryImage — fixed-size thumbnail for Event library cards. Renders
 * the real `imageUrl` when one exists; otherwise falls back to the
 * branded CategoryIllustration — never a fake photo or invented
 * placeholder claiming to depict real content.
 *
 * Uses the same fixed-height convention already established by
 * ExerciseLibrary.tsx's ExercisePlaceholder (64px compact / 96px full)
 * rather than a competing aspect-ratio system, so real photos and
 * icon fallbacks size identically within the same grid and neither
 * causes layout shift once it loads.
 */
import CategoryIllustration from './CategoryIllustration';

export default function EntryImage({
  imageUrl,
  imageAlt,
  category,
  entryName,
  compact = false,
  className = '',
}: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  category: string;
  entryName: string;
  compact?: boolean;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div
        className={`overflow-hidden rounded-md ${className}`}
        style={{ height: compact ? '64px' : '96px' }}
      >
        <img
          src={imageUrl}
          alt={imageAlt || entryName}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return <CategoryIllustration category={category} compact={compact} className={className} />;
}
