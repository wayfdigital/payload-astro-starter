/**
 * Builds the app and checks the metadata it actually ships, then serves the build
 * with `wrangler dev` to check the server-rendered routes. Slower than the unit
 * tests (two builds and a local Worker); it needs no network or Cloudflare account.
 *
 * Builds go to .tmp-seo-test/, never dist/, so a test build (with a throwaway
 * preview secret) cannot be deployed by mistake. The directory has to sit inside the
 * app: on Windows the workerd prerenderer fails on an outDir outside the project root.
 */
import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createServer } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isNonPublicUrl } from '../src/lib/seo/site-url.mjs'

const appRoot = fileURLToPath(new URL('..', import.meta.url))
const workDir = join(appRoot, '.tmp-seo-test')
const require = createRequire(import.meta.url)

/** Absolute path to a package's CLI, run with the current node binary. */
const binOf = (pkg, name) => {
  const manifest = require.resolve(`${pkg}/package.json`)
  const { bin } = JSON.parse(readFileSync(manifest, 'utf8'))
  return join(dirname(manifest), typeof bin === 'string' ? bin : bin[name])
}
const astroBin = binOf('astro', 'astro')
const wranglerBin = binOf('wrangler', 'wrangler')

const ORIGIN = 'https://starter.example.com'
const PREVIEW_SECRET = 'seo-test-preview-secret'

/** Overrides the shell and any local .env so every build sees the same inputs. */
const buildEnv = (overrides) => ({
  ...process.env,
  ASTRO_PUBLIC_SITE_URL: '',
  PREVIEW_SECRET: '',
  ASTRO_PUBLIC_ADMIN_ORIGIN: '',
  // Port 9 refuses connections at once, so CMS fetches fail fast and the
  // routes take their no-CMS paths, as on the live landing-only deploy.
  PAYLOAD_API_URL: 'http://127.0.0.1:9',
  ...overrides,
})

const build = (name, env) => {
  const outDir = join(workDir, name)
  const result = spawnSync(process.execPath, [astroBin, 'build', '--outDir', outDir], {
    cwd: appRoot,
    env: buildEnv(env),
    encoding: 'utf8',
  })
  return { outDir, status: result.status, output: `${result.stdout}\n${result.stderr}` }
}

