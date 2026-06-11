import type { CollectionConfig } from 'payload'
import { AdminOnlyAccessGuard } from '@/payload/access-guards/admin-only'

/**
 * Editable email copy. One document per template kind, identified by `key`
 * (e.g. `example`). All copy fields are `localized` so a single document holds
 * every language; the send task resolves exactly one locale at send time.
 *
 * Copy may contain `{placeholder}` tokens (see `email/utils/placeholders.ts`) —
 * e.g. `Hi {recipientName}, …` — which the task substitutes before rendering.
 *
 * Admin-only (`AdminOnlyAccessGuard`); jobs read it server-side via the Local
 * API with access override.
 */
export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  labels: {
    singular: { en: 'Email Template', pl: 'Szablon e-mail' },
    plural: { en: 'Email Templates', pl: 'Szablony e-mail' },
  },
  access: AdminOnlyAccessGuard,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'key'],
    description:
      'Editable subject + body for each transactional email. Use {placeholders} like {recipientName}, {siteName}, {message}, {actionUrl}.',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      label: 'Template key',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Stable identifier the code looks up (do not change once in use). The seeded example uses "example".',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      admin: { description: 'Human label shown in the admin list.' },
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
      localized: true,
      required: true,
    },
    {
      name: 'previewText',
      type: 'text',
      label: 'Preview text',
      localized: true,
      admin: { description: 'Inbox preview line shown before the email is opened.' },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body',
      localized: true,
      required: true,
      admin: { description: 'Line breaks become paragraphs. Supports {placeholders}.' },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button text',
      localized: true,
      admin: { description: 'Leave blank (with Button URL) to omit the call-to-action button.' },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      admin: { description: 'Supports {actionUrl}. Both button fields must be set to show a button.' },
    },
  ],
}
