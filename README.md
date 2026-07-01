# Payload Astro Starter

A ready-made foundation for a website — set it up once, then build it by describing **what you want**,
whether you're a developer or a non-technical user working with an AI assistant.

## What you get

- **Made to grow** — pages are built from blocks, so adding brand-new sections later is quick and clean.
- **Easy to manage** — all content lives in one friendly panel, no code required.
- **Ready for the world** — set up for multiple languages from day one, so going international is simple.
- **Live preview** — see your draft before it's public — a feature most Astro starters don't ship with.
- **Built for speed** — fast by default and easy to keep fast as the site grows.
- **Found on Google** — search-engine basics and clean social previews come ready out of the box.
- **Consistent by design** — one shared look (colors, fonts, styles) keeps every page on-brand.
- **Forms that just work** — contact forms with spam protection included.
- **Handles your media** — upload images once, the system prepares the right sizes for you.
- **Secure and organized** — proper accounts, access control, and site-wide settings in one place.
- **Email-ready** — send messages (e.g. from forms) with a safe local preview while building.
- **Background jobs ready** — a built-in jobs queue is wired up, so scheduled and async work (emails, imports, revalidation) can be added without extra setup.

---

## Which path are you on?

| I am… | My path |
|---|---|
| A developer setting this up for myself or a client | → [For developers](#for-developers) |
| A non-technical user who received this project | → [For non-technical users](#for-non-technical-users) |

---

## For developers

### 1. Prerequisites

Node.js 20+, [pnpm](https://pnpm.io), Docker.

### 2. Environment

```bash
cp apps/payload/.env.example apps/payload/.env   # fill in the variables (incl. PAYLOAD_SECRET)
cp apps/astro/.env.example apps/astro/.env        # frontend env (PAYLOAD_API_URL, etc.)
```

### 3. Choose your AI agent

This starter ships with a full operating manual for every supported AI assistant — the agent knows
the build pipeline, project structure, and rules from day one, no setup required. Just open the
project with your preferred tool:

| Agent | Config file |
|---|---|
| [Claude Code](https://claude.ai/code) | `CLAUDE.md` |
| [Cursor](https://cursor.sh) | `AGENTS.md` |
| [OpenAI Codex CLI](https://github.com/openai/codex) | `AGENTS.md` |
| [opencode](https://opencode.ai) | `AGENTS.md` |
| Other | `AGENTS.md` (read natively by most AI coding tools) |

> To update the operating manual: edit `AGENTS.md` or `CLAUDE.md` directly. See [`agents/README.md`](agents/README.md).

### 4. Start

```bash
docker compose up -d   # database + local mail
pnpm install
pnpm dev               # panel: http://localhost:3100/admin · site: http://localhost:3000
```

### 5. First run

Create the admin account at `http://localhost:3100/admin`, then start adding content or pages.

---

## For non-technical users

You've received a live website. You don't need to run anything or touch code.

**To edit content:** open the admin panel at the URL your developer gave you (usually
`yourdomain.com/admin`), log in with your credentials, and click any page, block, or field to
change it.

**To build new things with an AI assistant:** open this project folder in your AI tool (Claude
Code, Cursor, or another supported agent) and describe what you want:

- *"Add a pricing section with three tiers"*
- *"Change the hero headline to 'Welcome to Acme'"*
- *"Make the site available in Polish as well"*

The AI has the full operating manual for this project and will handle all the technical steps.

---

## Tech stack

Payload CMS · Astro · PostgreSQL · pnpm monorepo (Turborepo)
