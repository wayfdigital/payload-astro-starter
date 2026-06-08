import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  // Standalone Node server for the SSR build (`astro build` → `node ./dist/server/entry.mjs`).
  adapter: node({ mode: 'standalone' }),
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
