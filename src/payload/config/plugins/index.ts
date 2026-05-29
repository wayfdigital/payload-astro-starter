import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { Plugin } from 'payload'
import { seoPluginConfig } from './seo'
import { formBuilderPluginConfig } from './form-builder'
import { s3PluginConfig } from './s3'

export const plugins: Plugin[] = [
  payloadCloudPlugin(),
  s3PluginConfig,
  seoPluginConfig,
  formBuilderPluginConfig,
]
