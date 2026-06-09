# Hooks & cache revalidation

## Hook lifecycle (collections & fields)
- `beforeValidate` → `beforeChange` → DB write → `afterChange`
- `beforeRead` → `afterRead`
- `beforeDelete` → DB delete → `afterDelete`

Field hooks receive `{ value, data, siblingData, req, operation }`; collection hooks
receive `{ doc, previousDoc, req, operation }`. Keep them pure and fast; do heavy or
external work in `afterChange`/`afterDelete` (after the write commits).

```ts
// collection hook: keep search cache fresh + run side effects
hooks: {
  afterChange: [
    async ({ doc, req, operation }) => {
      // mutate-then-invalidate: never serve stale cached reads
      revalidateTag(`page:${doc.id}`)
      revalidateTag(PAGES_LIST_CACHE_TAG)
      if (operation === 'create') await notifySomething(doc, req)
    },
  ],
  afterDelete: [({ doc }) => revalidateTag(`page:${doc.id}`)],
}
```

## Cache + revalidation pattern (Next App Router)
1. Reads are wrapped in `unstable_cache(fn, keyParts, { tags: [...] })` inside the
   data-query module (`src/data-queries/*`).
2. Tag names are defined ONCE there (e.g. `PAGES_LIST_CACHE_TAG`, `page:${id}`) and
   exported, so hooks import the same constants — no string drift.
3. Collection `afterChange`/`afterDelete` call `revalidateTag(...)` for exactly the
   tags that read the changed data.

**Pitfall:** `revalidateTag` runs in a Next request/server-action context. Calling it
from a Payload hook works when the write happens within the Next runtime (admin UI,
server actions). For out-of-band writes (cron, external scripts) invalidate
separately. Don't rely on time-based `revalidate` for content that must be fresh —
use tags.

## Gotchas
- Field hooks on `group`/`array`/`row` fields fire per-row/sub-field — guard against
  re-entrancy and read `siblingData` for neighbors.
- `beforeChange` returning a value **replaces** the field value; return `value`
  unchanged if you only meant to observe.
- Avoid Local API calls inside a hook without passing `req` — you'll lose the
  transaction and can deadlock.
