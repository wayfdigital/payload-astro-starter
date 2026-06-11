#!/usr/bin/env node
// Debug-mode ingest bootstrap — runs as `predev`, before `turbo dev`.
//
// Reuses the global debug-mode skill server (~/.claude/skills/debug-mode/server.js)
// as the internal log-ingest server, pinned to port 7913 with logs written to the
// repo-local `.debug-logs/` dir. Idempotent and graceful: if the skill file is
// missing or the server is already up, it no-ops; it never exits non-zero so it
// can never break `pnpm dev`.
//
// See the project's debug-mode feature: browser + server capture POST NDJSON to
// http://127.0.0.1:7913/ingest/dev, appended to .debug-logs/debug-dev.log.

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = process.env.DEBUG_SERVER_PORT || '7913'
const HOST = process.env.DEBUG_SERVER_HOST || '127.0.0.1'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logDir = path.join(repoRoot, '.debug-logs')
const logFile = path.join(logDir, 'debug-dev.log')
const skillServer = path.join(os.homedir(), '.claude', 'skills', 'debug-mode', 'server.js')

const healthUrl = `http://${HOST}:${PORT}/health`

const warn = (msg) => console.warn(`[debug-ingest] ${msg}`)
const info = (msg) => console.log(`[debug-ingest] ${msg}`)

async function isHealthy() {
  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(500) })
    return res.ok && (await res.text()).trim() === 'ok'
  } catch {
    return false
  }
}

async function main() {
  // Fresh session: ensure the dir exists and truncate the merged log.
  fs.mkdirSync(logDir, { recursive: true })
  fs.writeFileSync(logFile, '')

  if (await isHealthy()) {
    info(`ingest server already running on ${healthUrl}`)
    return
  }

  if (!fs.existsSync(skillServer)) {
    warn(`debug-mode skill server not found at ${skillServer} — skipping (capture will silently no-op)`)
    return
  }

  const child = spawn('node', [skillServer], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      DEBUG_SERVER_PORT: PORT,
      DEBUG_SERVER_HOST: HOST,
      DEBUG_LOG_DIR: logDir,
    },
  })
  child.unref()

  // Poll health for ~2s so a fast `pnpm dev` finds the server already up.
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 200))
    if (await isHealthy()) {
      info(`ingest server started on ${healthUrl} (logs → ${logFile})`)
      return
    }
  }
  warn(`started ingest server but ${healthUrl} did not report healthy in time — continuing anyway`)
}

main().catch((err) => {
  warn(`unexpected error, continuing: ${err?.message ?? err}`)
  process.exit(0)
})
