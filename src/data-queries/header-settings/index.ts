import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { DEFAULT_LANGUAGE, type Locale } from '@/i18n/const'

/**
 * Template: add a `header-settings` global to `payload.config.ts`, run migrations, then
 * replace `unknown` with your generated Payload type (or a Zod view-model) as needed.
 */
type FindGlobalLoose = (opts: {
  slug: string
  depth?: number
  locale?: string
}) => Promise<unknown>

const fetchHeaderSettings = async (locale: Locale): Promise<unknown> => {
  const payload = await getPayload({ config })
  const findGlobal = payload.findGlobal.bind(payload) as FindGlobalLoose
  return findGlobal({
    slug: 'header-settings',
    depth: 2,
    locale,
  })
}

/** Cached header global for `locale` (template — global must exist in Payload config). */
export const getCachedHeaderSettings = async (
  locale: Locale = DEFAULT_LANGUAGE
): Promise<unknown> => {
  const cached = unstable_cache(
    async () => fetchHeaderSettings(locale),
    ['header-settings', locale],
    {
      revalidate: false,
      tags: ['header-settings', `header-settings:${locale}`],
    }
  )
  return cached()
}
