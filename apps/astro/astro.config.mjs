import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { resolveSiteUrl } from './src/lib/seo/site-url.mjs'

/**
 * Sets `site` from ASTRO_PUBLIC_SITE_URL and stops `astro build` before anything is
 * bundled unless the build environment (shell or CI, not a .env file) names a public
 * https origin. The check has to run here, in Node: the Cloudflare prerenderer only
 * logs an error thrown while rendering a page, writes the error text as the page and
 * still exits 0. `astro dev` falls back to http://localhost:3000.
 *
 * Canonical, Open Graph, hreflang, JSON-LD, robots.txt and sitemap URLs come from
 * SITE_URL in src/lib/seo/meta.ts, which reads the same variable through
 * import.meta.env, where the build environment takes precedence over .env files.
 * The sitemap is generated dynamically from the CMS at /sitemap.xml
 * (src/pages/sitemap.xml.ts), since @astrojs/sitemap can't see SSR-only CMS routes.
 *
 * @returns {import('astro').AstroIntegration}
 */
const siteOrigin = () => ({
  name: 'site-origin',
  hooks: {
    'astro:config:setup': ({ command, updateConfig }) => {
      updateConfig({
        site: resolveSiteUrl(process.env.ASTRO_PUBLIC_SITE_URL, {
          production: command === 'build',
        }),
      })
    },
  },
})

export default defineConfig({
  integrations: [siteOrigin(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  // Cloudflare Workers. The home page is prerendered (see src/pages/index.astro), so
  // it ships as a static asset; the CMS-backed routes stay SSR and run in the Worker.
  // Deploy with `pnpm --filter @repo/astro deploy:cf` (base config: wrangler.jsonc).
  adapter: cloudflare(),
  // Active locales mirror apps/payload/src/i18n/const.ts (LOCALE_CODES).
  // prefixDefaultLocale: false → `/about` = en, `/pl/about` = pl.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
})
