import type { EndorsementData } from '../../data/coursePageData';

interface CourseEndorsementsProps {
  endorsements: EndorsementData[];
}

export default function CourseEndorsements({ endorsements }: CourseEndorsementsProps) {
  return (
    <section style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }} className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="es-label mb-3">Formally Endorsed</p>
        <h2 className="text-2xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>Recognised by Governing Bodies</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {endorsements.map(item => (
            <div key={item.name} className="es-card p-6 flex flex-col gap-4">
              <div className="h-12 rounded-lg flex items-center px-3" style={{ background: '#2A2A2A', border: '1px solid #3C3C3C' }}>
                <span className="text-xs text-es-muted font-medium">{item.name} — Logo pending permission</span>
              </div>
              <p className="font-bold text-white">{item.name}</p>
              <p className="text-sm text-es-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-es-subtle mt-5">
          Endorsement details subject to confirmation. Contact Educate.Strong to verify current endorsement status.
        </p>
      </div>
    </section>
  );
}
