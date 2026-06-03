import RefereeGraduateCard from './RefereeGraduateCard';
import { REFEREE_GRADUATES, getPublishedReferees } from '../../data/refereeData';

interface RefereeGraduateGalleryProps {
  showPlaceholders?: boolean; // dev mode — show all including unpublished
  heading?: string;
  subheading?: string;
  maxCards?: number;
  className?: string;
}

export default function RefereeGraduateGallery({
  showPlaceholders = false,
  heading = 'Qualified Officials. Officiating at Competitions Across the UK.',
  subheading = 'Every referee below holds a Level 1 Strongman Refereeing Certification from Educate.Strong.',
  maxCards = 6,
  className = '',
}: RefereeGraduateGalleryProps) {
  const graduates = showPlaceholders
    ? REFEREE_GRADUATES.slice(0, maxCards)
    : getPublishedReferees().slice(0, maxCards);

  return (
    <div className={className}>
      {(heading || subheading) && (
        <div className="mb-8">
          {heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{heading}</h2>
          )}
          {subheading && (
            <p className="text-gray-600 max-w-2xl">{subheading}</p>
          )}
        </div>
      )}

      {graduates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {graduates.map(g => (
            <RefereeGraduateCard
              key={g.id}
              graduate={g}
              showPlaceholder={showPlaceholders}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-500 font-medium mb-1">Certified Referee Gallery</p>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Graduate photographs will appear here once individual consent has been confirmed.
            Contact each graduate to obtain written permission before adding their entry.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        All photographs displayed with the individual's written consent.
      </p>
    </div>
  );
}
