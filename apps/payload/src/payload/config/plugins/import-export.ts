import { Plugin } from 'payload'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

// Adds CSV/JSON import + export tooling and an `exports` collection for Pages.
export const importExportPluginConfig: Plugin = importExportPlugin({
  collections: [{ slug: 'pages' }],
})
