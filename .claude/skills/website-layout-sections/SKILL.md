---
name: website-layout-sections
description: Fires on a new/edited page section or layout block. Three layers — presentational component in packages/ui → Payload block schema in apps/payload (dual registration) → thin Astro adapter that maps block fields onto the ui component → layout-sections dispatcher case → generate:types → migration.
---

# Website layout sections — packages/ui component + Payload block + Astro adapter

**This repo is a Turborepo monorepo.** The shared design system lives in `packages/ui/`, Payload
(headless CMS) in `apps/payload/`, the frontend in `apps/astro/` (**Astro 6, SSR**).

## Architecture — three layers (do NOT collapse them)

Every layout section is built as **three separate pieces**, each in its own package:

1. **Presentational component** — `packages/ui/src/components/sections/<feature>/`. A **pure,
   Payload-agnostic** React component. Props are plain values (`title: string`, `actions: ReactNode`),
   **never** `@repo/payload-types`. This is the reusable UI. **This is where new section UI lives.**
2. **Block schema** — `apps/payload/src/payload/blocks/<feature>.ts`. The CMS fields (slug, dbName,
   interfaceName, fields). Drives the admin and the DB.
3. **Adapter (renderer)** — `apps/astro/src/components/sections/<feature>/index.tsx`. A **thin**
   component, typed by the block interface, that **maps Payload block fields onto the ui component's
   props** (e.g. builds an `actions` ReactNode from CTA fields). Contains as little markup as possible.

> **Canonical reference — the `Hero` pair. Read both before building:**
> - `packages/ui/src/components/sections/hero/hero.tsx` — presentational (plain props, no payload types).
> - `apps/astro/src/components/sections/hero/variants/default-hero.tsx` — adapter (maps `hero` group → `<Hero>` props).
>
> `page-content` and `example-block` are **legacy** — they inline markup in `apps/astro` instead of
> using a `packages/ui` component. **Do not copy them.** New sections follow the `Hero` pair.

Layout sections are **blocks** in the `pages` collection → field **`layout`**. (`hero` is a separate
**group field** on the page, not a layout block — `page-builder.astro` renders it before the layout blocks.)

**Other reference files:**
- `apps/payload/src/payload/blocks/example-block.ts` — cleanest single block *schema* definition.
- `apps/payload/src/payload/blocks/page-content.ts` — one file, three blocks (`page-content-1/2/3`).
- `apps/payload/src/payload/blocks/forms.ts` — block backed by the form-builder plugin.
- `apps/astro/src/components/page-builder/layout-sections.astro` — the dispatcher (already exists).

## Folder shapes

### Presentational component (`packages/ui/src/components/sections/`)
```
sections/
├── <feature>/
│   ├── <feature>.tsx   # export function <Feature>({ ... }: <Feature>Props) — pure UI, plain props
│   └── index.ts        # export { <Feature>, type <Feature>Props } from './<feature>'
└── index.ts            # barrel: re-export the new section here
```
Then re-export from the package root `packages/ui/src/index.ts` (`// Sections` block) so it imports
as `import { <Feature> } from '@repo/ui'`. **Three wiring points** (`<feature>/index.ts` →
`sections/index.ts` → `src/index.ts`) — miss one and `@repo/ui` won't resolve the export.

**Always ship a story.** Add a co-located `<feature>.stories.tsx` next to the component (copy
`packages/ui/src/components/_TEMPLATE.stories.tsx.txt`). Import from `@repo/ui`, set `title` to
`Sections/<Feature>`, and add an `argTypes` control for each union prop. Preview it in isolation with
`pnpm --filter @repo/ui storybook` (port 6006) before wiring the Payload block + Astro adapter — it's
the fastest way to iterate on the presentational layer without booting the full app.

### Payload block definition (`apps/payload/src/payload/blocks/`)
```
blocks/
└── <feature>.ts     # export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }
```
One file may export multiple blocks (e.g. `page-content.ts` exports three).

