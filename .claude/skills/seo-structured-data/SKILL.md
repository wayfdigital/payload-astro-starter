---
name: seo-structured-data
description: Fires when a page/section is built or a new collection is added, or on any "add structured data / rich results / improve SEO on this page" request. Detects which collections exist, then emits only the JSON-LD that the available data supports — WebSite/Organization/WebPage/BreadcrumbList today; Product/Article/FAQ deferred until their collection exists. Knows this repo's exact SEO files (lib/seo, components/seo, SiteSettings global). Complements the generic seo-audit skill.
---

# SEO structured data (this repo)

The SEO foundation already exists in `apps/astro/`. This skill is the **decision layer**:
given a page or a new content type, work out **which schema.org JSON-LD applies**, emit only
what the data supports, and record the rest as *deferred* — never invent fields that have no
source. For a general best-practices crawl (titles, speed, hreflang errors, indexation) use the
generic **seo-audit** skill instead; this one is about *what to render and when*.

## The SEO layer (read these first)

| File | Role |
|---|---|
| `apps/astro/src/lib/seo/meta.ts` | `buildSeo()` (resolves title/description/canonical/og/hreflang/noindex), `SITE_URL`, `absoluteUrl`, `localizedPath`, `hreflangAlternates`, `ogImageUrl`. |
| `apps/astro/src/lib/seo/jsonld.ts` | Schema builders. **Active:** `websiteSchema`, `organizationSchema`, `webPageSchema`, `breadcrumbSchema`. **Deferred templates:** `productSchema`, `articleSchema`, `faqSchema`. |
| `apps/astro/src/components/seo/Seo.astro` | Renders the `<head>` meta block from a `ResolvedSeo`. |
| `apps/astro/src/components/seo/JsonLd.astro` | Serializes a schema object/array into `<script type="application/ld+json">` (drops nullish, escapes `<`). |
| `apps/astro/src/components/seo/CustomCode.astro` | Injects admin-authored raw code (Site Settings → Custom Code). |
| `apps/astro/src/lib/payload/site-settings.ts` | `getSiteSettings(locale)` — site name, default OG image, Organization, robots, custom code. |
| `apps/payload/src/payload/globals/SiteSettings.ts` | The CMS source of site-wide SEO defaults. |
| `apps/astro/src/pages/sitemap.xml.ts` · `robots.txt.ts` | CMS-aware sitemap + dynamic robots. |

Data already available to feed schema: per-page `meta.{title,description,image}` (plugin-seo), the
`og` 1200×630 Media size, `nested-docs` `breadcrumbs` on every Page, and the `FooterSettings` /
`SiteSettings` Organization data.

## Step 1 — detect what exists (never assume)

```bash
ls apps/payload/src/payload/collections/   # Pages, Media, Users, Admins today
grep -n "collections:" apps/payload/src/payload.config.ts
```

## Step 2 — the conditional matrix

| Condition (collection / block present) | Emit | If absent |
|---|---|---|
| Always (Pages + SiteSettings) | `websiteSchema` + `organizationSchema` on home; `webPageSchema` + `breadcrumbSchema` on content pages | — |
| `products` collection | `productSchema` (name, image, `offers` → price + ISO-4217 currency + availability; add `aggregateRating` only with real on-page reviews) | **Deferred — say so explicitly; do not fabricate a Product node** |
| `posts` / blog collection | `articleSchema` (headline, image, datePublished, author) + set `ogType: 'article'` | Deferred |
| FAQ block on a page | `faqSchema` — only when the Q&A is visible to users | Deferred |
| Events collection | `Event` (add a builder following the same shape) | Deferred |

**Rule:** if the source data does not exist, report the schema as *deferred* with the exact fields
it will need — do **not** emit an empty or guessed node. The deferred builders in `jsonld.ts`
already document their required inputs.

## Step 3 — wire it (when a condition is met)

1. The builder usually already exists in `jsonld.ts`. For a brand-new type, add a builder there
   following the existing pure-function shape (return a plain object; `undefined` keys drop out).
2. In the page/route, add the schema object to the `jsonLd` array passed to `<Layout>`. Build URLs
   with `absoluteUrl(localizedPath(slug, locale))`; never hardcode the origin.
3. If the new type needs new CMS fields (e.g. `price` on a product), that is a **schema change** →
   run **payload-migrations** (`generate:types` → `migrate:create` → `migrate`) and commit the
   migration. See [[website-layout-sections]] for the block/collection pipeline.

## Step 4 — verify

- View source: the JSON-LD `<script>` is present and the JSON parses.
- Validate against Google's **Rich Results Test** (renders JS, unlike `curl`/`web_fetch`).
- Confirm `canonical`, `og:image`, and the `hreflang` set are correct for the locale.

## Per-page checklist (quick audit)

Title 50–60 chars · description 150–160 · exactly one `<h1>` · canonical present & self-referential
per locale · `og:image` resolves absolutely · `hreflang` includes self + `x-default` · `noindex` on
drafts/404 · page appears in `/sitemap.xml`. Deeper diagnostics → **seo-audit** skill.

## Related skills

- **seo-audit** — generic SEO framework (crawlability, Core Web Vitals, on-page, international).
- **payload-migrations** — required whenever a new content type adds CMS fields.
- **website-layout-sections** — the block/section build pipeline; run an SEO/structured-data pass after a new section or collection ships.
