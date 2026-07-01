# Operating manual — Payload CMS + Astro starter

This is a Payload CMS + Astro website starter for a **non-technical user** who describes outcomes
and lets you implement them. They describe **what they want** — you do all the technical work.
**Confirm the spec before building — never assume.**

---

## Build pipeline (new section / from a design)

Run **in order**:

0. **Confirm spec** — Ask the user the questions in the *Always-ask checklist* below. One round, all at once. Never assume.
1. **Reuse check** — Closest existing `@repo/ui` section in `packages/ui/src/components/sections/`, block in `apps/payload/src/payload/blocks/`, and adapter in `apps/astro/src/components/sections/`.
2. **Build the presentational component** — `packages/ui/src/components/sections/<feature>/<feature>.tsx`: a **pure, Payload-agnostic** React component (plain props, **no** `@repo/payload-types`). Wire all three export points (`<feature>/index.ts` → `sections/index.ts` → `src/index.ts`). **All new section UI lives here.** Reference: `packages/ui/src/components/sections/hero/hero.tsx`. **Ship a co-located `<feature>.stories.tsx`** (copy `packages/ui/src/components/_TEMPLATE.stories.tsx.txt`) and preview it with `pnpm --filter @repo/ui storybook` before wiring the block/adapter.
3. **Define the block** — `apps/payload/src/payload/blocks/<feature>.ts` → `export const <Name>Block: Block = { slug, dbName, interfaceName, labels, fields }` (`localized: true` on per-locale copy).
4. **Register in BOTH** `apps/payload/src/payload/collections/Pages.ts` (`layout` blocks) **and** `apps/payload/src/payload.config.ts` (`blocks`).
5. **Build the Astro adapter** — `apps/astro/src/components/sections/<feature>/index.tsx`: a **thin** component typed by the block interface that **maps block fields onto the `@repo/ui` component's props** (no markup of its own). Reference: `apps/astro/src/components/sections/hero/variants/default-hero.tsx`. For CMS data, use the typed layer in `apps/astro/src/lib/payload/`.
6. **Wire the map** — add `blockType → component` to `apps/astro/src/components/page-builder/layout-sections.astro` (or equivalent).
7. **Generate types** — `pnpm --filter @repo/payload generate:types` (writes `packages/payload-types/src/index.ts`).
8. **Migrate** — DB migration cycle: `docker compose up -d postgres` → `pnpm --filter @repo/payload migrate:create <name>` → review the generated migration file → `pnpm --filter @repo/payload migrate`. Commit the migration file with the change.
9. **Verify** — `/admin` → Pages → `layout`, and the rendered Astro page.
10. **SEO pass** — Does the new section/content type warrant structured data (Product/Article/FAQ/BreadcrumbList/etc.)? Emit applicable JSON-LD in `apps/astro/src/lib/seo`. Check `SiteSettings` global for site-level schema.

---

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

---

## Monorepo structure

```
apps/payload/   — Headless Payload CMS (Next.js, port 3100) — admin + API only
apps/astro/     — Astro frontend (SSR, port 3000)
packages/ui/    — Shared design system (React components, CSS vars, shadcn tokens)
packages/payload-types/  — Generated Payload TypeScript types (shared)
```

---

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
| Storybook (design-system preview) | `pnpm --filter @repo/ui storybook` (port 6006). Config `packages/ui/.storybook/`; stories co-located as `*.stories.tsx`; token reference at `packages/ui/src/foundations/`; new-component template `packages/ui/src/components/_TEMPLATE.stories.tsx.txt` |
| Section UI components | `packages/ui/src/components/sections/<feature>/` — **pure, Payload-agnostic** React; all new section UI lives here (ref: `hero/hero.tsx`). Export via `<feature>/index.ts` → `sections/index.ts` → `src/index.ts` |
| Astro section adapters | `apps/astro/src/components/sections/<feature>/index.tsx` — thin; maps block fields → `@repo/ui` component props (ref: `hero/variants/default-hero.tsx`) |
| Astro layouts | `apps/astro/src/layouts/Layout.astro` |
| Astro pages | `apps/astro/src/pages/` |
| Payload API base URL | `PAYLOAD_API_URL` env in `apps/astro/.env` (default `http://localhost:3100`) |
| Media (images) | `apps/payload/src/payload/collections/Media.ts` (`imageSizes`; use `media.url` / `media.sizes.*.url`) |

---

## Hard rules — never

- Never make a schema change without running a migration.
- Never leave `packages/payload-types/src/index.ts` stale — regenerate after every schema change.
- Never register a block in only one of `Pages.ts` / `payload.config.ts`.
- Never put a section's markup in the Astro adapter — section UI belongs in a `@repo/ui` component (`packages/ui/src/components/sections/`); the adapter only maps block fields onto its props.
- Never import `@repo/payload-types` into a `@repo/ui` component — components stay Payload-agnostic; only the Astro adapter knows the block types.
- Never import from `src/theme/` — use `@repo/ui` instead.
- Never invent file paths — use the *Project map*.
- Never assume the spec — ask (before every non-trivial build, confirm the spec with the user).
