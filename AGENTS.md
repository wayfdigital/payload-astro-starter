# Operating manual — Payload CMS + Astro starter

This is a Payload CMS + Astro website starter for a **non-technical user** who describes outcomes
and lets you implement them. They describe **what they want** — you do all the technical work.
**Confirm the spec before building — never assume.**

---

## Request routing

| The user says | What to do |
|---|---|
| "set it up / first run / get this running locally" (**new machine, nothing runs yet**) | Follow **First run** below, in order |
| "add a section / block / pricing / features / testimonials" (**new** — no block exists yet) | Follow the **Build pipeline** below end-to-end (steps 0–10), starting in **Design Mode** |
| "change how <existing section> looks" (a block for it **already exists**) | **Skip Design Mode.** Edit the `@repo/ui` component in place, verify, done — no gate, no Storybook loop |
| "here's my Figma / design" (URL or screenshot) | Read the design, then follow the **Build pipeline** per section |
| "add / change / remove a field / collection / content type" | Define the field → `pnpm --filter @repo/payload generate:types` → `migrate:create` → `migrate` |
| "show data from the CMS / make it dynamic" | Use `apps/astro/src/lib/payload/` for data-fetching; run migration if new schema needed |
| "change text / color / spacing only" | Edit theme variables in `packages/ui/src/` — **no migration needed** |
| "SEO / structured data / OG image" | Emit JSON-LD in `apps/astro/src/lib/seo`; check `SiteSettings` global |

---

## First run (new machine)

No admin is seeded — a fresh database shows Payload's **create first user** screen. The one thing
that must happen *before* that first admin exists is `PAYLOAD_API_SECRET`: it's the Admins API key
Astro uses to read drafts, and the `pinApiKeyToFirstAdmin` hook in
`apps/payload/src/payload/collections/Admins.ts` pins it onto the first admin only if the value is
already set. Set it afterwards and preview stays broken.

1. **Env** — `cp apps/payload/.env.example apps/payload/.env` and the same for `apps/astro`, **only
   if the file doesn't exist**. In the same message, ask the user for the **admin email and
   password** so step 2 can write them in. Both come **only** from the user's answer in chat —
   never from the session's `userEmail`, `git config user.email`, or an address found in the repo.
2. **Secrets** — fill **empty** values with `openssl rand -hex 32`: `PAYLOAD_SECRET`,
   `PREVIEW_SECRET`, `PAYLOAD_API_SECRET` in `apps/payload/.env`; `PREVIEW_SECRET` and
   `PAYLOAD_API_SECRET` in `apps/astro/.env` must be the **same values**. Put the user's
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `apps/payload/.env` too. Never overwrite a variable that
   already has one.
3. **Services** — `docker compose up -d` (Postgres 5432, Mailpit 1025/8025).
4. **Install + migrate** — `pnpm install` then `pnpm db:migrate`.
5. **First admin** — `pnpm --filter @repo/payload payload run src/scripts/create-admin.ts` (it reads
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `apps/payload/.env`). If the user gave no credentials, they
   register at `http://localhost:3100/admin` — the hook pins the key either way.
6. **Start** — `pnpm dev`: panel `:3100/admin`, site `:3000`, debug dashboard `:7913`.
7. **Verify** — open a page in the panel, hit Preview, confirm the draft renders on `:3000`.

If an admin already exists and `PAYLOAD_API_SECRET` was only just generated, the hook won't
backfill: `/admin` → Admins → your user → **Enable API Key** → Generate, then copy the generated
value into `apps/astro/.env`.

---

## Build pipeline (new section / from a design)

**This pipeline is for sections that don't exist yet.** If a block for the section is already in
`apps/payload/src/payload/blocks/`, it's integrated — edit the `@repo/ui` component in place and
skip Phase A entirely. There's nothing to gate when there's no integration step waiting.

Run **in order**. Two phases with a hard gate between them: **Phase A** loops and touches only
`packages/ui`; **Phase B** runs once, after approval.

### Phase A — Design Mode (steps 0–2, repeat until the user approves)

0. **Confirm spec** — Ask the user the questions in the *Always-ask checklist* below. One round, all at once. Never assume.
1. **Reuse check** — Closest existing `@repo/ui` section in `packages/ui/src/components/sections/`, and the **atoms** in `packages/ui/src/components/elements/` it composes from. In Phase A "reuse" means atoms: build the section out of `Container` / `Heading` / `Text` / `Button` / `Card` / `Badge` / `CmsLink`. If the design needs a look an atom lacks, **extend that atom's variant union** — never inline one-off styles in the section.
2. **Build the presentational component** — `packages/ui/src/components/sections/<feature>/<feature>.tsx`: a **pure, Payload-agnostic** React component (plain props, **no** `@repo/payload-types`). Wire all three export points (`<feature>/index.ts` → `sections/index.ts` → `src/index.ts`). **All new section UI lives here.** Reference: `packages/ui/src/components/sections/hero/hero.tsx`. **Ship a co-located `<feature>.stories.tsx`** (copy `packages/ui/src/components/_TEMPLATE.stories.tsx.txt`) plus a composed `Pages/<Name>` story, and iterate in Storybook (`pnpm --filter @repo/ui storybook`, port 6006). **Do not open `apps/payload` or `apps/astro` in this phase.** Full loop, atom rules and the page-story pattern: `.claude/skills/design-mode/SKILL.md`.

### GATE — the user approves the design (mandatory, explicit)

