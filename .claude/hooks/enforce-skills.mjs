#!/usr/bin/env node
/**
 * SessionStart hook — the "session bootstrap".
 *
 * This repo is a Payload CMS + Next.js/Astro website starter driven by a NON-TECHNICAL
 * ("no-code") user via an AI builder. They describe outcomes, never implementation, and
 * never invoke skills. CLAUDE.md is the operating manual and the `vibe-coding` skill is the
 * mandated FIRST step on any build request — but nothing guarantees they are in context at
 * the start of a chat. This hook fixes that: on every session start (startup / resume /
 * clear / compact) it injects a short, mandatory directive so the agent reliably
 * (1) treats CLAUDE.md as its source of truth and (2) invokes the `vibe-coding` skill before
 * touching code on any feature / design / schema / data / SEO / security request.
 *
 * Unlike route-skills.mjs (per-prompt, keyword-gated), this fires UNCONDITIONALLY once per
 * session — that is the "in every chat" guarantee the directive must provide.
 *
 * Contract: reads the hook JSON from stdin (it only needs to run, not inspect it), and prints
 * `hookSpecificOutput.additionalContext` (added to the agent's context). Pure string output,
 * no network. Always exits 0 (never blocks a session).
 */

const DIRECTIVE = [
  '[wayf session bootstrap] This repo is a Payload CMS + Next.js/Astro website starter driven by a NON-TECHNICAL ("no-code") user who describes outcomes, never implementation — YOU are the developer.',
  '',
  'MANDATORY for this chat:',
  '1. The operating manual is CLAUDE.md (project root). It is your source of truth — follow its Golden rules, Skill router, Build pipeline, and Hard rules exactly.',
  '2. On ANY build / feature / section / design / schema / field / data / SEO / security request, your FIRST action MUST be to invoke the `vibe-coding` skill via the Skill tool. It is the front door: it turns the user\'s plain-language ask into a developer spec and pulls in the exact downstream skills (website-layout-sections, payload-migrations, data-fetching, figma, seo-structured-data, security-audit) so you do not have to route by hand.',
  '3. Never assume the spec — confirm with AskUserQuestion first. Never make a DB-schema change without a migration. Never leave payload-types stale (run generate:types).',
  '',
  'Do not skip the vibe-coding skill because a request "looks simple" — it is the executable form of CLAUDE.md\'s Skill router and runs before any code.',
].join('\n')

const readStdin = async () => {
  let data = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) data += chunk
  return data
}

const main = async () => {
  await readStdin() // drain stdin so the hook process exits cleanly; payload is not needed
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: DIRECTIVE,
      },
    }),
  )
  process.exit(0)
}

main().catch(() => process.exit(0)) // never block a session on a hook error
