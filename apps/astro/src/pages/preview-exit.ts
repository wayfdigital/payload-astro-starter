import type { APIRoute } from 'astro'
import { PREVIEW_COOKIE } from '../lib/preview-env'

/**
 * Leaves preview mode (the "Exit preview" link in the preview banner).
 *
 * Needs to be a server route because the preview cookie is httpOnly — the browser
 * can't clear it from JS. No secret to validate: dropping your own preview cookie
 * only ever reduces access.
 */
export const GET: APIRoute = ({ url, cookies, redirect }) => {
  // Path must match the one used when the cookie was set in `preview.ts`.
  cookies.delete(PREVIEW_COOKIE, { path: '/' })

  let path = url.searchParams.get('path') ?? '/'
  // Only allow local redirects. `startsWith('/')` alone would still let a
  // protocol-relative `//evil.com` through, so resolve against our own origin and
  // keep the pathname only — same round-trip `preview.ts` does.
  if (!path.startsWith('/')) path = '/'
  const dest = new URL(path, url.origin)

  return redirect(dest.pathname, 302)
}
