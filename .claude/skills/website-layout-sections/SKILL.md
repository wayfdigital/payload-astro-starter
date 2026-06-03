---
name: website-layout-sections
description: >-
  Adds a new CMS-driven layout section (Payload `blocks` field + Next.js renderer)
  in this standalone repo. Covers Block definition, dual registration (Pages
  collection + payload.config), the page-builder section map, folder layout, the
  `@/theme` renderer, types, and migrations. Use when creating a new page section,
  layout block, "nowa sekcja", a marketing/grid/CTA/testimonials block, or
  extending the page builder layout.
---

# Website layout sections (Payload + page builder)

This repo is **standalone** — all code lives under `src/`, the import alias `@/*` → `./src/*`,
and the UI/theme alias is **`@/theme`** → `src/theme/`. (There is no `apps/website`, no
`getPayloadImageUrl`, and no `.cursor/rules` here.)

## Scope

Layout sections are **blocks** in the `pages` collection → field **`layout`**. They are **not**
the Hero — Hero is a `heroField` **group** on the page doc (see
[`sections/hero/hero.ts`](../../../src/app/(frontend)/[locale]/(website)/components/sections/hero/hero.ts))
and is rendered separately, not from the `layout` array.

**Reference implementations (read these first):**

- `src/app/(frontend)/[locale]/(website)/components/sections/example-block/` — cleanest single block; copy this shape.
- `…/components/sections/page-content/` — one folder, **three** blocks (`page-content-1/2/3`).
- `…/components/sections/form-block/` — block backed by the form-builder plugin.

## Folder shape (one section)

```
sections/<feature>/
├── <feature>.ts        # export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }
├── index.tsx           # FC router: switch on props.blockType → variant; export <Name>SectionProps
└── variants/
    └── <variant>.tsx   # presentational markup using @/theme primitives
```

A folder may export **several** blocks (like `page-content`) — one `export const …Block: Block`
per block, all registered.

## Checklist (do in order)

1. **Reuse check** — is an existing section close? Prefer extending `example-block`/`page-content` over net-new code.
2. **Define the Block** in `sections/<feature>/<feature>.ts`:
   ```ts
   import type { Block } from 'payload'

   export const ExampleBlock: Block = {
     slug: 'exampleBlock',          // === blockType === sectionMap key
     dbName: 'example_block',       // snake_case table name
     interfaceName: 'ExampleBlock', // PascalCase → exported interface in payload-types.ts
     labels: { singular: 'Example block', plural: 'Example blocks' },
     fields: [
       { name: 'title', type: 'text', localized: true, required: true },
       { name: 'description', type: 'textarea', localized: true },
       { name: 'ctaUrl', type: 'text', defaultValue: '/' },
     ],
   }
   ```
   - `localized: true` on editor-facing copy that differs per locale (this repo localizes `en`/`pl`, default `en`).
   - Reuse shared field helpers where they exist (e.g. a `link` field under `src/payload/fields/`).
3. **Register the block in BOTH places** (keep the lists identical):
   - [`src/payload/collections/Pages.ts`](../../../src/payload/collections/Pages.ts) → `layout` field → `blocks: [..., ExampleBlock]`.
   - [`src/payload.config.ts`](../../../src/payload.config.ts) → top-level `blocks: [..., ExampleBlock]`.
4. **Build the renderer** — `index.tsx` routes, `variants/` presents:
   ```tsx
   // index.tsx
   import type { FC } from 'react'
   import type { PageSection } from '../../page-builder/layout-sections'
   import { ExampleBlockVariant } from './variants/example-block'

   export type ExampleBlockSectionProps = Extract<PageSection, { blockType: 'exampleBlock' }>

   export const ExampleBlockSection: FC<ExampleBlockSectionProps> = (props) => {
     if (props.blockType === 'exampleBlock') return <ExampleBlockVariant {...props} />
     return null
   }
   export default ExampleBlockSection
   ```
   ```tsx
   // variants/example-block.tsx
   import { Container, Heading, Text, Button } from '@/theme'
   import type { ExampleBlockSectionProps } from '../index'

   export const ExampleBlockVariant = ({ title, description, ctaText, ctaUrl }: ExampleBlockSectionProps) => (
     <section className="py-16">
       <Container size="md">
         <Heading level={2}>{title}</Heading>
         {description && <Text>{description}</Text>}
         {ctaText && <a href={ctaUrl ?? '/'}><Button>{ctaText}</Button></a>}
       </Container>
     </section>
   )
   ```
