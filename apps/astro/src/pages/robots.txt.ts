import type { APIRoute } from 'astro'
import { SITE_URL } from '../lib/seo/meta'

/**
 * Dynamic robots.txt so the `Sitemap:` line always points at the current `site`
 * origin (no hardcoded localhost leaking into production). Allows all crawling;
 * per-page indexing is controlled by the `noindex` meta tag (drafts/404s) and the
 * site-wide robots switch in Site Settings.
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
