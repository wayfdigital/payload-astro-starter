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

/**
 * Fetches JSON from the Payload API. Throws on a non-2xx response so callers can
 * decide between an empty state (caught → `null`/`[]`) and a hard error.
 */
export const payloadFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(payloadUrl(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!res.ok) {
    throw new Error(`Payload API ${res.status} ${res.statusText} for ${path}`)
  }

  return (await res.json()) as T
}
