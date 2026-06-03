interface CourseLearningOutcomesProps {
  heading: string;
  intro: string;
  outcomes: string[];
}

export default function CourseLearningOutcomes({
  heading,
  intro,
  outcomes,
}: CourseLearningOutcomesProps) {
  return (
    <section className="bg-gray-900 text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{heading}</h2>
          <p className="text-gray-400 mb-8">{intro}</p>

          <ul className="space-y-4">
            {outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-200 leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
