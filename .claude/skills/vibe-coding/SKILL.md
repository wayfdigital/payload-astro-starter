---
name: vibe-coding
description: Turn a no-code user's plain-language request ("a pricing section", "make the hero say X", "here's my Figma") into a developer-ready spec, then load the exact skills needed to build it and run the pipeline. Use as the FIRST step on any vibecoder request before touching code.
---

# Run skill generator — vibecoder prompt → dev spec → skills → build

This repo ships to a **non-technical ("vibecoder") user** who describes **outcomes**, never
implementation. They will never say "migration", "block", "locale", or invoke a skill. **You are
the developer.** This skill is the front door: it takes their plain-language ask, turns it into a
concrete developer spec, pulls in the right skills automatically, and kicks off the build.

**Running the project locally** — when the user wants to stand up the stack on their machine
(env → docker → install → migrate → dev), follow the `local-setup` memory file
(`/Users/kacperzawojski/.claude/projects/-Users-kacperzawojski-code-payload-starter/memory/local-setup.md`),
which mirrors the *Getting started* section of `README.md`.

Run this **before** writing any code on a vibecoder request. It is the executable form of the
*Skill router* + *Build pipeline* in `CLAUDE.md` — when they conflict, `CLAUDE.md` wins.

## Pipeline (run in order)

### 1. Read the intent
Restate what the user wants in one plain sentence. Detect the **request type** — this drives
everything downstream:

| Signal in the request (EN / PL) | Request type |
|---|---|
| "a pricing / features / testimonials section", "add a block", "nową sekcję" | **new section** |
| a figma.com URL or a design screenshot, "here's my design", "projekt strony" | **from design** |
| "add / change / remove a field / collection / content type", "nowe pole", "zmień schemat" | **schema change** |
| "show / list products / posts", "load from the CMS", "make it dynamic" | **dynamic data** |
| "change text / color / spacing only", "tylko zmień kolor/tekst" | **content/theme only** |
| Payload config / hooks / access / validation question | **payload config** |
| "is my site secure / safe to launch", "security audit / review / harden", "OWASP", "czy bezpieczne", "audyt bezpieczeństwa", "zabezpiecz stronę" | **security audit** |

If the request mixes types (e.g. a Figma with several sections, some static, some CMS-driven),
split it into one line per deliverable and route each independently.

### 2. Map to skills (load them now — the user won't ask)

| Request type | Load skills, in order |
|---|---|
| **new section** | `website-layout-sections` → `data-fetching` (if it shows CMS data) → `payload-migrations` |
| **from design** | `figma` (read the design) → then treat each section as **new section** |
| **schema change** | `payload-migrations` (+ `payload` for field/hook/access design) |
| **dynamic data** | `data-fetching` → `payload-migrations` (if it needs new schema) |
| **content/theme only** | none — edit `@repo/ui` tokens / copy, **no migration** |
| **payload config** | `payload` (global skill) — for a **custom HTTP endpoint**, use the `defineEndpoint` wrapper (see Hard rules), never a bare `Endpoint` |
| **security audit** | `security-audit` (+ `payload-migrations` if a fix changes schema/config) |

### 3. Confirm the spec — ONE `AskUserQuestion` round
Never assume. Batch every open developer decision into a **single** `AskUserQuestion` round and
wait. Pull the questions that actually apply from the *Always-ask checklist*:

- **Content source** — static copy, a CMS-managed field, or a relationship to an existing collection?
- **Localization** — should the text be `localized` (pl / en)?
- **Responsiveness** — any specific mobile / tablet behavior?
- **Interactivity** — static, or client-side (filters, carousel, form)?
- **Freshness** — always-fresh (SSR) vs cached + on-demand revalidate (default: cached via `src/data-queries`)?
- **SEO** — does it need meta / OG / structured data?
- **Naming & placement** — block name, which page/slug, and position in the layout.
- **Reuse** — closest existing section to start from.
- **(Figma)** — which frames are in scope, and the breakpoint set.

Skip questions the user already answered or that don't apply. **State any safe default you adopt**
so they can correct it. Phrase options in outcome language ("text I can edit in the admin" rather
than "a localized text field"), never jargon.

