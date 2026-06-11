#!/usr/bin/env node
/*
 * @repo/debug-server — internal dev-only log-ingest server + live dashboard.
 *
 * Reproduces Cursor's web-debugging backend: the running app streams browser +
 * server console / error / network / debug logs here as NDJSON; the dashboard
 * renders them live and Claude reads the file for root-cause analysis.
 *
 * Repo-owned (committed), zero dependencies, runs via `turbo dev` (this package's
 * `dev` script) alongside astro (:3000) and payload (:3100).
 *
 * Routes:
 *   GET  /health   -> "ok"
 *   POST /ingest    -> append one NDJSON record to .debug-logs/debug-dev.log
 *        /ingest/*     (path suffix, e.g. /ingest/dev, is ignored — single stream)
 *   GET  /logs      -> { records: [...] }  (tail of the file)
 *   DELETE /logs    -> truncate the file (dashboard "Clear")
 *   GET  /          -> the dashboard UI
 *
 * Env: DEBUG_SERVER_PORT (default 7913), DEBUG_SERVER_HOST (default 127.0.0.1).
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number.parseInt(process.env.DEBUG_SERVER_PORT || '7913', 10)
const HOST = process.env.DEBUG_SERVER_HOST || '127.0.0.1'
const TAIL_BYTES = 256 * 1024
const MAX_RECORDS = 2000

function resolveRepoRoot() {
  let dir = path.dirname(fileURLToPath(import.meta.url))
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}

const LOG_DIR = path.join(resolveRepoRoot(), '.debug-logs')
const LOG_FILE = path.join(LOG_DIR, 'debug-dev.log')

// Fresh session: ensure dir exists and start from an empty file.
fs.mkdirSync(LOG_DIR, { recursive: true })
fs.writeFileSync(LOG_FILE, '')

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
  'access-control-allow-headers': 'content-type,x-debug-log-dir',
}

function appendRecord(parsed) {
  const record = {
    ...parsed,
    source: parsed.source || 'unknown',
    timestamp: parsed.timestamp || Date.now(),
  }
  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + '\n')
}

function readTail() {
  let records = []
  try {
    const stat = fs.statSync(LOG_FILE)
    const start = Math.max(0, stat.size - TAIL_BYTES)
    const fd = fs.openSync(LOG_FILE, 'r')
    try {
      const length = stat.size - start
      const buf = Buffer.alloc(length)
      fs.readSync(fd, buf, 0, length, start)
      const lines = buf.toString('utf8').split('\n')
      if (start > 0) lines.shift() // drop partial first line
      records = lines
        .filter((l) => l.trim())
        .map((l) => {
          try {
            return JSON.parse(l)
          } catch {
            return null
          }
        })
        .filter(Boolean)
        .slice(-MAX_RECORDS)
    } finally {
      fs.closeSync(fd)
    }
  } catch {
    records = []
  }
  return records
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0]
  const json = (status, obj) =>
    res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store', ...CORS }).end(JSON.stringify(obj))

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS).end()
    return
  }

  if (req.method === 'GET' && url === '/health') {
    res.writeHead(200, { 'content-type': 'text/plain', ...CORS }).end('ok')
    return
  }

  if (req.method === 'POST' && (url === '/ingest' || url.startsWith('/ingest/'))) {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (c) => {
      body += c
      if (body.length > 1_000_000) req.destroy()
    })
    req.on('end', () => {
      try {
        appendRecord(body ? JSON.parse(body) : {})
        json(200, { ok: true })
      } catch (e) {
        json(400, { ok: false, error: String(e) })
      }
    })
    return
  }

  if (req.method === 'GET' && url === '/logs') {
    json(200, { records: readTail() })
    return
  }

  if (req.method === 'DELETE' && url === '/logs') {
    try {
      fs.truncateSync(LOG_FILE, 0)
    } catch {
      /* nothing to clear */
    }
    json(200, { ok: true })
    return
  }

  if (req.method === 'GET' && url === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...CORS }).end(DASHBOARD_HTML)
    return
  }

  res.writeHead(404, CORS).end('not found')
})

server.listen(PORT, HOST, () => {
  console.log(`[debug-server] http://${HOST}:${PORT}  dashboard → http://${HOST}:${PORT}/  logs → ${LOG_FILE}`)
})

