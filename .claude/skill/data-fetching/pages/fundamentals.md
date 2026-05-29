# Fundamentals

## Golden Rule

Start with server-side rendering. Add client-side complexity only when you measure a bottleneck or need high-frequency interactive updates.

## Key Concepts

### Server Components

- Default in Next.js App Router.
- Run on the server only.
- Can access database and secrets directly.
- Send zero component JavaScript to the browser.

### Client Components

- Marked with `'use client'`.
- Run in the browser.
- Enable hooks and browser APIs.
- Increase JavaScript bundle size.

### React `cache()`

- Server-side request deduplication.
- Prevents repeated identical fetches in a single render/request lifecycle.

### Server Actions

- Server-executed functions callable from UI.
- Great for secure mutations and form submissions without custom REST handlers.

### TanStack Query

- Client-side cache and async state manager.
- Useful for frequent user-driven updates and background refetch.

## Decision Matrix

| Use case | Recommended approach | Typical tools | Why |
|---|---|---|---|
| Homepage, landing page, blog | SSR + on-demand revalidation | Server Components, `cache()`, `revalidatePath` | SEO and predictable freshness |
| Content catalogs | ISR | `revalidate`, webhook revalidation | Fast cached output with periodic updates |
| Checkout/forms | SSR + Server Actions | Server Components, Server Actions | Server-trusted calculations and updates |
| Filters/search/dashboard | Client-side fetching | TanStack Query + API route/handler | Fast interaction feedback loops |
| Real-time collaboration/chat | Realtime + client cache | WebSocket, TanStack Query | Continuous updates and sync |

## Quick Decision Guide

1. Does data change frequently?
   - Yes -> TanStack Query path.
   - No -> Server Components path.
2. Is SEO important?
   - Yes -> render content on server.
   - No -> client-heavy rendering is acceptable.
3. Is content CMS-managed and update-triggered?
   - Yes -> ISR + on-demand revalidation.
4. Are interactions lagging?
   - Initial load lag -> optimize SSR payload.
   - Interaction lag -> move interaction fetches client-side.
