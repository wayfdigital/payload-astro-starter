/**
 * Shared debug-capture configuration (Node side: server-capture + dashboard API).
 *
 * The browser capture does NOT import this — it is inlined into the page and
 * receives the port/sessionId via Astro `define:vars` (see Layout.astro).
 *
 * Single source of truth for the ingest server contract, reused by the
 * debug-mode skill server (~/.claude/skills/debug-mode/server.js):
 *   POST http://127.0.0.1:<port>/ingest/<sessionId>  -> appends NDJSON
 *   writes <repo>/.debug-logs/debug-<sessionId>.log
 */
import fs from 'node:fs'
import path from 'node:path'

export const DEBUG_HOST = process.env.DEBUG_SERVER_HOST || '127.0.0.1'
export const DEBUG_PORT = process.env.DEBUG_SERVER_PORT || '7913'
export const DEBUG_SESSION_ID = 'dev'

/** Ingest endpoint for the always-on dev session. */
export const DEBUG_INGEST_URL = `http://${DEBUG_HOST}:${DEBUG_PORT}/ingest/${DEBUG_SESSION_ID}`

/**
 * Repo-local log dir. `predev` (scripts/debug-ingest.mjs) starts the server with
 * DEBUG_LOG_DIR set to this same path, so the merged file is the source of truth.
 * Resolved from cwd, which is the app dir under `turbo dev`; walk up to the repo root.
 */
export function resolveLogDir(): string {
  // turbo runs each app from its own dir (apps/astro); walk up to the repo root,
  // identified by pnpm-workspace.yaml, and place .debug-logs there.
  let dir = process.cwd()
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) break
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return path.join(dir, '.debug-logs')
}

export const DEBUG_LOG_FILE = `debug-${DEBUG_SESSION_ID}.log`
