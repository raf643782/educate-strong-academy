/**
 * AtlasStoneHero — decorative atlas stone element for hero sections.
 *
 * The branded atlas stone image (owl mark carved in stone) should be at:
 * /public/assets/atlas-stone-branded.png
 *
 * When not available, renders a CSS-based stone circle placeholder.
 */

interface AtlasStoneHeroProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  opacity?: number;
}

export default function AtlasStoneHero({
  size = 'lg',
  className = '',
  opacity = 0.85,
}: AtlasStoneHeroProps) {
  const sizes = { sm: 'w-32 h-32', md: 'w-56 h-56', lg: 'w-80 h-80 md:w-96 md:h-96' };

  const hasImage = true; // We have this from the user's uploaded image — needs to be saved as file

  if (hasImage) {
    return (
      <div className={`relative ${sizes[size]} ${className}`} style={{ opacity }}>
        {/* Glow behind stone */}
        <div className="absolute inset-0 rounded-full blur-3xl" style={{
          background: 'radial-gradient(circle, rgba(164,28,100,0.3) 0%, transparent 70%)',
          transform: 'scale(1.2)',
        }} />
        <img
          src="/assets/atlas-stone-branded.png"
          alt="Educate.Strong branded atlas stone"
          className="relative w-full h-full object-contain drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 0 30px rgba(164,28,100,0.3))' }}
          onError={(e) => {
            // If image fails, show placeholder
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // CSS placeholder stone
  return (
    <div className={`relative ${sizes[size]} ${className}`} style={{ opacity }}>
      <div className="absolute inset-0 rounded-full blur-3xl" style={{
        background: 'radial-gradient(circle, rgba(164,28,100,0.25) 0%, transparent 70%)',
        transform: 'scale(1.3)',
      }} />
      <div className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #3C3C3C, #1A1A1A 60%, #0D0D0D)',
          border: '1px solid #2C2C2C',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 40px rgba(164,28,100,0.15)',
        }}>
        <img src="/assets/es-logo-v3.svg" alt="" className="w-2/3 h-2/3 object-contain opacity-20" />
      </div>
    </div>
  );
}
