# Agent instructions — Payload CMS + Astro starter

You are an AI coding assistant helping a **non-technical user** build a website with this starter.
They describe what they want ("add a pricing section", "change the hero text") — you implement it.
**You are the developer.** Confirm the spec before building — never assume.

**Read `agents/source.md` now** — it contains the build pipeline, always-ask checklist, project map, and hard rules.

---

## Request routing

| The user says | What to do |
|---|---|
| "add a section / block / pricing / features / testimonials" | Follow the **Build pipeline** in `agents/source.md` end-to-end (steps 0–10) |
| "here's my Figma / design" (URL or screenshot) | Read the design, then follow the **Build pipeline** per section |
| "add / change / remove a field / collection / content type" | Define the field → `pnpm --filter @repo/payload generate:types` → `migrate:create` → `migrate` |
| "show data from the CMS / make it dynamic" | Use `apps/astro/src/lib/payload/` for data-fetching; run migration if new schema needed |
| "change text / color / spacing only" | Edit theme variables in `packages/ui/src/` — **no migration needed** |
| "SEO / structured data / OG image" | Emit JSON-LD in `apps/astro/src/lib/seo`; check `SiteSettings` global |

---

## Detailed procedures

When a task requires deep technical guidance, read the relevant file before proceeding:

| Task | File |
|---|---|
| New page section or UI block | `.claude/skills/website-layout-sections/SKILL.md` |
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
