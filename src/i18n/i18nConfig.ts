import { DEFAULT_LANGUAGE, LANGUAGES } from './const'

const i18nConfig = {
  locales: Object.values(LANGUAGES).map(language => language.code),
  defaultLocale: DEFAULT_LANGUAGE,
  prefixDefault: false,
} as const

export default i18nConfig
