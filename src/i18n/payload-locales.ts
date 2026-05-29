export interface PayloadLocale {
  label: string
  code: string
  fallbackLocale?: string
}

export const PAYLOAD_LOCALES: PayloadLocale[] = [
  { label: 'Angielski', code: 'en' },
  { label: 'Polski', code: 'pl', fallbackLocale: 'en' },
  { label: 'Niemiecki', code: 'de', fallbackLocale: 'en' },
  { label: 'Francuski', code: 'fr', fallbackLocale: 'en' },
  { label: 'Hiszpański', code: 'es', fallbackLocale: 'en' },
  { label: 'Włoski', code: 'it', fallbackLocale: 'en' },
  { label: 'Portugalski', code: 'pt', fallbackLocale: 'en' },
  { label: 'Niderlandzki', code: 'nl', fallbackLocale: 'en' },
  { label: 'Szwedzki', code: 'sv', fallbackLocale: 'en' },
  { label: 'Duński', code: 'da', fallbackLocale: 'en' },
  { label: 'Fiński', code: 'fi', fallbackLocale: 'en' },
  { label: 'Czeski', code: 'cs', fallbackLocale: 'en' },
  { label: 'Słowacki', code: 'sk', fallbackLocale: 'en' },
  { label: 'Węgierski', code: 'hu', fallbackLocale: 'en' },
  { label: 'Rumuński', code: 'ro', fallbackLocale: 'en' },
  { label: 'Bułgarski', code: 'bg', fallbackLocale: 'en' },
  { label: 'Chorwacki', code: 'hr', fallbackLocale: 'en' },
  { label: 'Słoweński', code: 'sl', fallbackLocale: 'en' },
  { label: 'Litewski', code: 'lt', fallbackLocale: 'en' },
  { label: 'Łotewski', code: 'lv', fallbackLocale: 'en' },
  { label: 'Estoński', code: 'et', fallbackLocale: 'en' },
  { label: 'Grecki', code: 'el', fallbackLocale: 'en' },
  { label: 'Maltański', code: 'mt', fallbackLocale: 'en' },
  { label: 'Irlandzki', code: 'ga', fallbackLocale: 'en' },
  { label: 'Ukraiński', code: 'ua', fallbackLocale: 'en' },
]
