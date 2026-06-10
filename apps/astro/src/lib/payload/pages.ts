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
 * Fetches the first page matching `where` for a locale.
 * `depth=2` populates relationships (block images, the form on a FormBlock).
 *
 * In `draft` (preview) mode we ask Payload for the latest draft using the Admins
 * API key. If that finds nothing or the authenticated fetch fails (e.g. the API
 * key isn't set up yet), we **fall back to the last published version** so the
 * page still renders rather than collapsing to the empty landing. Outside preview
 * we only ever read published content.
 *
 * Returns `null` when nothing matches or the API is unreachable.
 */
const fetchFirstPage = async (
  where: Record<string, string>,
  locale: Locale,
  { draft = false }: PageFetchOptions,
): Promise<Page | null> => {
  const run = async (useDraft: boolean): Promise<Page | null> => {
    const params = new URLSearchParams({ ...where, locale, depth: '2', limit: '1' })
    if (useDraft) params.set('draft', 'true')
    const { docs } = await payloadFetch<PaginatedDocs<Page>>(
      `/api/pages?${params.toString()}`,
      undefined,
      { draft: useDraft },
    )
    return docs[0] ?? null
  }

  if (draft) {
    try {
      const draftDoc = await run(true)
      if (draftDoc) return draftDoc
    } catch {
      // Draft fetch failed (e.g. missing/invalid API key) — fall back to published.
    }
  }

  try {
    return await run(false)
  } catch {
    return null
  }
}

/**
 * Loads one page by slug for a locale. In preview, returns the latest draft and
 * falls back to the last published version (see `fetchFirstPage`).
 */
export const getPageBySlug = async (
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
  options: PageFetchOptions = {},
): Promise<Page | null> =>
  fetchFirstPage({ 'where[slug][equals]': slug }, locale, options)

/**
 * Loads the page marked as the home page (`isHomePage: true`) for a locale. In
 * preview, returns the latest draft and falls back to the last published version.
 */
export const getHomePage = async (
  locale: Locale = DEFAULT_LOCALE,
  options: PageFetchOptions = {},
): Promise<Page | null> =>
  fetchFirstPage({ 'where[isHomePage][equals]': 'true' }, locale, options)

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
