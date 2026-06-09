# Access control

Access functions run for `create / read / update / delete` (collection level) and
per-field. They return:
- a **boolean** (allow / deny), or
- a **`Where` query** (read/update/delete) → the user may only touch matching docs.

```ts
import type { Access, FieldAccess } from 'payload'

// Boolean guard — note auth is split across `admins` and `users` collections.
export const isAdmin: FieldAccess = ({ req }) => req.user?.collection === 'admins'

// Where-returning guard — non-admins only see their own rows.
export const adminOrOwner: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (!req.user) return false
  return { owner: { equals: req.user.id } } // a Where filter, not just true/false
}
```

Wire them into the collection:
```ts
access: {
  read: () => true,            // public read
  create: adminOnly,
  update: adminOrOwner,
  delete: adminOnly,
},
fields: [
  { name: 'internalNote', type: 'text', access: { read: isAdmin, update: isAdmin } },
]
```

## Rules
- Always check `req.user?.collection`, not just `req.user`, when multiple auth
  collections exist (`admins` vs `users`).
- Prefer returning a `Where` for row-level scoping over fetching-then-filtering.
- Field `access.read` returning false **removes the field** from the response — good
  for secrets, but the client must handle its absence.
- Keep guards tiny, named, and reusable in `src/payload/access-guards/*`; compose
  them rather than inlining logic in collections.
- `overrideAccess: true` in Local API calls **skips** these guards — use only after
  you've authorized the caller yourself.
