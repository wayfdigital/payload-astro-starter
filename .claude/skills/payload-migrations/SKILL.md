---
name: payload-migrations
description: Fires on any DB-schema change (collection/global/block/field, payload.config.ts). The Postgres/Drizzle migrate cycle for the monorepo + the data-safety (least-destructive) ladder.
---

# Payload migrations (Postgres / Drizzle) — monorepo

Payload lives in `apps/payload/`. The adapter is set to **`push: false`** in
`apps/payload/src/payload.config.ts`, so the DB is driven by **committed migration files
in `apps/payload/src/migrations/`**, not by dev auto-sync.

All `pnpm` commands below must be filtered to `@repo/payload` when run from the repo root.
If you `cd apps/payload` first, you can drop the `--filter` flag.

## When to create a migration

Any edit that changes the **database schema**:

- `apps/payload/src/payload/collections/*` — new/changed/removed collection or field
- `apps/payload/src/payload/globals/*` — new/changed/removed global or field
- `apps/payload/src/payload/blocks/*` — new/changed/removed block definition
- `apps/payload/src/payload.config.ts` — `collections`, `globals`, `blocks`, `localization`, `idType`

Pure frontend / styling / Astro-only changes do **not** need a migration.

## The migrate cycle (run in order)

```bash
docker compose up -d postgres                              # DB must be alive
pnpm --filter @repo/payload migrate:create <name>          # e.g. add-cta-block
# → ALWAYS review the generated file before applying (see Data safety)
pnpm --filter @repo/payload migrate                        # apply pending migrations
pnpm --filter @repo/payload generate:types                 # refresh packages/payload-types/src/index.ts
```

Then **commit** `apps/payload/src/migrations/*` together with the schema change.
Production deploy: `pnpm --filter @repo/payload migrate && pnpm --filter @repo/payload build`.

## Data safety — least-destructive ladder

| Change | What to do | Data loss |
|---|---|---|
| **Add** field / collection / index | Plain `ADD COLUMN`/`CREATE` — just review & apply. | None |
| **Rename** field / collection | Choose **rename** when prompted. Verify file uses `ALTER TABLE … RENAME COLUMN`, not `DROP + ADD`. | None (if done right) |
| **Type change** | **Expand-contract**: add new column → backfill `UPDATE … SET new = CAST(old AS …)` → drop old. | Minimal |
| **Delete** field | Prefer tombstone: rename to `__trash_<name>_<ts>` instead of `DROP`. | Deferred / reversible |

**Biggest win:** never let the first destructive migration be a `DROP`. Rewrite
`DROP COLUMN x` → `RENAME COLUMN x TO __trash_x_<ts>`.

## Gotchas

- **`--force-accept-warning` vs `--skip-empty` conflict.** Use one or the other, never both.
  For interactive work: run `migrate:create` and answer prompts. For non-interactive: use
  `--force-accept-warning`, then prune empty files and always review.
- **Drizzle bug** — rename + type change in one migration drops the type change (issues #5499 / #3826).
  Split into two migrations.
- **DB must be running.** All migrate commands connect to Postgres — `docker compose up -d postgres` first.

## Backup before risky migrations

```bash
docker compose exec -T postgres pg_dump -U postgres postgres > backup.sql
docker compose exec -T postgres psql   -U postgres -d postgres < backup.sql
```

## Common mistakes

- Running migrate with the DB container down.
- Not reviewing the generated migration file (renames/deletes especially).
- Forgetting `generate:types` — `packages/payload-types/src/index.ts` then lies about the schema.
- Not committing `apps/payload/src/migrations/*` with the schema change.
- Doing a destructive change without a backup or tombstone.

## Quick reference

| Task | Command (from repo root) |
|---|---|
| Start DB | `docker compose up -d postgres` |
| Create migration | `pnpm --filter @repo/payload migrate:create <name>` |
| Apply pending | `pnpm --filter @repo/payload migrate` |
| Check status | `pnpm --filter @repo/payload migrate:status` |
| Regenerate types | `pnpm --filter @repo/payload generate:types` |
| Backup DB | `docker compose exec -T postgres pg_dump -U postgres postgres > backup.sql` |
