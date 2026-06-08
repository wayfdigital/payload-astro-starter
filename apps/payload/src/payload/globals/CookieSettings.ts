import { type GlobalConfig } from 'payload'
import { isAdmin } from '@/payload/access-guards/is-admin'
import { linkField } from '@/payload/fields/link'

export const CookieSettings: GlobalConfig = {
  slug: 'cookieSettings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'consentVersion',
      type: 'text',
      required: true,
      defaultValue: 1,
    },
    linkField({ appearances: false }),
  ],
}
