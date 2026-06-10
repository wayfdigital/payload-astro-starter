import { Plugin } from 'payload'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import * as Sentry from '@sentry/nextjs'

// Reports Payload errors to Sentry. Disabled (and Sentry not required) until a
// SENTRY_DSN is provided, so local/dev without a DSN stays a no-op.
export const sentryPluginConfig: Plugin = sentryPlugin({
  enabled: Boolean(process.env.SENTRY_DSN),
  Sentry,
  options: {
    captureErrors: [400, 403, 500],
    debug: false,
  },
})
