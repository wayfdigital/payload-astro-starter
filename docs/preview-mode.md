# Preview / Draft Mode

How editors preview **unpublished** content from Payload on the Astro (SSR) frontend —
including the native **Live Preview** iframe inside the admin.

## TL;DR

- Selected collections/globals get **draft versions** (`_status: draft | published`).
- The public site only ever shows `published`. Drafts are reachable **only** through a
  preview link that carries a shared secret, and Astro reads them with an **Admins API key**.
- Two preview experiences:
  - **Preview button** → opens the page in a new tab (a one-shot snapshot).
  - **Live Preview tab** → embeds the page in an iframe that **auto-refreshes** when a
    save/draft/publish completes.
- Astro renders on the server, so there is no client React tree to merge live data into.
  Instead, the page **re-fetches via a full reload** when Payload signals that the document
  was persisted.

## Architecture

```
Admin (:3100)  ── Live Preview iframe src ──▶  Astro (:3000)/<path>?preview=1&secret=…&locale=…
   │                                              │
   │  postMessage 'payload-document-event'  ─────▶ live-preview island → window.location.reload()
   │  (fired after save/draft/autosave persists)   │
   ▼                                              ▼
read access:                                  middleware: validate secret → locals.preview = true
  admin / API-key  → full (drafts)                 │  + frame-ancestors CSP + link rewriting
  everyone else    → { _status: published }        ▼
                                              getPageBySlug(slug, locale, { draft:true })
                                                 │  Authorization: admins API-Key <PAYLOAD_API_SECRET>
                                                 ▼
                                              Payload REST /api/pages?draft=true → latest draft
```

## Why a full reload (and not live client merge)

Payload's admin sends **two** kinds of `postMessage` to the preview window:

| Message `type`            | Contains                         | Purpose                                            |
| ------------------------- | -------------------------------- | -------------------------------------------------- |
| `payload-live-preview`    | **unsaved** form values          | Client-side merge for React/Next frontends.        |
| `payload-document-event`  | nothing (just a signal)          | **For SSR** — fires after a save/draft/autosave is **persisted**, telling the frontend to do a server round-trip. |

Astro is server-rendered (only small React islands hydrate), so we can't consume the
unsaved form values. We listen for **`payload-document-event`** and reload — by the time it
fires, the draft is in the DB, so the SSR re-fetch (`?draft=true`) is fresh. No debounce, no
race. (Reacting to `payload-live-preview` instead would reload on every keystroke, before
autosave commits, and show stale content — that was the original bug.)

The reload preserves scroll position via `sessionStorage`.

## The pieces

### Payload

- **`src/payload/config/plugins/preview.ts`** — reusable `previewPlugin`. Applied to opted-in
  collections/globals; currently `collections: ['pages']` in
  `src/payload/config/plugins/index.ts`. For each target it:
  - enables `versions.drafts` (with optional autosave — see options),
  - sets `admin.preview` (new-tab) and `admin.livePreview.url` (iframe),
  - wraps `read` access: `req.user.collection === 'admins'` → full; otherwise constrained to
    `{ _status: { equals: 'published' } }`. This is the security gate — it holds even with
    `?draft=true`.
- **`src/payload/collections/Admins.ts`** — `auth: { useAPIKey: true }`, so Astro can read
  drafts server-to-server with an admin's API key.
- **`src/payload/collections/Pages.ts`** — a page can be flagged `isHomePage` (served at `/`); its
  `slug` is then optional (required for every other page). `resolvePath` maps the home page to `/`
  and all others to `/<slug>`, and Astro's `index.astro` renders the `isHomePage` page (falling back
  to a dev landing when none is set).
- **Migration** `src/migrations/20260609_093158_preview_drafts.ts` — adds `_status`, the
  `_pages_v` version tables, and the Admins API-key columns. It **backfills existing pages to
  `published`** so they don't vanish when drafts turn on.

#### `previewPlugin` options

```ts
previewPlugin({
  collections: ['pages'],            // collection slugs to enable
  globals: [{ slug, previewPath }],  // optional globals (path of a page that shows them)
  frontendUrl: process.env.ASTRO_PUBLIC_URL,
  previewSecret: process.env.PREVIEW_SECRET,
  autosave: true,                    // false → only manual "Save draft"/"Publish" refreshes
  autosaveInterval: 800,             // ms, when autosave is on
  resolvePath: (doc) => doc.isHomePage ? '/' : `/${doc.slug ?? ''}`,
})
```

### Astro

