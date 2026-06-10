import { Plugin } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

// Adds `parent` + `breadcrumbs` to Pages so editors can build a page hierarchy.
// URL is derived from the breadcrumb chain of slugs.
export const nestedDocsPluginConfig: Plugin = nestedDocsPlugin({
  collections: ['pages'],
  generateURL: (docs) =>
    docs.reduce((url, doc) => `${url}/${(doc.slug as string | undefined) ?? ''}`, ''),
})
