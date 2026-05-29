---
name: website-layout-sections
description: >-
  Adds a new CMS-driven layout section (Payload blocks field + Next.js renderer)
  for apps/website. Covers Block definition, registration in Pages and
  payload.config, layout-sections map, folder layout, and types/migrations.
  Use when creating a new page section, layout block, "nowa sekcja",
  workflow/grid-style block, or extending the page builder layout.
---

# Website layout sections (Payload + page builder)

## Scope

Layout sections are **blocks** inside `pages` → tab **Content** → field `layout`. They are **not** the Hero tab (that uses `heroField` on the page doc, not `layout`).

**Reference implementation (current standard):**

- `apps/website/src/app/(frontend)/[locale]/(website)/components/sections/products/`

Older single-block sections (still valid, but prefer the products pattern for new work):

- `sections/grid/`, `sections/workflow/`, `sections/cta/`

## Products pattern (multi-block feature folder)

One **feature folder** can own **several Payload blocks** that belong together (different `slug` / `blockType`, shared UI domain). The page builder still sees them as separate blocks in the layout array; the frontend groups them under one section module.

1. **`fields.ts`** — barrel file that **re-exports** each block from `fields/<block>.ts` (one `Block` export per file, each with `slug`, **`dbName`**, **`interfaceName`** per `.cursor/rules/payload-block-definition-metadata.mdc`).
2. **`fields/<block>.ts`** — single `export const …Fields: Block = { … }` for one block (e.g. `featuredProducts`, `currentDevelopment`).
3. **`index.tsx`** — one **`ProductsSection`-style** component:
   - `export type XSectionProps = NonNullable<BlockA | BlockB | …>` using generated types from `@/payload-types`.
   - **`switch (props.blockType)`** to render the correct variant wrapper (`return null` in `default` for exhaustiveness).
4. **`variants/<kebab-case-block-theme>/`** — implementation for each block: main file (e.g. `products-showcase.tsx`, `current-development.tsx`) plus splits (`list.tsx`, `terminal.tsx`, views, `utils.ts`) to stay under **600 lines** (`.cursor/rules/cognitive-complexity.mdc`).
5. **Inner visual modes** — use a **`select`** on the block (e.g. **`variant`**: `list` | `terminal`) when one block has multiple UIs. Prefer clear names; `products` uses `variant` rather than overloading `type` when `blockType` already discriminates blocks.

## Checklist (do in order)

1. **Scaffold** under `sections/<feature>/` using the folder structure below (barrel `fields.ts` if multiple blocks, or a single `fields.ts` with one block for a tiny section).
2. **Define each Block** in `fields/<name>.ts` with `slug`, **`dbName`**, **`interfaceName`**, and admin `labels` when helpful.
3. **Register every block in two places** (keep lists identical):
   - `apps/website/src/payload/collections/Pages.ts` — `layout` → `blocks: [..., BlockA, BlockB]`
   - `apps/website/src/payload.config.ts` — top-level `blocks: [..., BlockA, BlockB]`
4. **Wire `layout-sections.tsx`** (`apps/website/src/app/(frontend)/[locale]/(website)/components/page-builder/layout-sections.tsx`):
   - Import the section entry component once.
   - Add **one map entry per `blockType`**. Multiple slugs may point to the **same** component when using the multi-block folder pattern (e.g. `featuredProducts` and `currentDevelopment` both → `ProductsSection`).
5. **Regenerate types** from `apps/website`: `pnpm run types:generate` (updates `apps/website/src/payload-types.ts`).
6. **Database**: after schema changes, create/run a Payload migration as usual (`migration:generate` / `db:migrate` per `apps/website/package.json`).
7. **Images**: any `Media` (or media-like) URLs in the section UI must use **`getPayloadImageUrl`** from `@/utils/get-payload-image` (see **Images** below).

## Folder structure

**Multi-block feature (standard):**

```
sections/<feature>/
├── fields.ts                    # re-exports: export { BlockAFields, BlockBFields } from './fields/...'
├── fields/
│   ├── <block-a>.ts             # export const BlockAFields: Block = { slug, dbName, interfaceName, fields }
│   └── <block-b>.ts
├── index.tsx                    # switch (props.blockType) → variant components; export XSectionProps
└── variants/
    └── <kebab-theme>/
        ├── <main>.tsx           # async server component or client wrapper as needed
        ├── <sub-view>.tsx
        └── utils.ts             # optional
```

**Single-block legacy (still OK):**

```
sections/<slug>/
├── fields.ts                    # single export const <Name>Block: Block = { ... }
├── index.tsx                    # FC: `switch (props.type)` / `switch (props.variant)` → variant components
└── variants/
    └── <variant>.tsx
```

### Block fields pattern

- Use **`localized: true`** on editor-facing text that should differ per locale.
- Reuse shared field helpers (e.g. `linkField` from `@/payload/fields/link`) like `products` does.
- Nested **groups** and **arrays** are fine; split large field sets across files or extract subcomponents.

### Frontend section component (`index.tsx`)

- Import generated types from `@/payload-types`.
- **Multi-block folder:** union props and `switch (props.blockType)` (see `ProductsSection`).
- **Single block with inner `type` / `variant`:** use **`switch (props.type)`** or **`switch (props.variant)`** to pick the variant component, with **`default: return null`** for exhaustiveness and unknown values (see `CtaSection`). Prefer this over a chain of `if`/`else` or an object map for dispatch—same style as `blockType` routing.
- Prefer **arrow functions** for new code (`.cursor/rules/template/arrow-functions-pattern.mdc`).