### Astro adapter (`apps/astro/src/components/sections/`)
```
sections/<feature>/
├── index.tsx         # thin adapter: maps block fields → <Feature> props from @repo/ui
└── variants/         # optional, when one block has multiple layouts
    └── <variant>.tsx
```
Adapters are **`.tsx` React components rendered server-side** by Astro (no JS shipped) — use a
`client:*` directive only for interactive sections (see FormBlock).

## Checklist (do in order)

1. **Reuse check** — is an existing block/component close enough? See block inventory in the repo
   conventions memory. Prefer extending an existing `@repo/ui` section over a new one.

2. **Build the presentational component** in `packages/ui/src/components/sections/<feature>/<feature>.tsx`.
   **Pure UI, Payload-agnostic** — plain props, no `@repo/payload-types`. Compose from elements
   (`Container`, `Heading`, `Text`, `Button`) and style with CSS tokens. Mirror `hero.tsx`:
   ```tsx
   import type { ReactNode } from 'react'
   import { Container } from '../../elements/container'
   import { Heading } from '../../elements/heading'
   import { Text } from '../../elements/text'

   export interface ExampleProps {
     title: string
     description?: string
     actions?: ReactNode          // slots for CTAs — the adapter fills these, not the component
   }

   export function Example({ title, description, actions }: ExampleProps) {
     return (
       <section className="py-16" style={{ backgroundColor: 'var(--background)' }}>
         <Container size="md">
           <Heading level={2}>{title}</Heading>
           {description && <Text>{description}</Text>}
           {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
         </Container>
       </section>
     )
   }
   ```
   Then wire all **three** export points: `<feature>/index.ts`, `sections/index.ts`, `src/index.ts`.

3. **Define the block** in `apps/payload/src/payload/blocks/<feature>.ts`:
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

4. **Register in BOTH places** (keep lists identical):
   - `apps/payload/src/payload/collections/Pages.ts` → `layout` field → `blocks: [..., ExampleBlock]`
   - `apps/payload/src/payload.config.ts` → top-level `blocks: [..., ExampleBlock]`

5. **Generate types:**
   ```bash
   pnpm --filter @repo/payload generate:types   # writes packages/payload-types/src/index.ts
   ```
   Named blocks (with `interfaceName`) get an exported interface; blocks without it appear
   inline in the `Page['layout']` union (e.g. `page-content-1/2/3`). Derive those with
   `Extract<NonNullable<Page['layout']>[number], { blockType: 'page-content-1' }>`.

6. **Build the Astro adapter** in `apps/astro/src/components/sections/<feature>/index.tsx`.
   This is a **thin** component, typed by the block interface, that **maps Payload fields onto the
   `@repo/ui` component's props** — it should hold almost no markup of its own. Mirror `default-hero.tsx`:
   ```tsx
   import { Example, Button } from '@repo/ui'
   import type { ExampleBlock } from '@repo/payload-types'

   export const ExampleBlockSection = ({ title, description, ctaText, ctaUrl }: ExampleBlock) => (
     <Example
       title={title ?? ''}
       description={description ?? undefined}
       actions={
         ctaText ? (
           <a href={ctaUrl ?? '/'}>
             <Button>{ctaText}</Button>
           </a>
         ) : undefined
       }
     />
   )

   export default ExampleBlockSection
   ```
   - The adapter is the **only** layer that touches `@repo/payload-types`; the `@repo/ui` component stays payload-agnostic.
   - Import the section component and primitives from `@repo/ui`. Never reach into `packages/` by relative path.
   - Layout/markup belongs in the `@repo/ui` component (step 2), **not** here — if you're writing `<section>`/`<Container>` in the adapter, push it down into the ui component.
   - For an **interactive** section, hydrate the adapter as an island (`client:*`) — see FormBlock.

7. **Add a case to the dispatcher** `apps/astro/src/components/page-builder/layout-sections.astro`
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

8. **Migrate** (schema change → migration is mandatory):
   ```bash
   docker compose up -d postgres
   pnpm --filter @repo/payload migrate:create <name>   # review the generated file
   pnpm --filter @repo/payload migrate
   ```
   Commit migrations with the block definition change.

9. **Verify** — `/admin` (Pages → `layout`) and the rendered Astro page (`astro check` + a real request).

