---
name: design-mode
description: >-
  Phase A of the build pipeline — fires ONLY at the very start of a BRAND-NEW section,
  feature, or page, before anything is wired to Payload. Iterate the look in packages/ui +
  Storybook on static props, reuse or extend design-system atoms, and hold an explicit
  approval gate. Triggers: "add a pricing/features/testimonials section", "build this page",
  "here's my Figma", "nowa sekcja", "zrób stronę", "zaprojektuj". DOES NOT fire for a section
  that already exists and is wired to Payload — those get fixed in place. Stops at the gate;
  website-layout-sections takes over from there.
---

# Design Mode — iterate the design before anything touches Payload

Phase A of the *Build pipeline* in `AGENTS.md`. It exists because the two halves of building
a section have wildly different costs: **design is cheap and disposable** (a component and a
story, delete it and nothing notices), while **Payload integration is expensive and sticky**
(block schema, dual registration, adapter, dispatcher, generated types, a migration in the DB).

Running them as one pass means every visual revision arrives *after* the schema has landed, so
the designer pays a migration for a spacing change. Design Mode separates them: loop freely on
the look, then wire it **once**, on an explicit yes.

**Boundary: this skill only edits `packages/ui/src/`.** Opening `apps/payload/` or `apps/astro/`
means you have left Design Mode without passing the gate.

---

## When this fires — and when it must NOT

This is the narrow part. Get it wrong in either direction and the process becomes an obstacle.

| Situation | Design Mode? |
|---|---|
| A brand-new section that doesn't exist yet | **YES** — loop + gate |
| A new page/feature made of new sections | **YES** — one loop, gate per section or all at once |
| A Figma / screenshot for something not yet built | **YES** |
| A section that **already exists** and is wired to Payload — restyle, copy, spacing, a11y fix | **NO** — fix it in place |
| Brand colors / tokens / "make it match my brand" | **NO** — that's the **design-system** skill |
| A new field on an existing block | **NO** — that's **payload-migrations** |

**The mechanical test — use this instead of guessing:**

> Does a block for this section already exist in `apps/payload/src/payload/blocks/`
> (or is it an existing field group like `fields/hero.ts`)?
> **Yes → you are NOT in Design Mode.** Edit the `@repo/ui` component directly, verify, done.
> **No → you are in Design Mode.** Run the loop below.

An existing section is already integrated; there is nothing to gate, because there is no
integration step waiting on the other side. Do not open a Storybook loop and do not ask for
approval — just make the change the user asked for. Asking "is the design good now?" for a
one-line color tweak turns a helpful gate into a nuisance and trains the user to click through it.

---

## Fast access

```bash
pnpm --filter @repo/ui storybook
```

→ http://localhost:6006. Deliberately not part of `pnpm dev` — Design Mode is a phase you enter,
not a server that always runs. Storybook has HMR: leave it running across rounds, don't restart it.

**Never call this "preview mode."** In this repo *preview* already means Payload draft / live
preview (`apps/astro/src/pages/preview.ts`, `PREVIEW_SECRET`, `live-preview-listener.tsx`).

---

## The round loop

1. **Write the props inline in the story.** Hardcoded strings, `https://picsum.photos/…` for
   images. **Never** `@repo/payload-types`, never a fetch, never a Media object. The section takes
   plain props; where the data will eventually come from is a Phase B question.
2. **Build the section** in `packages/ui/src/components/sections/<feature>/<feature>.tsx`,
   composed from atoms (see *Design-system discipline*). Reference: `sections/hero/hero.tsx`.
3. **Wire all three export points** — `<feature>/index.ts` → `sections/index.ts` → `src/index.ts`.
   Storybook imports from `@repo/ui`, so a missing hop shows up as
   *"module has no exported member"*, not as a missing component.
4. **Look at it.** The composed `Pages/<Name>` story, at desktop and mobile width, in light **and**
   dark, with the a11y panel open (addon-a11y is installed). A contrast failure is a design defect
   — fix it now, in the loop, not in some later accessibility pass.
5. **Run the gate.** Not approved → round N+1, back to step 2.

**Free to change in a round:** layout, spacing, copy, atom variants, and **the prop shape itself**
— props are free to churn precisely because nothing consumes them yet.

