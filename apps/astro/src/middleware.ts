import { defineMiddleware } from 'astro:middleware'
import { ADMIN_ORIGIN, PREVIEW_COOKIE, PREVIEW_SECRET } from './lib/preview-env'

// Dev-only: forward Astro SSR console output to the debug-mode ingest server.
// The dynamic import + guard tree-shake this out of production builds.
if (import.meta.env.DEV) void import('./lib/debug/server-capture')

/**
 * Detects preview requests and, for them, (a) marks `locals.preview` so routes
 * fetch drafts, (b) allows the Payload admin to embed the page in its Live Preview
 * iframe, and (c) forbids caching so draft HTML is never stored by a shared cache.
 *
 * Keeping navigation inside the iframe in preview is handled client-side by the
 * live-preview listener (it rewrites clicked links), so we do not rewrite the HTML
 * body here — that avoids buffering responses and leaking the secret into asset URLs.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context

  const queryPreview =
    url.searchParams.get('preview') === '1' &&
    url.searchParams.get('secret') === PREVIEW_SECRET
  const cookiePreview = cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_SECRET
  const isPreview = Boolean(PREVIEW_SECRET) && (queryPreview || cookiePreview)

  context.locals.preview = isPreview

  const response = await next()
  if (!isPreview) return response

  // Let the admin origin frame us; do not block framing for preview responses.
  response.headers.set('Content-Security-Policy', `frame-ancestors 'self' ${ADMIN_ORIGIN}`)
  response.headers.delete('X-Frame-Options')
  // Drafts must never be cached by a CDN/proxy (the URL carries the shared secret).
  response.headers.set('Cache-Control', 'no-store')

  return response
})
