@AGENTS.md

# Operating manual — website starter for no-code users (Claude Code additions)

**Read this first, every session.** This is a Payload CMS + Next.js website starter shipped to a
**non-technical ("no-code") user** who drives it through an AI builder. They describe **outcomes**
("a pricing section", "make the hero say X", "here's my Figma") — they will **never** mention
migrations, blocks, types, locales, or invoke a skill. **You are the developer.** Translate their
intent into the correct implementation, pull in the right skills yourself, run the whole pipeline,
and **confirm the spec before building — never assume.**

`AGENTS.md` above (imported) has the full operating manual: build pipeline, always-ask checklist,
project map, and hard rules. This file adds Claude Code-specific skill routing.

## Golden rules

1. **Confirm the spec first.** Before any non-trivial build, batch the open decisions (see
   *Always-ask checklist* in `AGENTS.md`) into **one `AskUserQuestion` round** and wait. Never assume what the user means.
2. **Route every request through a skill.** Match the request in the *Skill router* and load the
   skill(s) — the user won't ask for them.
3. **Any DB-schema change ⇒ a migration.** New/changed/removed collection, global, block, or field
   means you run the **payload-migrations** cycle. The user never asks; you always do.
4. **Keep types honest.** After any schema change, run `pnpm --filter @repo/payload generate:types` (updates `packages/payload-types/src/index.ts`).
5. **Reuse before writing.** Prefer extending an existing section/component over net-new code.
6. **Never invent paths.** Use the *Project map* in `AGENTS.md` — every path there is real.
7. **Design before data — for new sections only.** A section that doesn't exist yet runs
   **design-mode** first (`packages/ui` + Storybook, static props, no Payload), and crosses into
   Payload only after an explicit `AskUserQuestion` **Yes**. A section that already has a block is
   past that — fix it in place, no gate.

## Skill router

| The user says (EN / PL) | Load skills (in order) | Then |
|---|---|---|
| any vibecoder request, first touch | **vibe-coding** | intent → spec → skills |
| **NEW** section: "add a section / block", "nową sekcję", "a pricing / features / testimonials section", "zrób stronę" | **design-mode** → *(gate)* → **website-layout-sections** → **data-fetching** (if it shows CMS data) → **payload-migrations** | Phase A loop, then *Build pipeline* |
| **EXISTING** section: "change how the hero looks", "popraw tę sekcję" (a block for it already exists) | *(no design-mode, no gate)* — edit the `@repo/ui` component in place | verify + done |
| "here's my Figma / design / projekt strony" (a figma.com URL or screenshot) | **figma** (read the design) → **design-system** (if brand/colors are in scope) → **design-mode** → *(gate)* → **website-layout-sections** → **data-fetching** → **payload-migrations** | per section |
| "make it match my brand / these colors / my design system" (tokens, not layout) | **design-system** | overwrite `[data-theme="ui"]` tokens — **no migration** |
| "add / change / remove a field / collection / content type", "nowe pole", "zmień / usuń pole", "zmień schemat" | **payload-migrations** | migration cycle |
| "show / list products / posts / data", "load from the CMS", "make it dynamic" | **data-fetching** → **payload-migrations** (if it needs new schema) | choose SSR/ISR + add a data-query |
| Payload config / collections / hooks / access / validation questions | **payload** (global skill) | per skill |
| "change text / color / spacing only", "tylko zmień kolor/tekst" | theme only (no skill, **no migration**) | edit `@/theme` usage + verify |
| "add structured data / rich results", "improve SEO on this page", "Google preview / social share", "site name / OG image / tracking scripts" | **seo-structured-data** (→ **payload-migrations** if a new content type needs CMS fields) | detect collections → emit applicable JSON-LD; edit Site Settings / `lib/seo` |
| "is my site secure / safe to launch", "security audit / review / harden", "OWASP", "exposed admin / leaked data", "czy bezpieczne", "audyt bezpieczeństwa", "zabezpiecz stronę" | **security-audit** (→ **payload-migrations** if a fix changes schema/config) | audit the 7 areas vs. real files → report by severity → fix app-level, advise infra |

## Skills index

- **design-mode** — Phase A. Fires **only** at the start of a section that doesn't exist yet. Owns `packages/ui` + Storybook (port 6006), static props only, atom reuse/extension, the composed `Pages/<Name>` story, the *Variant sync* checklist, and **the approval gate**. Does **not** fire for an existing, already-wired section — those get fixed in place. Stops at the gate.
- **design-system** — Figma/brand → `[data-theme="ui"]` CSS tokens in `packages/ui/src/styles/theme.css`. **Tokens only, never component code.** No migration.
- **vibe-coding** — the front door: plain-language ask → request type → dev spec → loads the skills → runs the pipeline.
- **payload-migrations** — fires on any schema change (collection/global/block/field, `payload.config.ts`). The migrate cycle + data-safety ladder.
- **website-layout-sections** — Phase B, starts at the design gate. Block def → dual registration → renderer → map → types → migration.
- **data-fetching** — fires when choosing how a page/section loads data (SSR / ISR / cached). The `getCached…` pattern.
- **payload** (global) — Payload config, fields, hooks, access control, queries, validation.
- **figma** (MCP) — fires on a Figma URL / design-to-code; read the design, then run the Build pipeline per section.
- **seo-structured-data** — fires when a page/section is built or a content type is added, or on any SEO / structured-data / social-preview / tracking-script request. Detects which collections exist and emits only the applicable JSON-LD (WebSite/Organization/WebPage/Breadcrumb now; Product/Article/FAQ deferred). Owns `apps/astro/src/lib/seo`, `components/seo`, and the `SiteSettings` global. Run an SEO pass after any new section ships.
- **seo-audit** (generic) — broad SEO framework (crawlability, Core Web Vitals, on-page, international) for "audit my SEO" requests.
- **debug-mode** (global) — fires on "debug this / why is X broken / enter debug mode". In this repo capture is **always-on** in dev: `@repo/debug-server` (`packages/debug-server`) runs with `turbo dev`, the app forwards browser + Astro/Payload console, errors, network, and `window.debug(msg, data)` to it. Dashboard: **http://localhost:7913**; NDJSON at `.debug-logs/debug-dev.log`. Don't spawn the skill's `.cursor` server here — reproduce, then read the log tail.
- **security-audit** — fires on any "is my site secure / safe to launch / security audit / harden / OWASP" request. Audits 7 areas (admin auth, access control, API exposure, secrets, input/XSS, logging, infra) against this repo's real files (`Admins.ts`, `access-guards/`, `cors.ts`, `payload.config.ts` secret, `Media.ts` uploads, `.env`), maps each finding to OWASP Top 10, reports by severity, fixes app-level issues (→ migration if schema/config changes) and advises on infra.
