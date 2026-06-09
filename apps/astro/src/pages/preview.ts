import type { APIRoute } from 'astro'
import { PREVIEW_COOKIE, PREVIEW_SECRET } from '../lib/preview-env'

/**
 * New-tab preview entry (Payload's `admin.preview` button points here).
 *
 * Validates the shared secret, sets an httpOnly preview cookie (works because this
 * is a top-level, same-origin navigation), then redirects to the target page —
 * where the middleware picks up the cookie and renders the draft.
 */
export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret')
  const locale = url.searchParams.get('locale')
  let path = url.searchParams.get('path') ?? '/'

  if (!PREVIEW_SECRET || secret !== PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // Only allow local redirects (prevent open-redirect via the `path` param).
  if (!path.startsWith('/')) path = '/'

  cookies.set(PREVIEW_COOKIE, PREVIEW_SECRET, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  const dest = new URL(path, url.origin)
  if (locale) dest.searchParams.set('locale', locale)
  return redirect(dest.pathname + dest.search, 307)
}
