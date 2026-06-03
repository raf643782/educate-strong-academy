import type { Testimonial } from '../../data/testimonialsData';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showCourse?: boolean;
}

export default function TestimonialCard({ testimonial, showCourse = true }: TestimonialCardProps) {
  const isPlaceholder = !testimonial.consentConfirmed;

  return (
    <div className={`bg-white border rounded-xl p-6 flex flex-col ${isPlaceholder ? 'border-dashed border-gray-200' : 'border-gray-200'}`}>
      {/* Quote mark */}
      <div className="text-amber-400 text-4xl font-serif leading-none mb-4 select-none">"</div>

      {/* Quote */}
      <blockquote className={`text-sm leading-relaxed flex-1 mb-5 ${isPlaceholder ? 'text-gray-300 italic' : 'text-gray-700'}`}>
        {testimonial.quote}
      </blockquote>

      {/* Outcome */}
      {testimonial.outcome && !isPlaceholder && (
        <p className="text-xs text-amber-600 font-medium mb-4 leading-snug">
          {testimonial.outcome}
        </p>
      )}

      {/* Attribution */}
      <div className="border-t border-gray-100 pt-4">
        <p className={`font-semibold text-sm ${isPlaceholder ? 'text-gray-300' : 'text-gray-900'}`}>
          {testimonial.name}
        </p>
        <p className="text-xs text-gray-500">{testimonial.role}</p>
        {testimonial.location && (
          <p className="text-xs text-gray-400">{testimonial.location}</p>
        )}
        {showCourse && (
          <p className="text-xs text-gray-400 mt-1">{testimonial.courseName}</p>
        )}
      </div>

      {/* Consent warning — admin visibility only in prod, visible in dev */}
      {isPlaceholder && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
          <p className="text-xs text-amber-700">Placeholder — consent not yet confirmed. Do not publish publicly.</p>
        </div>
      )}
    </div>
  );
}
