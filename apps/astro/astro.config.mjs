import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Absolute base for `Astro.site`. In production set ASTRO_PUBLIC_SITE_URL in the
  // environment; in dev it falls back to the local origin. Runtime SEO tags read the
  // same var via import.meta.env (see SITE_URL in src/lib/seo/meta.ts). The sitemap is
  // generated dynamically from the CMS at /sitemap.xml (src/pages/sitemap.xml.ts),
  // since @astrojs/sitemap can't see SSR-only CMS routes.
  site: process.env.ASTRO_PUBLIC_SITE_URL || 'http://localhost:3000',
  integrations: [react()],
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
