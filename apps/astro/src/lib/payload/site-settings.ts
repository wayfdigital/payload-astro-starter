import type { SiteSetting } from '@repo/payload-types'
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales'
import { payloadFetch } from './client'

/**
 * Loads the site-wide settings global (SEO defaults, Organization data, custom code).
 *
 * `depth=1` populates the `defaultOgImage` and `organization.logo` uploads so the
 * frontend gets full `Media` objects instead of bare IDs. Returns `null` when the
 * global has never been saved or the API is unreachable, so callers fall back to
 * per-page values and static defaults.
 */
export const getSiteSettings = async (
  locale: Locale = DEFAULT_LOCALE,
): Promise<SiteSetting | null> => {
  const params = new URLSearchParams({ locale, depth: '1' })

  try {
    return await payloadFetch<SiteSetting>(`/api/globals/site-settings?${params.toString()}`)
  } catch {
    return null
  }
}
