# Astro frontend upgraded to v6.4.4 + @astrojs/node adapter — clean, verified, no code changes

`apps/astro` was upgraded **Astro 5.18 → 6.4.4** (+ `@astrojs/react` 4 → **5.0.7**), and the **`@astrojs/node` v10.1.3** adapter was added. `astro check` passes (0 errors), dev + production build + all routes verified (`/`, `/about` with all sections, `/pl/about` locale routing, 404) — **no source changes were required** for the upgrade.

## Adapter (production build)
> **Superseded.** The Node adapter has since been replaced by `@astrojs/cloudflare` (see
> `apps/astro/astro.config.mjs`). The paragraph below describes the state at upgrade time only.

`astro.config.mjs` then set `adapter: node({ mode: 'standalone' })` alongside `output: 'server'`. `pnpm --filter @repo/astro build` succeeds and emits `dist/server/entry.mjs`; run it with `node ./dist/server/entry.mjs` (env: `HOST`, `PORT`, and `PAYLOAD_API_URL`). Verified the built standalone server serves `/about` (200) and `/nonexistent` (404). `@astrojs/node` v10 is the Astro-6 line (peer `astro: ^6.3.0`). `dist/` is gitignored.

## Why the v6 upgrade was painless here
Our frontend already avoided everything Astro 6 removed/changed:
- i18n uses `routing.prefixDefaultLocale: false` + a manual locale-prefix parse in `src/pages/[...slug].astro`, so the v6 flip of `redirectToDefaultLocale`'s default (true → **false**) had no effect.
- SSR via `output: 'server'` (no `getStaticPaths`), ESM `astro.config.mjs`, no content collections, no `<ViewTransitions />`, no `Astro.glob()`.
- `@tailwindcss/vite` 4.1.18 already declares `vite: ^5||^6||^7`, so Astro 6's **Vite 7** bump needed no change. `@astrojs/check` 0.9.9 works on v6.

## Astro 6 facts to remember
- Requires **Node ≥ 22.12** (repo runs 22.13). Ships **Vite 7**, Zod 4, Shiki 4.
- **ESM-only config** — `.cjs`/`.cts` config files removed.
- Removed: legacy content collections (`src/content/config.ts` → `src/content.config.ts` Content Layer API), `<ViewTransitions />` → `<ClientRouter />`, `Astro.glob()` → `import.meta.glob()`, the `getStaticPaths()` Astro object.

KB audit done alongside: the `website-layout-sections` project skill is version-agnostic (`.astro`/`.tsx`, `Astro.props`, `import.meta.env`, `client:*`, REST fetch) and remains accurate for Astro 6 — no edit needed. The local `.claude/skills/astro/SKILL.md` was corrected (it had listed `.cjs` config as valid) and given a v6 requirements note. Related: [[Monorepo migration gaps the refactor left — now repaired (Payload wiring + Astro frontend rebuilt)]].
