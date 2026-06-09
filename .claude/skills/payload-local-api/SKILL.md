---
name: payload-local-api
description: Reading Payload content from server code via the Local API (getPayload + find/findByID) instead of the REST layer.
---

# PayloadCMS — Local API in server components

To read content from Payload in a Next.js app, use `getPayload()` and `payload.find()` /
`payload.findByID()` on the server instead of the REST layer. Set the `depth` parameter for
relationships and `overrideAccess` when full access is required.

> Note (this monorepo): the **Astro** frontend runs in a separate process and therefore
> fetches Payload over **REST** (`apps/astro/src/lib/payload/`), not the Local API. Use the
> Local API only inside the Payload/Next app itself (`apps/payload`). See the `payloadcms`
> and `data-fetching` skills for the full server-fetch + cache/revalidate pattern.
