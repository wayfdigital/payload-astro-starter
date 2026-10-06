/**
 * The public origin behind every absolute URL the site emits: canonical, og:url,
 * og:image, hreflang, JSON-LD, robots.txt and the sitemap.
 *
 * Plain JS (typed with JSDoc) so the app, astro.config.mjs and the node:test suite
 * can all import it. `astro dev` falls back to the local dev server. A production
 * build must name the real public https origin: a missing, malformed or local value
 * stops `astro build` (see astro.config.mjs) instead of shipping
 * `http://localhost:3000` as the canonical, which is what a deploy without
 * ASTRO_PUBLIC_SITE_URL did (October 2026).
 */

/** Origin used by `astro dev` when ASTRO_PUBLIC_SITE_URL is not set. */
export const DEV_SITE_URL = 'http://localhost:3000'

/** Names that never resolve on the public internet (RFC 2606, RFC 6761). */
const RESERVED_SUFFIXES = ['.localhost', '.local', '.internal', '.test', '.invalid', '.example']

/**
 * @param {string} host A URL hostname, already normalised by the URL parser.
 * @returns {boolean}
 */
const isNonPublicIPv4 = (host) => {
  const parts = host.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false
  }
  const [a = -1, b = -1, c = -1, d = -1] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || // private use
    (a === 192 && b === 0 && c === 0 && d !== 9 && d !== 10) || // IETF assignments; except globally reachable anycast
    (a === 192 && b === 0 && c === 2) || // TEST-NET-1
    (a === 192 && b === 88 && c === 99) || // deprecated 6to4 relay block
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    (a === 198 && b === 51 && c === 100) || // TEST-NET-2
    (a === 203 && b === 0 && c === 113) || // TEST-NET-3
    a >= 224 // multicast and reserved for future use
  )
}

/**
 * @param {string} host A URL hostname; IPv6 literals keep their brackets.
 * @returns {boolean}
 */
const isPrivateIPv6 = (host) => {
  if (!host.startsWith('[')) return false
  const address = host.slice(1, -1)
  return (
    address === '::' ||
    address === '::1' ||
    /^f[cd]/.test(address) || // unique local
    /^fe[89ab]/.test(address) || // link-local
    address.startsWith('::ffff:') // IPv4-mapped
  )
}

/**
 * True for hosts that only resolve on a developer machine or a private network.
 *
 * @param {string} hostname
 * @returns {boolean}
 */
export const isNonPublicHost = (hostname) => {
  const host = hostname.toLowerCase().replace(/\.$/, '')
  return (
    host === 'localhost' ||
    RESERVED_SUFFIXES.some((suffix) => host.endsWith(suffix)) ||
    isNonPublicIPv4(host) ||
    isPrivateIPv6(host)
  )
}

/**
 * True when `value` is an absolute URL on a host search engines cannot reach.
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isNonPublicUrl = (value) => {
  try {
    return isNonPublicHost(new URL(value).hostname)
  } catch {
    return false
  }
}

/**
 * Returns the site's public origin (scheme, host and port, no trailing slash).
 *
 * @param {string | undefined} value ASTRO_PUBLIC_SITE_URL as read from the environment.
 * @param {{ production: boolean }} options `production` is true for `astro build`.
 * @returns {string}
 */
export const resolveSiteUrl = (value, { production }) => {
  const raw = value?.trim()
  if (!raw) {
    if (production) {
      throw new Error(
        'ASTRO_PUBLIC_SITE_URL is not set. A production build needs the public https origin in the build environment, for example ASTRO_PUBLIC_SITE_URL=https://www.example.com.',
      )
    }
    return DEV_SITE_URL
  }

  /** @type {URL} */
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`ASTRO_PUBLIC_SITE_URL is not a valid URL: "${raw}".`)
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`ASTRO_PUBLIC_SITE_URL must use http or https: "${raw}".`)
  }
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error(
      `ASTRO_PUBLIC_SITE_URL must be an origin, with no path, query or credentials: "${raw}".`,
    )
  }
  if (production && isNonPublicHost(url.hostname)) {
    throw new Error(
      `ASTRO_PUBLIC_SITE_URL points at a local or private host, which search engines cannot reach: "${raw}". Set the public origin for production builds.`,
    )
  }
  if (production && url.protocol !== 'https:') {
    throw new Error(`ASTRO_PUBLIC_SITE_URL must use https in a production build: "${raw}".`)
  }
  return url.origin
}
