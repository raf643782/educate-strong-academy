import type { AudienceCard } from '../../data/coursePageData';

interface CourseAudienceProps {
  cards: AudienceCard[];
  prerequisiteStatement: string;
}

export default function CourseAudience({ cards, prerequisiteStatement }: CourseAudienceProps) {
  return (
    <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Who Should Attend</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {cards.map((card) => (
            <div
              key={card.heading}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h3 className="font-bold text-gray-900 mb-3 text-sm leading-snug uppercase tracking-wide">
                {card.heading}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.copy}</p>
            </div>
          ))}
        </div>

        {/* Prerequisite statement */}
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-5">
          <svg
            className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900">Entry requirements: </strong>
            {prerequisiteStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