**Not allowed in a round:** adding a Payload field, defining a block, touching an adapter or the
dispatcher, running `generate:types`, creating a migration.

---

## The gate — the only exit from the loop

After **every** round, including the first:

```
AskUserQuestion:
  question: "Czy ten design jest już dobry? / Is this design good now?"
  header:   "Design gate"
  options:
    - label: "Tak — podpinamy do CMS-a"
      description: "Zatwierdzone. Wpinam sekcję w CMS, żebyś mógł edytować treść w /admin
                    (blok + pola + migracja). Zmiany layoutu po tym kroku kosztują więcej."
    - label: "Nie — poprawiamy"
      description: "Powiedz co zmienić. Zostajemy w Storybooku — nic nie jest jeszcze wpięte,
                    więc zmiany są darmowe."
```

Three rules, and the first one is the one that actually breaks:

1. **Only the literal "Tak / Yes" option counts as approval.** "ładnie", "nice", "super", 👍,
   "ok let's go on", or silence are **not** approval. This fails from the *agent* side, not the
   user's — a model reads enthusiasm as consent and starts writing block schemas. If the user
   says something nice without answering, ask the question.
2. **Ask after every round, and never batch it** with spec questions or a "what else?" wrap-up.
   The gate asks one thing: *is the look right.*
3. **Partial approval is normal** on a multi-section page. Approved sections go to Phase B; the
   rest stay in the loop.

Keep the cost of "yes" inside the option *description*, where a non-technical user actually reads
it. Otherwise they click yes reflexively and pay a migration for a design they'll change tomorrow.

---

## Design-system discipline

Which branch you're in depends on what already exists in
`packages/ui/src/components/elements/`.

### Branch 1 — the design system already exists (the normal case here)

Today that's `Button`, `CmsLink`, `Card`, `Badge`, `Heading`, `Text`, `Container`.

- **Reuse first.** Read `elements/` before writing anything. A new section is assembled from
  atoms plus layout; it is not a fresh pile of markup.
- **If the design needs a look an atom lacks, extend that atom's variant union.** Add the member
  to the union *and* the `Record<Variant, CSSProperties>` map — the `Record` type turns a
  forgotten entry into a compile error, which is exactly why the map is hand-rolled rather than CVA.
- **Never** inline a one-off `style={{ background: '#...' }}` or a bespoke className in a section
  to get a look the atom could carry. That's how a design system rots into decoration.
- **Never introduce CVA.** This system themes through CSS variables, not utility classes — a
  deliberate decision documented at the top of `elements/button/button.tsx`.
- **Style only with tokens** (`var(--primary)`, `var(--radius)`, `var(--spacing-lg)` …). A section
  must not define its own colors, radii, or shadows. If the value you need doesn't exist as a
  token, that's a **design-system** skill job — stop and say so; don't hardcode a hex.

> **The moment you touch `ButtonVariant` or `CMS_LINK_VARIANTS`, jump to *Variant sync* below.
> That is no longer styling — it's a schema change.**

### Branch 2 — empty project or full redesign

Build the first section, then after it **and after every subsequent one**, pull repeated
primitives into `packages/ui/src/components/elements/<atom>/` with their own
`Elements/<Atom>` story.

**Rule of two: extract on the second occurrence, never the first.** Extracting speculatively
produces a factory of single-use atoms and thrashes three barrel files per atom for nothing.
And always check the existing set before creating anything — the seed atoms above cover most of
what a marketing page needs.

---

## The composed page story

The artifact the gate is asked about. One per page under design.

```tsx
// packages/ui/src/components/sections/_pages/landing.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero, PageContentCards, Contact, Button } from '@repo/ui'

// Static props only — this file must never import @repo/payload-types.
const meta = {
  title: 'Pages/Landing',
  parameters: { layout: 'fullscreen' }, // ← mandatory, see below
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Landing: Story = {
  render: () => (
    <>
      <Hero
        title="Build your website without code"
        subtitle="Describe what you want and watch it come together."
        alignment="center"
        variant="gradient"
        actions={
          <>
            <Button variant="primary">Get started</Button>
            <Button variant="outline">Learn more</Button>
          </>
        }
      />
      <PageContentCards title="What you get" items={[/* 3 static cards */]} />
      <Contact title="Talk to us" />
    </>
  ),
}
```

