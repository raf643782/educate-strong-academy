import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  accessLevel: string;
  readMinutes?: number;
  reviewerName?: string;
}

interface Download {
  id: string;
  title: string;
  slug: string;
  category: string;
  fileType: string;
  isPublished: boolean;
  accessLevel: string;
}

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalDownloads: number;
  featuredArticles: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  BASICS:          'Nutrition Basics',
  COMPETITION:     'Competition',
  RECOVERY:        'Recovery',
  MAKING_WEIGHT:   'Making Weight',
  HYDRATION:       'Hydration',
  SUPPLEMENTS:     'Supplements',
  COACHES_GUIDE:   "Coaches' Guide",
  YOUTH_NUTRITION: 'Youth Nutrition',
  DOWNLOADS:       'Downloads',
};

export default function BeStrongManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'articles' | 'downloads'>('articles');
  const [updating, setUpdating] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/be-strong/admin/articles'),
      api.get('/be-strong/admin/downloads'),
      api.get('/be-strong/admin/stats'),
    ]).then(([artRes, dlRes, statsRes]) => {
      setArticles(artRes.data);
      setDownloads(dlRes.data);
      setStats(statsRes.data);
    }).catch(() => setLoadError(true)).finally(() => setLoading(false));
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    setUpdating(id);
    setActionError(null);
    try {
      await api.put(`/be-strong/admin/articles/${id}`, { isPublished: !current });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, isPublished: !current } : a));
    } catch { setActionError('Unable to save changes. Please try again.'); } finally { setUpdating(null); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setUpdating(id);
    setActionError(null);
    try {
      await api.put(`/be-strong/admin/articles/${id}`, { isFeatured: !current });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, isFeatured: !current } : a));
    } catch { setActionError('Unable to save changes. Please try again.'); } finally { setUpdating(null); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)', paddingTop: 'calc(var(--navbar-height,72px) + 24px)', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                <Link to="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Admin</Link> › EatStrong
              </p>
              <h1 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, margin: 0, color: '#fff' }}>EatStrong Content Manager</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' }}>Manage nutrition articles, downloads, and featured content.</p>
            </div>
            <Link
              to="/eatstrong"
              style={{ fontSize: '13px', fontWeight: 600, color: '#C2186A', border: '1px solid rgba(194,24,106,0.3)', borderRadius: '8px', padding: '8px 14px', textDecoration: 'none' }}
            >
              View EatStrong →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {loadError && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
            Failed to load content. Please refresh and try again.
          </div>
        )}

        {actionError && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total Articles', value: stats.totalArticles },
              { label: 'Published', value: stats.publishedArticles },
              { label: 'Featured', value: stats.featuredArticles },
              { label: 'Downloads', value: stats.totalDownloads },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content' }}>
          {(['articles', 'downloads'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 16px', borderRadius: '7px', fontSize: '13px', fontWeight: 600,
                background: tab === t ? '#A41C64' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.45)',
                border: 'none', cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Articles table */}
        {tab === 'articles' && (
          <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Articles</span>
              <button
                disabled
                style={{ fontSize: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', cursor: 'not-allowed' }}
                title="Article editor coming soon"
              >
                + Add Article
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Loading...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#111116' }}>
                      <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Title</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Access</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured</th>
                      <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Published</th>
                      <th style={{ textAlign: 'right', padding: '10px 20px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr
                        key={article.id}
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <p style={{ fontWeight: 600, color: '#fff', fontSize: '13px', margin: '0 0 2px', lineHeight: 1.4 }}>{article.title}</p>
                          {article.reviewerName && (
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Reviewed by {article.reviewerName}</p>
                          )}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#E19A47', background: 'rgba(225,154,71,0.12)', borderRadius: '6px', padding: '2px 8px' }}>
                            {CATEGORY_LABELS[article.category] || article.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{article.accessLevel}</span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleFeatured(article.id, article.isFeatured)}
                            disabled={updating === article.id}
                            style={{ fontSize: '12px', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', opacity: updating === article.id ? 0.5 : 1, color: article.isFeatured ? '#C2186A' : 'rgba(255,255,255,0.3)' }}
                            title={article.isFeatured ? 'Remove from featured' : 'Add to featured'}
                          >
                            {article.isFeatured ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => togglePublish(article.id, article.isPublished)}
                            disabled={updating === article.id}
                            title={article.isPublished ? 'Unpublish' : 'Publish'}
                            style={{
                              position: 'relative', display: 'inline-flex', alignItems: 'center',
                              width: '36px', height: '20px', borderRadius: '999px',
                              background: article.isPublished ? '#A41C64' : 'rgba(255,255,255,0.12)',
                              border: 'none', cursor: updating === article.id ? 'default' : 'pointer',
                              transition: 'background 0.15s', opacity: updating === article.id ? 0.5 : 1,
                            }}
                          >
                            <span style={{
                              position: 'absolute', left: article.isPublished ? '18px' : '2px',
                              width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s',
                            }} />
                          </button>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <Link
                            to={`/eatstrong/articles/${article.slug}`}
                            style={{ fontSize: '12px', fontWeight: 600, color: '#A41C64', textDecoration: 'none' }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {articles.length === 0 && (
                  <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                    No articles found. Run the database seed to populate EatStrong content.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Downloads table */}
        {tab === 'downloads' && (
          <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Downloads &amp; Templates</span>
            </div>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Loading...</div>
            ) : (
              <div>
                {downloads.map(dl => (
                  <div key={dl.id} style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#E19A47', background: 'rgba(225,154,71,0.12)', borderRadius: '6px', padding: '2px 8px' }}>
                          {CATEGORY_LABELS[dl.category] || dl.category}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1px 6px' }}>{dl.fileType}</span>
                        {dl.accessLevel === 'FREE' && (
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#C2186A' }}>Free</span>
                        )}
                      </div>
                      <p style={{ fontWeight: 600, color: '#fff', fontSize: '13px', margin: 0 }}>{dl.title}</p>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                      background: dl.isPublished ? 'rgba(164,28,100,0.15)' : 'rgba(255,255,255,0.06)',
                      color: dl.isPublished ? '#C2186A' : 'rgba(255,255,255,0.35)',
                    }}>
                      {dl.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
                {downloads.length === 0 && (
                  <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No downloads found.</div>
                )}
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '20px' }}>
          Full article and download editing is in development. Use the toggles above to publish or feature articles.
        </p>
      </div>
    </div>
  );
}
