import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: () => false,
    create: () => true,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
