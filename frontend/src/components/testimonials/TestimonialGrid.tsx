import TestimonialCard from './TestimonialCard';
import type { Testimonial } from '../../data/testimonialsData';

interface TestimonialGridProps {
  testimonials: Testimonial[];
  columns?: 2 | 3;
  showCourse?: boolean;
  heading?: string;
  subheading?: string;
}

export default function TestimonialGrid({
  testimonials,
  columns = 3,
  showCourse = true,
  heading,
  subheading,
}: TestimonialGridProps) {
  const colClass = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  if (testimonials.length === 0) return null;

  return (
    <div>
      {(heading || subheading) && (
        <div className="mb-8">
          {heading && <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{heading}</h2>}
          {subheading && <p className="text-gray-500">{subheading}</p>}
        </div>
      )}
      <div className={`grid ${colClass} gap-5`}>
        {testimonials.map(t => (
          <TestimonialCard key={t.id} testimonial={t} showCourse={showCourse} />
        ))}
      </div>
    </div>
  );
}
