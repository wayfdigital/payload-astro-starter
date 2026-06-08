 

import type { Payload } from 'payload'

export async function seedUsers(payload: Payload) {
  const existingUsers = await payload.find({
    collection: 'admins',
    limit: 1,
  })

  if (existingUsers.docs.length > 0) {
    console.log('[SEED] Users already seeded, skipping...')
    return
  }

  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('[SEED] SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set, skipping user seeding...')
    return
  }

  await payload.create({
    collection: 'admins',
    data: { email, password },
  })
}
