/*
 * Server-side console capture for the Payload/Next (Node) runtime — DEV ONLY.
 *
 * Mirrors apps/astro/src/lib/debug/server-capture.ts but self-contained (no
 * cross-app import). Loaded once via instrumentation.ts `register()`, guarded by
 * NODE_ENV !== 'production', so it never runs in prod. Forwards console.* to the
 * reused debug-mode ingest server (same-process Node → 127.0.0.1, no CORS).
 */
declare global {
  // eslint-disable-next-line no-var
  var __DEBUG_SERVER_PATCHED: boolean | undefined
}

export function installServerCapture(): void {
  if (globalThis.__DEBUG_SERVER_PATCHED) return
  globalThis.__DEBUG_SERVER_PATCHED = true

  const host = process.env.DEBUG_SERVER_HOST || '127.0.0.1'
  const port = process.env.DEBUG_SERVER_PORT || '7913'
  const ingestUrl = `http://${host}:${port}/ingest`
  const levels = ['log', 'info', 'warn', 'error', 'debug'] as const
  let sending = false

  const safe = (value: unknown): unknown => {
    if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack }
    if (typeof value === 'object' && value !== null) {
      try {
        return JSON.parse(JSON.stringify(value))
      } catch {
        return String(value)
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
        void fetch(ingestUrl, {
          method: 'POST',
          headers: { 'content-type': 'text/plain' },
          body: JSON.stringify({
            source: 'payload',
            level,
            location: 'payload-console',
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

installServerCapture()
