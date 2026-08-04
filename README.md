# Payload Astro Starter

A production-ready website monorepo: Payload CMS for content, Astro for the site, wired together
with live preview, i18n, a design system and real migrations. Opinionated on purpose — the parts
you'd otherwise spend a week assembling are already assembled.

**New to Payload or Astro?** You don't have to invent conventions. Every layer has one reference
implementation to copy — a section component, a block definition, an adapter, a data query — and
`AGENTS.md` documents where each thing lives and why.

**Working with an AI agent?** The repo ships its own operating manual. `AGENTS.md` (read by any
agent) plus `CLAUDE.md` and 15 skills in `.claude/skills/` spell out the build pipeline, the project
map and the hard rules, so the agent follows how this codebase actually works instead of guessing:
design → block → adapter → types → migration.

**Starting from zero?** Open the project in your AI assistant and run **`/setup`** (or say *"set it
up"*). It handles env files, secrets, Docker, migrations and the admin account, then tells you what
to build first. That's the whole onboarding.

**Payload CMS** (admin + API) · **Astro** (fast SSR site) · **PostgreSQL** · pnpm + Turborepo.

---

## What's in the box

| | |
|---|---|
| **Block-based pages** | Editors compose pages from blocks; new section types slot in cleanly. |
| **One admin panel** | All content, media, settings and accounts in one place — no code. |
| **Live preview** | See a draft before it's public. Most Astro starters don't ship this. |
| **Multilingual** | Per-locale fields wired from day one (pl / en out of the box). |
| **Design system** | Shared `@repo/ui` components + CSS tokens, previewed in Storybook. |
| **SEO ready** | Meta, OG images and JSON-LD structured data built in. |
| **Forms + email** | Contact forms with spam protection; local mail catcher for dev. |
| **Media pipeline** | Upload once, sizes are generated for you. |
| **Jobs queue** | Async/scheduled work (emails, imports, revalidation) already wired. |
| **Debug dashboard** | Browser + server logs streamed to one place in dev. |
| **AI operating manual** | `AGENTS.md` / `CLAUDE.md` + 15 skills: build pipeline, project map, hard rules. |

---

## Run it locally

Needs **Node 20+**, **pnpm**, **Docker**.

**The short way:** open the project in your AI assistant and say *"set it up"* (or `/setup` in
Claude Code). It does everything below, in order, including the secrets ordering trap.

**By hand:**

```bash
cp apps/payload/.env.example apps/payload/.env
cp apps/astro/.env.example apps/astro/.env
# fill every empty secret with: openssl rand -hex 32

docker compose up -d          # Postgres :5432 · Mailpit :8025
pnpm install
pnpm db:migrate
pnpm --filter @repo/payload payload run src/scripts/create-admin.ts   # reads ADMIN_EMAIL / ADMIN_PASSWORD
pnpm dev
```

| | |
|---|---|
| Site | http://localhost:3000 |
| Admin panel | http://localhost:3100/admin |
| Debug dashboard | http://localhost:7913 |
| Mailpit (dev inbox) | http://localhost:8025 |
| Storybook (design mode) | `pnpm --filter @repo/ui storybook` → http://localhost:6006 |

> **One ordering rule that bites.** `PREVIEW_SECRET` and `PAYLOAD_API_SECRET` must hold the **same
> value in both `.env` files**, and `PAYLOAD_API_SECRET` must be set **before the first admin is
> created** — it gets pinned onto that admin as the API key Astro uses to read drafts. Too late?
> `/admin` → Admins → your user → **Enable API Key** → Generate, then paste it into
> `apps/astro/.env`.

No admin is seeded, so a fresh database shows Payload's create-first-user screen if you skip the
script.

---

## Editing content

Log in at `/admin` — locally `http://localhost:3100/admin`, in production wherever it's deployed.
Pages are a stack of blocks: click a page, reorder or edit blocks, hit **Preview** to see the draft
on the real site, then publish. Media, site settings, forms and locales live in the same panel.

---

## Adding a section — with an agent

Both paths below run the **same** pipeline; the only difference is who types it. With an agent you
describe the outcome, not the implementation:

- *"Add a pricing section with three tiers"*
- *"Change the hero headline to 'Welcome to Acme'"*
- *"Here's my Figma — build the landing page"*
- *"Make the site available in Polish too"*

The agent reads `AGENTS.md` and picks the right skill. For a **brand-new section** it runs a
two-phase pipeline with a hard stop in the middle:

1. **Design Mode** — builds the component in `packages/ui` with static props and iterates it in
   Storybook. Nothing touches the CMS yet.
2. **The gate** — it asks *"is this design good?"*. Only an explicit yes advances.
3. **Integration** — Payload block → registration → Astro adapter → `generate:types` → migration.

Changing a section that already exists skips all of that and edits the component in place.

Any assistant that reads `AGENTS.md` works (Cursor, Codex CLI, opencode, …). Claude Code
additionally reads `CLAUDE.md` and the skills in `.claude/skills/`.

---

## Adding a section — by hand

Full step-by-step in
[`AGENTS.md`](AGENTS.md) — the short version:

| Layer | Where |
|---|---|
| Presentational component (Payload-agnostic) | `packages/ui/src/components/sections/<feature>/` |
| Payload block definition | `apps/payload/src/payload/blocks/<feature>.ts` |
| Register it (**both** places) | `collections/Pages.ts` + `payload.config.ts` |
| Astro adapter (block fields → ui props) | `apps/astro/src/components/sections/<feature>/` |
| Dispatcher | `apps/astro/src/components/page-builder/layout-sections.astro` |

Then regenerate types and migrate:

```bash
pnpm --filter @repo/payload generate:types
pnpm --filter @repo/payload generate:migration <name>
pnpm --filter @repo/payload migrate
```

**Every schema change gets a migration.** Non-negotiable — collections, globals, blocks, fields,
and editor-selectable component variants all count.

---

## Layout

```
apps/payload/          Payload CMS — admin + API (:3100)
apps/astro/            Astro frontend — SSR (:3000)
packages/ui/           Design system: components, tokens, Storybook
packages/payload-types/ Generated Payload types (shared)
packages/debug-server/  Dev log collector (:7913)
```

Root commands: `pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm db:migrate` ·
`pnpm db:clean` (destroys the local database).

---

## License

See [`LICENSE`](LICENSE).
