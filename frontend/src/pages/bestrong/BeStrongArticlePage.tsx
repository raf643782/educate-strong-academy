import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { SITE_URL } from '../../lib/siteUrl';
import BreadcrumbSchema from '../../components/content/BreadcrumbSchema';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  summary?: string;
  content?: string | null;
  authorName?: string;
  reviewerName?: string;
  reviewerQualification?: string;
  lastReviewedAt?: string;
  scopeOfPracticeNote?: string;
  accessLevel: string;
  readMinutes?: number;
  tags?: string;
  locked?: boolean;
}

export const CATEGORY_LABELS: Record<string, string> = {
  BASICS:          'Strongman Nutrition Basics',
  COMPETITION:     'Competition Nutrition',
  RECOVERY:        'Recovery Nutrition',
  MAKING_WEIGHT:   'Making Weight',
  HYDRATION:       'Hydration',
  SUPPLEMENTS:     'Supplements',
  COACHES_GUIDE:   'Nutrition for Coaches',
  YOUTH_NUTRITION: 'Youth Nutrition',
  DOWNLOADS:       'Downloads',
};

export const CATEGORY_SLUG: Record<string, string> = {
  BASICS:          'basics',
  COMPETITION:     'competition',
  RECOVERY:        'recovery',
  MAKING_WEIGHT:   'making_weight',
  HYDRATION:       'hydration',
  SUPPLEMENTS:     'supplements',
  COACHES_GUIDE:   'coaches_guide',
  YOUTH_NUTRITION: 'youth_nutrition',
  DOWNLOADS:       'downloads',
};

function readEmbeddedEatStrongArticle(slug: string | undefined): Article | null {
  if (typeof document === 'undefined' || !slug) return null;
  const el = document.getElementById('__ES_EATSTRONG_ARTICLE__');
  if (!el) return null;
  try {
    const data = JSON.parse(el.textContent || '');
    if (data && data.slug === slug) return data.article as Article;
  } catch {}
  return null;
}

