/**
 * TrustStripPreview — preview-only accreditation and partner strip.
 *
 * Deliberately different from the production PartnerLogosMarquee: the
 * per-logo relationship words ("Level 1 Accredited", "Refereeing
 * Endorsed", "Partner", "Endorsed") are removed here because their
 * exact wording has not been confirmed (see the strategy report,
 * "Claims requiring confirmation"). Organisation names and logos are
 * shown neutrally instead. Mind Body Connect keeps its registered
 * charity number, since that is a fact about Mind Body Connect itself,
 * not a claim about Educate Strong's relationship to it.
 *
 * A static row, not a marquee, so this section reads as calm and
 * certain rather than another moving element on the page.
 */

interface Partner {
  src: string;
  alt: string;
  label: string;
  sublabel?: string;
}

const PARTNERS: Partner[] = [
  { src: '/assets/partner-activeiq.png', alt: 'Active IQ', label: 'Active IQ' },
  { src: '/assets/partner-waygb.jpg', alt: 'WHEA.GB', label: 'WHEA.GB' },
  { src: '/assets/partner-british-army.webp', alt: 'British Army', label: 'British Army' },
  { src: '/assets/partner-mindbodyconnect.avif', alt: 'Mind Body Connect', label: 'Mind Body Connect', sublabel: 'Charity No. 1173834' },
  { src: '/assets/british-army-logo.webp', alt: 'Armed Forces Strongman', label: 'Armed Forces Strongman' },
];

export default function TrustStripPreview() {
  return (
    <section
      aria-label="Accreditation and partners"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(40,40,40,0.8)',
        borderBottom: '1px solid rgba(40,40,40,0.8)',
        padding: '36px 0',
      }}
    >
      <div className="es-container">
        <p className="es-label text-center mb-6" style={{ opacity: 0.85 }}>
          Accreditation and Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <div key={p.label} className="flex items-center gap-2.5 opacity-70 hover:opacity-95 transition-opacity duration-200">
              <img
                src={p.src}
                alt={p.alt}
                className="h-7 w-auto object-contain"
                style={{ maxWidth: '76px' }}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <p className="text-xs font-semibold text-white leading-none">{p.label}</p>
                {p.sublabel && (
                  <p className="text-[11px] leading-none mt-1" style={{ color: '#555566' }}>
                    {p.sublabel}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
