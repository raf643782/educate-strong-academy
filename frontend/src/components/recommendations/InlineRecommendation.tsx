import { Link } from 'react-router-dom';

interface InlineRecommendationProps {
  promptLabel: string;
  ctaText: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  position: 'inline' | 'end_of_lesson' | 'sidebar';
}

function buildLink(targetType: string, targetId: string | null, targetUrl: string | null): string {
  if (targetUrl) return targetUrl;
  if (!targetId) return '#';
  switch (targetType) {
    case 'KB_ARTICLE': return `/knowledge/${targetId}`;
    case 'EXERCISE': return `/exercises`;
    case 'EVENT': return `/events`;
    case 'COURSE': return `/courses`;
    case 'LESSON': return `/learn/lesson/${targetId}`;
    default: return '#';
  }
}

export default function InlineRecommendation({
  promptLabel,
  ctaText,
  targetType,
  targetId,
  targetUrl,
  position,
}: InlineRecommendationProps) {
  const href = buildLink(targetType, targetId, targetUrl);
  const isExternal = href.startsWith('http');

  if (position === 'inline') {
    return (
      <div className="my-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <span className="text-amber-600 mt-0.5 flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-0.5">{promptLabel}</p>
          {isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              {ctaText} &rarr;
            </a>
          ) : (
            <Link to={href} className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              {ctaText} &rarr;
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (position === 'end_of_lesson') {
    return (
      <div className="mt-8 border border-gray-200 rounded-xl p-6 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{promptLabel}</p>
        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 hover:border-amber-400 bg-white hover:bg-amber-50 text-gray-900 hover:text-amber-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150"
          >
            {ctaText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        ) : (
          <Link
            to={href}
            className="inline-flex items-center gap-2 border border-gray-300 hover:border-amber-400 bg-white hover:bg-amber-50 text-gray-900 hover:text-amber-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150"
          >
            {ctaText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
      </div>
    );
  }

  // sidebar
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{promptLabel}</p>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:text-amber-800 font-medium">
          {ctaText} &rarr;
        </a>
      ) : (
        <Link to={href} className="text-sm text-amber-600 hover:text-amber-800 font-medium">
          {ctaText} &rarr;
        </Link>
      )}
    </div>
  );
}
