// Pattern: a cached, tag-invalidated Local-API read for server components.
// Tags are defined ONCE here and imported by collection hooks for invalidation.
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Locale } from '@/i18n/const'
import type { Page } from '@/payload-types'

export const PAGES_LIST_CACHE_TAG = 'pages:list'
export const pageBySlugTag = (locale: Locale, slug: string) => `page:${locale}:${slug}`

// Uncached fetch — the single source of the actual query.
async function fetchPageBySlug(locale: Locale, slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

// Cached wrapper — keyed + tagged so hooks can `revalidateTag(pageBySlugTag(...))`.
export async function getCachedPageBySlug(locale: Locale, slug: string): Promise<Page | null> {
  return unstable_cache(() => fetchPageBySlug(locale, slug), ['page-by-slug', locale, slug], {
    tags: [pageBySlugTag(locale, slug), PAGES_LIST_CACHE_TAG],
  })()
}

// Usage in a Server Component:
//   const page = await getCachedPageBySlug(locale, params.slug)
//   if (!page) notFound()
