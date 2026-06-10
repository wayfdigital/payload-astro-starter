/**
 * Pure helpers that turn page data + site settings into the values the `<Seo>`
 * component renders. No fetching here — callers pass in the already-loaded
 * `SiteSetting` (see `lib/payload/site-settings.ts`).
 */
import type { Media, SiteSetting } from '@repo/payload-types'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../../i18n/locales'
import { ADMIN_ORIGIN } from '../preview-env'

/** Public origin of this site, used to build absolute canonical / OG URLs. */
export const SITE_URL = (
  import.meta.env.ASTRO_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

/** Joins a path onto the public site origin, yielding an absolute URL. */
export const absoluteUrl = (path: string): string =>
  `${SITE_URL}/${path.replace(/^\//, '')}`

/**
 * Absolutizes a Payload media URL. S3-backed uploads are already absolute; local
 * uploads are relative to the Payload origin (which serves the file), so we prefix
 * those with {@link ADMIN_ORIGIN}.
 */
const absoluteMediaUrl = (url: string): string =>
  /^https?:\/\//.test(url) ? url : `${ADMIN_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`

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
): string | null => {
  const pick = (m: MediaRef): string | null => {
    if (!isMedia(m)) return null
    const url = m.sizes?.og?.url ?? m.url
    return url ? absoluteMediaUrl(url) : null
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
  const siteName = settings?.siteName?.trim()
  const template = settings?.titleTemplate?.trim()
  if (template) {
    return template.replace(/%s/g, pageTitle).replace(/%siteName%/g, siteName ?? '').trim()
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

/**
 * Builds the hreflang alternate set for a slug across every locale, plus an
 * `x-default` pointing at the default locale. Each URL is absolute and self-
 * referential (the current page appears in its own set), as Google requires.
 */
export const hreflangAlternates = (slug: string): HreflangAlternate[] => {
  const alternates = LOCALES.map((locale) => ({
    hreflang: locale,
    href: absoluteUrl(localizedPath(slug, locale)),
  }))
  return [
    ...alternates,
    { hreflang: 'x-default', href: absoluteUrl(localizedPath(slug, DEFAULT_LOCALE)) },
  ]
}
