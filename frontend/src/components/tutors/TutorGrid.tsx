import TutorCard from './TutorCard';
import type { Tutor } from '../../data/tutorsData';

interface TutorGridProps {
  tutors: Tutor[];
  variant: 'compact' | 'course' | 'full';
  heading?: string;
  intro?: string;
}

export default function TutorGrid({ tutors, variant, heading, intro }: TutorGridProps) {
  if (tutors.length === 0) return null;

  const gridClass = variant === 'compact'
    ? 'grid-cols-2 sm:grid-cols-4'
    : variant === 'course'
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1';

  return (
    <div>
      {(heading || intro) && (
        <div className="mb-8">
          {heading && <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{heading}</h2>}
          {intro && <p className="text-gray-600 max-w-2xl">{intro}</p>}
        </div>
      )}
      <div className={variant === 'full' ? 'divide-y divide-gray-100' : `grid ${gridClass} gap-5`}>
        {tutors.map(tutor => (
          <TutorCard key={tutor.id} tutor={tutor} variant={variant} />
        ))}
      </div>
    </div>
  );
}
