# Repository structure conventions

## Workspace layout

```
apps/
  payload/   — Headless Payload CMS (Next.js shell, admin + API only, port 3100)
  astro/     — Public website frontend (Astro 6 SSR, port 3000)
packages/
  ui/        — Design system: React primitives + CSS variables
  payload-types/ — Generated TypeScript types from Payload (never hand-edit)
```

**Dependency direction — one-way, no exceptions:** `packages/*` ← `apps/*`. A package NEVER
imports from an app. An app MAY import from a package.

## Where each type of code lives

| What | Lives in | Import from |
|---|---|---|
| Payload block **schema** (fields, slug, dbName) | `apps/payload/src/payload/blocks/<name>.ts` | (internal to payload app) |
| Payload **collections** | `apps/payload/src/payload/collections/` | (internal) |
| Payload **globals** | `apps/payload/src/payload/globals/` | (internal) |
| Payload reusable **fields** (e.g. `heroField`) | `apps/payload/src/payload/fields/` | (internal) |
| Payload **access guards** | `apps/payload/src/payload/access-guards/` | (internal) |
| Payload **migrations** | `apps/payload/src/migrations/` | (internal) |
| Generated TypeScript types | `packages/payload-types/src/index.ts` | `@repo/payload-types` |
| UI primitives (Button, Card, Heading…) | `packages/ui/src/components/elements/` | `@repo/ui` |
| UI section composites (Hero, PageContent…) | `packages/ui/src/components/sections/` | `@repo/ui` |
| CSS design tokens | `packages/ui/src/styles/theme.css` | `@repo/ui/styles/theme.css` |
| Astro **data layer** (REST fetch from Payload) | `apps/astro/src/lib/payload/` | (internal to astro) |
| Astro **page builder** (dispatcher + page) | `apps/astro/src/components/page-builder/` | (internal) |
| Astro **section renderers** | `apps/astro/src/components/sections/<name>/index.tsx` | (internal) |
| Astro **pages / routes** | `apps/astro/src/pages/` | (internal) |

## Import aliases

- `apps/payload`: `@/payload-types` or `@repo/payload-types`; `@payload-config` → `payload.config.ts`; `@/*` → `apps/payload/src/*`.
- `apps/astro`: `@repo/ui`, `@repo/payload-types`; data via REST (`import.meta.env.PAYLOAD_API_URL`).
- `packages/ui`: NO `@repo/*` imports — must be self-contained (peer deps: react, react-dom).

## CSS tokens (shadcn names — no `--template-*` prefix)

`--primary`/`--primary-foreground`, `--secondary`, `--background`, `--foreground`, `--card`
(was `--surface`), `--muted`/`--muted-foreground`, `--border`, `--accent`, `--destructive`,
`--radius*`, `--shadow*`, `--font-*`, `--spacing-*`, `--max-width`, `--header-height`,
`--gradient-*`. Applied via `data-theme="ui"` on `<body>` (Astro `Layout.astro` already does this).
Dark mode: add class `dark`.

## What already exists — reuse before writing

### Payload blocks (`apps/payload/src/payload/blocks/`)
- `page-content.ts` → `pageContentBlock1/2/3` · `example-block.ts` → `ExampleBlock` · `forms.ts` → `FormBlock`.
- Reusable field: `apps/payload/src/payload/fields/hero.ts` → `heroField` (the page `hero` group).
- NOTE: the Pages `texts` array field was REMOVED — it crashed all queries (see the Payload+Postgres crash memory).

### UI (`@repo/ui`)
Elements: `Button`, `Card`, `Container`, `Heading`, `Text`, `Badge`. Layout: `Header`, `Footer`.
Sections: `Hero`, `PageContent`, `Contact`. Provider: `ThemeProvider`. Config: `defaultTheme`.
`packages/ui/src/styles/globals.css` imports `tw-animate-css` (a real dep — keep it installed).

### Payload collections/globals/plugins
Collections: `Pages` (slug + `hero` group + `layout` blocks; `read: () => true`, no drafts), `Media` (S3), `Admins`, `Users`.
Globals: `FooterSettings`, `CookieSettings`. Plugins: SEO, Form Builder (defaults `requireRecaptcha: true`), S3, Payload Cloud.

### Astro frontend (`apps/astro/src/`) — BUILT (no longer empty)
- `lib/payload/{client,pages,forms}.ts` — REST data layer (`getPageBySlug`, `getAllPages`, `payloadFetch`, `submitForm`). Plain SSR, always fresh.
- `components/page-builder/{layout-sections,page-builder}.astro` — dispatcher (`switch(blockType)`; FormBlock is a `client:load` island) + Hero-then-layout page.
- `components/sections/{hero,example-block,page-content,form-block}/` — `.tsx` renderers using `@repo/ui` + tokens. Sections receive block fields as props (dispatcher spreads `{...section}`).
- `pages/[...slug].astro` (+ `404.astro`) — locale-prefix-aware routing; `i18n/locales.ts` mirrors Payload's `en`/`pl`.
- `astro.config.mjs` — Astro 6, `output: 'server'`, `adapter: node({ mode: 'standalone' })`, i18n `prefixDefaultLocale: false`.

## Naming conventions

Block export PascalCase (`ExampleBlock`); `slug`/`blockType` camelCase (`exampleBlock`); `dbName`
snake_case (`example_block`); `interfaceName` PascalCase; block file kebab-case
(`example-block.ts`); Astro section folder kebab-case (`sections/example-block/`, `index.tsx`);
packages `@repo/<name>`.

## "New code goes where?"

1. Pure visual component → `packages/ui/src/components/elements/`.
2. Reusable section, no Payload schema → `packages/ui/src/components/sections/`.
3. Payload field/collection/global/block schema → `apps/payload/src/payload/`.
4. Page section rendering CMS data on the website → `apps/astro/src/components/sections/<name>/index.tsx` + a `case` in `layout-sections.astro`.
5. Astro page/route → `apps/astro/src/pages/`. Data fetch helper → `apps/astro/src/lib/payload/`.
6. Shared TS types → regenerate via `pnpm --filter @repo/payload generate:types`.

## Key "never do" rules

- Never import from `src/theme/` — gone; use `@repo/ui`.
- Never hand-edit `packages/payload-types/src/index.ts` — it's generated.
- Never register a block in only ONE of `Pages.ts` / `payload.config.ts` — must be both.
- Never put frontend rendering in `apps/payload` (headless), and never let a package import from an app.
- Never read `import.meta.env.PAYLOAD_API_URL` inside a `client:*` island — pass it down as a prop.
