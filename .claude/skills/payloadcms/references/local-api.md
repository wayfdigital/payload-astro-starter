# Local API

Run Payload **on the server** via the Local API — it talks to the DB directly, with
no HTTP hop, and respects access control unless you opt out.

```ts
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })

const { docs, totalDocs, hasNextPage } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  locale,            // localized fields resolved for this locale
  depth: 2,          // how deep relationships are populated (keep as low as needed)
  limit: 1,
  // select: { title: true, slug: true }, // fetch only what you need (perf)
})

const page = await payload.findByID({ collection: 'pages', id, depth: 1 })
```

## Tips
- **`depth`**: every level populates related docs — costs queries. Use the minimum;
  set `depth: 0` and select relationship IDs when you don't need the related body.
- **`select`** (Payload 3): fetch only required fields to cut payload size.
- **`overrideAccess: true`** bypasses access control — only in trusted server code
  that has already authorized the caller. Default is `false` for user-facing reads.
- **`locale` / `fallbackLocale`**: pass the request locale; rely on generated types
  (`@/payload-types`) for the returned shape.
- **Mutations**: `payload.create / update / delete` accept the same options; wrap
  multi-step writes in a transaction (`const req = ...; payload.update({ req })`) so
  hooks and DB writes are atomic.
- Never call the REST (`/api/...`) or GraphQL endpoint from your own server — that's
  an extra network hop and re-auth. Use the Local API.

See `examples/data-query.ts` for the cached, tagged pattern this project uses.