### Variant components

- Accept **narrowed** props where useful, e.g. `Extract<SectionProps, { blockType: 'featuredProducts' }>` or a single block type from `@/payload-types`.
- **Server components** may `await` locale and call `getCached…` / data-query modules (see `current-development.tsx`).
- **Zod** at the variant boundary is appropriate when validating populated relationships or rich shapes (see `products-showcase.tsx` + `productSchema`).
- **Do not** bake in hardcoded copy fallbacks in React—content from CMS; use Payload `defaultValue`, `required`, admin descriptions. Prefer conditional render (`value && <Component />`) over placeholder strings.
- For **optional UI** (missing CMS field, optional link group, etc.), prefer **`condition && <Jsx />`** over **`condition ? <Jsx /> : null`**—shorter and consistent across layout sections. THIS IS SUPER IMPORTANT and always check if you are using the correct syntax.

## Zavcodeui theme reference — always copy, never import

When layout markup matches or starts from **`ui/themes/Zavcodeui`** (especially `src/components/sections/`):

- **Copy** the JSX and Tailwind classes into `apps/website` under `variants/<…>/`, then bind fields from Payload props. Treat the theme file as a **visual reference**, not a runtime dependency.
- **Do not** import or reuse **section** components from `ui/themes/Zavcodeui` in website layout code: no `import … from '../../../../ui/themes/…'`, no workspace imports whose target is theme **sections**, and no tsconfig `paths` whose purpose is to load theme **sections** into the website app.
- Prefer a one-line comment at the top of the variant citing the source path (e.g. “Copied from `ui/themes/Zavcodeui/...` — keep in sync manually”) so drift is visible in code review.

**Scope:** this rule applies to **page-level section components** under the theme’s `components/sections/` (and similar marketing blocks). **Shadcn-style primitives** under `ui/themes/Zavcodeui/src/components/ui/` may still be consumed via **`@zavcode/theme-ui/*`** where the project already does—that is separate from section duplication.

## Images (Payload `Media`)

**Always** resolve upload / relationship image URLs through `apps/website/src/utils/get-payload-image.ts` (import from `@/utils/get-payload-image` in app code):

- Use **`getPayloadImageUrl(image, size?)`** for `src` on `<img>`, Next.js `Image`, CSS `url()`, etc.
- Pass a **`MediaSizeKey`** when the `Media` document has **`sizes`** populated (the helper throws if `sizes` exist but no size is passed—pick the correct variant for layout/performance).
- Plain strings are returned as-is; prefer still going through the helper so CDN base URL and path normalization stay consistent when the value is a `Media` object.

Do **not** concatenate `media.url`, `filename`, or env base URLs by hand in layout sections.

## SSR + data-query quality (header/footer-style globals)

When section/layout-adjacent UI is driven by Payload globals or server data:

- Prefer **full SSR** server components for fetching (`getCached…`) and pass data via props.
- Add a client component only when you need browser interactivity.
- Keep query layer minimal: **fetch → parse (Zod) → pass through**. No hardcoded fallback data in query mappers.
- Avoid TS assertions like `as Locale`; type inputs/params correctly.

## Payload ↔ TypeScript

- `interfaceName` on each Block becomes the **exported interface** in `payload-types.ts` (e.g. `FeaturedProducts`, `CurrentDevelopment`).
- `layout-sections.tsx` types `PageSection` from `Page['Content']['layout']`; new blocks extend the union after `types:generate`.

## Zod (optional)

If you add a Zod schema that models a block’s data:

- Bind with `satisfies z.ZodType<…>` (see `.cursor/rules/payload-zod-satisfies.mdc`).

Not every section needs Zod—add it when parsing/validating block data in queries, hooks, or variant entry (e.g. relationship payloads).

## Common mistakes

- Registering a block only in **Pages.ts** or only in **`payload.config.ts`**.
- Omitting **`dbName` / `interfaceName`** on any Block.
- **`slug`** / **`blockType`** mismatch: Block `slug` must equal `blockType` and the key in `sectionMap`.
- Forgetting **`pnpm run types:generate`** after editing block fields.
- Adding a new file under `fields/` but not re-exporting it from **`fields.ts`** or not appending it to **Pages** / **payload.config** `blocks` arrays.
- Building image URLs manually instead of **`getPayloadImageUrl`** from `@/utils/get-payload-image`.
- **Importing Zavcodeui section components** instead of **copying** markup into `variants/` (see **Zavcodeui theme reference — always copy, never import** above).

## Quick naming guide

| Payload / code | Value |
|----------------|--------|
| Block export | e.g. `FeaturedProductsFields`, `CurrentDevelopmentFields` |
| `slug` | Must match `blockType` and `sectionMap` keys. Existing layout uses a mix (`trusted-by`, `featuredProducts`); align new blocks with the closest sibling sections. |
| `dbName` | snake_case, e.g. `featured_products_section` |
| `interfaceName` | PascalCase, e.g. `FeaturedProducts` |
| Feature folder | product/domain name, e.g. `products/` |
| `variants/` subfolder | kebab-case describing the block theme, e.g. `products-showcase/`, `current-development/`, `contact-booking/` |

After implementation, run **lint** for `apps/website` if available, and smoke-test each block in the admin **layout** field and on a published page.
