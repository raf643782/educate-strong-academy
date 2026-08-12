import type { SanityPublicReference } from '../../lib/sanity';

export default function PublicReferencesList({ items }: { items?: SanityPublicReference[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2C2C2C' }}>
      <h3 className="font-bold text-white mb-4 text-lg">References</h3>
      <ol className="space-y-4 list-decimal pl-5">
        {items.map((ref, i) => {
          const citationLine = [ref.authorsOrOrganisation, ref.year && `(${ref.year})`, ref.title, ref.publicationOrSource]
            .filter(Boolean)
            .join('. ');
          return (
            <li key={i} className="text-es-muted text-sm leading-relaxed">
              {citationLine}
              {ref.doi && <span>{citationLine ? '. ' : ''}DOI: {ref.doi}</span>}
              {ref.url && (
                <>
                  {(citationLine || ref.doi) ? '. ' : ''}
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: '#A41C64' }}>
                    {ref.url}
                  </a>
                </>
              )}
              {ref.accessDate && <span> (accessed {ref.accessDate})</span>}
              {ref.notesForDisplay && <p className="text-es-subtle text-xs mt-1">{ref.notesForDisplay}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
