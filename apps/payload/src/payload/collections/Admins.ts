import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  // `useAPIKey` keeps email/password login and additionally exposes a per-admin
  // API key. The Astro frontend uses that key for authenticated draft reads.
  auth: {
    useAPIKey: true,
  },
  fields: [],
}
