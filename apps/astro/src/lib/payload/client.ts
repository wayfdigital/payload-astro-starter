/**
 * Thin REST client for the Payload CMS API.
 *
 * Astro runs in a separate process from Payload, so we fetch over HTTP (the
 * Payload REST API) rather than using the Local API. Base URL comes from
 * `PAYLOAD_API_URL` (see `apps/astro/.env`).
 */

const PAYLOAD_API_URL = import.meta.env.PAYLOAD_API_URL ?? 'http://localhost:3100'

/** Builds an absolute Payload API URL from a path like `/api/pages`. */
export const payloadUrl = (path: string): string =>
  `${PAYLOAD_API_URL}${path.startsWith('/') ? path : `/${path}`}`

/** Options that influence how a Payload request is authenticated. */
export interface PayloadFetchOptions {
  /**
   * When true, authenticate the request with the Admins API key so Payload
   * returns draft (unpublished) content. Server-only — the key is never sent to
   * the browser. Callers must also add `draft=true` to the query string.
   */
  draft?: boolean
}

/**
 * Fetches JSON from the Payload API. Throws on a non-2xx response so callers can
 * decide between an empty state (caught → `null`/`[]`) and a hard error.
 *
 * For draft reads we attach `Authorization: admins API-Key <PAYLOAD_API_SECRET>`,
 * which Payload resolves to an admin user; the `read` access gate then returns
 * unpublished documents (see the preview plugin in apps/payload).
 */
export const payloadFetch = async <T>(
  path: string,
  init?: RequestInit,
  options: PayloadFetchOptions = {},
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (options.draft) {
    const apiKey = import.meta.env.PAYLOAD_API_SECRET
    if (!apiKey) {
      throw new Error('Draft fetch requested but PAYLOAD_API_SECRET is not set')
    }
    headers.Authorization = `admins API-Key ${apiKey}`
  }

  const res = await fetch(payloadUrl(path), { ...init, headers })

  if (!res.ok) {
    throw new Error(`Payload API ${res.status} ${res.statusText} for ${path}`)
  }

  return (await res.json()) as T
}
