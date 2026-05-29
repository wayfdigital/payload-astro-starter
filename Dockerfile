# Dockerfile dla Next.js + Payload CMS (assembled starter)
# Źródło: tools/ci-templates/ w monorepo Zavcode
#
# Build-args (przekazywane z GitHub Actions):
#   NEXT_PUBLIC_SERVER_URL, NEXT_PUBLIC_URL, NEXT_PUBLIC_*_ALLOWED_ORIGINS,
#   NEXT_PUBLIC_RECAPTCHA_SITE_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, itd.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_SITE_INDEXABLE
ARG NEXT_PUBLIC_API_ALLOWED_ORIGINS
ARG NEXT_PUBLIC_DASHBOARD_ALLOWED_ORIGINS
ARG NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS
ARG NEXT_PUBLIC_WEB_ALLOWED_ORIGINS

ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}
ENV NEXT_PUBLIC_POSTHOG_HOST=${NEXT_PUBLIC_POSTHOG_HOST}
ENV NEXT_PUBLIC_SITE_INDEXABLE=${NEXT_PUBLIC_SITE_INDEXABLE}
ENV NEXT_PUBLIC_API_ALLOWED_ORIGINS=${NEXT_PUBLIC_API_ALLOWED_ORIGINS}
ENV NEXT_PUBLIC_DASHBOARD_ALLOWED_ORIGINS=${NEXT_PUBLIC_DASHBOARD_ALLOWED_ORIGINS}
ENV NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS=${NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS}
ENV NEXT_PUBLIC_WEB_ALLOWED_ORIGINS=${NEXT_PUBLIC_WEB_ALLOWED_ORIGINS}

RUN corepack enable pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json 2>/dev/null || true

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Migracje Payload przy starcie, potem Next.js
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]
