import type { CurriculumItem } from '../../data/coursePageData';

interface CourseCurriculumGridProps {
  heading: string;
  intro: string;
  items: CurriculumItem[];
}

export default function CourseCurriculumGrid({ heading, intro, items }: CourseCurriculumGridProps) {
  return (
    <section className="es-grit" style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)', position: 'relative' }}
      id="course-details">
      <div className="es-container-wide py-14 md:py-18">
        <div className="mb-10 max-w-2xl">
          <p className="es-label mb-2">Curriculum</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          <p className="text-es-muted text-base leading-relaxed">{intro}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div key={item.name} className="es-card-hover p-5">
              <div className="w-8 h-8 rounded flex items-center justify-center mb-4 font-black text-xs text-white"
                style={{ background: '#A41C64' }}>
                {idx + 1}
              </div>
              <h3 className="font-bold text-white mb-2">{item.name}</h3>
              <p className="text-sm text-es-muted leading-relaxed">{item.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
