import { Plugin } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

// Creates a `redirects` collection (from/to + type) so editors can manage URL redirects.
export const redirectsPluginConfig: Plugin = redirectsPlugin({
  collections: ['pages'],
})
