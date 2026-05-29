import { Plugin } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Pages } from '@/payload/collections/Pages'

export const seoPluginConfig: Plugin = seoPlugin({
  collections: [Pages.slug],
  uploadsCollection: 'media',
})