- **`src/middleware.ts`** — marks `locals.preview` when `?preview=1&secret=` (or the
  `payload-preview` cookie) is valid; on preview responses sets
  `Content-Security-Policy: frame-ancestors 'self' <admin origin>` (so the admin can frame the
  page) and `Cache-Control: no-store` (drafts must never be cached by a shared cache). It does
  **not** rewrite the HTML body — keeping in-iframe navigation in preview is done client-side
  (see the island), so the secret never leaks into asset URLs.
- **`src/pages/preview.ts`** — the new-tab entry (`admin.preview` points here): validates the
  secret, sets an httpOnly `payload-preview` cookie, redirects to the real path.
- **`src/lib/payload/client.ts` + `pages.ts`** — `getPageBySlug(slug, locale, { draft })`; on
  draft it appends `draft=true` and the `Authorization: admins API-Key …` header (server-only).
- **`src/components/preview/live-preview-listener.tsx`** — React island mounted only in preview
  (`Layout.astro`). Sends `ready()`, listens for `payload-document-event` and reloads on it, and
  intercepts same-origin link clicks to carry the `?preview=1&secret=` query so navigation inside
  the iframe stays in preview.
- **`src/pages/[...slug].astro`** — passes `locals.preview` into the fetch; in preview, a
  `?locale=` query overrides the path-derived locale.

## Security model

| Request                                   | Sees           |
| ----------------------------------------- | -------------- |
| Public, no `draft`                        | published only |
| Public, `?draft=true` (no/forged secret)  | published only |
| Astro preview (valid secret + API key)    | latest draft   |
| Admin (logged in or API key)              | everything     |

Two distinct secrets:

- **`PREVIEW_SECRET`** — shared between both apps; gates the preview *link*.
- **`PAYLOAD_API_SECRET`** — an Admins API key (generated in the admin UI); authorizes Astro's
  draft *reads*. Server-only, never exposed to the browser.

## Setup

1. **Payload `.env`**: `PREVIEW_SECRET`, `ASTRO_PUBLIC_URL=http://localhost:3000`, and add
   `http://localhost:3000` to `NEXT_PUBLIC_API_ALLOWED_ORIGINS` / `NEXT_PUBLIC_WEB_ALLOWED_ORIGINS`.
2. **Astro `.env`**: `PREVIEW_SECRET` (same value), `ASTRO_PUBLIC_ADMIN_ORIGIN=http://localhost:3100`,
   and `PAYLOAD_API_SECRET` = an Admins API key.
3. Generate the API key: admin → **Admins → your user → enable API Key** → copy into
   `PAYLOAD_API_SECRET`.
4. Run migrations: `pnpm --filter @repo/payload migrate`.

### Public vs internal URLs (production)

Some URLs are used by the **editor's browser** and must be **public**; one is used only
**server-to-server** and may stay on a private/internal network (e.g. a single VPS):

| Env var                     | Used by                                              | Must be public? |
| --------------------------- | --------------------------------------------------- | --------------- |
| `ASTRO_PUBLIC_URL`          | Live Preview **iframe src** (loads in the browser)  | **Yes**         |
| `ASTRO_PUBLIC_ADMIN_ORIGIN` | postMessage origin check + CSP `frame-ancestors`    | **Yes**         |
| `PAYLOAD_API_URL`           | Astro server → Payload draft fetch (server-to-server)| No — internal OK |

To avoid silent misconfiguration, when `PREVIEW_SECRET` is set **and** `NODE_ENV/PROD` is
production, a missing `ASTRO_PUBLIC_URL` (Payload) or `ASTRO_PUBLIC_ADMIN_ORIGIN` (Astro) is a
**hard error** instead of falling back to `localhost`. Set them to the public origins; leave
`PAYLOAD_API_URL` pointing at the internal address if both run on the same VPS.

## Using it

- **Preview button** (new tab): a snapshot of the current draft. Reload the tab to see newer
  edits — it does **not** auto-update (Payload doesn't stream changes to popups).
- **Live Preview tab** (split view in admin): the iframe auto-refreshes after each save/draft/
  publish (and on autosave, if enabled).

## Gotchas

- After changing Payload **auth/config**, clear `apps/payload/.next` and restart, or the change
  may not take effect (e.g. API-key auth silently returns `user: null` from a stale build).
- Enabling drafts defaults existing rows to `_status='draft'` — the migration backfills them to
  `published`. Remember this for any new collection you add to the plugin.
- Cross-site cookies don't work in the iframe on `http://localhost`, which is why preview state
  is threaded via the query param (cookie is only used for the same-origin new-tab flow).
- Restarting a dev server while the admin tab is open can throw a Next.js *"Server Action … was
  not found"* — just hard-reload the admin.
