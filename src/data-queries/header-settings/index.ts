import { DEFAULT_LANGUAGE, type Locale } from '@/i18n/const'

/**
 * Template stub. Add a `header-settings` global to `payload.config.ts`, run migrations,
 * then implement this with `payload.findGlobal({ slug: 'header-settings', locale })` —
 * Payload returns it fully typed, so no assertion is needed. Until then it returns `null`.
 */
export const getCachedHeaderSettings = (_locale: Locale = DEFAULT_LANGUAGE): Promise<null> =>
  Promise.resolve(null)
