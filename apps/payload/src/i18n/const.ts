export const LOCALE_CODES = ['en', 'pl'] as const

export type Locale = (typeof LOCALE_CODES)[number]

export const LANGUAGES = {
  en: { code: 'en', name: 'English' },
  pl: { code: 'pl', name: 'Polski' },
} as const satisfies Record<Locale, { code: Locale; name: string }>

export const DEFAULT_LANGUAGE: Locale = 'en'

/** Type guard: narrows an arbitrary string to a supported `Locale`. */
export const isLocale = (value: string): value is Locale =>
  LOCALE_CODES.some((code) => code === value)

/** Narrows a string to a `Locale`, falling back to {@link DEFAULT_LANGUAGE}. */
export const toLocale = (value: string): Locale => (isLocale(value) ? value : DEFAULT_LANGUAGE)
