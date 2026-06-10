import type { APIRoute } from 'astro'
import { getAllPages } from '../lib/payload/pages'
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales'
import { absoluteUrl, localizedPath } from '../lib/seo/meta'

/**
 * CMS-aware XML sitemap. @astrojs/sitemap only sees build-time static routes, so on
 * this SSR + Payload site it would omit every page served by `[...slug]`. We instead
 * query Payload for all published page slugs and emit one `<url>` per slug with an
 * `<xhtml:link>` alternate for every locale (Google's hreflang-in-sitemap form).
 *
 * Slugs are non-localized (same slug across locales, content differs), so we list the
 * slugs once and expand each across `LOCALES`.
 */
const XML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}

const escapeXml = (value: string): string =>
  value.replaceAll(/[<>&'"]/g, (c) => XML_ENTITIES[c] ?? c)

const urlEntry = (slug: string): string => {
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(absoluteUrl(localizedPath(slug, locale)))}" />`,
  ).join('\n')
  // <loc> uses the default-locale URL; alternates carry the rest.
  const loc = escapeXml(absoluteUrl(localizedPath(slug, DEFAULT_LOCALE)))
  return `  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`
}

export const GET: APIRoute = async () => {
  const pages = await getAllPages(DEFAULT_LOCALE)
  // Home page (empty slug) + every non-home page slug.
  const slugs = ['', ...pages.map((p) => p.slug).filter((s): s is string => Boolean(s))]
  const unique = Array.from(new Set(slugs))

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${unique.map(urlEntry).join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
