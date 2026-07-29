import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '../payload.config'

// Check for the "no seeded admin" setup: an EMPTY, migrated database must have
// zero admins (so /admin shows the create-first-user screen), and the first admin
// created there must end up with PAYLOAD_API_SECRET as a *working* API key —
// `apiKeyIndex` populated, which is what the API-key auth strategy looks up.
//
// Needs a throwaway DB, it writes two admins:
//   DATABASE_URI=…/scratch pnpm --filter @repo/payload payload migrate
//   DATABASE_URI=…/scratch pnpm --filter @repo/payload payload run src/scripts/verify-first-admin.ts
const run = async () => {
  const payload = await getPayload({ config })
  const secret = process.env.PAYLOAD_API_SECRET
  if (!secret) throw new Error('PAYLOAD_API_SECRET must be set to run this check')

  const before = await payload.count({ collection: 'admins' })
  console.assert(before.totalDocs === 0, 'fresh DB must have zero admins')

  const created = await payload.create({
    collection: 'admins',
    data: { email: 'first@example.com', password: 'first-admin-pass-123' },
  })
  const first = await payload.findByID({ collection: 'admins', id: created.id })
  console.assert(first.enableAPIKey === true, 'first admin must have enableAPIKey')
  console.assert(first.apiKey === secret, `apiKey must equal PAYLOAD_API_SECRET, got ${first.apiKey}`)

  // Exactly what the API-key auth strategy queries on (auth/strategies/apiKey).
  const index = crypto.createHmac('sha256', payload.secret).update(secret).digest('hex')
  const byIndex = await payload.find({
    collection: 'admins',
    where: { and: [{ apiKeyIndex: { equals: index } }, { enableAPIKey: { equals: true } }] },
  })
  console.assert(byIndex.totalDocs === 1, `API-key lookup must match 1 admin, got ${byIndex.totalDocs}`)

  const second = await payload.create({
    collection: 'admins',
    data: { email: 'second@example.com', password: 'second-admin-pass-123' },
  })
  const other = await payload.findByID({ collection: 'admins', id: second.id })
  console.assert(!other.enableAPIKey, 'later admins must NOT share the env API key')

  console.log('OK: register-first-admin flow verified')
  process.exit(0)
}

await run()
