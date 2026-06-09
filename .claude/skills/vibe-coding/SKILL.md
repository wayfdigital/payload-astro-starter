---
name: vibe-coding
description: Turn a no-code user's plain-language request ("a pricing section", "make the hero say X", "here's my Figma") into a developer-ready spec, then load the exact skills needed to build it and run the pipeline. Use as the FIRST step on any vibecoder request before touching code.
---

# Run skill generator — vibecoder prompt → dev spec → skills → build

This repo ships to a **non-technical ("vibecoder") user** who describes **outcomes**, never
implementation. They will never say "migration", "block", "locale", or invoke a skill. **You are
the developer.** This skill is the front door: it takes their plain-language ask, turns it into a
concrete developer spec, pulls in the right skills automatically, and kicks off the build.

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
| **payload config** | `payload` (global skill) |

Always also call `knowledge-base` `get_context` first to pull repo patterns and prior decisions.

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

## Hard rules (inherited from CLAUDE.md — never break)

- **Any DB-schema change ⇒ a migration.** New/changed/removed collection, global, block, or field.
- Regenerate types after every schema change: `pnpm --filter @repo/payload generate:types`.
- Register a block in **both** `Pages.ts` and `payload.config.ts`, never one.
- Never import from `src/theme/` — use `@repo/ui`.
- Never invent paths — use the *Project map* in `CLAUDE.md`.
- Never assume the spec — step 3 is mandatory for any non-trivial build.

## Worked example

> User: "I want a section with three pricing plans I can edit later."

1. **Intent / type** → new section, CMS-editable copy → **new section**.
2. **Skills** → `website-layout-sections` → `data-fetching` (editable in admin = CMS field) → `payload-migrations`; `knowledge-base.get_context` first.
3. **Ask (one round)** → localized pl/en? · which page + position? · static cards vs relationship to a `plans` collection? · highlight/"most popular" toggle? (default: 3 static localized cards, cached). 
4. **Spec** → `PricingBlock` (slug `pricingBlock`, dbName `pricing_block`), repeatable `plans` array (name, price, features[], ctaUrl, featured) localized; renders on `/pricing`; cached.
5. **Build** → run the Build pipeline, commit the migration with the change, verify in `/admin` and the rendered page.
