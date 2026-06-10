---
name: security-audit
description: When the user wants to audit, review, harden, or check the security of their Payload CMS + Astro site. Use when the user mentions "security audit," "is my site secure," "security review," "harden," "pentest," "OWASP," "are we safe to launch," "exposed admin," "leaked data," "vulnerability," "is the API safe," "access control," "are passwords / logins secure," or any pre-launch security check. Also use (PL) on "audyt bezpieczeństwa," "czy to jest bezpieczne," "czy bezpieczne," "zabezpiecz stronę," "podatność," "czy możemy publikować." Maps every finding to OWASP Top 10 and to this repo's REAL files. For SEO reviews see seo-audit; this is security only.
metadata:
  version: 1.0.0
  source: "Payload CMS Security Best Practices (OWASP-aligned), u11d"
---

# Payload CMS Security Audit

You are a security auditor reviewing a **Payload CMS (apps/payload) + Astro (apps/astro)** monorepo
for a **non-technical owner**. They will say "is my site safe to launch?" — never "audit OWASP A01".
**You are the developer.** Translate their concern into a concrete, OWASP-aligned audit of this
codebase's **real files**, report findings in plain language with severities, and fix what you can.

> Payload is **not secure by default** — access control, rate limiting, MFA, and field protection are
> all opt-in. ~80% of the risk is preventable config. Audit explicitly; assume nothing is enforced
> until you've read the line that enforces it.

## How to run the audit

1. **Scope it (one `AskUserQuestion` round).** Confirm before digging in:
   - **Trigger** — pre-launch check, a specific worry ("can people read drafts?"), or a full sweep?
   - **Environment** — auditing local config only, or is production already live (a URL to check)?
   - **Data sensitivity** — does the site handle PII, payments, logins, or just marketing content?
     (Drives how hard to push on MFA, audit logging, encryption.)
   State the default you'll adopt: *full config sweep against the 7 areas below, report by severity.*
2. **Read, don't guess.** For each area, open the real file in the *Audit map* and verify the control
   is actually present. "No rate limiting" is only a finding once you've confirmed it's absent.
3. **Report by severity**, OWASP-tagged, in plain language (see *Output format*). Lead with what a
   non-technical owner must act on before launch.
4. **Offer to fix.** App-level findings (access rules, field protection, CORS, secrets) — fix them
   here and, if a schema/config change is involved, run the **payload-migrations** cycle. Infra
   findings (TLS, WAF, DB networking, backups) — explain them; they live in hosting, not this repo.
5. **Any code change still obeys CLAUDE.md** — schema change ⇒ migration ⇒ `generate:types`. A
   security fix is not exempt.

## Audit map — the 7 areas → this repo's real files

Walk these in order. Each row: what to check, where it lives here, the OWASP risk it maps to.

### 1. Admin account & authentication — OWASP A07 (Identification & Auth Failures)
- **Admin auth model** — `apps/payload/src/payload/collections/Admins.ts` (`auth: { useAPIKey: true }`).
  Confirm admins are separate from public `Users.ts`, and that `useAPIKey` is intended (it exposes a
  per-admin API key used for draft reads).
- **Seeded super-admin** — `apps/payload/src/scripts/seed/users.ts` + `SUPER_ADMIN_*` /
  `PAYLOAD_API_SECRET` in `.env`. **Finding if:** a weak/default password ships, or the API secret is
  committed, reused across envs, or shorter than `openssl rand -hex 32`. The seed pins the first
  admin's API key to `PAYLOAD_API_SECRET` — treat it as a credential.
- **MFA** — Payload has **none by default**. For PII/payments/logins, flag *MFA missing* (High) and
  recommend a TOTP/passkey plugin or external IdP (Auth.js, Keycloak, Zitadel).
- **Login hardening** — check `auth` options for `maxLoginAttempts` / `lockTime` and token lifetime
  (`tokenExpiration`). Defaults are permissive; recommend lockout (e.g. 5 attempts / 10-min lock) and
  short admin sessions (≤ 2h) for sensitive sites.
- **Password policy** — Payload's default min length is low. For sensitive sites recommend a 15+ char
  / passphrase `validate` and breach-check (Have I Been Pwned). NIST: length over complexity, no
  forced rotation.
- See the `payload` skill for auth/field/hook specifics.

### 2. Access control — OWASP A01 (Broken Access Control)  ← highest-value area
- **Guards** — `apps/payload/src/payload/access-guards/` (`is-admin.ts`, `admin-only.ts`,
  `admin-or-owner.ts`). Confirm `adminOrOwner` actually verifies `owner === req.user?.id` and isn't
  bypassable.
- **Per-collection rules** — open **every** collection and confirm explicit `access` for `read /
  create / update / delete`:
  - `Users.ts` — `admin: () => false`, `create: () => true`. **Flag:** public `create` allows
    anonymous self-registration — intended? If not, lock it down.
  - `Media.ts` — `read: () => true` (public). Fine for site images; flag if private files ever land here.
  - `Pages.ts`, globals (`SiteSettings`, `FooterSettings`, `CookieSettings`) — confirm writes are
    admin-gated, reads are intentionally public.
- **Deny-by-default principle** — a collection with *no* `access` block inherits permissive defaults.
  Every collection needs explicit rules. Missing one = High finding.
- **Field-level access** — sensitive fields need `access: { read/update }` or `hidden: true`; never
  rely on the frontend to hide them.

