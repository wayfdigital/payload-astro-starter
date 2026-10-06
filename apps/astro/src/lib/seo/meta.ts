/**
 * Pure helpers that turn page data + site settings into the values the `<Seo>`
 * component renders. No fetching here — callers pass in the already-loaded
 * `SiteSetting` (see `lib/payload/site-settings.ts`).
 */
import type { Media, SiteSetting } from '@repo/payload-types'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../../i18n/locales'
import { ADMIN_ORIGIN } from '../preview-env'
import { isNonPublicUrl, resolveSiteUrl } from './site-url.mjs'

/**
 * Public origin of this site, used to build absolute canonical / OG URLs. `astro dev`
 * falls back to http://localhost:3000. astro.config.mjs has already stopped any
 * production build whose environment lacks a public https origin; resolving it again
 * here normalises the value and keeps the rule in the runtime bundle. See
 * `./site-url.mjs`.
 */
export const SITE_URL = resolveSiteUrl(import.meta.env.ASTRO_PUBLIC_SITE_URL, {
  production: import.meta.env.PROD,
})

/** Joins a path onto the public site origin, yielding an absolute URL. */
export const absoluteUrl = (path: string): string =>
  `${SITE_URL}/${path.replace(/^\//, '')}`

/**
 * Absolutizes a Payload media URL. S3-backed uploads are already absolute; local
 * uploads are relative to the Payload origin (which serves the file), so we prefix
 * those with {@link ADMIN_ORIGIN}. In production a URL on a local or private host
 * (the dev fallback for ADMIN_ORIGIN, or a Payload `serverURL` left on localhost)
 * returns `null`, so the page omits the image instead of advertising that host.
 */
export const absoluteMediaUrl = (url: string): string | null => {
  const path = url.startsWith('/') ? url : `/${url}`
  const absolute = /^https?:\/\//.test(url) ? url : `${ADMIN_ORIGIN}${path}`
  if (import.meta.env.PROD && isNonPublicUrl(absolute)) return null
  return absolute
}

/** A populated Media object, or `null`/an unpopulated id, as relationships arrive. */
type MediaRef = (string | null | undefined) | Media

const isMedia = (value: MediaRef): value is Media =>
  typeof value === 'object' && value !== null

/**
 * Resolves the best Open Graph image: the page's own image (1200×630 `og` size
 * preferred), falling back to the site-wide default. Returns an absolute URL or
 * `null` when neither is set.
 */
export const ogImageUrl = (
  pageImage: MediaRef,
  settings: SiteSetting | null,
): string | null => resolveOgImage(pageImage, settings)?.url ?? null

interface ResolvedOgImage {
  url: string
  alt: string | null
  width: number | null
  height: number | null
  type: string | null
}

const resolveOgImage = (
  pageImage: MediaRef,
  settings: SiteSetting | null,
): ResolvedOgImage | null => {
  const pick = (m: MediaRef): ResolvedOgImage | null => {
    if (!isMedia(m)) return null
    const image = m.sizes?.og
    const source = image?.url ?? m.url
    const url = source ? absoluteMediaUrl(source) : null
    if (!url) return null
    return {
      url,
      alt: m.alt?.trim() || null,
      width: image?.width ?? m.width ?? null,
      height: image?.height ?? m.height ?? null,
      type: image?.mimeType ?? m.mimeType ?? null,
    }
  }
  return pick(pageImage) ?? pick(settings?.defaultOgImage) ?? null
}

/**
 * Builds the `<title>` from the page title and the site's template
 * (`%s` → page title, `%siteName%` → site name). Falls back to `"page · site"`,
 * then to the bare page title.
 */
export const resolveTitle = (
  pageTitle: string,
  settings: SiteSetting | null,
): string => {
  const siteName = settings?.siteName?.trim() || null
  const template = settings?.titleTemplate?.trim()
  if (template && (!template.includes('%siteName%') || siteName)) {
    return template.replaceAll('%s', pageTitle).replaceAll('%siteName%', siteName ?? '').trim()
  }
  return siteName ? `${pageTitle} · ${siteName}` : pageTitle
}

