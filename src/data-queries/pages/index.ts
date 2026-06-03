import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LOCALE_CODES, type Locale } from '@/i18n/const'
import type { Page } from '@/payload-types'
import { collectLocalizedSlugValues } from './localized-slugs'

/** Cache tag for the full list of public page routes; invalidate when any page list changes. */
export const PAGES_LIST_CACHE_TAG = 'pages:list'

/** Prefix for `unstable_cache` tags keyed by Payload page document id (localized slug map). */
export const PAGE_BY_ID_TAG_PREFIX = 'page:id:'

export const pageByIdCacheTag = (id: string | number): string => {
  return `${PAGE_BY_ID_TAG_PREFIX}${id}`
}

/** Loads one published page document from Payload by slug and locale (uncached). */
const fetchPageBySlug = async (locale: Locale, slug: string): Promise<Page | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    depth: 2,
  })

  return (docs[0]) ?? null
}

/** Returns a page by slug for `locale`, backed by `unstable_cache` and tag `page:${locale}:${slug}`. */
export const getCachedPageBySlug = async (
  locale: Locale,
  slug: string
): Promise<Page | null> => {
  const cached = unstable_cache(
    async () => fetchPageBySlug(locale, slug),
    ['page-by-slug', locale, slug],
    { revalidate: false, tags: [`page:${locale}:${slug}`] }
  )
  return cached()
}

const fetchLocalizedSlugsByPageId = async (
  id: string
): Promise<Partial<Record<Locale, string>>> => {
  const payload = await getPayload({ config })
  const doc = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    locale: 'all',
  })
  return collectLocalizedSlugValues(doc.slug, LOCALE_CODES)
}

/** Cached per-locale slugs for a page document (`findByID` + `locale: 'all'`). */
export const getCachedLocalizedSlugsByPageId = async (
  id: string
): Promise<Partial<Record<Locale, string>>> => {
  const cached = unstable_cache(
    async () => fetchLocalizedSlugsByPageId(id),
    ['page-localized-slugs', id],
    {
      revalidate: false,
      tags: [pageByIdCacheTag(id), PAGES_LIST_CACHE_TAG],
    }
  )
  return cached()
}

/**
 * Resolves the current CMS page, then returns all localized slug values for that document.
 * Returns `null` when no published page matches `locale` + `slug`.
 */
export const getCachedLocalizedSlugsForPath = async (
  locale: Locale,
  slug: string
): Promise<Partial<Record<Locale, string>> | null> => {
  const page = await getCachedPageBySlug(locale, slug)
  if (page?.id == null) {
    return null
  }
  return getCachedLocalizedSlugsByPageId(page.id)
}