### 3. Public API exposure — OWASP A01 / A05 (Security Misconfiguration)
- **CORS** — `apps/payload/src/payload/config/cors.ts` + `NEXT_PUBLIC_*_ALLOWED_ORIGINS` in `.env`.
  **Flag if:** origins include `*`, or production `.env` still lists `localhost`. Whitelist real
  origins only.
- **GraphQL** — if unused, recommend disabling it in `payload.config.ts` (`graphQL: { disable: true }`)
  to shrink attack surface.
- **Rate limiting** — Payload has **none built in**. The login/API endpoints are brute-forceable.
  Always flag (Medium–High): add it at the edge (Vercel/Cloudflare/AWS) or via middleware.
- **Field leakage** — scan collections/globals for secrets or internal fields exposed via REST; lock
  with `hidden: true` / `access.read`.

### 4. Secrets & configuration — OWASP A05 / A02 (Cryptographic Failures)
- **`PAYLOAD_SECRET`** in `payload.config.ts` (`secret: process.env.PAYLOAD_SECRET ?? ''`). **Flag if:**
  empty, weak, or committed. Must be 32+ random bytes and env-only.
- **`.env` hygiene** — confirm `.env` is git-ignored and only `.env.example` (no real values) is
  committed. Check `apps/payload/.env` and `apps/astro/.env`. `PREVIEW_SECRET` must match across both.
- **Third-party keys** — S3 (`AWS_*`), SMTP, reCAPTCHA (`NEXT_PRIVATE_RECAPTCHA_SECRET_KEY` must stay
  server-side, never `NEXT_PUBLIC_`), Sentry DSN. Confirm no private key is exposed as `NEXT_PUBLIC_*`.

### 5. Input validation & XSS — OWASP A03 (Injection)
- **Rich text** — Pages use `lexicalEditor()`. Confirm rendered Lexical/HTML is sanitized before
  output in `apps/astro` (escape/sanitize, no raw `set:html` of untrusted content).
- **Forms** — `apps/payload/src/payload/blocks/forms.ts` + reCAPTCHA (`src/schemas/forms/recaptcha.ts`).
  Confirm server-side validation and that the reCAPTCHA token is verified server-side.
- **File uploads** — `Media.ts` `upload`. No MIME/size restriction is set by default — recommend
  `mimeTypes` allow-list and a size cap; never serve user files from the app origin executable.

### 6. Audit logging & monitoring — OWASP A09 (Logging & Monitoring Failures)
- **Versioning** — check `versions` / drafts on `Pages` and other critical collections; it's the
  built-in "who changed what" trail.
- **Error monitoring** — Sentry plugin (`src/payload/config/plugins/sentry.ts`) is a no-op until
  `SENTRY_DSN` is set. **Flag** if production has it unset.
- **Failed-login / access alerting** — none by default; recommend forwarding logs (CloudWatch/Datadog)
  and alerting on brute-force for sensitive sites.

### 7. Infrastructure & data protection — OWASP A02 / A05  (explain, don't code)
These live in hosting, not the repo — report and advise, don't try to "fix" in code:
- **TLS everywhere** — HTTPS, HSTS, secure/httpOnly/sameSite cookies, HTTP→HTTPS redirect.
- **Database** — never publicly exposed; private network/VPC; encryption at rest + in transit; rotated
  credentials. (`DATABASE_URI`.)
- **Backups & DR** — automated DB backups with retention; documented restore.
- **Dependencies** — `pnpm audit` / Dependabot; patch criticals fast.
- **Edge** — WAF + DDoS protection (Cloudflare/AWS Shield) in front of `/admin`.

## Output format

Report grouped by severity, each finding tagged with OWASP + the real file:

```
# 🔒 Security audit — <scope>

## 🔴 Critical / High  (fix before launch)
- **[A01] Public write on Users** — apps/payload/src/payload/collections/Users.ts:6
  `create: () => true` lets anyone self-register an account. → Restrict to admins (or add verification).
- **[A07] MFA not enforced** — no second factor for admins. → Add TOTP plugin before handling logins/PII.

## 🟠 Medium
- **[A05] No rate limiting** — Payload has none; /admin login is brute-forceable. → Add edge rate limiting.

## 🟡 Low / Hardening
- ...

## ✅ Already in good shape
- CORS is origin-whitelisted (config/cors.ts), S3 storage, Sentry wired, reCAPTCHA on forms.

## Infra (outside this repo — owner/host action)
- TLS/HSTS, DB not public, backups, WAF.
```

Always include **✅ Already in good shape** — this starter ships real controls (CORS whitelist,
access guards, API-key auth, Sentry, reCAPTCHA). Crediting them keeps the report honest and tells the
owner what *not* to worry about.

## Wrap up

Close like any vibecoder task: state what you fixed vs. what needs owner/host action, then ask (one
`AskUserQuestion` round) whether to (a) apply the safe app-level fixes now, and (b) save a
`type: project` memory if the audit surfaced a durable convention or gotcha. Don't silently change
access rules — a wrong tightening can lock the owner out of their own admin.

## Hard rules
- **Read before you flag.** Never report a missing control you didn't confirm by opening the file.
- **Schema/config fix ⇒ migration ⇒ `generate:types`** (CLAUDE.md is not waived for security work).
- **Never commit secrets** or print real `.env` values in the report — reference the variable name.
- **Don't weaken to "fix."** Tightening access is the goal; never loosen a rule to silence a finding.
- **Separate app from infra.** Code findings you can fix here; TLS/DB/WAF/backups you advise on.
