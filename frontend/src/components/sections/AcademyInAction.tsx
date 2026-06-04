import { useEffect } from 'react';

const INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/DTJFTrSDT7W/';
const INSTAGRAM_EMBED_URL = `${INSTAGRAM_REEL_URL}?utm_source=ig_embed&utm_campaign=loading`;

export default function AcademyInAction() {
  // Trigger Instagram embed processing when component mounts
  useEffect(() => {
    // Instagram's embed.js processes blockquotes on load.
    // If the script has already loaded, we need to manually trigger it.
    if (typeof window !== 'undefined' && (window as any).instgrm) {
      try {
        (window as any).instgrm.Embeds.process();
      } catch {
        // Instagram embed not available — fallback card will show
      }
    }
  }, []);

  return (
    <section
      className="es-grit relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(164,28,100,0.08) 0%, transparent 70%), #0A0A0A',
        borderTop: '1px solid #2C2C2C',
        borderBottom: '1px solid #2C2C2C',
      }}
    >
      {/* Decorative scratch lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(30deg, transparent, transparent 100px, rgba(255,255,255,0.008) 100px, rgba(255,255,255,0.008) 101px)',
      }} />

      <div className="es-container py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div className="order-2 lg:order-1">
            <p className="es-label mb-3">Academy in Action</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Inside Educate.Strong
            </h2>
            <p className="text-es-muted leading-relaxed mb-6">
              Real coaching. Real referees. Real outcomes. Follow the Educate.Strong journey on Instagram
              and see what the UK's original Strongman coaching academy delivers on the ground.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Practical coaching sessions across the UK',
                'Level 1 Refereeing cohorts with real athletes',
                'Behind-the-scenes StrongKidz sessions',
                'Community of certified coaches and officials',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-es-muted">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#A41C64' }} />
                  {item}
                </div>
              ))}
            </div>
            <a
              href="https://www.instagram.com/educate.strong/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex items-center gap-2"
            >
              {/* Instagram icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @educate.strong
            </a>
          </div>

          {/* Instagram embed — dark branded wrapper */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-sm">
              {/* Dark branded frame around the Instagram embed */}
              <div
                className="rounded-xl overflow-hidden animate-pulse-glow"
                style={{
                  border: '1px solid rgba(164,28,100,0.4)',
                  background: '#1A1A1A',
                  boxShadow: '0 0 40px rgba(164,28,100,0.15), 0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                {/* Frame header */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #2C2C2C', background: '#141414' }}>
                  <img src="/assets/es-logo.png" alt="" className="h-5 w-auto" />
                  <span className="text-xs font-bold" style={{ color: '#A41C64' }}>@educate.strong</span>
                  <div className="ml-auto flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-es-grey" />
                    <span className="w-2 h-2 rounded-full bg-es-grey" />
                    <span className="w-2 h-2 rounded-full" style={{ background: '#A41C64' }} />
                  </div>
                </div>

                {/* Instagram embed area */}
                <div className="ig-embed-wrapper" style={{ minHeight: '400px' }}>
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={INSTAGRAM_EMBED_URL}
                    data-instgrm-version="14"
                    style={{
                      background: '#1A1A1A',
                      border: 0,
                      margin: 0,
                      padding: 0,
                      maxWidth: '100%',
                      minWidth: 0,
                      width: '100%',
                    }}
                  >
                    {/* Fallback shown while embed loads */}
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.3)' }}>
                        <svg className="w-5 h-5" style={{ color: '#A41C64' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-sm text-es-muted mb-3">Educate.Strong on Instagram</p>
                      <a
                        href={INSTAGRAM_REEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-2 px-4 inline-block"
                      >
                        Watch on Instagram
                      </a>
                    </div>
                  </blockquote>
                </div>

                {/* Frame footer */}
                <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderTop: '1px solid #2C2C2C', background: '#141414' }}>
                  <span className="text-xs text-es-subtle">Educate.Strong · Qualified Referees</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
