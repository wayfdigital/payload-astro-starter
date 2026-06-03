import { z } from 'zod'

const localizedSlugObjectSchema = z.record(z.string(), z.unknown())

/**
 * Normalize Payload localized `slug` (string or per-locale object) for app locales.
 */
export const collectLocalizedSlugValues = (
  slugField: unknown,
  appLocales: readonly string[]
): Record<string, string> => {
  const result: Record<string, string> = {}
  if (slugField == null) {
    return result
  }
  if (typeof slugField === 'string') {
    const s = slugField.trim()
    if (!s) {
      return result
    }
    for (const loc of appLocales) {
      result[loc] = s
    }
    return result
  }
  const parsed = localizedSlugObjectSchema.safeParse(slugField)
  if (parsed.success) {
    for (const loc of appLocales) {
      const v = parsed.data[loc]
      if (typeof v === 'string' && v.trim()) {
        result[loc] = v.trim()
      }
    }
  }
  return result
}
