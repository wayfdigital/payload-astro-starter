# Website Starter

Content website on **Next.js 15** (App Router, React 19) + **Payload CMS 3** in a single app.

## Features

- **Page Builder** — `Pages` collection with a `layout` field (blocks) and a type-safe layout builder; ready-made sections: Hero, Page Content (3 variants), Form Block, Example Block — each with variants.
- **i18n** — two-level localization: `next-intl` (frontend) + Payload localization (content), `en`/`pl` locales, localized slugs.
- **Design system** — internal [`src/ui-template`](src/ui-template) theme (Button, Card, Heading, Text, Container, Hero, Header, Footer) driven by the [`src/contract`](src/contract) contract and CSS variables (Tailwind 4).
- **Forms** — `@payloadcms/plugin-form-builder` with `customID` and `requireRecaptcha` fields; server-side **reCAPTCHA** validation (Zod).
- **SEO** — `@payloadcms/plugin-seo` for Pages, dynamic `sitemap.ts` and `robots.ts`, per-page `generateMetadata`.
- **Media / Storage** — `Media` collection (7 sizes, focal point, OG) + **S3** (configurable CDN).
- **Auth & Access** — separate `Admins` (panel) and `Users` (frontend), access guards, super-admin seed, origin-based CORS/firewall in middleware.
- **Globals** — `FooterSettings`, `CookieSettings`, reusable `linkField`.
- **Performance** — caching layer with `unstable_cache` + tag-based revalidation.
- **Email** — `@payloadcms/email-nodemailer`; caught locally by **Mailpit**.
- **Infra** — PostgreSQL (Docker), ready-to-use `Dockerfile`.

## Local development

```bash
# 1. Environment variables
cp .env.example .env          # fill in PAYLOAD_SECRET (openssl rand -hex 32), etc.

# 2. Local services: Postgres + Mailpit
docker compose up -d

# 3. Dependencies and dev server
pnpm install
pnpm dev                      # http://localhost:3100  (admin: /admin)
```

- **Mailpit** (preview of sent emails): http://localhost:8025 — SMTP listens on `1025`, no auth. Payload is already wired to SMTP via [`src/payload/config/mail.ts`](src/payload/config/mail.ts).
- In production set real `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`.
