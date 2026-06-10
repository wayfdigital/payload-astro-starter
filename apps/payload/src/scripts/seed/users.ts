import type { Payload } from 'payload'

/**
 * Seeds the first admin and — crucially for preview/draft mode — pins that
 * admin's API key to `PAYLOAD_API_SECRET`. The Astro frontend reads drafts with
 * `Authorization: admins API-Key <PAYLOAD_API_SECRET>`, so seeding the key here
 * means the user just sets the SAME value in both `.env` files and preview works
 * out of the box — no generating a key in the admin UI and pasting it across.
 *
 * Idempotent: on a fresh DB it creates the admin with the key; on an existing DB
 * it backfills the key onto the first admin only if one isn't set yet (so a
 * manually rotated key is never clobbered).
 */
export async function seedUsers(payload: Payload) {
  const apiKey = process.env.PAYLOAD_API_SECRET

  const existingUsers = await payload.find({
    collection: 'admins',
    limit: 1,
  })

  const admin = existingUsers.docs[0]
  if (admin) {
    // Backfill the seeded key for setups created before this change.
    // `enableAPIKey` is always returned; the raw `apiKey` may be omitted.
    if (apiKey && !admin.enableAPIKey) {
      await payload.update({
        collection: 'admins',
        id: admin.id,
        data: { enableAPIKey: true, apiKey },
      })
      console.log('[SEED] Backfilled admin API key from PAYLOAD_API_SECRET.')
    } else {
      console.log('[SEED] Users already seeded, skipping...')
    }
    return
  }

  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('[SEED] SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set, skipping user seeding...')
    return
  }

  if (!apiKey) {
    console.warn(
      '[SEED] PAYLOAD_API_SECRET not set — admin created without an API key; ' +
        'Astro draft/preview reads will fail until you set it (same value in both .env files).',
    )
  }

  await payload.create({
    collection: 'admins',
    data: {
      email,
      password,
      // Pin the API key so the Astro frontend can authenticate draft reads
      // with the matching PAYLOAD_API_SECRET — no manual UI step.
      ...(apiKey ? { enableAPIKey: true, apiKey } : {}),
    },
  })
}
