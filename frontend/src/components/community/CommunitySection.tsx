/**
 * CommunitySection — placeholder architecture for community content.
 *
 * This section prevents the Academy from feeling purely transactional.
 * It will eventually surface: recent graduates, upcoming events, spotlights.
 * At launch, it uses placeholder content with clear labels.
 *
 * Do not build live feeds yet. Build the visual architecture and populate
 * with static placeholder content until a CMS or admin upload system is ready.
 */

const COMMUNITY_ITEMS = [
  {
    id: 'c1',
    category: 'Graduate',
    heading: '[Name] — Level 1 Coach',
    body: 'Placeholder — recent Level 1 Coaching graduate spotlight. Replace with real graduate content once consent is confirmed.',
    date: '[Date]',
  },
  {
    id: 'c2',
    category: 'Referee',
    heading: '[Name] — Level 1 Referee',
    body: 'Placeholder — certified referee spotlight. Replace with real content once consent is confirmed.',
    date: '[Date]',
  },
  {
    id: 'c3',
    category: 'StrongKidz',
    heading: 'StrongKidz Update',
    body: 'Placeholder — StrongKidz programme update or achievement. Replace with real content from Educate.Strong.',
    date: '[Date]',
  },
];

const CATEGORY_COLOURS: Record<string, string> = {
  Graduate:   'bg-amber-100 text-amber-700',
  Referee:    'bg-gray-100 text-gray-600',
  StrongKidz: 'bg-blue-50 text-blue-600',
};

export default function CommunitySection() {
  return (
    <section className="bg-gray-50 py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              The Community
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              Coaches, referees, and youth programme leaders building the Strongman coaching community.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMUNITY_ITEMS.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-5 border-dashed"
            >
              <span className={`text-xs font-semibold px-2 py-0.5 rounded mb-3 inline-block ${CATEGORY_COLOURS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                {item.category}
              </span>
              <h3 className="font-bold text-gray-700 text-sm mb-2">{item.heading}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
              <p className="text-xs text-gray-300 mt-3">{item.date}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Community content is managed from the Admin Portal. Replace placeholders with real graduate stories, events, and updates.
        </p>
      </div>
    </section>
  );
}
