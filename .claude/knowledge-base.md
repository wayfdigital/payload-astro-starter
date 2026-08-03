# Knowledge base (materialized into the repo)

This directory holds the project's knowledge as plain files so the repo is **self-contained**
— it no longer depends on the external `knowledge-base` MCP server (which is a local/test
instance). Everything was exported verbatim from that KB on 2026-06-09.

Three kinds of entries, mirroring the KB model:

- **`skills/`** — how to use a tool/library or run a workflow. Each is a folder with a
  `SKILL.md` (YAML frontmatter `name` + `description`) and optional `reference/`, `pages/`,
  `examples/` files. Skills here are auto-discovered by Claude Code and invocable as `/<name>`.
- **`patterns/`** — project-agnostic coding conventions (short rules + the multi-file
  `data-fetching` guide). Not auto-loaded as skills; read them when relevant.
- **`memories/`** — project-specific decisions, gotchas, and facts. `[[Double-bracket]]`
  references point to other memory files by title.

## Skills (`.claude/skills/`)

| Skill | Scope | Files | What it covers |
|---|---|---|---|
| `website-layout-sections` | project | 1 | New page section/layout block: Payload block → dual registration → Astro renderer → `layout-sections.astro` case → types → migration |
| `payload-migrations` | project | 1 | Postgres/Drizzle migrate cycle + data-safety ladder (monorepo) |
| `payload` | shared | 13 | Full Payload reference (fields, hooks, access, queries, adapters, plugins, advanced) |
| `payloadcms` | shared | 7 | Payload 3 + Next App Router: Local API, access guards, hooks + cache revalidation |
| `data-fetching` | project | 6 | Next.js + Payload data-fetching strategy (SSR/ISR/Server Actions/TanStack) |
| `cms-migration` | project | 2 | Migrating another CMS (WordPress/Contentful/Strapi…) into Payload + field reference |
| `vibe-coding` | project | 1 | Vibecoder front door: plain-language request → dev spec → loads the right skills → runs the build pipeline |
| `payload-local-api` | shared | 1 | Short note: read Payload via the Local API in server code |
| `astro` | local | 1 | Astro framework usage (already in repo; updated for Astro 6) |
| `knowledge-base` | local | 1 | How to use the KB MCP server (already in repo) |

## Patterns (`.claude/patterns/`)

- `data-fetching/` — the full Next.js + Payload data-fetching guide (same content as the skill).
- `error-and-loading-states.md` — loading/error/empty states; never show raw stack traces.
- `data-fetching-in-rsc.md` — fetch in server components; mutations via Server Actions.
- `caching-and-revalidating-server-data.md` — tag + `revalidateTag`; dedupe per request.
- `form-validation-client-and-server.md` — one Zod schema, validated on both sides.
- `unit-and-integration-testing-strategy.md` — unit for domain logic, integration for critical paths.

## Memories (`.claude/memories/`)

- `repo-structure-conventions.md` — what lives where, import aliases, tokens, "new code goes where".
- `monorepo-migration-gaps-repaired.md` — the broken-then-fixed state of both apps after the Turborepo migration.
- `payload-postgres-array-crash.md` — the `texts` array field that crashed every `pages` query (Drizzle `referencedTable`).
- `astro-v6-upgrade.md` — Astro 5→6.4.4, verified. **Adapter is now Cloudflare, not Node.**

## Re-connecting to the hosted KB later

If/when a shared knowledge-base server is set up, these files can be re-uploaded
(skills via `create_skill_files`, memories/patterns via the Admin panel or MCP create tools).
Until then, treat the files here as the source of truth and keep them updated alongside code changes.