const DASHBOARD_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Debug · runtime logs</title>
  <style>
    :root { color-scheme: dark; --bg:#0b0d10; --panel:#14181d; --border:#232a31; --text:#d6dde3; --muted:#7d8893; --error:#ff6b6b; --warn:#ffc14d; --network:#4dd0e1; --debug:#b388ff; --info:#8ab4f8; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    header { position:sticky; top:0; background:var(--panel); border-bottom:1px solid var(--border); padding:10px 16px; display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center; }
    header h1 { font-size:14px; margin:0; font-weight:600; }
    .spacer { flex:1; }
    .chip { cursor:pointer; padding:3px 10px; border:1px solid var(--border); border-radius:999px; color:var(--muted); user-select:none; }
    .chip.on { color:var(--text); border-color:#3a4651; background:#1b2129; }
    button { font:inherit; cursor:pointer; background:#1b2129; color:var(--text); border:1px solid var(--border); border-radius:6px; padding:4px 12px; }
    button:hover { border-color:#3a4651; }
    label.toggle { display:inline-flex; align-items:center; gap:6px; color:var(--muted); cursor:pointer; }
    #count { color:var(--muted); }
    main { padding:8px 0 40px; }
    .row { display:grid; grid-template-columns:84px 64px 110px 1fr; gap:12px; padding:4px 16px; border-bottom:1px solid #11151a; align-items:baseline; }
    .row:hover { background:#10141a; }
    .time { color:var(--muted); }
    .lvl { text-transform:uppercase; font-size:11px; font-weight:600; }
    .src { color:var(--muted); }
    .msg { white-space:pre-wrap; word-break:break-word; }
    .data { margin:2px 0 0; color:var(--muted); white-space:pre-wrap; word-break:break-word; max-height:200px; overflow:auto; }
    .lvl-error,.row-error .msg { color:var(--error); }
    .row-error { background:rgba(255,107,107,.06); }
    .lvl-warn { color:var(--warn); }
    .lvl-network { color:var(--network); }
    .lvl-debug { color:var(--debug); }
    .lvl-info { color:var(--info); }
    .empty { color:var(--muted); padding:40px 16px; text-align:center; }
  </style>
</head>
<body>
  <header>
    <h1>🐞 Debug</h1>
    <div id="sources"></div>
    <div id="levels"></div>
    <label class="toggle"><input type="checkbox" id="errorsOnly" /> errors only</label>
    <label class="toggle"><input type="checkbox" id="autoscroll" checked /> autoscroll</label>
    <div class="spacer"></div>
    <span id="count">0 records</span>
    <button id="clear">Clear</button>
  </header>
  <main id="log"><div class="empty">Waiting for logs… interact with the app at localhost:3000.</div></main>
  <script>
    const SOURCES = ['browser','astro','payload']
    const LEVELS = ['log','info','warn','error','debug','network']
    const state = { sources:new Set(SOURCES), levels:new Set(LEVELS), errorsOnly:false, records:[] }
    function chip(text,on,onToggle){ const el=document.createElement('span'); el.className='chip'+(on?' on':''); el.textContent=text; el.onclick=()=>{ const nowOn=!el.classList.contains('on'); el.classList.toggle('on',nowOn); onToggle(nowOn); render(); }; return el }
    const srcWrap=document.getElementById('sources'); SOURCES.forEach(s=>srcWrap.appendChild(chip(s,true,on=>on?state.sources.add(s):state.sources.delete(s))))
    const lvlWrap=document.getElementById('levels'); LEVELS.forEach(l=>lvlWrap.appendChild(chip(l,true,on=>on?state.levels.add(l):state.levels.delete(l))))
    document.getElementById('errorsOnly').onchange=e=>{ state.errorsOnly=e.target.checked; render() }
    document.getElementById('clear').onclick=async()=>{ await fetch('/logs',{method:'DELETE'}); state.records=[]; render() }
    function fmtTime(ts){ const d=new Date(ts); return d.toLocaleTimeString('en-GB',{hour12:false})+'.'+String(d.getMilliseconds()).padStart(3,'0') }
    function render(){
      const log=document.getElementById('log')
      const visible=state.records.filter(r=>{ if(state.errorsOnly&&r.level!=='error')return false; if(!state.sources.has(r.source))return false; if(!state.levels.has(r.level))return false; return true })
      document.getElementById('count').textContent=visible.length+' / '+state.records.length+' records'
      if(!visible.length){ log.innerHTML='<div class="empty">No matching records.</div>'; return }
      const atBottom=window.innerHeight+window.scrollY>=document.body.offsetHeight-40
      log.innerHTML=''
      for(const r of visible){
        const row=document.createElement('div'); row.className='row'+(r.level==='error'?' row-error':'')
        const dataStr=(typeof r.data!=='undefined'&&r.data!==null)?(typeof r.data==='string'?r.data:JSON.stringify(r.data,null,2)):''
        row.innerHTML='<span class="time">'+fmtTime(r.timestamp)+'</span><span class="lvl lvl-'+r.level+'">'+r.level+'</span><span class="src">'+(r.source||'')+'</span><div><div class="msg"></div>'+(dataStr?'<pre class="data"></pre>':'')+'</div>'
        row.querySelector('.msg').textContent=(r.location?'['+r.location+'] ':'')+(r.message||'')
        if(dataStr) row.querySelector('.data').textContent=dataStr
        log.appendChild(row)
      }
      if(document.getElementById('autoscroll').checked&&atBottom) window.scrollTo(0,document.body.scrollHeight)
    }
    async function poll(){ try{ const res=await fetch('/logs',{cache:'no-store'}); if(res.ok){ const j=await res.json(); state.records=j.records||[]; render() } }catch(e){} }
    poll(); setInterval(poll,1000)
  </script>
</body>
</html>`
