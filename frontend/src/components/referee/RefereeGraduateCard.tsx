import ImagePlaceholder from '../media/ImagePlaceholder';
import type { RefereeGraduate } from '../../data/refereeData';

interface RefereeGraduateCardProps {
  graduate: RefereeGraduate;
  showPlaceholder?: boolean; // show placeholder cards before consent is confirmed
}

export default function RefereeGraduateCard({
  graduate,
  showPlaceholder = false,
}: RefereeGraduateCardProps) {
  // Do not render unpublished entries publicly unless showPlaceholder is true
  if (!graduate.isPublished && !showPlaceholder) return null;

  return (
    <div className="group">
      {/* Photo */}
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-square">
        {graduate.consentConfirmed && graduate.isPublished ? (
          // Real image — replace ImagePlaceholder when src is available
          <ImagePlaceholder
            label={graduate.photoAlt}
            aspectRatio="1/1"
            className="rounded-xl"
          />
        ) : (
          <ImagePlaceholder
            label={graduate.photoAlt}
            aspectRatio="1/1"
            className="rounded-xl"
          />
        )}
        {showPlaceholder && !graduate.consentConfirmed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Consent pending
            </span>
          </div>
        )}
      </div>

      {/* Caption — always visible, not hover-only */}
      <div>
        <p className="font-bold text-gray-900 text-sm leading-snug">{graduate.name}</p>
        <p className="text-xs text-amber-600 font-medium mt-0.5">
          {graduate.certificationLevel} Certified Referee
        </p>
        <p className="text-xs text-gray-400">Certified {graduate.certificationDate}</p>
        {graduate.officatingNote && (
          <p className="text-xs text-gray-500 mt-1 leading-snug">{graduate.officatingNote}</p>
        )}
        {/* Optional personality quote — appears below formal credentials */}
        {graduate.quote && (
          <p className="text-xs text-gray-600 italic mt-2 leading-snug">"{graduate.quote}"</p>
        )}
      </div>
    </div>
  );
}
