/**
 * EntryImage — fixed-size thumbnail for Event library cards. Renders
 * the real `imageUrl` when one exists; otherwise falls back to the
 * branded CategoryIllustration — never a fake photo or invented
 * placeholder claiming to depict real content.
 *
 * Treated as purely decorative here: the card it sits inside already
 * carries the entry's name as real link/heading text, so the image
 * uses an empty alt and is hidden from assistive technology rather
 * than repeating that name as alternative text a second time.
 * `imageAlt` is intentionally not read by this component — it stays
 * in the data model for a future meaningful use on dedicated pages
 * (e.g. a standalone hero image), where the same photo would not be
 * decorative.
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
  category,
  compact = false,
  className = '',
}: {
  imageUrl?: string | null;
  category: string;
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
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return <CategoryIllustration category={category} compact={compact} className={className} />;
}
