/**
 * PartnerLogosMarquee — animated horizontal drift of partner/trust logos.
 *
 * Uses CSS marquee animation for smooth infinite scroll.
 * Logos that have real files use them; others use styled text badges.
 */

interface Logo {
  src?: string;
  alt: string;
  label: string;
  sublabel?: string;
}

const LOGOS: Logo[] = [
  {
    src: '/assets/es-logo-v3.svg',
    alt: 'Educate.Strong',
    label: 'Educate.Strong',
    sublabel: 'The Academy',
  },
  {
    alt: 'Active IQ',
    label: 'Active IQ',
    sublabel: 'Accredited',
  },
  {
    src: '/assets/british-army-logo.webp',
    alt: 'British Army',
    label: 'British Army',
    sublabel: 'Partner',
  },
  {
    alt: 'WHEA.GB',
    label: 'WHEA.GB',
    sublabel: 'Endorsed',
  },
  {
    src: '/assets/mind-body-connect-logo.avif',
    alt: 'Mind Body Connect',
    label: 'Mind Body Connect',
    sublabel: 'Charity No. 1173834',
  },
  {
    alt: 'Armed Forces Strongman',
    label: 'Armed Forces',
    sublabel: 'Strongman',
  },
];

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-3 rounded-lg flex-shrink-0 mx-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(60,60,60,0.6)',
      }}
    >
      {logo.src && (
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-7 w-auto object-contain opacity-70"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div>
        <p className="text-xs font-bold text-white leading-none">{logo.label}</p>
        {logo.sublabel && (
          <p className="text-xs text-es-subtle leading-none mt-0.5">{logo.sublabel}</p>
        )}
      </div>
    </div>
  );
}

export default function PartnerLogosMarquee() {
  // Duplicate logos for seamless loop
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C' }}>
      <div className="py-5">
        <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <div className="marquee-track">
            {doubled.map((logo, i) => (
              <LogoItem key={`${logo.label}-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
      <div className="es-container pb-3">
        <p className="text-xs text-es-subtle text-center">
          Built around recognised education standards, practical Strongman experience, and trusted delivery partners.
        </p>
      </div>
    </section>
  );
}
