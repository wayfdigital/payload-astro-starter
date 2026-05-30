export interface PayloadLocale {
  label: string
  code: string
  fallbackLocale?: string
}

export const PAYLOAD_LOCALES: PayloadLocale[] = [
  { label: 'English', code: 'en' },
  { label: 'Polish', code: 'pl', fallbackLocale: 'en' },
  { label: 'German', code: 'de', fallbackLocale: 'en' },
  { label: 'French', code: 'fr', fallbackLocale: 'en' },
  { label: 'Spanish', code: 'es', fallbackLocale: 'en' },
  { label: 'Italian', code: 'it', fallbackLocale: 'en' },
  { label: 'Portuguese', code: 'pt', fallbackLocale: 'en' },
  { label: 'Dutch', code: 'nl', fallbackLocale: 'en' },
  { label: 'Swedish', code: 'sv', fallbackLocale: 'en' },
  { label: 'Danish', code: 'da', fallbackLocale: 'en' },
  { label: 'Finnish', code: 'fi', fallbackLocale: 'en' },
  { label: 'Czech', code: 'cs', fallbackLocale: 'en' },
  { label: 'Slovak', code: 'sk', fallbackLocale: 'en' },
  { label: 'Hungarian', code: 'hu', fallbackLocale: 'en' },
  { label: 'Romanian', code: 'ro', fallbackLocale: 'en' },
  { label: 'Bulgarian', code: 'bg', fallbackLocale: 'en' },
  { label: 'Croatian', code: 'hr', fallbackLocale: 'en' },
  { label: 'Slovenian', code: 'sl', fallbackLocale: 'en' },
  { label: 'Lithuanian', code: 'lt', fallbackLocale: 'en' },
  { label: 'Latvian', code: 'lv', fallbackLocale: 'en' },
  { label: 'Estonian', code: 'et', fallbackLocale: 'en' },
  { label: 'Greek', code: 'el', fallbackLocale: 'en' },
  { label: 'Maltese', code: 'mt', fallbackLocale: 'en' },
  { label: 'Irish', code: 'ga', fallbackLocale: 'en' },
  { label: 'Ukrainian', code: 'ua', fallbackLocale: 'en' },
]
