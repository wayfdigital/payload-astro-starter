import type { Admin } from '@repo/payload-types'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

// No admin is seeded — a fresh DB shows /admin's "create first user" screen.
// That first admin gets its API key pinned to PAYLOAD_API_SECRET so Astro
// draft/preview reads work with the same value in both .env files.
// Must be afterChange (an update): the base `apiKeyIndex` field hook runs before
// collection hooks, so setting apiKey earlier leaves the index empty and
// API-key auth never matches.
const pinApiKeyToFirstAdmin: CollectionAfterChangeHook<Admin> = async ({ doc, operation, req }) => {
  const apiKey = process.env.PAYLOAD_API_SECRET
  if (operation !== 'create' || !apiKey || doc.enableAPIKey) return

  // Inside the same transaction the new row already counts, so 1 = first admin.
  const { totalDocs } = await req.payload.count({ collection: 'admins', req })
  if (totalDocs !== 1) return

  await req.payload.update({
    collection: 'admins',
    id: doc.id,
    data: { enableAPIKey: true, apiKey },
    req,
  })
}

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
  hooks: {
    afterChange: [pinApiKeyToFirstAdmin],
  },
  fields: [],
}