- **`layout: 'fullscreen'` is mandatory.** `.storybook/preview.tsx` sets `'centered'` globally, so
  without the override every section renders inside a centered box and the user approves a picture
  that isn't what the page looks like.
- Title namespace is `Pages/<Name>` — alongside `Elements/`, `Layout/`, `Sections/`.
- Import from `@repo/ui` only, never deep paths.
- **Show this at the gate**, not the individual section stories.
- Keep it after Phase B. It's the free regression view when **design-system** re-skins the tokens.

---

## Variant sync — an editor-selectable variant is SCHEMA

`Button` / `CmsLink` variants are not styling: an editor picks them from a `select` in Payload
(`linkField()`). Adding one is a **Phase B change even when no new block exists.** All of it, in order:

1. **`packages/ui/src/components/elements/button/button.tsx`** — add to `ButtonVariant` *and* to
   `buttonVariantCSS`. Button-only variants stop here — `destructive` is **deliberately** not
   editor-selectable, so don't "fix" that asymmetry unless the user asks for a red CTA.
2. **`packages/ui/src/components/elements/cms-link/cms-link.tsx`** — add to `CMS_LINK_VARIANTS`.
   That array is the single source of truth; `CmsLinkVariant` derives from it and both
   `resolve-link.ts` and the stories import it. **Nothing else in `packages/ui` needs editing.**
3. **`apps/payload/src/payload/fields/link.ts`** — add `{ label, value }` to `variantField.options`.
   `value` must match the union member exactly; `label` is what the editor reads, so write it in
   their language ("Button – Tertiary"), not in code language.
4. **`pnpm --filter @repo/payload generate:types`**
5. **`pnpm --filter @repo/payload migrate:create add-<variant>-variant`** → review → `migrate`.
   Expect one `ALTER TYPE … ADD VALUE` per variant enum — **8 today** (4 `linkField()` sites × the
   `_v` version-table twins), and that number **grows with every new block that uses a link, so
   count them, don't memorize**. A missed `_v` twin is the nastiest failure mode: everything works
   until someone saves a **draft**. Do not change `defaultValue` in the same migration — Postgres
   forbids *using* a new enum value in the transaction that added it. Split it in two.
6. **`pnpm --filter @repo/astro typecheck`** — the drift guard in
   `apps/astro/src/lib/link/resolve-link.ts` fails the build if the Payload options and
   `CmsLinkVariant` disagree.
7. **Commit all of it in one commit** — `cms-link.tsx`, `link.ts`,
   `packages/payload-types/src/index.ts`, and the migration. A half-applied variant sync is
   invisible until an editor picks the new option.

---

## Hard rules

- Never import `@repo/payload-types` into `packages/ui` — Design Mode is exactly where it gets
  tempting.
- Never fetch. A section that "needs data" takes plain props; the adapter fills them in Phase B.
- Never edit `apps/astro/` or `apps/payload/` while in Design Mode.
- Never build a preview route in Astro — Storybook is the surface.
- Never skip the gate, and never infer approval from a compliment.
- Never run Design Mode on a section that already has a block. Fix it in place.

---

## Handoff to Phase B

On approval, emit this, then run **website-layout-sections**:

```
DESIGN APPROVED: <section names>
UI COMPONENT:    packages/ui/src/components/sections/<feature>/<feature>.tsx (exported from @repo/ui)
PROPS:           <prop: type — which are CMS-editable, which localized, which stay static>
ATOMS TOUCHED:   <none | Button + CmsLink variant 'x' added → VARIANT SYNC REQUIRED>
PAGE STORY:      Pages/<Name>
```

The component's props are now the contract the block schema must satisfy — Phase B derives the
fields **from the props**, not the other way round.

---

## Related skills

- **design-system** — Figma/brand → `[data-theme="ui"]` CSS tokens. Runs *before* this one; tokens
  first, layout second. Never touches component code.
- **website-layout-sections** — Phase B. Starts where this skill stops, at the gate.
- **vibe-coding** — the front door; routes new-section requests here.
- **payload-migrations** — owns the migration in *Variant sync* step 5.