## Data fetching in Astro

A typed REST data layer already exists in `apps/astro/src/lib/payload/` — **use it, don't inline fetch**:
- `getPageBySlug(slug, locale)` / `getAllPages(locale)` — `pages.ts`
- `payloadFetch(path)` — thin wrapper over `fetch(import.meta.env.PAYLOAD_API_URL + path)` — `client.ts`
- `submitForm(apiUrl, formId, data)` — `forms.ts` (called from the FormBlock island; pass `apiUrl` from the page)

Routing is a single `apps/astro/src/pages/[...slug].astro` that parses a leading `/<locale>/`
prefix (the Payload `slug` is **non-localized** — same slug per locale, only content differs).
i18n is configured in `astro.config.mjs` (`locales: ['en','pl']`, `prefixDefaultLocale: false`).
Plain SSR, always fresh (no Next-style cache). Set `PAYLOAD_API_URL=http://localhost:3100` in `apps/astro/.env`.

## Layering rules

- **Markup lives in `packages/ui`, not the adapter.** The `@repo/ui` section component owns the
  layout, structure and styling. The Astro adapter only maps data. If the adapter grows a
  `<section>`/`<Container>`, you've put UI in the wrong layer — push it into the ui component.
- **`@repo/ui` components are Payload-agnostic.** Plain props (`title: string`, `actions: ReactNode`),
  **never** `@repo/payload-types`. They must be reusable outside this CMS.
- **The adapter is the only `@repo/payload-types` consumer.** It maps nullable CMS fields (`title ?? ''`)
  and builds `ReactNode` slots (CTAs) for the ui component's `actions`-style props.
- Adapters/components are server-rendered React (`.tsx`) by default; `client:*` only for interactivity (forms, carousels).
- The adapter receives block fields as props (dispatcher spreads `{...section}`), typed by the block interface.
- Render conditionally: `{value && <Element />}` — never hardcode placeholder strings.
- Style exclusively with CSS tokens from `packages/ui/src/styles/theme.css` (`var(--primary)`, `var(--background)`…).

## Images

No image URL helper exists. Use `media.url` or `media.sizes?.medium?.url` directly.
Query at `depth >= 1` to get a populated `Media` object instead of just an ID.

## Common mistakes

- **Inlining the section's markup in the Astro adapter** instead of building a `@repo/ui` component
  (the `page-content` / `example-block` legacy mistake — don't repeat it).
- Wiring **only one or two** of the three ui export points (`<feature>/index.ts` → `sections/index.ts`
  → `src/index.ts`) — `@repo/ui` won't resolve `import { <Feature> }` until all three are done.
- Importing `@repo/payload-types` **into the `@repo/ui` component** — it must stay payload-agnostic.
- Registering a block in **only one** of `Pages.ts` / `payload.config.ts` (must be both).
- `slug` ↔ `blockType` ↔ dispatcher `case` mismatch — all three must be identical.
- Not running `pnpm --filter @repo/payload generate:types` after a field change.
- Not running the migration cycle after any schema change.
- Reading `import.meta.env.PAYLOAD_API_URL` inside a `client:*` island (it's undefined in the browser — pass it as a prop).
- Importing from `@/theme` — that path is gone; use `@repo/ui`.

## Quick naming guide

| Thing | Value |
|---|---|
| `@repo/ui` component export | `Example` / `ExampleProps` |
| ui component file | `packages/ui/src/components/sections/example/example.tsx` |
| ui export points (all three) | `example/index.ts` → `sections/index.ts` → `src/index.ts` |
| Block export | `ExampleBlock` |
| `slug` / `blockType` / dispatch `case` | `exampleBlock` (camelCase) |
| `dbName` | `example_block` (snake_case) |
| `interfaceName` | `ExampleBlock` (PascalCase) |
| Block file | `apps/payload/src/payload/blocks/example-block.ts` |
| Astro adapter folder | `apps/astro/src/components/sections/example-block/` (`index.tsx`) |

## Related skills

- **payload-migrations** — the full migration cycle for step 8.
- **payload** — Payload config, fields, hooks, access control.
