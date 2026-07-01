# Multi-agent setup

## Source of truth

**`AGENTS.md`** (repo root) — the single source of truth. Contains the build pipeline, always-ask
checklist, monorepo structure, project map, skills index, and hard rules. Edit it directly when
the project structure or procedures change.

## Agent config files

| Agent | Config file | How it gets the manual |
|---|---|---|
| [Cursor](https://cursor.sh) | `AGENTS.md` | Reads it natively, in full |
| [OpenAI Codex CLI](https://github.com/openai/codex) | `AGENTS.md` | Reads it natively, in full |
| [opencode](https://opencode.ai) | `AGENTS.md` | Reads it natively, in full |
| Other | `AGENTS.md` | Read natively by most AI coding tools |
| [Claude Code](https://claude.ai/code) | `CLAUDE.md` | First line `@AGENTS.md` imports the full manual; the rest of the file adds Claude-specific skill routing |

## Updating the operating manual

Edit **`AGENTS.md`** directly. `CLAUDE.md` imports it via `@AGENTS.md` — no sync needed, no
generation step.

For Claude-specific changes (skill routing, skills index): edit `CLAUDE.md` below the import line.

## Adding a new agent

Most agents read `AGENTS.md` natively — nothing to do.
