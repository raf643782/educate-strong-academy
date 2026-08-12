# Wix → Educate Strong Academy: URL Redirect Map

Before cutting over DNS, add every Wix URL that should not return a 404
to `frontend/vercel.json` under `"redirects"`. Vercel's file-system
routing handles the destination — a 301 redirect from an old Wix slug to
the matching new Academy path.

## Format (vercel.json)

```json
{
  "redirects": [
    { "source": "/old-wix-path", "destination": "/new-academy-path", "permanent": true }
  ]
}
```

`permanent: true` emits HTTP 308 (Permanent Redirect), which passes link
equity and updates bookmarks/cached URLs. Use `permanent: false` (307)
only for URLs you expect to change again.

---

## Known redirects to implement

Verify each source path by crawling the live Wix site before cutover.
Mark the **Status** column once confirmed.

| Wix source path | New destination | Notes | Status |
|---|---|---|---|
| `/` | `/` | Homepage | — |
| `/about` | `/about` | About page | — |
| `/courses` | `/courses` | Course catalogue | — |
| `/coaching` | `/coaching` | Coaching pathway | — |
| `/refereeing` | `/courses/level-1-strongman-refereeing` | Refereeing course | — |
| `/strongkidz` | `/strongkidz` | StrongKidz page | — |
| `/knowledge` | `/knowledge` | Knowledge Hub | — |
| `/exercises` | `/exercises` | Exercise Library | — |
| `/events` | `/events` | Event Library | — |
| `/eatstrong` | `/eatstrong` | EatStrong hub | — |
| `/contact` | `/register-interest` | Contact → Register Interest | — |
| `/shop` | `/shop` | Shop (if live on Wix) | — |
| `/privacy-policy` | `/privacy` | Privacy Policy | — |
| `/terms-and-conditions` | `/terms` | Terms | — |
| `/refund-policy` | `/refund-policy` | Refund Policy | — |
| `/coaches` | `/coaches` | Certified Coaches directory | — |

### Wix Blog posts (if any)

If the Wix site had a blog at `/blog/post-slug`, each post needs a
redirect. List them here once crawled:

| Wix blog URL | Best matching new URL | Notes |
|---|---|---|
| *(crawl Wix to discover)* | | |

---

## How to apply

1. Add all confirmed redirects to `frontend/vercel.json` under the
   `"redirects"` array (create the key if it doesn't exist yet — the
   current file only has `"headers"` and `"rewrites"`).
2. Deploy the branch `seo/critical_technical_closure` to preview on
   Vercel (`vercel deploy --prebuilt` or open a PR).
3. Test all redirects in the preview deployment before DNS cutover.
4. After confirming, proceed with the domain cutover checklist.

---

## Sitemap note

`frontend/scripts/prerender.mjs` already filters redirect source paths
out of `sitemap.xml` (via `getRedirectSourcePaths()`), so once a
redirect is added to `vercel.json`, its source URL will automatically
be excluded from the sitemap on the next build.
