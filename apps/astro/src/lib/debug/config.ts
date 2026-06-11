/**
 * Shared debug-capture configuration (Node side: server-capture).
 *
 * The browser capture does NOT import this — it is inlined into the page and
 * receives the port/sessionId via Astro `define:vars` (see Layout.astro).
 *
 * Single source of truth for the ingest contract served by @repo/debug-server
 * (packages/debug-server): POST http://127.0.0.1:<port>/ingest. The server owns
 * its own log dir (<repo>/.debug-logs/debug-dev.log), so clients only need the URL.
 */
export const DEBUG_HOST = process.env.DEBUG_SERVER_HOST || '127.0.0.1'
export const DEBUG_PORT = process.env.DEBUG_SERVER_PORT || '7913'

/** Ingest endpoint for the always-on dev session. */
export const DEBUG_INGEST_URL = `http://${DEBUG_HOST}:${DEBUG_PORT}/ingest`
