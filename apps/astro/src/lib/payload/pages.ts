import type { Page } from '@repo/payload-types'
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales'
import { payloadFetch } from './client'

interface PaginatedDocs<T> {
  docs: T[]
}

/** Options for page reads. `draft` switches to authenticated draft (preview) fetches. */
interface PageFetchOptions {
  draft?: boolean
}

/**
 * Loads one page by slug for a locale via the Payload REST API.
 * `depth=2` populates relationships (block images, the form on a FormBlock).
 * When `draft` is set, fetches the latest draft with the Admins API key (preview).
 * Returns `null` when no page matches or the API is unreachable.
 */
export const getPageBySlug = async (
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
  { draft = false }: PageFetchOptions = {},
): Promise<Page | null> => {
  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    locale,
    depth: '2',
    limit: '1',
  })
  if (draft) params.set('draft', 'true')

  try {
    const { docs } = await payloadFetch<PaginatedDocs<Page>>(
      `/api/pages?${params.toString()}`,
      undefined,
      { draft },
    )
    return docs[0] ?? null
  } catch {
    return null
  }
}

/**
 * Loads the page marked as the home page (`isHomePage: true`) for a locale.
 * When `draft` is set, fetches the latest draft with the Admins API key (preview).
 * Returns `null` when no home page is set or the API is unreachable.
 */
export const getHomePage = async (
  locale: Locale = DEFAULT_LOCALE,
  { draft = false }: PageFetchOptions = {},
): Promise<Page | null> => {
  const params = new URLSearchParams({
    'where[isHomePage][equals]': 'true',
    locale,
    depth: '2',
    limit: '1',
  })
  if (draft) params.set('draft', 'true')

  try {
    const { docs } = await payloadFetch<PaginatedDocs<Page>>(
      `/api/pages?${params.toString()}`,
      undefined,
      { draft },
    )
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
