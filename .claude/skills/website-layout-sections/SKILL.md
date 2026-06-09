---
name: website-layout-sections
description: Fires on a new/edited page section or layout block (Payload block + Astro renderer). Block definition → dual registration (Pages.ts + payload.config.ts) → Astro renderer → layout-sections dispatcher case → generate:types → migration.
---

# Website layout sections — Payload blocks + Astro renderers

**This repo is a Turborepo monorepo.** Payload (headless CMS) lives in `apps/payload/`, the
frontend in `apps/astro/` (**Astro 6, SSR**), and the shared design system in `packages/ui/`.

## Scope

Layout sections are **blocks** in the `pages` collection → field **`layout`**. The block
**schema** (fields, slug) lives in `apps/payload/`; the **renderer** (what users see) lives
in `apps/astro/`. (`hero` is a separate **group field** on the page, not a layout block — it
is rendered before the layout blocks by `page-builder.astro`.)

**Reference implementations (read these first):**
- `apps/payload/src/payload/blocks/example-block.ts` — cleanest single block definition.
- `apps/payload/src/payload/blocks/page-content.ts` — one file, three blocks (`page-content-1/2/3`).
- `apps/payload/src/payload/blocks/forms.ts` — block backed by the form-builder plugin.
- `apps/astro/src/components/sections/example-block/index.tsx` — cleanest renderer.
- `apps/astro/src/components/page-builder/layout-sections.astro` — the dispatcher (already exists).

## Folder shapes

### Payload block definition (`apps/payload/src/payload/blocks/`)
```
blocks/
└── <feature>.ts     # export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }
```
One file may export multiple blocks (e.g. `page-content.ts` exports three).

### Astro section renderer (`apps/astro/src/components/sections/`)
```
sections/<feature>/
├── index.tsx         # React component (the norm — sections use @repo/ui React primitives)
└── variants/         # optional, when one block has multiple layouts
    └── <variant>.tsx
```
Renderers are **`.tsx` React components rendered server-side** by Astro (no JS shipped) — use a
`client:*` directive only for interactive sections (see FormBlock). Pure-static markup may use
`.astro`, but every existing section is `.tsx`.

## Checklist (do in order)

1. **Reuse check** — is an existing block close enough? See block inventory in the repo conventions memory.
2. **Define the block** in `apps/payload/src/payload/blocks/<feature>.ts`:
   ```ts
   import type { Block } from 'payload'

   export const ExampleBlock: Block = {
     slug: 'exampleBlock',          // === blockType === astro dispatch key
     dbName: 'example_block',       // snake_case
     interfaceName: 'ExampleBlock', // PascalCase → exported interface in payload-types
     labels: { singular: 'Example block', plural: 'Example blocks' },
     fields: [
       { name: 'title', type: 'text', localized: true, required: true },
       { name: 'description', type: 'textarea', localized: true },
       { name: 'ctaUrl', type: 'text', defaultValue: '/' },
     ],
   }
   ```
   - `localized: true` on copy that differs per locale (this repo: `en`/`pl`, default `en`).
   - **Do NOT make an `array`/`group` whose sub-fields are *all* present without any plain
     column edge case** — an all-localized array field on Pages once crashed every query
     (Drizzle `referencedTable` undefined). Prefer a `group`, or keep fields simple. See the
     "Payload+Postgres crash" memory.
   - Reuse shared field helpers from `apps/payload/src/payload/fields/` (e.g. `heroField`).

3. **Register in BOTH places** (keep lists identical):
   - `apps/payload/src/payload/collections/Pages.ts` → `layout` field → `blocks: [..., ExampleBlock]`
   - `apps/payload/src/payload.config.ts` → top-level `blocks: [..., ExampleBlock]`

4. **Generate types:**
   ```bash
   pnpm --filter @repo/payload generate:types   # writes packages/payload-types/src/index.ts
   ```
   Named blocks (with `interfaceName`) get an exported interface; blocks without it appear
   inline in the `Page['layout']` union (e.g. `page-content-1/2/3`). Derive those with
   `Extract<NonNullable<Page['layout']>[number], { blockType: 'page-content-1' }>`.

