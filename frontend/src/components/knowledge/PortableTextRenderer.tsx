/**
 * Minimal Portable Text renderer for Sanity-backed Knowledge Hub articles
 * (Stage 1). Supports paragraphs, H2/H3, bold, italic, links, and lists.
 * Image blocks are not expected yet — a clearly labelled placeholder is
 * rendered if one appears, rather than failing silently or crashing.
 */

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Link } from 'react-router-dom';

const LINK_COLOUR = '#A41C64';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-black text-white mt-10 mb-4" style={{ letterSpacing: '-0.02em' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-white mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-es-muted leading-relaxed text-base mb-4">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value?.href as string) || '#';
      const isInternal = href.startsWith('/');
      return isInternal ? (
        <Link to={href} className="underline" style={{ color: LINK_COLOUR }}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: LINK_COLOUR }}>
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1 mb-4 text-es-muted">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-1 mb-4 text-es-muted">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: () => (
      <div
        className="my-6 p-4 text-center text-xs text-es-subtle rounded"
        style={{ border: '1px dashed #2C2C2C' }}
      >
        Image rendering is not yet implemented for Sanity content — placeholder.
      </div>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: unknown[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value as never} components={components} />;
}
