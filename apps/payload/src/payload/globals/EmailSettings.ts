import { type GlobalConfig } from 'payload'
import { isAdmin } from '@/payload/access-guards/is-admin'

/**
 * Branding + sender identity shared by every outgoing email.
 *
 * Templates pull copy from the `email-templates` collection; this global holds
 * the values that are the same across all of them — the From identity, site
 * name, support address and logo. The send task reads it (`locale`-agnostic)
 * and passes the values into the React Email layout.
 *
 * Admin-only to edit (`update: isAdmin`); read is open so server-side jobs can
 * load it without an authenticated user.
 */
export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: {
    en: 'Email Settings',
    pl: 'Ustawienia e-mail',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Site / brand name',
      required: true,
      defaultValue: 'Example',
      admin: {
        description: 'Shown in the email footer and available as the {siteName} placeholder.',
      },
    },
    {
      name: 'fromName',
      type: 'text',
      label: 'From name',
      admin: {
        description: 'Display name on the From line. Falls back to the adapter default if blank.',
      },
    },
    {
      name: 'fromAddress',
      type: 'email',
      label: 'From address',
      admin: {
        description: 'From email address. Falls back to the adapter default if blank.',
      },
    },
    {
      name: 'supportEmail',
      type: 'email',
      label: 'Support email',
      admin: {
        description: 'Shown in the footer and available as the {supportEmail} placeholder.',
      },
    },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'Logo URL',
      admin: {
        description: 'Absolute URL to a logo image shown at the top of every email (optional).',
      },
    },
  ],
}
