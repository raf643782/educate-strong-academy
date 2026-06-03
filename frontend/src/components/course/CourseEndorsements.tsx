import type { EndorsementData } from '../../data/coursePageData';

interface CourseEndorsementsProps {
  endorsements: EndorsementData[];
}

export default function CourseEndorsements({ endorsements }: CourseEndorsementsProps) {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Formally Endorsed</h2>
        <p className="text-gray-600 mb-8 max-w-xl">
          This certification is recognised by established Strongman governing bodies.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {endorsements.map((item) => (
            <div
              key={item.name}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Logo placeholder */}
              <div className="bg-gray-100 rounded-lg h-14 flex items-center justify-center">
                <p className="text-xs text-gray-400 font-medium">{item.name} — Logo pending permission</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">{item.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Logos displayed subject to permission from endorsing organisations. Contact Educate.Strong to confirm current endorsement status.
        </p>
      </div>
    </section>
  );
}