/** Resolves the meta description, falling back to the site-wide default. */
export const resolveDescription = (
  pageDescription: string | null | undefined,
  settings: SiteSetting | null,
): string => (pageDescription?.trim() || settings?.defaultDescription?.trim() || '')

/**
 * The locale-prefixed path for a non-localized slug, matching the repo's routing
 * (`/about` = en, `/pl/about` = pl). The home page has an empty slug.
 */
export const localizedPath = (slug: string, locale: Locale): string => {
  const clean = slug.replace(/^\//, '')
  const base = locale === DEFAULT_LOCALE ? `/${clean}` : `/${locale}/${clean}`
  return base.replace(/\/$/, '') || '/'
}

export interface HreflangAlternate {
  hreflang: string
  href: string
}

/** Fully-resolved SEO values handed to the `<Seo>` component. */
export interface ResolvedSeo {
  title: string
  description: string
  canonical: string
  ogImage: string | null
  ogImageAlt: string | null
  ogImageWidth: number | null
  ogImageHeight: number | null
  ogImageType: string | null
  ogType: 'website' | 'article'
  locale: Locale
  siteName: string | null
  twitterHandle: string | null
  alternates: HreflangAlternate[]
  noindex: boolean
}

/**
 * Merges page-level fields with site-wide settings into the final tag values.
 * One call per page render keeps the three page files free of resolution logic.
 */
export const buildSeo = (
  input: {
    title: string
    description?: string | null
    image?: MediaRef
    /** Non-localized slug; `''` for the home page. Drives canonical + hreflang. */
    slug: string
    locale: Locale
    type?: 'website' | 'article'
    /** Static/social image override, useful for pages that do not load CMS settings. */
    socialImage?: {
      src: string
      alt: string
      width?: number
      height?: number
      type?: string
    }
    /** Site name override for static pages that do not load CMS settings. */
    siteName?: string
    /** Limit hreflang to locales that have a real, indexable page. */
    alternateLocales?: readonly Locale[]
    /** Force noindex (drafts, 404s) on top of the site-wide robots switch. */
    noindex?: boolean
  },
  settings: SiteSetting | null,
): ResolvedSeo => {
  const image = input.socialImage
    ? {
        url: /^https?:\/\//.test(input.socialImage.src)
          ? input.socialImage.src
          : absoluteUrl(input.socialImage.src),
        alt: input.socialImage.alt,
        width: input.socialImage.width ?? null,
        height: input.socialImage.height ?? null,
        type: input.socialImage.type ?? null,
      }
    : resolveOgImage(input.image, settings)

  return {
    title: resolveTitle(input.title, settings),
    description: resolveDescription(input.description, settings),
    canonical: absoluteUrl(localizedPath(input.slug, input.locale)),
    ogImage: image?.url ?? null,
    ogImageAlt: image?.alt ?? null,
    ogImageWidth: image?.width ?? null,
    ogImageHeight: image?.height ?? null,
    ogImageType: image?.type ?? null,
    ogType: input.type ?? 'website',
    locale: input.locale,
    siteName: input.siteName?.trim() || settings?.siteName || null,
    twitterHandle: settings?.twitterHandle ?? null,
    alternates: hreflangAlternates(input.slug, input.alternateLocales),
    noindex: Boolean(input.noindex) || Boolean(settings?.robots?.noindexSite),
  }
}

/**
 * Builds the hreflang alternate set for a slug across every locale, plus an
 * `x-default` pointing at the default locale. Each URL is absolute and self-
 * referential (the current page appears in its own set), as Google requires.
 */
export const hreflangAlternates = (
  slug: string,
  locales: readonly Locale[] = LOCALES,
): HreflangAlternate[] => {
  const alternates = locales.map((locale) => ({
    hreflang: locale,
    href: absoluteUrl(localizedPath(slug, locale)),
  }))
  return [
    ...alternates,
    { hreflang: 'x-default', href: absoluteUrl(localizedPath(slug, DEFAULT_LOCALE)) },
  ]
}