5. **Wire the section map** — [`…/components/page-builder/layout-sections.tsx`](../../../src/app/(frontend)/[locale]/(website)/components/page-builder/layout-sections.tsx): import the section once and add **one `sectionMap` entry per `blockType`**. Multiple slugs may point at the same component (e.g. `page-content-1/2/3` → `PageContentSection`). The map feeds `createLayoutBuilder<PageSection>(sectionMap)` from `@/utils/layout-builder`.
6. **Regenerate types** — `pnpm generate:types` (updates `src/payload-types.ts`). `interfaceName` becomes the exported interface; `PageSection` is `NonNullable<Page['layout']>[number]`, so new blocks join the union. *(If a brand-new block isn't in the generated union yet, `layout-sections.tsx` shows the fallback: a hand-written `…SectionType` unioned into `PageSection`. Prefer regenerating types over keeping the manual augmentation.)*
7. **Migration** — any new/changed block field is a **schema change** → run the **payload-migrations** skill cycle (DB up → `pnpm migrate:create <name>` → review the file → `pnpm migrate`). Commit the migration with the section.
8. **Verify** — smoke-test the block in `/admin` (Pages → `layout`) and on a published page.

## Renderer rules

- Prefer **arrow functions**; route with **`switch`/`if` on `props.blockType`** and `return null` for the default (exhaustive, no object-map dispatch).
- For optional UI prefer **`value && <Jsx />`** over `value ? <Jsx/> : null` — shorter and consistent across sections. Always double-check this syntax.
- **No hardcoded copy fallbacks** in React. Drive content from CMS via Payload `defaultValue` / `required` / admin descriptions; conditionally render instead of placeholder strings.
- Use **`@/theme`** for all UI: primitives (`Container`, `Heading`, `Text`, `Button`, `Card`, `Badge`) and theme sections (`Hero`, `PageContent`, `Contact`). Theme components define their **own** props — the variant maps Payload props → theme props (the page builder is the bridge between `payload-types` and theme types). Style with the theme CSS vars (`var(--template-color-*)`).

## Data fetching (when a section needs CMS data)

For server data, follow the **data-fetching** skill and the `getCached…` pattern in
[`src/data-queries/`](../../../src/data-queries/) (e.g. `getCachedPageBySlug` in `data-queries/pages/index.ts`):
`fetch…` (uncached `getPayload` + `payload.find`) wrapped by `getCached…` (`unstable_cache` with
tags + `revalidate: false` → on-demand revalidation). Server components `await` the locale and
call `getCached…`; add a client component only for browser interactivity.

## Images (Payload `Media`)

There is **no image helper util** in this repo. The `Media` collection
([`src/payload/collections/Media.ts`](../../../src/payload/collections/Media.ts)) defines
`imageSizes` (`thumbnail`, `square`, `small`, `medium`, `large`, `xlarge`, `og`). Query the
relationship/upload at `depth >= 1` so you get a `Media` **object**, then read `media.url` (or a
size: `media.sizes?.medium?.url`) directly for `src`. Pick a size appropriate to the layout.

## Common mistakes

- Registering a block in **only one** of `Pages.ts` / `payload.config.ts` (must be both).
- Omitting **`dbName`** or **`interfaceName`** on a Block.
- **`slug` ↔ `blockType` ↔ `sectionMap` key** mismatch — all three must be equal.
- Forgetting **`pnpm generate:types`**, or forgetting the **migration** (schema change with no migration).
- Inventing paths — use the real `src/...` locations above.

## Quick naming guide

| Thing | Value |
|---|---|
| Block export | `ExampleBlock`, `PageContentBlock1` |
| `slug` | `exampleBlock` — equals `blockType` and the `sectionMap` key |
| `dbName` | snake_case, e.g. `example_block` |
| `interfaceName` | PascalCase, e.g. `ExampleBlock` |
| Feature folder | `sections/<feature>/` (kebab), e.g. `example-block/` |
| Variant file | `variants/<variant>.tsx` |

## Related skills

- **payload-migrations** — the migration cycle for step 7 (every schema change).
- **data-fetching** — SSR/ISR strategy + the `getCached…` data-query pattern for step 4/data sections.
