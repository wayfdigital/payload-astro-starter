#!/usr/bin/env node
/**
 * UserPromptSubmit hook — the "router middleware".
 *
 * This repo is a website starter driven by a NON-TECHNICAL ("no-code") user via an
 * AI builder. They describe outcomes, never implementation, and never invoke skills.
 * When a prompt looks like a feature / design / schema request, this hook injects a
 * short reminder so the agent reliably (1) loads the right skill(s), (2) follows the
 * Build pipeline in CLAUDE.md, and (3) confirms the spec before building.
 *
 * Contract: reads the hook JSON from stdin, inspects `.prompt`, and on a keyword match
 * prints `hookSpecificOutput.additionalContext` (added to the agent's context). No match
 * → no output. Pure regex, no network. Always exits 0 (never blocks a prompt).
 */

// Domain signals (EN + PL) that mark a build / design / schema request. Intentionally
// noun-led so trivial prompts ("fix this typo", "what does X do") don't trigger it.
const TRIGGER =
  /(section|sekcj|\bblock\b|blok|\bpage\b|stron|\bfield\b|\bpole\b|collection|kolekcj|schema|schemat|migrat|design|projekt|figma|layout|hero|formularz|\bform\b|locale|lokaliz|tłumacz|translat|\bi18n\b|dynamic|dynamicz|\bcms\b|data[ -]quer|content type|typ treści)/i

const REMINDER = [
  '[wayf router] This repo serves a NO-CODE user who describes outcomes, not code — you are the developer.',
  'Before building: (1) classify this request — and first check whether the section ALREADY has a block',
  'in apps/payload/src/payload/blocks/: if yes it is integrated, so edit the @repo/ui component in place',
  '(no Design Mode, no gate); if no, it is new;',
  '(2) load the matching skill(s) — design-mode (a NEW section/page/design: iterate in packages/ui + Storybook',
  'on static props, then hold the approval gate), website-layout-sections (Phase B, after the gate),',
  'payload-migrations (any schema/field/collection change), data-fetching (loading CMS data), figma (a Figma design);',
  '(3) for a new section run Phase A → GATE (one AskUserQuestion; only an explicit Yes continues — a compliment is not approval)',
  '→ Phase B of the Build pipeline in CLAUDE.md',
  '(block → register in Pages.ts + payload.config.ts → renderer + layout-sections map → pnpm generate:types → migration → verify);',
  '(4) confirm the spec with AskUserQuestion first — never assume.',
].join(' ')

const readStdin = async () => {
  let data = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) data += chunk
  return data
}

const main = async () => {
  const raw = await readStdin()
  let prompt = ''
  try {
    prompt = JSON.parse(raw)?.prompt ?? ''
  } catch {
    prompt = raw // tolerate raw text input
  }

  if (TRIGGER.test(prompt)) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: REMINDER,
        },
      }),
    )
  }
  process.exit(0)
}

main().catch(() => process.exit(0)) // never block a prompt on a hook error
