---
name: payloadcms
description: >-
  Working with PayloadCMS 3 — collections, fields, globals, access control, hooks,
  the Local API, Next.js App Router integration, and cache/revalidation. Use when
  editing payload.config, collections/globals, access functions, hooks, or when
  fetching Payload data in server components / data-query modules.
---

# PayloadCMS 3

Guidance for building on **PayloadCMS 3** with the **Next.js App Router**
(stack: Payload 3.x, Postgres adapter, Lexical richtext, i18n / localized fields).

## Golden rules
1. **Fetch server-side via the Local API**, never your own REST/GraphQL calls:
   `const payload = await getPayload({ config }); await payload.find(...)`.
   See `references/local-api.md`.
2. **Cache + tag** reads with `unstable_cache({ tags })`, and **invalidate** with
   `revalidateTag` from collection hooks after writes. Centralize tags in the
   data-query module. See `references/hooks-and-revalidation.md`.
3. **Use generated types** from `@/payload-types` — never hand-write document
   shapes. Regenerate (`payload generate:types`) after any schema change.
4. **Access control** lives in small, typed, reusable guard functions, returning a
   boolean or a `Where` query. See `references/access-control.md`.
5. **Side effects** go in collection/field **hooks** (`beforeChange`, `afterChange`,
   `afterDelete`), not in route handlers.

## Where things live (this project)
- Collections: `src/payload/collections/*` · Globals: `src/payload/globals/*`
- Access guards: `src/payload/access-guards/*` (e.g. `isAdmin`, `adminOnly`, `adminOrOwner`)
- Server data fetching: `src/data-queries/*` (Local API + `unstable_cache` + tags)
- Zod schemas: `src/schemas/*` · Generated types: `@/payload-types` · Config: `@/payload.config`
- Auth is split across the `admins` and `users` collections — check
  `req.user?.collection` in guards, not just `req.user`.

## References (load on demand)
- `references/local-api.md` — find/findByID, depth, locale, pagination, `select`, transactions
- `references/access-control.md` — collection & field access, `req.user`, role guards, `Where` filters
- `references/hooks-and-revalidation.md` — hook lifecycle + `revalidateTag` invalidation
- `references/collections-and-fields.md` — field config, localized fields, relationships, Lexical

## Examples
- `examples/data-query.ts` — a cached, tagged Local-API read for a server component
- `examples/access-guard.ts` — typed access guards
