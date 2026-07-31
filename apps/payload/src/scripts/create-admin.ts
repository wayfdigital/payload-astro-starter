import { getPayload } from 'payload'
import config from '../payload.config'

const run = async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in apps/payload/.env')
  }
  if (!process.env.PAYLOAD_API_SECRET) {
    console.warn(
      'PAYLOAD_API_SECRET is empty — this admin gets no API key and Astro draft/preview ' +
        'reads will fail. Set it in apps/payload/.env AND apps/astro/.env first.',
    )
  }

  const payload = await getPayload({ config })

  const { totalDocs } = await payload.count({ collection: 'admins' })
  if (totalDocs > 0) {
    console.error('An admin already exists — create further accounts in /admin.')
    process.exit(1)
  }

  await payload.create({ collection: 'admins', data: { email, password } })
  console.log(`Created admin ${email}. Log in at /admin.`)
  process.exit(0)
}

await run()
