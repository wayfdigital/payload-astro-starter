import { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

function getMediaCdnBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_CDN_BASE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  return (process.env.NEXT_PUBLIC_URL ?? '').replace(/\/$/, '')
}

export const s3PluginConfig: Plugin = s3Storage({
  collections: {
    media: {
      disableLocalStorage: true,
      prefix: process.env.AWS_PREFIX ?? '',
      generateFileURL: ({ filename }) => {
        if (!filename) return ''
        const base = getMediaCdnBaseUrl()
        if (!base) return ''
        return `${base}/${encodeURIComponent(filename)}`
      },
    },
  },
  config: {
    endpoint: process.env.AWS_ENDPOINT_URL,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    region: process.env.AWS_DEFAULT_REGION || '',
  },
  acl: 'public-read',
  bucket: process.env.AWS_S3_BUCKET_NAME || '',
})
