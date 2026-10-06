import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  DEV_SITE_URL,
  isNonPublicHost,
  isNonPublicUrl,
  resolveSiteUrl,
} from '../src/lib/seo/site-url.mjs'

/** ASTRO_PUBLIC_SITE_URL from the fixture of the build that shipped localhost. */
const shipped = readFileSync(new URL('./fixtures/shipped-site-url.env', import.meta.url), 'utf8')
  .split(/\r?\n/)
  .find((line) => line.startsWith('ASTRO_PUBLIC_SITE_URL='))
  ?.slice('ASTRO_PUBLIC_SITE_URL='.length)

const production = { production: true }
const development = { production: false }

test('a production build rejects the value the live site shipped with', () => {
  assert.equal(shipped, 'http://localhost:3000')
  assert.throws(() => resolveSiteUrl(shipped, production), /local or private host/)
})

test('a production build rejects a missing value', () => {
  for (const value of [undefined, '', '   ']) {
    assert.throws(() => resolveSiteUrl(value, production), /is not set/)
  }
})

test('a production build rejects local, private and reserved hosts', () => {
  for (const value of [
    'https://localhost',
    'https://127.0.0.1',
    'https://0x7f.1', // the URL parser normalises this to 127.0.0.1
    'https://10.1.2.3',
    'https://172.20.0.1',
    'https://192.168.1.10',
    'https://192.0.0.1',
    'https://192.0.2.1',
    'https://192.88.99.1',
    'https://198.18.0.1',
    'https://198.19.255.254',
    'https://198.51.100.7',
    'https://203.0.113.9',
    'https://169.254.10.1',
    'https://100.64.0.1',
    'https://0.0.0.0',
    'https://224.0.0.1',
    'https://240.0.0.1',
    'https://255.255.255.255',
    'https://[::1]',
    'https://[fd12::1]',
    'https://[fe80::1]',
    'https://starter.localhost',
    'https://starter.local',
    'https://starter.internal',
    'https://starter.test',
  ]) {
    assert.throws(() => resolveSiteUrl(value, production), /local or private host/, value)
  }
})

test('a production build rejects plain http, paths, queries and malformed values', () => {
  assert.throws(() => resolveSiteUrl('http://starter.example.com', production), /https/)
  assert.throws(() => resolveSiteUrl('https://starter.example.com/blog', production), /origin/)
  assert.throws(() => resolveSiteUrl('https://starter.example.com/?a=1', production), /origin/)
  assert.throws(() => resolveSiteUrl('https://user:pass@starter.example.com', production), /origin/)
  assert.throws(() => resolveSiteUrl('starter.example.com', production), /not a valid URL/)
  assert.throws(() => resolveSiteUrl('ftp://starter.example.com', production), /http or https/)
})

test('a production build accepts a public https origin and drops the trailing slash', () => {
  assert.equal(
    resolveSiteUrl('https://payload-astro-starter.wayf.ai/', production),
    'https://payload-astro-starter.wayf.ai',
  )
  assert.equal(
    resolveSiteUrl(' https://Starter.Example.com:8443 ', production),
    'https://starter.example.com:8443',
  )
})

test('development falls back to the local dev server and accepts local values', () => {
  assert.equal(resolveSiteUrl(undefined, development), DEV_SITE_URL)
  assert.equal(resolveSiteUrl('', development), DEV_SITE_URL)
  assert.equal(resolveSiteUrl(shipped, development), 'http://localhost:3000')
  assert.equal(resolveSiteUrl('http://starter.test:4321', development), 'http://starter.test:4321')
})

test('public hosts are not flagged', () => {
  for (const host of [
    'payload-astro-starter.wayf.ai',
    'example.com',
    '8.8.8.8',
    '192.0.0.9', // IANA anycast exceptions inside 192.0.0.0/24
    '192.0.0.10',
    '[2606:4700::1111]',
  ]) {
    assert.equal(isNonPublicHost(host), false, host)
  }
})

test('media URLs on a development host are flagged', () => {
  assert.equal(isNonPublicUrl('http://localhost:3100/api/media/file/og.png'), true)
  assert.equal(isNonPublicUrl('https://cdn.example.com/og.png'), false)
  assert.equal(isNonPublicUrl('/relative/og.png'), false)
})
