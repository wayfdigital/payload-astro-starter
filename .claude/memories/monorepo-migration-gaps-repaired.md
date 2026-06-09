# Monorepo migration gaps the refactor left — now repaired (Payload wiring + Astro frontend rebuilt)

The solo-Payload → Turborepo migration moved files but left both apps broken. All of the following were fixed in the "bring back the lost utils" task — recorded so the same gaps are recognised if they resurface elsewhere.

## Payload app (apps/payload) — was not compiling
- `src/payload/collections/Pages.ts` imported `heroField` + the 5 blocks from the DELETED path `@/app/(frontend)/[locale]/(website)/components/sections/...`. Blocks live in `src/payload/blocks/`; `payload.config.ts` already imported them correctly. FIX: re-point Pages.ts imports to `../blocks/...` and `../fields/hero`.
- `heroField` existed nowhere (only at the deleted path). FIX: recreated at `apps/payload/src/payload/fields/hero.ts` (recovered via `git show HEAD:'src/app/(frontend)/[locale]/(website)/components/sections/hero/hero.ts'`).
- `useAsTitle: 'title'` referenced a non-existent field → set to `'slug'`.
- `packages/payload-types/src/index.ts` was a 3-line stub → `pnpm --filter @repo/payload generate:types` (config outputFile already points there).
- `src/migrations/` was empty + adapter `push:false` → created/applied an initial migration. `apps/payload/.env` did not exist (only `.env.example`); created it with `DATABASE_URI`, `PAYLOAD_SECRET`, and `SUPER_ADMIN_EMAIL`/`SUPER_ADMIN_PASSWORD` (onInit `seedUsers` seeds an `admins` doc from those).
- A `texts` array field on Pages crashed every query — see [[Payload+Postgres crash: array field on Pages broke ALL queries (Drizzle 'referencedTable' undefined)]]. Removed it.

## packages/ui — missing dependency
`packages/ui/src/styles/globals.css` does `@import 'tw-animate-css'` but the package was never added → Astro 500'd ("Can't resolve 'tw-animate-css'"). FIX: `pnpm --filter @repo/ui add tw-animate-css`.

## Astro app (apps/astro) — frontend layer rebuilt from scratch
Only `Layout.astro` + `index.astro` + `env.d.ts` existed. Rebuilt (Astro-native, adapting the old Next/React utils):
- `src/lib/payload/{client,pages,forms}.ts` — REST data fetching (plain SSR, always fresh; no Next `unstable_cache`).
- `src/components/page-builder/{layout-sections,page-builder}.astro` — the "layout builder UI" as an Astro dispatcher. Static sections (hero, example-block, page-content) render as server-side React via `@astrojs/react`; the interactive FormBlock is a `client:load` island. NOTE: did NOT port the old React `createLayoutBuilder` — an all-React tree can't give per-section island hydration; the `.astro` dispatcher is the correct Astro equivalent (matches the website-layout-sections skill).
- `src/components/sections/{hero,example-block,page-content,form-block}/` — React renderers using `@repo/ui` + shadcn CSS tokens (`--border`, `--card`, `--primary`…). The old `@/theme` import and `--template-color-*` tokens are gone.
- i18n: `astro.config.mjs` `i18n` (locales `en`,`pl`, `prefixDefaultLocale:false`) + a single `src/pages/[...slug].astro` that parses a leading `/<locale>/` prefix (the Payload slug is non-localized). Plus `404.astro` and `src/i18n/locales.ts`.

## Build/run gotchas hit
- Run `pnpm install` at the root first — apps/astro had no node_modules and the `astro` bin was missing.
- `astro check` needs `@astrojs/check` (the `typecheck` script referenced it but it wasn't installed) → added as a devDep.
- The FormBlock island runs in the browser, where non-`PUBLIC_` env vars are stripped — pass `PAYLOAD_API_URL` from the `.astro` page into the island as a prop; don't read `import.meta.env` in island code.
- Form submissions are gated by reCAPTCHA: the form-builder config sets `requireRecaptcha` defaultValue `true` + a `formSubmissionOverrides` validate hook → `POST /api/form-submissions` returns 400 "Please complete the reCAPTCHA" without a token. Wiring a reCAPTCHA widget (site key) into the island is a separate task, or set `requireRecaptcha:false` per form.

Verified working: Payload `/admin` + `/api/pages` 200; Astro `/about` renders hero+page-content+exampleBlock+form, `/pl/about` locale routing, unknown slug → 404; `astro check` 0 errors. Related: [[Repo structure conventions — what lives where, imports, and what to reuse]].
