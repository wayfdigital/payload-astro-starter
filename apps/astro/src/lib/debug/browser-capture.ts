/*
 * Browser debug capture — INLINED into the page <head> in dev only (see Layout.astro).
 *
 * IMPORTANT: this file is shipped verbatim to the browser via a `?raw` import and
 * `set:html`, so it must be valid plain JS with NO TypeScript syntax and NO imports.
 * The variables `port` and `sessionId` are injected ahead of this code by Astro's
 * `define:vars`.
 *
 * Captures console.*, window.onerror / unhandledrejection, a custom window.debug(),
 * and fetch/XHR network activity, then streams each record (NDJSON-friendly) to the
 * reused debug-mode ingest server. Fire-and-forget, CORS-free (text/plain → no
 * preflight), with a self-loop guard so the capture never logs its own requests.
 */
/* eslint-disable */
// @ts-nocheck
;(function () {
  if (typeof window === 'undefined') return
  if (window.__DEBUG_CAPTURE_INSTALLED) return
  window.__DEBUG_CAPTURE_INSTALLED = true

  // `port` and `sessionId` come from define:vars; fall back defensively.
  var PORT = typeof port !== 'undefined' ? port : 7913
  var SESSION = typeof sessionId !== 'undefined' ? sessionId : 'dev'
  var INGEST_ORIGIN = 'http://127.0.0.1:' + PORT
  var INGEST_URL = INGEST_ORIGIN + '/ingest/' + SESSION

  var queue = []
  var sending = false // reentrancy guard so our own sends aren't captured

  // ---- safe serialization (depth/size limited, handles circular + Errors) ----
  function serialize(value, depth, seen) {
    if (depth > 4) return '[Max depth]'
    if (value === null || typeof value === 'undefined') return value
    var t = typeof value
    if (t === 'string') return value.length > 5000 ? value.slice(0, 5000) + '…' : value
    if (t === 'number' || t === 'boolean') return value
    if (t === 'function') return '[Function ' + (value.name || 'anonymous') + ']'
    if (t === 'bigint' || t === 'symbol') return String(value)
    if (value instanceof Error) {
      return { name: value.name, message: value.message, stack: value.stack }
    }
    if (typeof Node !== 'undefined' && value instanceof Node) {
      return '[' + (value.nodeName || 'Node') + ']'
    }
    if (seen.indexOf(value) !== -1) return '[Circular]'
    seen.push(value)
    try {
      if (Array.isArray(value)) {
        var arr = []
        for (var i = 0; i < value.length && i < 100; i++) arr.push(serialize(value[i], depth + 1, seen))
        return arr
      }
      var out = {}
      var keys = Object.keys(value)
      for (var k = 0; k < keys.length && k < 50; k++) {
        out[keys[k]] = serialize(value[keys[k]], depth + 1, seen)
      }
      return out
    } catch (e) {
      return '[Unserializable]'
    } finally {
      seen.pop()
    }
  }

  function summarize(args) {
    var parts = []
    for (var i = 0; i < args.length; i++) {
      var a = args[i]
      if (typeof a === 'string') parts.push(a)
      else if (a instanceof Error) parts.push(a.name + ': ' + a.message)
      else {
        try {
          parts.push(JSON.stringify(serialize(a, 0, [])))
        } catch (e) {
          parts.push(String(a))
        }
      }
    }
    return parts.join(' ')
  }

  function enqueue(record) {
    record.source = 'browser'
    record.sessionId = SESSION
    if (!record.timestamp) record.timestamp = Date.now()
    if (typeof record.url === 'undefined') {
      try {
        record.url = window.location.href
      } catch (e) {}
    }
    queue.push(record)
    if (queue.length >= 20) flush()
  }

  // ---- transport (fire-and-forget, no preflight) ----
  function send(record) {
    var body
    try {
      body = JSON.stringify(record)
    } catch (e) {
      body = JSON.stringify({ source: 'browser', level: 'error', message: '[capture serialize failed]', timestamp: Date.now(), sessionId: SESSION })
    }
    sending = true
    try {
      var beacon = navigator && navigator.sendBeacon
      if (beacon) {
        var blob = new Blob([body], { type: 'text/plain' })
        if (navigator.sendBeacon(INGEST_URL, blob)) return
      }
      fetch(INGEST_URL, {
        method: 'POST',
        body: body,
        headers: { 'content-type': 'text/plain' },
        keepalive: true,
        mode: 'no-cors',
      }).catch(function () {})
    } catch (e) {
      // never let logging throw
    } finally {
      sending = false
    }
  }

  function flush() {
    if (!queue.length) return
    var batch = queue
    queue = []
    for (var i = 0; i < batch.length; i++) send(batch[i])
  }

  setInterval(flush, 1000)
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush()
  })

  // ---- console.* ----
  var levels = ['log', 'info', 'warn', 'error', 'debug']
  for (var li = 0; li < levels.length; li++) {
    ;(function (level) {
      var original = console[level] ? console[level].bind(console) : function () {}
      console[level] = function () {
        original.apply(null, arguments)
        if (sending) return
        var args = Array.prototype.slice.call(arguments)
        enqueue({
          level: level,
          location: 'console',
          message: summarize(args),
          data: args.length ? serialize(args.length === 1 ? args[0] : args, 0, []) : undefined,
        })
      }
    })(levels[li])
  }

  // ---- uncaught errors ----
  window.addEventListener('error', function (event) {
    var err = event.error
    enqueue({
      level: 'error',
      location: 'window.onerror',
      message: event.message || (err && err.message) || 'Uncaught error',
      data: {
        name: err && err.name,
        stack: err && err.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  })

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason
    enqueue({
      level: 'error',
      location: 'unhandledrejection',
      message: reason instanceof Error ? reason.name + ': ' + reason.message : summarize([reason]),
      data: reason instanceof Error ? { name: reason.name, stack: reason.stack } : serialize(reason, 0, []),
    })
  })

  // ---- custom debug() API ----
  window.debug = function (message, data) {
    enqueue({
      level: 'debug',
      location: 'window.debug',
      message: typeof message === 'string' ? message : summarize([message]),
      data: typeof data !== 'undefined' ? serialize(data, 0, []) : undefined,
    })
  }

  function isIngest(url) {
    return typeof url === 'string' && url.indexOf(INGEST_ORIGIN) === 0
  }

  // ---- fetch ----
  if (typeof window.fetch === 'function') {
    var originalFetch = window.fetch.bind(window)
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : input && input.url ? input.url : String(input)
      var method = (init && init.method) || (input && input.method) || 'GET'
      if (sending || isIngest(url)) return originalFetch(input, init)
      var start = Date.now()
      return originalFetch(input, init).then(
        function (res) {
          enqueue({
            level: 'network',
            location: method.toUpperCase() + ' ' + url,
            message: method.toUpperCase() + ' ' + url + ' → ' + res.status,
            data: { method: method, url: url, status: res.status, durationMs: Date.now() - start, ok: res.ok },
          })
          return res
        },
        function (err) {
          enqueue({
            level: 'network',
            location: method.toUpperCase() + ' ' + url,
            message: method.toUpperCase() + ' ' + url + ' failed',
            data: { method: method, url: url, durationMs: Date.now() - start, ok: false, error: String(err) },
          })
          throw err
        }
      )
    }
  }

  // ---- XMLHttpRequest ----
  if (typeof window.XMLHttpRequest === 'function') {
    var XHR = window.XMLHttpRequest
    var open = XHR.prototype.open
    var xhrSend = XHR.prototype.send
    XHR.prototype.open = function (method, url) {
      this.__debug = { method: method, url: url }
      return open.apply(this, arguments)
    }
    XHR.prototype.send = function () {
      var meta = this.__debug
      if (meta && !isIngest(meta.url) && !sending) {
        var start = Date.now()
        var self = this
        this.addEventListener('loadend', function () {
          enqueue({
            level: 'network',
            location: (meta.method || 'GET').toUpperCase() + ' ' + meta.url,
            message: (meta.method || 'GET').toUpperCase() + ' ' + meta.url + ' → ' + self.status,
            data: {
              method: meta.method,
              url: meta.url,
              status: self.status,
              durationMs: Date.now() - start,
              ok: self.status >= 200 && self.status < 400,
            },
          })
        })
      }
      return xhrSend.apply(this, arguments)
    }
  }
})()