5. **Build the Astro renderer** in `apps/astro/src/components/sections/<feature>/index.tsx`.
   The component receives the **block's fields as props directly** (the dispatcher spreads
   `{...section}`), typed by the block interface:
   ```tsx
   import { Container, Heading, Text, Button } from '@repo/ui'
   import type { ExampleBlock } from '@repo/payload-types'

   export const ExampleBlockSection = ({ title, description, ctaText, ctaUrl }: ExampleBlock) => (
     <section className="py-16">
       <Container size="md">
         <Heading level={2}>{title}</Heading>
         {description && <Text>{description}</Text>}
         {ctaText && (
           <a href={ctaUrl ?? '/'}>
             <Button>{ctaText}</Button>
           </a>
         )}
       </Container>
     </section>
   )

   export default ExampleBlockSection
   ```
   - Import UI primitives from `@repo/ui`; types from `@repo/payload-types`. Never reach into `packages/` by relative path.
   - Style with CSS tokens (`var(--primary)`, `var(--card)`, `var(--border)`…) — never hardcode colours, never `@/theme`.
   - `data-theme="ui"` is already set on `<body>` in `Layout.astro`.

6. **Add a case to the dispatcher** `apps/astro/src/components/page-builder/layout-sections.astro`
   (it already exists — `switch (section.blockType)`):
   ```astro
   import ExampleBlockSection from '../sections/example-block/index'
   ...
   case 'exampleBlock':
     return <ExampleBlockSection {...section} />
   ```
   For an **interactive** section, hydrate it as an island and forward the API base URL
   (the browser can't read non-`PUBLIC_` env): `<FormBlockSection client:load {...section} apiUrl={apiUrl} />`.
   `page-builder.astro` renders `<HeroSection {...page.hero} />` then `<LayoutSections sections={page.layout} apiUrl={apiUrl} />`.

7. **Migrate** (schema change → migration is mandatory):
   ```bash
   docker compose up -d postgres
   pnpm --filter @repo/payload migrate:create <name>   # review the generated file
   pnpm --filter @repo/payload migrate
   ```
   Commit migrations with the block definition change.

8. **Verify** — `/admin` (Pages → `layout`) and the rendered Astro page (`astro check` + a real request).

## Data fetching in Astro

A typed REST data layer already exists in `apps/astro/src/lib/payload/` — **use it, don't inline fetch**:
- `getPageBySlug(slug, locale)` / `getAllPages(locale)` — `pages.ts`
- `payloadFetch(path)` — thin wrapper over `fetch(import.meta.env.PAYLOAD_API_URL + path)` — `client.ts`
- `submitForm(apiUrl, formId, data)` — `forms.ts` (called from the FormBlock island; pass `apiUrl` from the page)

Routing is a single `apps/astro/src/pages/[...slug].astro` that parses a leading `/<locale>/`
prefix (the Payload `slug` is **non-localized** — same slug per locale, only content differs).
i18n is configured in `astro.config.mjs` (`locales: ['en','pl']`, `prefixDefaultLocale: false`).
Plain SSR, always fresh (no Next-style cache). Set `PAYLOAD_API_URL=http://localhost:3100` in `apps/astro/.env`.

## Renderer rules

- Sections are server-rendered React (`.tsx`) by default; `client:*` only for interactivity (forms, carousels).
- Receive block fields as props (dispatcher spreads `{...section}`), typed by the block interface.
- Render conditionally: `{value && <Element />}` — never hardcode placeholder strings.
- Style exclusively with CSS tokens from `packages/ui/src/styles/theme.css`.

## Images

No image URL helper exists. Use `media.url` or `media.sizes?.medium?.url` directly.
Query at `depth >= 1` to get a populated `Media` object instead of just an ID.

## Common mistakes

- Registering a block in **only one** of `Pages.ts` / `payload.config.ts` (must be both).
- `slug` ↔ `blockType` ↔ dispatcher `case` mismatch — all three must be identical.
- Not running `pnpm --filter @repo/payload generate:types` after a field change.
- Not running the migration cycle after any schema change.
- Reading `import.meta.env.PAYLOAD_API_URL` inside a `client:*` island (it's undefined in the browser — pass it as a prop).
- Importing from `@/theme` — that path is gone; use `@repo/ui`.

## Quick naming guide

| Thing | Value |
|---|---|
| Block export | `ExampleBlock` |
| `slug` / `blockType` / dispatch `case` | `exampleBlock` (camelCase) |
| `dbName` | `example_block` (snake_case) |
| `interfaceName` | `ExampleBlock` (PascalCase) |
| Block file | `apps/payload/src/payload/blocks/example-block.ts` |
| Astro section folder | `apps/astro/src/components/sections/example-block/` (`index.tsx`) |

## Related skills

- **payload-migrations** — the full migration cycle for step 7.
- **payload** — Payload config, fields, hooks, access control.
