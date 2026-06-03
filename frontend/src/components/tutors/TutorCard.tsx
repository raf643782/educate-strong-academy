/**
 * TutorCard — three variants:
 *   'compact'  — homepage strip (portrait + name + one credential)
 *   'course'   — course page cards (portrait + credentials + statement)
 *   'full'     — About page full profiles
 */
import { Link } from 'react-router-dom';
import ImagePlaceholder from '../media/ImagePlaceholder';
import type { Tutor } from '../../data/tutorsData';

interface TutorCardProps {
  tutor: Tutor;
  variant: 'compact' | 'course' | 'full';
}

export default function TutorCard({ tutor, variant }: TutorCardProps) {

  // ── Compact: homepage strip ───────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 flex-shrink-0">
          <ImagePlaceholder
            label={tutor.photoAlt}
            aspectRatio="1/1"
            className="rounded-full"
          />
        </div>
        <p className="font-bold text-white text-sm">{tutor.name}</p>
        <p className="text-xs text-amber-400 mt-0.5">{tutor.shortRole}</p>
      </div>
    );
  }

  // ── Course: course page two-column ────────────────────────────────────────
  if (variant === 'course') {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-100 h-48">
          <ImagePlaceholder
            label={tutor.photoAlt}
            aspectRatio="4/3"
            className="h-full rounded-none"
          />
        </div>
        <div className="p-5">
          <p className="font-bold text-gray-900 text-base mb-0.5">{tutor.name}</p>
          <p className="text-sm text-amber-600 font-medium mb-3">{tutor.role}</p>
          <ul className="space-y-1 mb-4">
            {tutor.credentials.slice(0, 4).map(c => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed">{tutor.description}</p>
        </div>
      </div>
    );
  }

  // ── Full: About page ──────────────────────────────────────────────────────
  return (
    <div className="grid md:grid-cols-3 gap-8 py-10 border-b border-gray-100 last:border-0">
      {/* Photo */}
      <div className="md:col-span-1">
        <ImagePlaceholder
          label={tutor.photoAlt}
          aspectRatio="3/4"
          className="rounded-xl max-w-xs mx-auto"
        />
      </div>
      {/* Content */}
      <div className="md:col-span-2">
        <p className="font-bold text-gray-900 text-2xl mb-1">{tutor.name}</p>
        <p className="text-amber-600 font-medium mb-5">{tutor.role}</p>

        <ul className="space-y-2 mb-6">
          {tutor.credentials.map(c => (
            <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {c}
            </li>
          ))}
        </ul>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">In their own words</p>
          <p className="text-sm text-gray-600 leading-relaxed italic">{tutor.personalStatement}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Teaches</p>
          <div className="flex flex-wrap gap-2">
            {tutor.coursesTaught.map(c => (
              <Link
                key={c.slug}
                to={`/courses/${c.slug}`}
                className="text-xs border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700 px-2.5 py-1 rounded transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {tutor.instagramUrl && (
          <a
            href={tutor.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Instagram
          </a>
        )}
      </div>
    </div>
  );
}