After every design round, ask **one `AskUserQuestion`**: *"Is this design good now?"* with options
**"Yes — wire it up to the CMS"** / **"No — change something"**. **Only that explicit Yes advances
to Phase B.** A compliment ("nice", "ładnie"), a 👍, or silence is **not** approval — it's another
round of step 2. Never start Phase B on your own judgement.

### Phase B — Payload integration (steps 3–10, only after the gate)

If Phase A added or renamed a variant on an **editor-selectable** atom (`Button` / `CmsLink`),
Phase B is required **even if no new block was created** — see *Variant sync* in
`.claude/skills/design-mode/SKILL.md`.

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
| First admin (setup) | `apps/payload/src/scripts/create-admin.ts` (run via `payload run`); API key pinned by the hook in `apps/payload/src/payload/collections/Admins.ts` |
| i18n (Payload) | `apps/payload/src/i18n/const.ts` · `apps/payload/src/i18n/payload-locales.ts` |
| Generated types | `packages/payload-types/src/index.ts` (via `pnpm --filter @repo/payload generate:types`) |
| Design system | `packages/ui/src/` — imports as `@repo/ui`; CSS vars follow shadcn conventions (`--primary`, `--background`, etc.) |
| Storybook — **the Design Mode surface** | `pnpm --filter @repo/ui storybook` (port 6006). Not started by `pnpm dev`. Config `packages/ui/.storybook/`; stories co-located as `*.stories.tsx`; token reference at `packages/ui/src/foundations/`; new-component template `packages/ui/src/components/_TEMPLATE.stories.tsx.txt`. Story namespaces: `Elements/` · `Layout/` · `Sections/` · `Pages/` (composed page previews) |
| Atoms / design-system elements | `packages/ui/src/components/elements/` — `Button`, `CmsLink`, `Card`, `Badge`, `Heading`, `Text`, `Container`. Variants are a hand-rolled union + `Record<Variant, CSSProperties>` map (**no CVA** — this system themes via CSS vars). Need a new look? **Extend the union**, never inline a one-off style in a section |
| Section UI components | `packages/ui/src/components/sections/<feature>/` — **pure, Payload-agnostic** React; all new section UI lives here (ref: `hero/hero.tsx`). Export via `<feature>/index.ts` → `sections/index.ts` → `src/index.ts` |
| Astro section adapters | `apps/astro/src/components/sections/<feature>/index.tsx` — thin; maps block fields → `@repo/ui` component props (ref: `hero/variants/default-hero.tsx`) |
| Astro layouts | `apps/astro/src/layouts/Layout.astro` |
| Astro pages | `apps/astro/src/pages/` |
| Payload API base URL | `PAYLOAD_API_URL` env in `apps/astro/.env` (default `http://localhost:3100`) |
| Media (images) | `apps/payload/src/payload/collections/Media.ts` (`imageSizes`; use `media.url` / `media.sizes.*.url`) |

---

## Detailed procedures

When a task requires deep technical guidance, read the relevant file before proceeding:

| Task | File |
|---|---|
| First run / local setup / missing `PAYLOAD_API_SECRET` | `.claude/skills/setup/SKILL.md` |
| Designing a **new** section (Phase A, the gate) | `.claude/skills/design-mode/SKILL.md` |
| New page section or UI block (Phase B, after the gate) | `.claude/skills/website-layout-sections/SKILL.md` |
| DB schema change / migration | `.claude/skills/payload-migrations/SKILL.md` |
| Data fetching (SSR / ISR / cached) | `.claude/skills/data-fetching/SKILL.md` |
| Payload config, fields, hooks, access control | `.claude/skills/payload/SKILL.md` |
| Payload CMS + Next.js App Router patterns | `.claude/skills/payloadcms/SKILL.md` |
| Payload Local API (server-side queries) | `.claude/skills/payload-local-api/SKILL.md` |
| SEO / structured data / JSON-LD | `.claude/skills/seo-structured-data/SKILL.md` |
| SEO audit | `.claude/skills/seo-audit/SKILL.md` |
| Security audit / hardening | `.claude/skills/security-audit/SKILL.md` |
| Astro 6 patterns | `.claude/skills/astro/SKILL.md` |
| Design system / Storybook / @repo/ui | `.claude/skills/design-system/SKILL.md` |
| Migrating from another CMS | `.claude/skills/cms-migration/SKILL.md` |
| Project gotchas | `.claude/memories/` |
| Coding patterns | `.claude/patterns/` |

---

## Hard rules — never

- Never wire a **new** section into Payload before the user has explicitly approved the design — Phase B starts only after the Design Mode gate. (A section that already has a block is past this; fix it in place.)
- Never add a variant to `Button` / `CmsLink` without running the *Variant sync* checklist (`.claude/skills/design-mode/SKILL.md`) — an editor-selectable variant is **schema**, so it needs `generate:types` + a migration.
- Never make a schema change without running a migration.
- Never leave `packages/payload-types/src/index.ts` stale — regenerate after every schema change.
- Never register a block in only one of `Pages.ts` / `payload.config.ts`.
- Never put a section's markup in the Astro adapter — section UI belongs in a `@repo/ui` component (`packages/ui/src/components/sections/`); the adapter only maps block fields onto its props.
- Never import `@repo/payload-types` into a `@repo/ui` component — components stay Payload-agnostic; only the Astro adapter knows the block types.
- Never import from `src/theme/` — use `@repo/ui` instead.
- Never hardcode a color/radius/shadow in a section or atom — read a token from `packages/ui/src/styles/theme.css`. Missing token? That's a **design-system** job, not a hex.
- Never invent file paths — use the *Project map*.
- Never assume the spec — ask (before every non-trivial build, confirm the spec with the user).
