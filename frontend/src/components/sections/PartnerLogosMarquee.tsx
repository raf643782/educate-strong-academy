/**
 * PartnerLogosMarquee — clean ticker strip, no boxes around logos.
 * Logos separated by subtle dividers, smooth infinite scroll.
 * Pauses on hover.
 */

interface Logo {
  src?: string;
  alt: string;
  label: string;
  sublabel?: string;
}

const LOGOS: Logo[] = [
  {
    src: '/assets/logo_owl.svg',
    alt: 'Educate.Strong',
    label: 'Educate.Strong',
    sublabel: 'The Academy',
  },
  {
    src: '/assets/partner-activeiq.png',
    alt: 'Active IQ',
    label: 'Active IQ',
    sublabel: 'Level 1 Accredited',
  },
  {
    src: '/assets/partner-british-army.webp',
    alt: 'British Army',
    label: 'British Army',
    sublabel: 'Partner',
  },
  {
    src: '/assets/partner-waygb.jpg',
    alt: 'WHEA.GB',
    label: 'WHEA.GB',
    sublabel: 'Refereeing Endorsed',
  },
  {
    src: '/assets/partner-mindbodyconnect.avif',
    alt: 'Mind Body Connect',
    label: 'Mind Body Connect',
    sublabel: 'Charity No. 1173834',
  },
  {
    src: '/assets/british-army-logo.webp',
    alt: 'Armed Forces Strongman',
    label: 'Armed Forces Strongman',
    sublabel: 'Endorsed',
  },
];

function LogoItem({ logo, index }: { logo: Logo; index: number }) {
  return (
    <div
      className="logo-ticker-item"
      aria-label={`${logo.label}${logo.sublabel ? ' — ' + logo.sublabel : ''}`}
    >
      {/* Subtle separator before (not before first) */}
      {index > 0 && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '1px',
            height: '24px',
            background: 'rgba(60,60,60,0.6)',
            marginRight: '40px',
          }}
        />
      )}

      {/* Logo image */}
      {logo.src && (
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-7 w-auto object-contain"
          style={{ maxWidth: '80px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Text */}
      <div>
        <p className="text-xs font-semibold text-white leading-none">{logo.label}</p>
        {logo.sublabel && (
          <p className="text-xs leading-none mt-0.5" style={{ color: '#555566' }}>
            {logo.sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PartnerLogosMarquee() {
  // Duplicate for seamless loop
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section
      aria-label="Partners and accreditations"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(40,40,40,0.8)',
        borderBottom: '1px solid rgba(40,40,40,0.8)',
      }}
    >
      {/* Fade masks left + right */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #080808, transparent)' }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #080808, transparent)' }}
          aria-hidden="true"
        />

        {/* Scrolling track */}
        <div className="overflow-hidden py-4" aria-hidden="true">
          <div className="marquee-track">
            {doubled.map((logo, i) => (
              <LogoItem key={`${logo.label}-${i}`} logo={logo} index={i % LOGOS.length} />
            ))}
          </div>
        </div>
      </div>

      {/* Accessible static list for screen readers */}
      <ul className="sr-only">
        {LOGOS.map(logo => (
          <li key={logo.label}>{logo.label}{logo.sublabel ? ` — ${logo.sublabel}` : ''}</li>
        ))}
      </ul>
    </section>
  );
}
