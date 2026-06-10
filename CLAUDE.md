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
4. **Keep types honest.** After any schema change, run `pnpm --filter @repo/payload generate:types` (updates `packages/payload-types/src/index.ts`).
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
| "add structured data / rich results", "improve SEO on this page", "Google preview / social share", "site name / OG image / tracking scripts" | **seo-structured-data** (→ **payload-migrations** if a new content type needs CMS fields) | detect collections → emit applicable JSON-LD; edit Site Settings / `lib/seo` |

## Build pipeline (new section / from a design)

Run **in order**. This is the "do everything the no-code user can't" path.

0. **Confirm spec** — `AskUserQuestion` with the *Always-ask checklist*.
1. **Reuse check** — closest existing block in `apps/payload/src/payload/blocks/` and section component in `apps/astro/src/components/sections/`.
2. **Define the block** — `apps/payload/src/payload/blocks/<feature>.ts` → `export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }` (`localized: true` on per-locale copy).
3. **Register in BOTH** `apps/payload/src/payload/collections/Pages.ts` (`layout` blocks) **and** `apps/payload/src/payload.config.ts` (`blocks`).
4. **Build the renderer** — `apps/astro/src/components/sections/<feature>/index.astro` (or `.tsx` for React islands) using tokens from `@repo/ui`. For CMS data, fetch via Payload REST API (`PAYLOAD_API_URL`).
5. **Wire the map** — add `blockType → component` to `apps/astro/src/components/page-builder/layout-sections.astro` (or equivalent).
6. **Generate types** — `pnpm --filter @repo/payload generate:types` (writes `packages/payload-types/src/index.ts`).
7. **Migrate** — payload-migrations cycle (`docker compose up -d postgres` → `pnpm --filter @repo/payload migrate:create <name>` → review → `pnpm --filter @repo/payload migrate`). Commit migration with the change.
8. **Verify** — `/admin` → Pages → `layout`, and the rendered Astro page.
9. **SEO pass** — load **seo-structured-data**: does the new section/content type warrant structured data (Product/Article/FAQ/etc.)? Emit applicable JSON-LD or record it as deferred.

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

## Monorepo structure

```
apps/payload/   — Headless Payload CMS (Next.js, port 3100) — admin + API only
apps/astro/     — Astro frontend (SSR, port 3000)
packages/ui/    — Shared design system (React components, CSS vars, shadcn tokens)
packages/payload-types/  — Generated Payload TypeScript types (shared)
```

## Project map (real paths)

| Concept | Path |
|---|---|
| Payload block definitions | `apps/payload/src/payload/blocks/{page-content,example-block,forms}.ts` |
| Collections / globals | `apps/payload/src/payload/collections/` · `apps/payload/src/payload/globals/` |
| Global block registry | `apps/payload/src/payload.config.ts` (`blocks: [...]`) |
| Pages collection (`layout` blocks) | `apps/payload/src/payload/collections/Pages.ts` |
| Payload config | `apps/payload/src/payload.config.ts` |
| DB / migrations | `apps/payload/src/migrations/`; `pnpm --filter @repo/payload migrate:create \| migrate \| migrate:status` |
| i18n (Payload) | `apps/payload/src/i18n/const.ts` · `apps/payload/src/i18n/payload-locales.ts` |
| Generated types | `packages/payload-types/src/index.ts` (via `pnpm --filter @repo/payload generate:types`) |
| Design system | `packages/ui/src/` — imports as `@repo/ui`; CSS vars follow shadcn conventions (`--primary`, `--background`, etc.) |
| Astro sections | `apps/astro/src/components/sections/` (to be created as features are built) |
| Astro layouts | `apps/astro/src/layouts/Layout.astro` |
| Astro pages | `apps/astro/src/pages/` |
| Payload API base URL | `PAYLOAD_API_URL` env in `apps/astro/.env` (default `http://localhost:3100`) |
| Media (images) | `apps/payload/src/payload/collections/Media.ts` (`imageSizes`; use `media.url` / `media.sizes.*.url`) |

## Skills index

- **payload-migrations** — fires on any schema change (collection/global/block/field, `payload.config.ts`). The migrate cycle + data-safety ladder.
- **website-layout-sections** — fires on a new/edited page section or layout block. Block def → dual registration → renderer → map → types → migration.
- **data-fetching** — fires when choosing how a page/section loads data (SSR / ISR / cached). The `getCached…` pattern.
- **payload** (global) — Payload config, fields, hooks, access control, queries, validation.
- **figma** (MCP) — fires on a Figma URL / design-to-code; read the design, then run the Build pipeline per section.
- **seo-structured-data** — fires when a page/section is built or a content type is added, or on any SEO / structured-data / social-preview / tracking-script request. Detects which collections exist and emits only the applicable JSON-LD (WebSite/Organization/WebPage/Breadcrumb now; Product/Article/FAQ deferred). Owns `apps/astro/src/lib/seo`, `components/seo`, and the `SiteSettings` global. Run an SEO pass after any new section ships.
- **seo-audit** (generic) — broad SEO framework (crawlability, Core Web Vitals, on-page, international) for "audit my SEO" requests.

## Hard rules — never

- Never make a schema change without running a migration.
- Never leave `packages/payload-types/src/index.ts` stale — regenerate after every schema change.
- Never register a block in only one of `Pages.ts` / `payload.config.ts`.
- Never import from `src/theme/` — use `@repo/ui` instead.
- Never invent file paths — use the *Project map*.
- Never assume the spec — ask (Golden rule #1).
