# PayloadCMS Integration

## Prefer Local API in Server Context

Use Payload local API directly from Server Components, route handlers, and server actions.

```typescript
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = cache(async () => getPayload())

export const getHeroContent = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'hero',
    select: ['title', 'subtitle', 'image', 'cta'],
    limit: 1,
  })

  return result.docs[0]
})
```

## Query Design Rules

1. Use `select` to return only required fields.
2. Filter with `where` at DB layer (never fetch-all then filter in code).
3. Set sane `limit` defaults.
4. Parallelize independent queries with `Promise.all`.
5. Wrap repeatable read operations with React `cache()`.

## Revalidation Flow with Payload Hooks

When CMS content changes:

1. Payload `afterChange` hook posts to Next.js revalidation endpoint.
2. Endpoint validates secret and calls `revalidatePath`.
3. Next request receives rebuilt content.

```typescript
await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-secret': process.env.PAYLOAD_WEBHOOK_SECRET!,
  },
  body: JSON.stringify({ collection: 'hero' }),
})
```

## Integration Checklist

- Keep payload fetchers in a dedicated server-only module.
- Centralize query helpers for each collection.
- Avoid exposing broad collection queries to client components.
- Audit payload query size regularly for accidental overfetching.
