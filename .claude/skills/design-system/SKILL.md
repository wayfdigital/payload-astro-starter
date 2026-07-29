---
name: design-system
description: >-
  Generate the @repo/ui design system from a Figma design-system page, moodboard, or hero frame.
  Reads the Figma file via MCP, extracts design tokens (colors, typography, spacing, radii,
  shadows, gradients), and overwrites the [data-theme="ui"] tokens in packages/ui so the whole
  site adopts the look. Use when the user shares a Figma URL and wants their theme / brand /
  design system applied, or says "build my design system / theme from this design / these colors".
---

# Design System from Figma → `@repo/ui`

Turn a Figma design-system page (or a moodboard / hero frame) into this project's design tokens.
The design system is **CSS-variable-first**: every `@repo/ui` component reads CSS custom properties,
so **changing the tokens re-skins the entire site with zero component edits**. This skill only
touches tokens — never component code.

**Input ("props"):** a `figma.com` URL (optionally a specific frame/node). Output: overwritten
tokens in `packages/ui`.

## Hard rules

- **Tokens only.** Never edit component files. Never add or remove CSS variables — only replace
  **values**. A missing key breaks every component that reads it.
- **CSS/TS only ⇒ NO migration, NO `generate:types`.** No DB schema is touched. Do not run the
  payload migrate cycle for this work.
- **Overwrite mode.** Replace values inside the existing `[data-theme="ui"]` block. Keep
  `name: 'ui'` / `dataAttribute: 'ui'` in `theme.config.ts` — no provider rewiring.
- Everything lives in `@repo/ui`. Never import from `src/theme/`.

## Write targets (real paths)

| File | What to change |
|---|---|
| `packages/ui/src/styles/theme.css` | Overwrite values in `[data-theme="ui"]` (light) **and** regenerate the `[data-theme="ui"].dark, .dark [data-theme="ui"]` block. Leave the apply block (`font-family`/`line-height`/`color`/`background`) and the utility blocks (`.ui-card`, `.ui-badge`, `.ui-divider`, focus ring, transitions) untouched. |
| `packages/ui/src/theme.config.ts` | Update `defaultTheme.displayName` + `description` to the new brand; bump `version`. Keep `name`/`dataAttribute`/`cssImport`. |
| `packages/ui/src/styles/globals.css` | **Leave as-is by default.** Its shadcn `:root` HSL vars are not what `@repo/ui` components read. Only sync if the user explicitly asks (advanced). |

## Pipeline

### 1. Read the Figma input

Parse `fileKey` and `nodeId` from the URL (`figma.com/design/<fileKey>/...?node-id=<a-b>` → nodeId
`a:b`, hyphen → colon). Extract via the Figma MCP, most-reliable first:

1. **`get_variable_defs(fileKey, nodeId)`** — published variables/tokens. The gold source when the
   file has a real variable collection (colors, type scale, radii, spacing as named tokens).
2. **`get_design_context(fileKey, nodeId)`** — node tree with fills, text styles, effects, corner
   radii, auto-layout spacing. Use for moodboard / hero frames that lack variables.
3. **`get_screenshot(fileKey, nodeId)`** — visual fallback and sanity check for color mood,
   contrast, and hierarchy when structured data is thin.

Only the read tools above are needed. If you ever need `use_figma`, load the **figma-use** skill
first (Figma MCP requirement).

### 2. Map Figma values → the exact `@repo/ui` token set

Land extracted values on these **existing** variables — do not invent names:

| Token group | CSS variables |
|---|---|
| Brand / palette | `--primary`, `--primary-hover`, `--primary-foreground`, `--secondary`, `--secondary-hover`, `--secondary-foreground`, `--accent`, `--accent-foreground` |
| Surfaces | `--background`, `--card`, `--foreground`, `--muted`, `--muted-foreground`, `--border` |
| Status | `--destructive`, `--destructive-hover`, `--destructive-foreground`, `--success`, `--warning` |
| Gradients | `--gradient-hero`, `--gradient-surface`, `--gradient-subtle` |
| Typography | `--font-sans`, `--font-heading`, `--font-mono`, `--font-weight-normal/medium/semibold/bold`, `--line-height`, `--letter-spacing-tight` |
| Radii / spacing | `--radius`, `--radius-sm`, `--radius-lg`, `--radius-xl`, `--radius-full`, `--spacing-xs/sm/md/lg/xl/2xl/3xl` |
| Shadows | `--shadow`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow` |
| Layout | `--max-width`, `--header-height` |

**Derivation rules** (when the design doesn't specify a token — derive sensibly, then disclose):

- `--*-hover` ≈ the base color darkened ~10% (lightened in dark mode).
- `--*-foreground` = readable on/against its pairing (usually `#ffffff` on saturated brand, near-black on light surfaces).
- `--muted` / `--muted-foreground` / `--border` from the surface + foreground at reduced contrast.
- `--accent` from a tint of the brand; `--accent-foreground` a readable counterpart.
- `--gradient-hero` from the primary→secondary range; `--shadow-glow` tinted with the primary color.
- Spacing, radii, and `--max-width`/`--header-height` — keep current values unless the design clearly differs.

**Fonts:** if the design uses a non-system font, set `--font-sans`/`--font-heading`/`--font-mono`
and **tell the user the font must be loaded** (Astro `Layout.astro` `<head>` link or `@fontsource`).
Do not assume it is already available.

### 3. Write the tokens

- Overwrite the light values in `[data-theme="ui"]`.
- Regenerate the dark block: lighten brand colors for contrast, use dark surfaces
  (`--background`/`--card`/`--foreground`/`--muted`/`--border`), and increase shadow alpha. If the
  Figma file has an explicit dark mode / variable mode, use those values directly instead of deriving.
- Update `theme.config.ts` metadata (`displayName`, `description`, bump `version`).

### 4. Verify

- **Static:** the set of `--var` names in `[data-theme="ui"]` is unchanged (same keys, new values) —
  no component loses a variable. Light and dark blocks define the same palette keys.
- **Visual:** run `pnpm --filter @repo/ui storybook` (port 6006) and check `Foundations`,
  `Elements/Button`, `Elements/Badge` and any `Pages/*` story in **both** light and dark. Storybook
  is far faster than booting Astro + Payload and renders the same components — for a token-only
  change the Astro app is not required. Boot it (port 3000) only if you also want to confirm
  real page content.

### 5. Report back

Give the user a short before→after of the key tokens (primary, background, foreground, fonts,
radius) and an explicit list of any values you **derived** rather than read from the design, plus any
font that still needs loading.

## Related skills

- **design-mode** — after the tokens land, sections get composed with them. Tokens first, layout
  second. That skill must never hardcode a color; if it needs a value that isn't a token, it comes
  back here.
- **figma / figma-use** — Figma MCP read tools and `use_figma` requirements.
- **vibe-coding** — routes a no-code user's "here's my Figma / make it look like this" request here.
- **astro** — where to load custom font files if the design needs one.
