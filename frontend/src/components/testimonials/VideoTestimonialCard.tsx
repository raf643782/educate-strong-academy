import type { Testimonial } from '../../data/testimonialsData';
import VideoPlaceholder from '../media/VideoPlaceholder';

interface VideoTestimonialCardProps {
  testimonial: Testimonial;
  layout?: 'centered' | 'split';
}

export default function VideoTestimonialCard({
  testimonial,
  layout = 'split',
}: VideoTestimonialCardProps) {
  const videoLabel = testimonial.videoThumbnailAlt ||
    `Video testimonial — ${testimonial.name} — ${testimonial.courseName} — Educate.Strong to provide YouTube or Vimeo URL`;

  if (layout === 'centered') {
    return (
      <div className="max-w-2xl mx-auto">
        <VideoPlaceholder
          label={videoLabel}
          videoUrl={testimonial.videoUrl}
          title={`Testimonial — ${testimonial.name}`}
          className="mb-4"
        />
        <p className="text-sm text-gray-500 text-center">
          {testimonial.name} · {testimonial.role} · {testimonial.courseName}
        </p>
      </div>
    );
  }

  // Split layout — video left, quote right
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <VideoPlaceholder
        label={videoLabel}
        videoUrl={testimonial.videoUrl}
        title={`Testimonial — ${testimonial.name}`}
      />
      <div>
        <div className="text-amber-400 text-5xl font-serif leading-none mb-4 select-none">"</div>
        <blockquote className="text-gray-700 leading-relaxed mb-5 text-base italic">
          {testimonial.quote}
        </blockquote>
        <div>
          <p className="font-bold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
          <p className="text-sm text-gray-400">{testimonial.courseName}</p>
        </div>
      </div>
    </div>
  );
}
