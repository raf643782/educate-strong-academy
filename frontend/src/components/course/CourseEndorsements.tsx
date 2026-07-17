import type { EndorsementData } from '../../data/coursePageData';

interface CourseEndorsementsProps {
  endorsements: EndorsementData[];
}

// Real, already-published logo assets (same files used in the homepage
// partner marquee) — matched by endorsement name rather than duplicating
// the asset paths into the data file.
const ENDORSEMENT_LOGOS: Record<string, string> = {
  'WHEA.GB': '/assets/partner-waygb.jpg',
  'Armed Forces Strongman': '/assets/british-army-logo.webp',
};

export default function CourseEndorsements({ endorsements }: CourseEndorsementsProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
      <div className="es-container-wide">
        <p className="es-label mb-3">Formally Endorsed</p>
        <h2 className="text-2xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>Recognised by Governing Bodies</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {endorsements.map(item => {
            const logo = ENDORSEMENT_LOGOS[item.name];
            return (
              <div key={item.name} className="es-card p-6 flex flex-col gap-4">
                <div className="h-12 rounded-lg flex items-center px-3 overflow-hidden" style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {logo ? (
                    <img src={logo} alt={`${item.name} logo`} className="h-8 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-xs text-es-muted font-medium">{item.name} — Logo pending permission</span>
                  )}
                </div>
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-sm text-es-muted leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-es-subtle mt-5">
          Endorsement details subject to confirmation. Contact Educate.Strong to verify current endorsement status.
        </p>
      </div>
    </section>
  );
}
