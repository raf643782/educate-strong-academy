/**
 * EditorialAttribution — compact "Written by / Technically reviewed
 * by / Published / Last reviewed / Rules last reviewed / Sources"
 * block shown on Exercise and Event dedicated pages.
 *
 * Renders nothing at all when none of these fields have a real value
 * — no empty section, no placeholder text, no invented attribution.
 * Each individual line (author, reviewer, published date, etc.) is
 * itself independently conditional, so a record with only a reviewer
 * and no confirmed author shows just the reviewer line, not an
 * "unknown author" gap.
 *
 * Deliberately compact — this is a few lines of text, not a
 * standalone academic-paper-style credentials section. `sources` is
 * shown as a plain list (one entry per line) rather than a formal
 * bibliography, but still real, visible text — not hidden behind an
 * extra click — since event rule sources specifically need to be
 * readable by coaches, referees and promoters without digging.
 */
function splitSources(sources?: string | null): string[] {
  if (!sources) return [];
  return sources.split('\n').map(s => s.trim()).filter(Boolean);
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface EditorialAttributionProps {
  authorName?: string | null;
  authorRole?: string | null;
  reviewerName?: string | null;
  reviewerQualification?: string | null;
  publishedDate?: string | null;
  lastReviewedDate?: string | null;
  /** Event-only: when the promoter/federation rule summary was last
   * confirmed current, distinct from general editorial review. */
  ruleReviewDate?: string | null;
  sources?: string | null;
}

export default function EditorialAttribution({
  authorName,
  authorRole,
  reviewerName,
  reviewerQualification,
  publishedDate,
  lastReviewedDate,
  ruleReviewDate,
  sources,
}: EditorialAttributionProps) {
  const published = formatDate(publishedDate);
  const lastReviewed = formatDate(lastReviewedDate);
  const rulesReviewed = formatDate(ruleReviewDate);
  const sourceLines = splitSources(sources);

  const hasAnything = !!authorName || !!reviewerName || !!published || !!lastReviewed || !!rulesReviewed || sourceLines.length > 0;
  if (!hasAnything) return null;

  return (
    <div style={{ borderTop: '1px solid #2C2C2C', paddingTop: '16px' }} className="space-y-1.5">
      {authorName && (
        <p className="text-xs text-es-subtle">
          Written by {authorName}{authorRole ? `, ${authorRole}` : ''}
        </p>
      )}
      {reviewerName && (
        <p className="text-xs text-es-subtle">
          Technically reviewed by {reviewerName}{reviewerQualification ? `, ${reviewerQualification}` : ''}
        </p>
      )}
      {published && <p className="text-xs text-es-subtle">Published {published}</p>}
      {lastReviewed && <p className="text-xs text-es-subtle">Last reviewed {lastReviewed}</p>}
      {rulesReviewed && <p className="text-xs text-es-subtle">Rules last reviewed {rulesReviewed}</p>}
      {sourceLines.length > 0 && (
        <div className="pt-1">
          <p className="text-xs font-semibold text-es-subtle mb-1">Sources</p>
          <ul className="space-y-0.5">
            {sourceLines.map((line, i) => (
              <li key={i} className="text-xs text-es-subtle leading-relaxed">{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
