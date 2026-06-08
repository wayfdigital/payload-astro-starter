/**
 * Active locales for the website frontend. Mirrors `apps/payload/src/i18n/const.ts`
 * (`LOCALE_CODES`) — Astro can't import from the Payload app, so the set is duplicated
 * here. Keep the two in sync when adding/removing a locale.
 */
export const LOCALES = ['en', 'pl'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Type guard: narrows an arbitrary string to a supported {@link Locale}. */
export const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && LOCALES.some((code) => code === value)

/** Narrows a string to a {@link Locale}, falling back to {@link DEFAULT_LOCALE}. */
export const toLocale = (value: string | undefined): Locale =>
  isLocale(value) ? value : DEFAULT_LOCALE
