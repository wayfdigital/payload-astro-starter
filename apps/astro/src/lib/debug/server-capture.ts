/*
 * Server-side console capture for the Astro SSR (Node) runtime — DEV ONLY.
 *
 * Patches console.* once and forwards each call to the reused debug-mode ingest
 * server via a fire-and-forget fetch (same-process Node → 127.0.0.1, no CORS).
 * Imported for its side effect from middleware.ts behind an import.meta.env.DEV
 * guard, so it never loads in production.
 */
import { DEBUG_INGEST_URL } from './config'

installServerCapture('astro')

declare global {
  var __DEBUG_SERVER_PATCHED: boolean | undefined
}

export function installServerCapture(source: 'astro' | 'payload'): void {
  if (globalThis.__DEBUG_SERVER_PATCHED) return
  globalThis.__DEBUG_SERVER_PATCHED = true

  const levels = ['log', 'info', 'warn', 'error', 'debug'] as const
  let sending = false

  const safe = (value: unknown): unknown => {
    if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack }
    if (typeof value === 'object' && value !== null) {
      try {
        return JSON.parse(JSON.stringify(value))
      } catch {
        // Circular or otherwise unserializable — `String(value)` would only ever
        // say "[object Object]", so say something that is actually true.
        return '[unserializable]'
      }
    }
    return value
  }

  const summarize = (args: unknown[]): string =>
    args
      .map((a) => {
        if (typeof a === 'string') return a
        if (a instanceof Error) return `${a.name}: ${a.message}`
        try {
          return JSON.stringify(safe(a))
        } catch {
          return String(a)
        }
      })
      .join(' ')

  for (const level of levels) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      original(...args)
      if (sending) return
      sending = true
      try {
        void fetch(DEBUG_INGEST_URL, {
          method: 'POST',
          headers: { 'content-type': 'text/plain' },
          body: JSON.stringify({
            source,
            level,
            location: `${source}-console`,
            message: summarize(args),
            data: args.length === 1 ? safe(args[0]) : args.map(safe),
            timestamp: Date.now(),
          }),
        }).catch(() => {})
      } finally {
        sending = false
      }
    }
  }
}