const readEnvFixture = (file) =>
  Object.fromEntries(
    readFileSync(new URL(`./fixtures/${file}`, import.meta.url), 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  )

/** Values of one attribute on every tag that matches `selector` (a tag-level regex). */
const attrs = (html, selector, attr) =>
  [...html.matchAll(selector)].map((m) => m[0].match(new RegExp(`${attr}="([^"]*)"`))?.[1])

const canonicals = (html) => attrs(html, /<link[^>]+rel="canonical"[^>]*>/g, 'href')
const alternates = (html) => attrs(html, /<link[^>]+rel="alternate"[^>]*>/g, 'href')
const metaContent = (html, key) =>
  attrs(html, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`, 'g'), 'content')
const absoluteUrls = (text) => text.match(/https?:\/\/[^\s"'<>)]+/g) ?? []

// Best effort: on Windows workerd can hold its files for a while after it exits.
// The directory is gitignored, and the next run starts by removing it again.
const cleanUp = () => {
  try {
    rmSync(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
  } catch (error) {
    console.warn(`Could not remove ${workDir}: ${String(error)}`)
  }
}

before(cleanUp)
after(cleanUp)

test('the build environment that shipped localhost stops `astro build`', () => {
  const fixture = readEnvFixture('shipped-site-url.env')
  assert.equal(fixture.ASTRO_PUBLIC_SITE_URL, 'http://localhost:3000')

  const { outDir, status, output } = build('shipped', fixture)
  assert.notEqual(status, 0, 'the build must fail')
  assert.match(output, /ASTRO_PUBLIC_SITE_URL points at a local or private host/)
  assert.equal(existsSync(join(outDir, 'client', 'index.html')), false, 'no page is written')
})

test('a build without ASTRO_PUBLIC_SITE_URL stops before writing anything', () => {
  const { outDir, status, output } = build('unset', {})
  assert.notEqual(status, 0)
  assert.match(output, /ASTRO_PUBLIC_SITE_URL is not set/)
  assert.equal(existsSync(join(outDir, 'client', 'index.html')), false)
})

describe('a production build with a public origin', () => {
  /** @type {{ outDir: string, status: number | null, output: string }} */
  let built
  before(() => {
    built = build('production', {
      ASTRO_PUBLIC_SITE_URL: `${ORIGIN}/`,
      PREVIEW_SECRET,
      ASTRO_PUBLIC_ADMIN_ORIGIN: 'https://cms.example.com',
    })
  })

  test('builds', () => {
    assert.equal(built.status, 0, built.output)
  })

  test('the home page names the public origin in every absolute metadata URL', () => {
    const html = readFileSync(join(built.outDir, 'client', 'index.html'), 'utf8')
    assert.deepEqual(canonicals(html), [`${ORIGIN}/`])
    assert.deepEqual(metaContent(html, 'og:url'), [`${ORIGIN}/`])
    assert.deepEqual(metaContent(html, 'og:image'), [`${ORIGIN}/og-image.png`])
    assert.deepEqual(metaContent(html, 'twitter:image'), [`${ORIGIN}/og-image.png`])
    assert.match(metaContent(html, 'robots')[0] ?? '', /^index, follow/)
    assert.ok(alternates(html).length > 0)
    for (const href of alternates(html)) assert.equal(href, `${ORIGIN}/`)

    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
      .flatMap((m) => JSON.parse(m[1]))
    assert.equal(jsonLd.find((node) => node['@type'] === 'WebSite')?.url, ORIGIN)
    assert.equal(jsonLd.find((node) => node['@type'] === 'Organization')?.logo, `${ORIGIN}/icon-512.png`)

    assert.deepEqual(absoluteUrls(html).filter(isNonPublicUrl), [])
  })

  test('robots.txt points at the sitemap on the public origin', () => {
    const robots = readFileSync(join(built.outDir, 'client', 'robots.txt'), 'utf8')
    assert.match(robots, new RegExp(`^Sitemap: ${ORIGIN}/sitemap\\.xml$`, 'm'))
    assert.deepEqual(absoluteUrls(robots).filter(isNonPublicUrl), [])
  })

  describe('served by the built Worker', () => {
    /** @type {import('node:child_process').ChildProcess} */
    let worker
    let base = ''

    before(async () => {
      const port = await new Promise((resolve, reject) => {
        const server = createServer().listen(0, '127.0.0.1', () => {
          const { port: free } = server.address()
          server.close(() => resolve(free))
        })
        server.on('error', reject)
      })
      base = `http://127.0.0.1:${port}`
      worker = spawn(
        process.execPath,
        [wranglerBin, 'dev', '-c', join(built.outDir, 'server', 'wrangler.json'),
          '--ip', '127.0.0.1', '--port', String(port), '--local', '--log-level', 'warn'],
        {
          cwd: appRoot,
          env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
          stdio: 'ignore',
          detached: process.platform !== 'win32',
        },
      )
      for (let i = 0; i < 60; i += 1) {
        const ready = await fetch(`${base}/robots.txt`).then((r) => r.ok, () => false)
        if (ready) return
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      throw new Error('wrangler dev did not start')
    })

    after(async () => {
      if (!worker?.pid || worker.exitCode !== null) return
      const exited = new Promise((resolve) => worker.once('exit', resolve))
      // Stop wrangler and the workerd process it started, and nothing else.
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(worker.pid), '/T', '/F'], { stdio: 'ignore' })
      } else {
        process.kill(-worker.pid, 'SIGTERM')
      }
      await exited
    })

    test('the sitemap lists URLs on the public origin only', async () => {
      const res = await fetch(`${base}/sitemap.xml`)
      assert.equal(res.status, 200)
      const xml = await res.text()
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
      assert.deepEqual(locs, [`${ORIGIN}/`])
      for (const url of absoluteUrls(xml).filter((u) => !u.includes('sitemaps.org') && !u.includes('w3.org'))) {
        assert.ok(url.startsWith(`${ORIGIN}/`), url)
      }
    })

    test('a missing page is a noindex 404 with no canonical', async () => {
      const res = await fetch(`${base}/no-such-page/`)
      assert.equal(res.status, 404)
      const html = await res.text()
      assert.match(metaContent(html, 'robots')[0] ?? '', /noindex/)
      assert.deepEqual(canonicals(html), [])
      assert.deepEqual(metaContent(html, 'og:url'), [])
      assert.deepEqual(alternates(html), [])
    })

    test('a preview response is kept out of the index and out of caches', async () => {
      const res = await fetch(`${base}/no-such-page/?preview=1&secret=${PREVIEW_SECRET}`)
      assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow')
      assert.equal(res.headers.get('cache-control'), 'no-store')
      const html = await res.text()
      assert.match(metaContent(html, 'robots')[0] ?? '', /noindex/)
      assert.deepEqual(canonicals(html), [])
    })

    test('a public page carries no robots header to contradict its index meta tag', async () => {
      const res = await fetch(`${base}/`)
      assert.equal(res.status, 200)
      assert.equal(res.headers.get('x-robots-tag'), null)
      assert.deepEqual(canonicals(await res.text()), [`${ORIGIN}/`])
    })
  })
})
