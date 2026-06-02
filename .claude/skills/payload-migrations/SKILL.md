---
name: payload-migrations
description: >-
  How to correctly generate and run Payload (Postgres/Drizzle) database
  migrations in this repo. Use whenever a change touches the DB schema —
  adding/renaming/deleting a collection, global, block, or field, editing
  `payload.config.ts` (localization, `idType`, `blocks`), or running migrations.
  Triggers: migration, migracja, `migrate:create`, `payload migrate`, schema
  change, zmiana schematu, nowa kolekcja, nowe pole, dodaj/zmień/usuń pole,
  push mode, generate:types, payload-types, "no migrations directory".
---

# Payload migrations (Postgres / Drizzle)

This repo uses `@payloadcms/db-postgres` (Drizzle under the hood). The adapter is set to
**`push: false`** in [`src/payload.config.ts`](../../../src/payload.config.ts), so the DB is
driven by **committed migration files in `src/migrations/`**, not by dev auto-sync. That
means a schema edit **does not take effect until you run a migrate cycle** — this is the
safe, intended behavior (push mode can hang on prompts or silently lose data).

> Design rationale (renames, tombstones, snapshots, the "least-destructive ladder") lives in
> [`docs/migrations.mdc`](../../../docs/migrations.mdc). This skill is the practical how-to;
> read the `.mdc` for the *why*.

## When to create a migration

Any edit that changes the **database schema**:

- `src/payload/collections/*` — new/changed/removed collection or field
- `src/payload/globals/*` — new/changed/removed global or field
- Block / field definitions (e.g. `…/sections/**/fields.ts`, `…/forms.ts`) registered in `payload.config.ts`
- `src/payload.config.ts` itself — `collections`, `globals`, `blocks`, `localization`, `idType`

Pure frontend / styling / non-schema changes do **not** need a migration.

## The migrate cycle (run in order)

```bash
docker compose up -d postgres        # DB must be alive (DATABASE_URI in .env)
pnpm migrate:create <name>           # generates a file in src/migrations/  (e.g. add-cta-block)
#   → ALWAYS open and review the generated .ts / SQL before applying (see Data safety)
pnpm migrate                         # apply pending migrations
pnpm generate:types                  # refresh src/payload-types.ts to match the new schema
```

Long form (equivalent, if you prefer the raw CLI): `pnpm payload migrate:create <name>`,
`pnpm payload migrate`, `pnpm payload generate:types`.

Then **commit the new `src/migrations/*` files together with the schema change** — they are
one unit. Production deploy applies them: `payload migrate && pnpm build`.

> First migration in a fresh repo: `src/migrations/` doesn't exist yet; `migrate:create`
> creates it plus an `index.ts`. Name the baseline something like `initial`.

## Data safety — the least-destructive ladder

Drizzle's generated SQL is **not** automatically safe. Review every migration before
`pnpm migrate`, and handle each change by tier:

| Change | What to do | Data loss |
|---|---|---|
| **Add** field / collection / index | Fast path — plain `ADD COLUMN`/`CREATE`. Just review & apply. | None |
| **Rename** field / collection | When `migrate:create` prompts "rename or create?", choose **rename**. Then **verify the file uses `ALTER TABLE … RENAME COLUMN old TO new`**, not `DROP` + `ADD`. Never trust Drizzle's auto-decision. | None (if done right) |
| **Type change** (e.g. text→number) | **Expand-contract**: add the new column → backfill `UPDATE … SET new = CAST(old AS …)` → drop the old column. Don't do a raw in-place type change that fails the cast. | Minimal — verify the cast |
| **Delete** field / narrow constraint | Prefer a **tombstone**: rename to `__trash_<name>_<ts>` (Payload only renders columns it knows from config, so it stays hidden but recoverable). Or **back up the DB first** (below) before an actual `DROP`. | Deferred / reversible |

**The biggest win:** never let the first destructive migration be a `DROP`. Rewrite
`DROP COLUMN x` → `RENAME COLUMN x TO __trash_x_<ts>` to turn "data lost" into "data hidden,
recoverable." Postgres tolerates the extra column and Drizzle ignores it (not in config).

## Gotchas

- **`--force-accept-warning` vs `--skip-empty` conflict.** `--force-accept-warning` accepts
  every prompt (won't hang) **but forces a migration file even with no schema changes**.
  `--skip-empty` skips the "no changes" prompt **but does not auto-accept the destructive
  warning** (can still hang). Don't combine them. For **interactive** work just run
  `pnpm migrate:create <name>` and answer prompts deliberately. For **non-interactive /
  automation**, use `--force-accept-warning`, then prune empty files and always review.
- **Drizzle bug — rename + type change at once** keeps the rename but **drops the type
  change** (drizzle-orm issues #5499 / #3826). Split it into two migrations, or force the
  expand-contract path.
- **DB must be running.** `migrate` / `migrate:status` / `migrate:create` all connect to
  Postgres — start `docker compose up -d postgres` first, with `DATABASE_URI` set in `.env`.

## Back up before risky migrations (Tier 2–3)

Snapshot the DB inside the container (no host Postgres needed; service/db/user are all
`postgres` per `docker-compose.yml`):

```bash
docker compose exec -T postgres pg_dump -U postgres postgres > backup.sql   # snapshot
docker compose exec -T postgres psql   -U postgres -d postgres < backup.sql # restore
```

## Common mistakes

- Running `pnpm migrate` while the DB container is **down**.
- **Not reviewing** the generated migration file before applying it (renames/deletes especially).
- Forgetting **`pnpm generate:types`** — `src/payload-types.ts` then lies about the schema.
- **Not committing** `src/migrations/*` alongside the schema edit (the two must travel together).
- Doing a destructive change (type change / delete) **without a backup or tombstone**.
- Expecting a schema edit to show up in dev **without** running the migrate cycle (we're on `push: false`).

## Quick reference

| Task | Command |
|---|---|
| Start DB | `docker compose up -d postgres` |
| Create migration | `pnpm migrate:create <name>` |
| Apply pending | `pnpm migrate` |
| Check status | `pnpm migrate:status` |
| Regenerate types | `pnpm generate:types` |
| Backup DB | `docker compose exec -T postgres pg_dump -U postgres postgres > backup.sql` |

## Resources

- [Payload — Migrations](https://payloadcms.com/docs/database/migrations)
- [Payload — Postgres adapter (push mode)](https://payloadcms.com/docs/database/postgres)
- [`docs/migrations.mdc`](../../../docs/migrations.mdc) — full design rationale & conflict ladder
