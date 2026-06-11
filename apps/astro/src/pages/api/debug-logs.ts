import type { APIRoute } from 'astro'
import fs from 'node:fs'
import path from 'node:path'
import { DEBUG_LOG_FILE, resolveLogDir } from '../../lib/debug/config'

/**
 * Dev-only API for the /debug dashboard.
 *   GET    → returns the tail of the merged NDJSON capture stream as { records }
 *   DELETE → truncates the file (the "Clear" button); never removes it.
 *
 * Returns 404 in production so the route exists but serves nothing.
 */

const TAIL_BYTES = 256 * 1024 // read at most the last 256KB
const MAX_RECORDS = 2000

const notFound = () => new Response('Not found', { status: 404 })

function logPath(): string {
  return path.join(resolveLogDir(), DEBUG_LOG_FILE)
}

export const GET: APIRoute = () => {
  if (import.meta.env.PROD) return notFound()

  const file = logPath()
  let records: unknown[] = []
  try {
    const stat = fs.statSync(file)
    const start = Math.max(0, stat.size - TAIL_BYTES)
    const fd = fs.openSync(file, 'r')
    try {
      const length = stat.size - start
      const buf = Buffer.alloc(length)
      fs.readSync(fd, buf, 0, length, start)
      const text = buf.toString('utf8')
      // Drop a possibly-partial first line when we started mid-file.
      const lines = text.split('\n')
      if (start > 0) lines.shift()
      records = lines
        .filter((l) => l.trim())
        .map((l) => {
          try {
            return JSON.parse(l)
          } catch {
            return null
          }
        })
        .filter((r) => r !== null)
        .slice(-MAX_RECORDS)
    } finally {
      fs.closeSync(fd)
    }
  } catch {
    // missing file → empty stream (server may not have started yet)
    records = []
  }

  return new Response(JSON.stringify({ records }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

export const DELETE: APIRoute = () => {
  if (import.meta.env.PROD) return notFound()
  try {
    fs.truncateSync(logPath(), 0)
  } catch {
    // nothing to clear
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}
