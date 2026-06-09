# Payload+Postgres crash: array field on Pages broke ALL queries (Drizzle 'referencedTable' undefined)

After repairing the Payload app wiring (see [[Monorepo migration gaps the refactor left — now repaired (Payload wiring + Astro frontend rebuilt)]]), every `pages` query (REST `/api/pages` and Local API `payload.find({collection:'pages'})`) threw HTTP 500:

`TypeError: Cannot read properties of undefined (reading 'referencedTable')` at drizzle-orm `normalizeRelation` → `buildRelationalQueryWithoutPK`.

## Root cause
The `texts` field on the Pages collection — `{ name: 'texts', type: 'array', fields: [{ name: 'text', type: 'text', localized: true }] }` — generated a broken Drizzle relation (a referenced table's `relations` map had an `undefined` entry). Stack/versions: payload 3.81.0, @payloadcms/db-postgres 3.81.0, drizzle-orm 0.44.7, `idType: 'uuid'`, push:false.

## What it was NOT (ruled out by bisection)
- NOT duplicate drizzle-orm copies (only 0.44.7 installed, matches db-postgres pin).
- NOT the top-level `blocks: [...]` config in payload.config.ts.
- NOT the SEO plugin (`meta.image → media`) nor the formBuilder `form → forms` relationship.
- NOT the `hero` group field, NOT the `layout` blocks field, NOT the media/forms relationships — full `pages` with `slug + hero + layout` (all 5 blocks, media + forms relations) queries fine.
- Other collections (`media`, `forms`) always worked, including their own array fields (`forms.emails`). So it is NOT "any array" — it was this specific `texts` array on Pages.

## Fix applied
Removed the vestigial `texts` field entirely (it had no frontend consumer; added in an earlier refactor that "replaced title with an array of localized texts"). No array-composition workaround avoided the bug (tested localized-only, localized+non-localized, non-localized-only — all crash; a `group` instead of `array` is fine). Then: reset dev DB schema (`DROP SCHEMA public CASCADE; CREATE SCHEMA public`), deleted the stale initial migration, regenerated a clean `migrate:create initial`, applied it, and `generate:types`. `/api/pages` then returned 200.

## Reusable diagnostic method
A standalone `tsx` script that does `getPayload({ config })` then `payload.find()` per collection gives a clean full stack (the Next dev log truncates it). Bisect by editing the collection's `fields` array and re-running — `push:false` means relations rebuild in-memory from config against the existing DB, so no re-migration is needed between probes. Must pass `DATABASE_URI` + `PAYLOAD_SECRET` env inline (a bare tsx script does not load `apps/payload/.env`).

If this recurs with a needed array field: try a `group`, or split localized vs non-localized into separate sibling fields, or check for a newer payload/db-postgres patch.
