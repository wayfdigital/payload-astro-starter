import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { Plugin } from 'payload'
import { seoPluginConfig } from './seo'
import { formBuilderPluginConfig } from './form-builder'
import { s3PluginConfig } from './s3'
import { previewPlugin } from './preview'
import { nestedDocsPluginConfig } from './nested-docs'
import { redirectsPluginConfig } from './redirects'
import { searchPluginConfig } from './search'
import { importExportPluginConfig } from './import-export'
import { sentryPluginConfig } from './sentry'

/**
 * Resolves a browser-facing URL env var. In production, when the feature is enabled,
 * a missing value is a hard error rather than a silent localhost fallback (which would
 * point the editor's browser at the wrong host). In dev it falls back to localhost.
 */
const requirePublicUrl = (
  value: string | undefined,
  name: string,
  devFallback: string,
  enabled: boolean,
): string => {
  if (value) return value
  if (enabled && process.env.NODE_ENV === 'production') {
    throw new Error(`[preview] ${name} must be set to a public URL in production.`)
  }
  return devFallback
}

export const plugins: Plugin[] = [
  payloadCloudPlugin(),
  s3PluginConfig,
  seoPluginConfig,
  formBuilderPluginConfig,
  nestedDocsPluginConfig,
  redirectsPluginConfig,
  searchPluginConfig,
  importExportPluginConfig,
  sentryPluginConfig,
  previewPlugin({
    collections: ['pages'],
    // `frontendUrl` is the browser-facing Astro origin (used as the Live Preview
    // iframe src), so it must be public — not an internal VPS address. Fail fast in
    // production when preview is enabled but it is missing.
    frontendUrl: requirePublicUrl(
      process.env.ASTRO_PUBLIC_URL,
      'ASTRO_PUBLIC_URL',
      'http://localhost:3000',
      Boolean(process.env.PREVIEW_SECRET),
    ),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
    // Temporarily disabled to test manual "Save draft" / "Publish" refresh.
    autosave: false,
    // Home page is served at `/`; every other page at `/<slug>`.
    resolvePath: (doc) =>
      doc.isHomePage ? '/' : `/${(doc.slug as string | undefined) ?? ''}`,
  }),
]
