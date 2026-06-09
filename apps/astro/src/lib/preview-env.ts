/**
 * Centralized preview configuration.
 *
 * Browser-facing values (the admin origin) must be public URLs, because the editor's
 * browser uses them (postMessage origin matching + CSP `frame-ancestors`). In
 * production, when preview is enabled, a missing value is a hard error instead of a
 * silent localhost fallback. (The server-to-server `PAYLOAD_API_URL` may stay internal.)
 */

/** Shared secret that gates preview links. When unset, preview is disabled entirely. */
export const PREVIEW_SECRET = import.meta.env.PREVIEW_SECRET

/** Cookie set by the new-tab `/preview` entry; its value is the preview secret. */
export const PREVIEW_COOKIE = 'payload-preview'

const previewEnabled = Boolean(PREVIEW_SECRET)

const requirePublic = (value: string | undefined, name: string, devFallback: string): string => {
  if (value) return value
  if (previewEnabled && import.meta.env.PROD) {
    throw new Error(`[preview] ${name} must be set to a public URL in production.`)
  }
  return devFallback
}

/** Browser-facing Payload admin origin (live-preview postMessage source + CSP). */
export const ADMIN_ORIGIN = requirePublic(
  import.meta.env.ASTRO_PUBLIC_ADMIN_ORIGIN,
  'ASTRO_PUBLIC_ADMIN_ORIGIN',
  'http://localhost:3100',
)
