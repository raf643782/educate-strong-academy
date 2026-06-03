import type { CurriculumItem } from '../../data/coursePageData';

interface CourseCurriculumGridProps {
  heading: string;
  intro: string;
  items: CurriculumItem[];
}

export default function CourseCurriculumGrid({
  heading,
  intro,
  items,
}: CourseCurriculumGridProps) {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{heading}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{intro}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.name}
              className="border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all"
            >
              {/* Number marker */}
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
