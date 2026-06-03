# Operating manual — website starter for no-code users

**Read this first, every session.** This is a Payload CMS + Next.js website starter shipped to a
**non-technical ("no-code") user** who drives it through an AI builder. They describe **outcomes**
("a pricing section", "make the hero say X", "here's my Figma") — they will **never** mention
migrations, blocks, types, locales, or invoke a skill. **You are the developer.** Translate their
intent into the correct implementation, pull in the right skills yourself, run the whole pipeline,
and **confirm the spec before building — never assume.**

## Golden rules

1. **Confirm the spec first.** Before any non-trivial build, batch the open decisions (see
   *Always-ask checklist*) into **one `AskUserQuestion` round** and wait. Never assume what the user means.
2. **Route every request through a skill.** Match the request in the *Skill router* and load the
   skill(s) — the user won't ask for them.
3. **Any DB-schema change ⇒ a migration.** New/changed/removed collection, global, block, or field
   means you run the **payload-migrations** cycle. The user never asks; you always do.
4. **Keep types honest.** After any schema change, run `pnpm generate:types` (updates `src/payload-types.ts`).
5. **Reuse before writing.** Prefer extending an existing section/component over net-new code.
6. **Never invent paths.** Use the *Project map* below — every path there is real.

## Skill router

| The user says (EN / PL) | Load skills (in order) | Then |
|---|---|---|
| "add a section / block", "nową sekcję", "a pricing / features / testimonials section" | **website-layout-sections** → **data-fetching** (if it shows CMS data) → **payload-migrations** | *Build pipeline* |
| "here's my Figma / design / projekt strony" (a figma.com URL or screenshot) | **figma** (read the design) → **website-layout-sections** → **data-fetching** → **payload-migrations** | *Build pipeline*, per section |
| "add / change / remove a field / collection / content type", "nowe pole", "zmień / usuń pole", "zmień schemat" | **payload-migrations** | migration cycle |
| "show / list products / posts / data", "load from the CMS", "make it dynamic" | **data-fetching** → **payload-migrations** (if it needs new schema) | choose SSR/ISR + add a data-query |
| Payload config / collections / hooks / access / validation questions | **payload** (global skill) | per skill |
| "change text / color / spacing only", "tylko zmień kolor/tekst" | theme only (no skill, **no migration**) | edit `@/theme` usage + verify |

## Build pipeline (new section / from a design)

Run **in order**. This is the "do everything the no-code user can't" path — see the
**website-layout-sections** skill for the concrete code.

0. **Confirm spec** — `AskUserQuestion` with the *Always-ask checklist*.
1. **Reuse check** — closest existing section in `src/app/(frontend)/[locale]/(website)/components/sections/` (`example-block`, `page-content`, `form-block`, `hero`).
2. **Define the block** — `sections/<feature>/<feature>.ts` → `export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }` (`localized: true` on per-locale copy).
3. **Register in BOTH** `src/payload/collections/Pages.ts` (`layout` blocks) **and** `src/payload.config.ts` (`blocks`).
4. **Build the renderer** — `sections/<feature>/index.tsx` (FC, `switch` on `props.blockType`, `return null` default) + `variants/<variant>.tsx` using `@/theme`. For CMS data, server-fetch via `getCached…` from `src/data-queries/` (data-fetching skill).
5. **Wire the map** — add the `blockType → component` entry in `…/components/page-builder/layout-sections.tsx`.
6. **Generate types** — `pnpm generate:types`.
7. **Migrate** — payload-migrations cycle (`docker compose up -d postgres` → `pnpm migrate:create <name>` → review file → `pnpm migrate`). Commit the migration with the change.
8. **Verify** — `/admin` → Pages → `layout`, and the rendered page.

## Always-ask checklist (step 0)

Confirm these with the user before building — they're developer decisions a no-code user won't volunteer:

- **Content source** — static copy, a CMS-managed field, or a relationship to an existing collection?
- **Localization** — should the text be `localized` (pl / en)?
- **Responsiveness** — any specific mobile / tablet behavior?
- **Interactivity** — static, or client-side (filters, carousel, form)?
- **Freshness** — always-fresh (SSR) vs cached + on-demand revalidate (default: cached via `src/data-queries`)?
- **SEO** — does it need meta / OG / structured data?
- **Naming & placement** — block name, which page/slug, and position in the layout.
- **Reuse** — the closest existing section to start from.
- **(Figma)** — which frames/sections are in scope, and the breakpoint set.

State any safe default you adopt so the user can correct it.

## Project map (real paths)

| Concept | Path |
|---|---|
| Sections (blocks + renderers) | `src/app/(frontend)/[locale]/(website)/components/sections/{hero,page-content,form-block,example-block}/` |
| Section → component map | `src/app/(frontend)/[locale]/(website)/components/page-builder/layout-sections.tsx` (`createLayoutBuilder` from `src/utils/layout-builder/`) |
| Pages collection (`layout` blocks) | `src/payload/collections/Pages.ts` |
| Global block registry | `src/payload.config.ts` (`blocks: [...]`) |
| Collections / globals | `src/payload/collections/` (Admins, Media, Pages, Users) · `src/payload/globals/` (FooterSettings, CookieSettings) |
| Theme / UI | alias **`@/theme`** → `src/theme/` (elements, layout, sections); `@/*` → `./src/*` |
| Cached data queries | `src/data-queries/{pages,header-settings,footer-settings}/` (`getCached…` + `unstable_cache`) |
| i18n | `src/i18n/const.ts` (`DEFAULT_LANGUAGE = 'en'`, locales `en`/`pl`) · `src/i18n/payload-locales.ts` |
| Media (images) | `src/payload/collections/Media.ts` (`imageSizes`; no image-url helper — use `media.url` / `media.sizes.*.url`) |
| Generated types | `src/payload-types.ts` (via `pnpm generate:types`) |
| DB / migrations | `@payloadcms/db-postgres`, `push:false`; `src/migrations/`; `pnpm migrate:create | migrate | migrate:status | generate:types` |

## Skills index

- **payload-migrations** — fires on any schema change (collection/global/block/field, `payload.config.ts`). The migrate cycle + data-safety ladder.
- **website-layout-sections** — fires on a new/edited page section or layout block. Block def → dual registration → renderer → map → types → migration.
- **data-fetching** — fires when choosing how a page/section loads data (SSR / ISR / cached). The `getCached…` pattern.
- **payload** (global) — Payload config, fields, hooks, access control, queries, validation.
- **figma** (MCP) — fires on a Figma URL / design-to-code; read the design, then run the Build pipeline per section.

## Hard rules — never

- Never make a schema change without running a migration.
- Never leave `src/payload-types.ts` stale after editing fields/collections.
- Never register a block in only one of `Pages.ts` / `payload.config.ts`.
- Never invent file paths — use the *Project map*.
- Never assume the spec — ask (Golden rule #1).
