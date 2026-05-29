import { type GlobalConfig } from 'payload'
import { isAdmin } from '@/payload/access-guards/is-admin'
import { linkField } from '@/payload/fields/link'

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: false,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      localized: true,
      required: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Information',
          fields: [
            {
              name: 'officeAddress',
              type: 'group',
              label: 'Office Address',
              fields: [
                { name: 'street', type: 'text', label: 'Street', required: false },
                { name: 'city', type: 'text', label: 'City', required: false },
                { name: 'postalCode', type: 'text', label: 'Postal Code', required: false },
                { name: 'country', type: 'text', label: 'Country', required: false },
              ],
            },
            {
              name: 'warehouseAddress',
              type: 'group',
              label: 'Warehouse Address',
              fields: [
                { name: 'street', type: 'text', label: 'Street', required: false },
                { name: 'city', type: 'text', label: 'City', required: false },
                { name: 'postalCode', type: 'text', label: 'Postal Code', required: false },
                { name: 'country', type: 'text', label: 'Country', required: false },
              ],
            },
            { name: 'phone', type: 'text', label: 'Phone Number', required: false },
            { name: 'email', type: 'email', label: 'Email Address', required: false },
          ],
        },
        {
          label: 'Footer Links',
          fields: [
            {
              name: 'links',
              type: 'array',
              label: 'Footer Links',
              fields: [linkField({ appearances: false })],
            },
          ],
        },
        {
          label: 'Copyright',
          fields: [
            { name: 'copyright', type: 'text', label: 'Copyright Text', localized: true, required: false },
            { name: 'implementation', type: 'text', label: 'Implementation Text', localized: true, required: false },
          ],
        },
      ],
    },
  ],
}
