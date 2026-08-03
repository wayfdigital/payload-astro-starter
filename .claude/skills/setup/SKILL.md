---
name: setup
description: >-
  First run of this starter on a new machine — env files, generated secrets, Docker, install,
  migrations, the first admin account, and dev servers, in that order. Triggers: "set up the
  project", "first run", "get this running locally", "install it", "pierwsze uruchomienie",
  "uruchom projekt lokalnie", "postaw projekt", "zainstaluj". Also fires when preview/draft mode
  fails because PAYLOAD_API_SECRET is missing.
---

# Setup — first run

Runs the whole local bring-up in one pass. It exists mostly for one reason: **`PAYLOAD_API_SECRET`
must be generated into both `.env` files *before* the first admin is created.** That secret is the
Admins API key Astro uses to read drafts; the `pinApiKeyToFirstAdmin` hook in
`apps/payload/src/payload/collections/Admins.ts` pins it onto the first admin — but only if the
value is already there. Set it after the fact and preview stays broken.

Nothing is seeded. A fresh database shows Payload's **create first user** screen; this skill just
offers to create that account for the user instead.

---

## Steps — run in order

### 0. Preflight

Node ≥ 20, pnpm 10.11 (`packageManager` in the root `package.json`), Docker running. Stop and say
which one is missing rather than working around it.

### 1. `.env` files

```bash
cp apps/payload/.env.example apps/payload/.env
cp apps/astro/.env.example apps/astro/.env
```

**Only if the file does not exist.** Never overwrite an existing `.env` — it holds working secrets.
(Both are gitignored; `.env.example` is the committed one.)

Then collect the **admin email and password** in the same step — they go into `apps/payload/.env`
in step 2, and step 5 uses them. Doing it here means one interruption instead of stopping again
later.

Ask with **one `AskUserQuestion` carrying both questions**, so the user types into input fields
rather than composing a chat message. `AskUserQuestion` always appends an **Other** option with a
free-text box — that box is the real answer path here; the listed options are only shortcuts.

| Question | header | Options (Other is added automatically) |
|---|---|---|
| *"Admin email for the panel?"* | `Admin email` | `admin@example.com` (local throwaway) · `admin@localhost.dev` — **or Other to type a real address** |
| *"Admin password?"* | `Password` | **`Generate a strong random one`** (recommended — `openssl rand -base64 24`, print it once in your reply so the user can save it) · `I'll type my own` — **or Other to type it** |

`Admins` sets no `minPasswordLength`, so Payload's default (3 characters) applies — a short local
password is accepted. Say so if the user picks one; don't reject it.

Two caveats to state, not hide:

- The Other box is **not masked** and its value is stored in the conversation transcript exactly
  like chat text. This is nicer UX, not stronger secrecy. The generate-random option is the one
  that avoids the user handing over a password they use elsewhere.
- If the user picks the literal `I'll type my own` option instead of Other, they haven't given you
  a password — ask again, don't guess.

**Both values come only from the user's answer.** Not from the session's `userEmail`, not from
`git config user.email`, not from an address in the repo or in an earlier `.env` — an address being
*available* is not the user telling you to use it. The Claude Code account is not necessarily the
admin login, especially on a project that ships to a client. If the user declines, leave both empty
and take the `/admin` registration path in step 5; never fill them in yourself.

### 2. Secrets + admin credentials — fill empty values only

Generate each secret with `openssl rand -hex 32`:

| File | Variable | Note |
|---|---|---|
| `apps/payload/.env` | `PAYLOAD_SECRET` | signs tokens/cookies; Payload won't boot without it |
| `apps/payload/.env` | `PREVIEW_SECRET` | gates the preview link |
| `apps/payload/.env` | `PAYLOAD_API_SECRET` | becomes the first admin's API key |
| `apps/payload/.env` | `ADMIN_EMAIL` | from the user (step 1) — read by `create-admin.ts` |
| `apps/payload/.env` | `ADMIN_PASSWORD` | from the user (step 1) — read by `create-admin.ts` |
| `apps/astro/.env` | `PREVIEW_SECRET` | **same value** as Payload's |
| `apps/astro/.env` | `PAYLOAD_API_SECRET` | **same value** as Payload's |

Rules:

- A variable that already has a value stays as it is. Overwriting a live secret invalidates
  sessions and API keys.
- Payload has a value, Astro is empty → copy Payload's across. The pair must match.

### 3. Database + local mail

```bash
docker compose up -d
```

Postgres on 5432, Mailpit on 1025/8025. If 5432 is already taken by another project, say so and
stop — do not kill someone else's container.

### 4. Install + migrate

```bash
pnpm install
pnpm db:migrate
```

### 5. The first admin

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are already in `apps/payload/.env` from step 2, and `payload run`
loads that file — so this is just:

```bash
pnpm --filter @repo/payload payload run src/scripts/create-admin.ts
```

The script refuses if an admin already exists. If the user declined to give credentials in step 1,
point them at http://localhost:3100/admin instead — the create-first-user screen does the same job
and the hook pins the API key on that path too.

### 6. Start

```bash
pnpm dev
```

Panel http://localhost:3100/admin · site http://localhost:3000 · debug dashboard
http://localhost:7913.

### 7. Verify preview

Log into the panel, open a page, hit **Preview** and confirm the draft renders on `:3000`. That
exercises `PREVIEW_SECRET` and the pinned API key in one go.

### 8. Hand off — never end on "done"

Setup succeeded means the user is now sitting in front of a running site with no idea what to do
with it. Close with the three links and **one `AskUserQuestion`** offering the first build:

> Everything's up: site http://localhost:3000 · panel http://localhost:3100/admin (log in with the
> credentials you gave me) · debug http://localhost:7913.

Question: *"What do you want to build first?"* — options, worded for a non-technical user:

- **Add a section to the home page** — pricing, features, testimonials… *(runs the Design Mode pipeline)*
- **Apply my brand** — colors, fonts, logo, or a Figma link *(design-system skill)*
- **Edit the content that's already there** — I'll walk you through the panel *(no code)*
- **Nothing yet — I'll look around** — leave them a one-liner: come back and describe anything you want changed

Whatever they pick, route it through the skill router in `CLAUDE.md` and keep going in the same
session. Do not make them re-explain the project.

---

## Edge cases

- **An admin already exists and `PAYLOAD_API_SECRET` was only just generated.** The hook fires on
  create, first admin only — it will not backfill. Fix in the UI: `/admin` → Admins → your user →
  **Enable API Key** → Generate, then copy the *generated* value into `apps/astro/.env` as
  `PAYLOAD_API_SECRET`. The direction is reversed because Payload's UI generates the key; you
  cannot paste your own. On a throwaway project, `pnpm db:clean && pnpm db:migrate` and start over.
- **Draft fetch throws "PAYLOAD_API_SECRET is not set".** That is
  `apps/astro/src/lib/payload/client.ts` — the Astro `.env` is missing the value. Back to step 2.
- **API-key auth behaves oddly after config changes.** Clear `apps/payload/.next`.
- **Port 5432 in use.** Another Postgres owns it. Either stop that project's container yourself or
  point `DATABASE_URI` at a different port — the user's call, not yours.
