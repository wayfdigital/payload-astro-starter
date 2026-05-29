import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/i18n.ts')

const nextConfig: NextConfig = {}

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
})
