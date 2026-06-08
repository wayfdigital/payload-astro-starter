import type { Page } from '@repo/payload-types'
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales'
import { payloadFetch } from './client'

interface PaginatedDocs<T> {
  docs: T[]
}

/**
 * Loads one page by slug for a locale via the Payload REST API.
 * `depth=2` populates relationships (block images, the form on a FormBlock).
 * Returns `null` when no page matches or the API is unreachable.
 */
export const getPageBySlug = async (
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Page | null> => {
  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    locale,
    depth: '2',
    limit: '1',
  })

  try {
    const { docs } = await payloadFetch<PaginatedDocs<Page>>(`/api/pages?${params.toString()}`)
    return docs[0] ?? null
  } catch {
    return null
  }
}

/**
 * Lists all pages (slugs only) for building navigation / the home index.
 * Returns `[]` on error so callers can render an empty state.
 */
export const getAllPages = async (locale: Locale = DEFAULT_LOCALE): Promise<Page[]> => {
  const params = new URLSearchParams({ locale, depth: '0', limit: '100' })

  try {
    const { docs } = await payloadFetch<PaginatedDocs<Page>>(`/api/pages?${params.toString()}`)
    return docs
  } catch {
    return []
  }
}
