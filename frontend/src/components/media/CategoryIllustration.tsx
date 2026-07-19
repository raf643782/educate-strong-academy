/**
 * CategoryIllustration — abstract, geometric fallback art shown on
 * Event library cards when no real photo (`imageUrl`) exists yet.
 * Deliberately iconographic, not a literal depiction of any real
 * athlete, equipment, or event — nothing here claims to be a photo, so
 * there is no risk of it reading as invented documentary content.
 *
 * Matches the branded visual language already established by
 * ExerciseLibrary.tsx's local ExercisePlaceholder/CategoryIcon (same
 * pink radial-gradient card, same brand-pink line colour), so both
 * libraries look like one system. Normalises the Event category set
 * (Press Events, Deadlift Events, Carry Events, Loading Events, Pull
 * Events, Static Events) onto the same shared icon families used
 * there, rather than introducing a second icon style.
 *
 * Purely decorative: the card it sits in already shows the category
 * as visible text and the entry name as a heading, so this is
 * aria-hidden rather than announced a second time via role="img".
 */
const BRAND = 'rgba(164,28,100,0.7)';

function normaliseFamily(category: string): string {
  return category.replace(/ Events$/, '').trim();
}

function CategoryIcon({ category, size = 32 }: { category: string; size?: number }) {
  const family = normaliseFamily(category);

  if (family === 'Press') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="5" y="13" width="22" height="4" rx="2" fill={BRAND} />
        <rect x="1" y="10" width="5" height="10" rx="2" fill={BRAND} />
        <rect x="26" y="10" width="5" height="10" rx="2" fill={BRAND} />
        <circle cx="16" cy="7" r="3" fill={BRAND} />
        <rect x="14.5" y="9" width="3" height="5" rx="1" fill={BRAND} />
      </svg>
    );
  }
  if (family === 'Deadlift') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="14" width="28" height="4" rx="2" fill={BRAND} />
        <rect x="2" y="10" width="6" height="12" rx="2" fill={BRAND} />
        <rect x="24" y="10" width="6" height="12" rx="2" fill={BRAND} />
        <rect x="14" y="4" width="4" height="11" rx="1.5" fill={BRAND} />
      </svg>
    );
  }
  if (family === 'Carry') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="7" r="4" fill={BRAND} />
        <path d="M9 14 C9 14 7 16 7 20 L11 28 L14 27 L12 21 L16 23 L20 21 L18 27 L21 28 L25 20 C25 16 23 14 23 14 Z" fill={BRAND} />
        <rect x="2" y="15" width="3" height="8" rx="1.5" fill={BRAND} />
        <rect x="27" y="15" width="3" height="8" rx="1.5" fill={BRAND} />
      </svg>
    );
  }
  if (family === 'Loading') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="20" r="9" fill={BRAND} />
        <rect x="13" y="6" width="6" height="8" rx="1.5" fill={BRAND} opacity="0.6" />
        <rect x="11" y="12" width="10" height="3" rx="1" fill={BRAND} opacity="0.5" />
      </svg>
    );
  }
  if (family === 'Pull') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="7" r="3.5" fill={BRAND} />
        <path d="M10 26 L16 11 L22 26" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="4" y="24" width="24" height="4" rx="2" fill={BRAND} opacity="0.55" />
      </svg>
    );
  }
  if (family === 'Static') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="5" y="4" width="4" height="24" rx="1.5" fill={BRAND} />
        <rect x="23" y="4" width="4" height="24" rx="1.5" fill={BRAND} />
        <rect x="5" y="10" width="22" height="3" rx="1" fill={BRAND} opacity="0.55" />
        <rect x="5" y="19" width="22" height="3" rx="1" fill={BRAND} opacity="0.55" />
      </svg>
    );
  }
  // Default — matches ExercisePlaceholder's own fallback (Accessories).
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="14" width="22" height="4" rx="2" fill={BRAND} />
      <rect x="2" y="11" width="4" height="10" rx="2" fill={BRAND} />
      <rect x="26" y="11" width="4" height="10" rx="2" fill={BRAND} />
    </svg>
  );
}

export default function CategoryIllustration({
  category,
  compact = false,
  className = '',
}: {
  category: string;
  compact?: boolean;
  className?: string;
}) {
  const height = compact ? '64px' : '96px';
  const iconSize = compact ? 22 : 32;

  return (
    <div
      className={className}
      style={{
        height,
        background: 'linear-gradient(135deg, #1A0D13 0%, #12101A 100%)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(164,28,100,0.14)',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(164,28,100,0.14), transparent)',
        }}
        aria-hidden="true"
      />
      <CategoryIcon category={category} size={iconSize} />
      <span
        style={{
          position: 'absolute',
          bottom: compact ? '5px' : '7px',
          right: '9px',
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: 'rgba(164,28,100,0.5)',
        }}
        aria-hidden="true"
      >
        {category}
      </span>
    </div>
  );
}
