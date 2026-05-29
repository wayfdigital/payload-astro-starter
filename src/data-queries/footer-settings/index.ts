import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { DEFAULT_LANGUAGE, type Locale } from '@/i18n/const'
import type { FooterSetting } from '@/payload-types'

const fetchFooterSettings = async (locale: Locale): Promise<FooterSetting> => {
  const payload = await getPayload({ config })
  return payload.findGlobal({
    slug: 'footer-settings',
    depth: 2,
    locale,
  })
}

/**
 * Cached footer global for `locale`.
 * Matches the starter `footer-settings` global shape (`FooterSetting` from `payload-types`).
 */
export const getCachedFooterSettings = async (
  locale: Locale = DEFAULT_LANGUAGE
): Promise<FooterSetting> => {
  const cached = unstable_cache(
    async () => fetchFooterSettings(locale),
    ['footer-settings', locale],
    {
      revalidate: false,
      tags: ['footer-settings', `footer-settings:${locale}`],
    }
  )
  return cached()
}
