import type { APIRoute } from 'astro'
import { SITE_URL } from '../lib/seo/meta'

/**
 * robots.txt built from the validated public origin, so the `Sitemap:` line follows
 * ASTRO_PUBLIC_SITE_URL. Allows all crawling; per-page indexing is controlled by the
 * `noindex` meta tag (drafts/404s) and the site-wide robots switch in Site Settings.
 *
 * Prerendered, so it ships as a static file built with the same origin as the home
 * page and needs no Worker request.
 */
export const prerender = true

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
