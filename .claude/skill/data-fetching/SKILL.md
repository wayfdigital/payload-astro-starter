---
name: data-fetching
description: "Guide for choosing Next.js + PayloadCMS data fetching strategy. Use when deciding between SSR, ISR, Server Actions, or TanStack Query, and when reviewing performance, caching, and revalidation trade-offs."
---

# Next.js Data Fetching Strategy Guide

This skill is now organized into smaller pages. Use this file as the entrypoint and jump to the focused section you need.

## Start Here

1. Read [Fundamentals](pages/fundamentals.md) for core concepts and the decision matrix.
2. Read [Patterns](pages/patterns.md) to choose implementation style.
3. Read [PayloadCMS Integration](pages/payloadcms-integration.md) for local API and query conventions.
4. Read [Common Pitfalls](pages/common-pitfalls.md) to avoid typical architecture mistakes.
5. Read [Performance Optimization](pages/performance-optimization.md) for tuning and scalability.

## Fast Decision Checklist

- SEO-critical and mostly static content -> Server Components + SSR/ISR.
- CMS-managed pages that update occasionally -> ISR + on-demand revalidation.
- Interactive server-driven flows (forms/checkout) -> Server Components + Server Actions.
- High-frequency client interactivity (filters/dashboards) -> TanStack Query.
- Always wrap server data access with React `cache()` where deduplication helps.

## Resources

- [Next.js Data Fetching Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [PayloadCMS Local API](https://payloadcms.com/docs/local-api/overview)
- [ISR in Next.js](https://nextjs.org/docs/app/building-your-application/rendering/incremental-static-regeneration)