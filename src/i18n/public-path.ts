import { DEFAULT_LANGUAGE, toLocale } from '@/i18n/const'

/** Home page slug in CMS (served at `/` / `/{locale}`, not under `[slug]`). */
export const HOME_PAGE_SLUG = 'home'

/** Public path matching `localePrefix: 'as-needed'` (next-intl). */
export function toPublicPath(locale: string, slug: string): string {
  const loc = toLocale(locale)
  if (slug === HOME_PAGE_SLUG) {
    if (loc === DEFAULT_LANGUAGE) {
      return '/'
    }
    return `/${loc}`
  }
  if (loc === DEFAULT_LANGUAGE) {
    return `/${slug}`
  }
  return `/${loc}/${slug}`
}