/** Content-only render — used by the SSR prerender script via renderShell. */
export function EatStrongArticleContent({
  article,
  categorySlug,
  categoryLabel,
}: {
  article: Article;
  categorySlug: string;
  categoryLabel: string;
}) {
  return (
    <main className="flex-1">
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'EatStrong', path: '/eatstrong' },
        { name: categoryLabel, path: `/eatstrong/category/${categorySlug}` },
        { name: article.title, path: `/eatstrong/articles/${article.slug}` },
      ]} />
      {/* Article header */}
      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: '#A41C64' }}>
            <Link to="/eatstrong" className="hover:text-white transition-colors" style={{ color: '#A41C64' }}>EatStrong</Link>
            <span className="text-es-subtle">/</span>
            <Link to={`/eatstrong/category/${categorySlug}`} className="hover:text-white transition-colors" style={{ color: '#A41C64' }}>
              {categoryLabel}
            </Link>
          </nav>
          <div className="mb-3">
            <span className="badge-grey">{categoryLabel}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            {article.title}
          </h1>
          {article.summary && (
            <p className="text-es-muted text-lg leading-relaxed max-w-2xl">{article.summary}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 text-sm text-es-subtle">
            {article.readMinutes && <span>{article.readMinutes} min read</span>}
            {article.reviewerName && (
              <span>
                Reviewed by{' '}
                <strong className="text-es-muted font-semibold">{article.reviewerName}</strong>
                {article.reviewerQualification && ` · ${article.reviewerQualification}`}
              </span>
            )}
            {article.lastReviewedAt && (
              <span>
                Last reviewed:{' '}
                {new Date(article.lastReviewedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>
      {article.scopeOfPracticeNote && (
        <div style={{ background: 'rgba(225,154,71,0.06)', borderBottom: '1px solid rgba(225,154,71,0.2)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-xs leading-relaxed" style={{ color: '#E19A47', opacity: 0.85 }}>{article.scopeOfPracticeNote}</p>
          </div>
        </div>
      )}
      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-none">
          {article.content ? (
            article.content.split('\n').map((para, i) => {
              if (!para.trim()) return <div key={i} className="h-3" />;
              if (para.startsWith('•')) {
                return (
                  <div key={i} className="flex items-start gap-2 my-1.5 ml-4">
                    <span className="mt-1 text-xs flex-shrink-0" style={{ color: '#A41C64' }}>—</span>
                    <span className="text-es-muted leading-relaxed text-base">{para.slice(1).trim()}</span>
                  </div>
                );
              }
              if (para.endsWith(':') && para.length < 80 && !para.startsWith(' ')) {
                return <h3 key={i} className="text-base font-black text-white mt-8 mb-3">{para}</h3>;
              }
              return <p key={i} className="text-es-muted leading-relaxed my-3 text-base">{para}</p>;
            })
          ) : article.locked ? (
            <div className="rounded-xl p-6" style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.2)' }}>
              <p className="font-bold text-white mb-2">Go deeper inside EatStrong.</p>
              <p className="text-es-muted text-sm leading-relaxed mb-4">
                Full meal planning templates, advanced nutrition guidance and learner resources sit inside the paid pathway.
              </p>
              <p className="text-xs text-es-subtle mb-4">
                This is a free overview. Full tutor guided learning, templates and assessment support sit inside the learner pathway.
              </p>
              <Link to="/register-interest?type=general" className="text-sm font-semibold" style={{ color: '#A41C64' }}>
                Register your interest →
              </Link>
            </div>
          ) : (
            <p className="text-es-subtle italic text-sm">Content coming soon.</p>
          )}
        </div>
        {article.tags && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.split(',').map(tag => (
              <span key={tag} className="badge-grey">{tag.trim()}</span>
            ))}
          </div>
        )}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2C2C2C' }}>
          <h3 className="font-bold text-es-muted mb-4 text-sm uppercase tracking-wide">Related resources</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to={`/eatstrong/category/${categorySlug}`} className="flex items-center gap-3 es-card p-4 hover:border-es-accent transition-colors">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}>
                <svg className="w-4 h-4" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-es-subtle mb-0.5">More in</p>
                <p className="text-sm font-semibold text-white">{categoryLabel}</p>
              </div>
            </Link>
            <Link to="/courses" className="flex items-center gap-3 es-card p-4 hover:border-es-accent transition-colors">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.2)' }}>
                <svg className="w-4 h-4 text-es-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-es-subtle mb-0.5">Continue your development</p>
                <p className="text-sm font-semibold text-white">Coaching Qualifications</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-4 text-sm">
          <Link to={`/eatstrong/category/${categorySlug}`} className="font-medium flex items-center gap-1" style={{ color: '#A41C64' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {categoryLabel}
          </Link>
          <span className="text-es-subtle">·</span>
          <Link to="/eatstrong" className="text-es-subtle hover:text-es-muted">EatStrong hub</Link>
        </div>
      </div>
    </main>
  );
}

export default function EatStrongArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(() => readEmbeddedEatStrongArticle(slug));
  const [loading, setLoading] = useState(article === null);
  const [notFound, setNotFound] = useState(false);

  useDocumentHead({
    title: article?.title || 'Article Not Found',
    description: article?.summary,
    canonical: slug ? `${SITE_URL}/eatstrong/articles/${slug}` : undefined,
  });

  useEffect(() => {
    if (!slug || article !== null) return; // eslint-disable-line react-hooks/exhaustive-deps
    setLoading(true);
    api
      .get(`/be-strong/articles/${slug}`)
      .then(res => setArticle(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Article schema — only once the real article has loaded, and only for
  // fields actually shown on the page (no invented author/date/publisher
  // fields beyond what the article record itself provides).
  useEffect(() => {
    if (!article || !slug) return;
    const scriptId = 'eatstrong-article-schema';
    const url = `${SITE_URL}/eatstrong/articles/${slug}`;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary || undefined,
      url,
      author: article.authorName ? { '@type': 'Person', name: article.authorName } : undefined,
      dateModified: article.lastReviewedAt || undefined,
      publisher: {
        '@type': 'Organization',
        name: 'Educate Strong Academy',
        sameAs: `${SITE_URL}/`,
      },
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [article, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-es-muted text-sm">
          Loading article...
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-2">Article not found</h2>
            <Link to="/eatstrong" className="text-sm font-medium" style={{ color: '#A41C64' }}>
              Back to EatStrong
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categorySlug = CATEGORY_SLUG[article.category] || article.category.toLowerCase();
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <EatStrongArticleContent
        article={article}
        categorySlug={categorySlug}
        categoryLabel={categoryLabel}
      />
      <Footer />
    </div>
  );
}
