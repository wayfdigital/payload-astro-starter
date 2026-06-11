/**
 * Placeholder substitution for CMS-driven email copy.
 *
 * Editors write copy in the admin with `{placeholder}` tokens (e.g.
 * "Hi {recipientName}, welcome to {siteName}."). At send time the task builds a
 * variable map and replaces every token. Unknown tokens are left untouched so a
 * typo is visible rather than silently blanked.
 */

/** Every placeholder the example template understands. Surfaced to editors. */
export const EXAMPLE_PLACEHOLDERS = [
  'recipientName',
  'siteName',
  'supportEmail',
  'message',
  'actionUrl',
] as const

export type PlaceholderVars = Record<string, string>

const TOKEN = /\{(\w+)\}/g

/** Replaces every `{key}` in `text` with its value from `vars`. */
export function substitutePlaceholders(text: string, vars: PlaceholderVars): string {
  return text.replace(TOKEN, (match, key: string) => vars[key] ?? match)
}

/**
 * Builds the variable map for the example email. Missing optional inputs become
 * empty strings so substitution never injects "undefined".
 */
export function buildExamplePlaceholderVars(input: {
  recipientName?: string
  siteName: string
  supportEmail?: string
  message?: string
  actionUrl?: string
}): PlaceholderVars {
  return {
    recipientName: input.recipientName ?? '',
    siteName: input.siteName,
    supportEmail: input.supportEmail ?? '',
    message: input.message ?? '',
    actionUrl: input.actionUrl ?? '',
  }
}
