/**
 * schema.org JSON-LD builders. Each returns a plain object that `<JsonLd>` serializes
 * into a `<script type="application/ld+json">`. Keep these pure (no fetching).
 *
 * ACTIVE builders use data that exists today (Pages + SiteSettings + nested-docs
 * breadcrumbs). The DEFERRED builders at the bottom are templates for content types
 * this starter does not have yet (Products, Posts/Blog, FAQ) — see the
 * `seo-structured-data` skill for when and how to wire them up.
 */
import type { Media, SiteSetting } from '@repo/payload-types'
import type { Locale } from '../../i18n/locales'
import { SITE_URL, absoluteMediaUrl, absoluteUrl, localizedPath } from './meta'

type Json = Record<string, unknown>
type MediaRef = (string | null | undefined) | Media

const mediaUrl = (m: MediaRef): string | undefined =>
  typeof m === 'object' && m !== null && m.url ? absoluteMediaUrl(m.url) : undefined

// ---------------------------------------------------------------------------
// ACTIVE — emitted today
// ---------------------------------------------------------------------------

/** Site-level WebSite node (home page). Enables the sitelinks search box if wired. */
export const websiteSchema = (
  settings: SiteSetting | null,
  fallbackName?: string,
): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: settings?.siteName ?? fallbackName,
  url: SITE_URL,
})

interface OrganizationFallback {
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}

/** Organization node from SiteSettings → Organization (home page). */
export const organizationSchema = (
  settings: SiteSetting | null,
  fallback?: OrganizationFallback,
): Json | null => {
  const org = settings?.organization
  const name = org?.legalName ?? settings?.siteName ?? fallback?.name
  if (!name) return null

  const sameAs = org?.sameAs
    ? org.sameAs.map((entry) => entry.url).filter((url): url is string => Boolean(url))
    : (fallback?.sameAs ?? [])

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: fallback?.url ?? SITE_URL,
    logo: mediaUrl(org?.logo) ?? fallback?.logo,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }
}

/** A single content page. */
export const webPageSchema = (input: {
  title: string
  description?: string
  url: string
  image?: string | null
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: input.title,
  description: input.description || undefined,
  url: input.url,
  primaryImageOfPage: input.image || undefined,
})

type Breadcrumb = { doc?: unknown; url?: string | null; label?: string | null }

/**
 * BreadcrumbList from the nested-docs `breadcrumbs` array on a Page. Each crumb's
 * `url` is a non-localized slug-path; we localize + absolutize it. Returns `null`
 * when there are fewer than two crumbs (a single item isn't a useful breadcrumb).
 */
export const breadcrumbSchema = (
  breadcrumbs: Breadcrumb[] | null | undefined,
  locale: Locale,
): Json | null => {
  const crumbs = (breadcrumbs ?? []).filter((c) => c.label)
  if (crumbs.length < 2) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: crumb.url ? absoluteUrl(localizedPath(crumb.url, locale)) : undefined,
    })),
  }
}

// ---------------------------------------------------------------------------
// DEFERRED — templates for content types this starter does not have yet.
// Do NOT import these until the matching collection exists. See the
// `seo-structured-data` skill for the activation checklist + required fields.
// ---------------------------------------------------------------------------

/**
 * Product node — ACTIVATE when a `products` collection is added.
 * Required by Google: name, image, and an `offers` block with price + currency +
 * availability. Add `aggregateRating` / `review` only with real, on-page reviews.
 */
export const productSchema = (input: {
  name: string
  description?: string
  image?: string | null
  url: string
  price?: number | string
  currency?: string // ISO 4217, e.g. 'PLN', 'EUR'
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  sku?: string
  brand?: string
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: input.name,
  description: input.description || undefined,
  image: input.image || undefined,
  sku: input.sku || undefined,
  brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
  offers:
    input.price !== undefined
      ? {
          '@type': 'Offer',
          url: input.url,
          price: String(input.price),
          priceCurrency: input.currency,
          availability: `https://schema.org/${input.availability ?? 'InStock'}`,
        }
      : undefined,
})

/**
 * Article / BlogPosting node — ACTIVATE when a `posts` (blog) collection is added.
 * Required: headline, image, datePublished, author.
 */
export const articleSchema = (input: {
  headline: string
  description?: string
  image?: string | null
  url: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: input.headline,
  description: input.description || undefined,
  image: input.image || undefined,
  url: input.url,
  datePublished: input.datePublished || undefined,
  dateModified: input.dateModified || input.datePublished || undefined,
  author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
})

/**
 * FAQPage node — ACTIVATE when an FAQ block/collection exists. Only use on pages
 * that actually display the Q&A to users (Google policy).
 */
export const faqSchema = (qa: { question: string; answer: string }[]): Json | null => {
  if (!qa.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
