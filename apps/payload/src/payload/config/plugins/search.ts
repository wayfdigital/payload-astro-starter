import { Plugin } from 'payload'
import { searchPlugin } from '@payloadcms/plugin-search'

// Maintains a synced `search` collection indexing Pages for fast querying.
export const searchPluginConfig: Plugin = searchPlugin({
  collections: ['pages'],
  defaultPriorities: {
    pages: 10,
  },
})
