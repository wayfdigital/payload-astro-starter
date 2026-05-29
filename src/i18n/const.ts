export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
  },
  pl: {
    code: 'pl',
    name: 'Polski',
  },
} as const

export const DEFAULT_LANGUAGE = 'en'

export type Locale = keyof typeof LANGUAGES

export const LOCALE_CODES = Object.keys(LANGUAGES) as [Locale, ...Locale[]]