### 4. Emit the dev spec
Write a short, concrete spec the build steps can follow verbatim:

```
GOAL:        <one sentence, the user's outcome>
REQUEST TYPE: <new section | from design | schema change | dynamic data | content/theme | payload config>
SKILLS:      <ordered list loaded in step 2>
BLOCK/FIELD: <name, slug, dbName, interfaceName, fields + types + which are localized>
PAGE/SLUG:   <where it renders, position in layout>
DATA:        <static | CMS field | relationship to X> · freshness: <SSR | cached>
SCHEMA?:     <yes → migration required | no>
REUSE:       <closest existing block/section to extend>
```

### 5. Hand off to the build
Run the relevant skill's checklist. For a new section / design that is the **Build pipeline** in
`CLAUDE.md`: reuse check → define block → register in **both** `Pages.ts` and `payload.config.ts`
→ Astro renderer → wire `layout-sections.astro` → `generate:types` → migration → verify.

### 6. Wrap up — confirm done + offer a memory
After the build is implemented and verified, **always** close the loop with the user. Emit a
**large H1 heading** (markdown `#`) so it visually stands out as the end-of-work checkpoint, then
ask two things:

```
# Czy to wszystko? ✅
```

1. **Is this everything?** — confirm the deliverable matches what they wanted, or if there's
   anything else to add/adjust before we call it done.
2. **Generate a memory?** — if anything non-obvious was decided or discovered during the build (a
   gotcha, an architectural choice, a project convention), recommend writing a `type: project`
   memory file and adding its pointer to `MEMORY.md` — and ask whether to do it now. Skip the offer
   only when nothing durable came out of the work (e.g. a pure copy/color tweak).

Use one `AskUserQuestion` round for this (recommend "Yes, save a memory" as the first option when a
memory is warranted). Don't write the memory silently — confirm first, since the user owns what's
worth remembering.

## Hard rules (inherited from CLAUDE.md — never break)

- **Any DB-schema change ⇒ a migration.** New/changed/removed collection, global, block, or field.
- Regenerate types after every schema change: `pnpm --filter @repo/payload generate:types`.
- Register a block in **both** `Pages.ts` and `payload.config.ts`, never one.
- Never import from `src/theme/` — use `@repo/ui`.
- Never invent paths — use the *Project map* in `CLAUDE.md`.
- Never assume the spec — step 3 is mandatory for any non-trivial build.
- **Custom Payload endpoints use the `defineEndpoint` wrapper**
  (`apps/payload/src/payload/endpoints/_lib/defineEndpoint.ts`) — never a hand-written bare
  `Endpoint`. It factors out collection auth, zod body parsing, and the error envelope, and infers
  the handler's `body` type from the schema. Schemas come from `@/schemas/<domain>` (never inline).
  See the `custom-endpoint-pattern` memory.
- **Zod schemas live in `src/schemas/<domain>/`** — never inline in a task/endpoint/collection/hook
  (see the `zod-schemas-in-schemas-folder` memory).
- **Documentation lives in memory — no `docs/` folder.** When you'd normally write or update
  documentation, write a self-contained memory file instead, in
  `/Users/kacperzawojski/.claude/projects/-Users-kacperzawojski-code-payload-starter/memory/`
  (`type: project`), and add its one-line pointer to `MEMORY.md`. Memories are loaded each session
  via `MEMORY.md`; a `docs/` folder is not. Example: the former `docs/preview-mode.md` is now the
  memory `preview-draft-mode-architecture`.

## Worked example

> User: "I want a section with three pricing plans I can edit later."

1. **Intent / type** → new section, CMS-editable copy → **new section**.
2. **Skills** → `website-layout-sections` → `data-fetching` (editable in admin = CMS field) → `payload-migrations`.
3. **Ask (one round)** → localized pl/en? · which page + position? · static cards vs relationship to a `plans` collection? · highlight/"most popular" toggle? (default: 3 static localized cards, cached). 
4. **Spec** → `PricingBlock` (slug `pricingBlock`, dbName `pricing_block`), repeatable `plans` array (name, price, features[], ctaUrl, featured) localized; renders on `/pricing`; cached.
5. **Build** → run the Build pipeline, commit the migration with the change, verify in `/admin` and the rendered page.
