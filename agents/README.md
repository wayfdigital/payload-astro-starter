# Multi-agent setup

## Source of truth

**`agents/source.md`** — the single source of truth. Contains the build pipeline, always-ask
checklist, monorepo structure, project map, and hard rules. Edit here when the project structure
or procedures change. All agent config files point to it.

## Agent config files

| Agent | Config file | What it contains |
|---|---|---|
| [Claude Code](https://claude.ai/code) | `CLAUDE.md` | Claude-specific: skill routing, hooks framing, skills index + reference to `agents/source.md` |
| [Cursor](https://cursor.sh) | `AGENTS.md` + `.cursor/rules/*.mdc` | Thin routing + reference to `agents/source.md`; MDC rules load skill files on demand |
| [OpenAI Codex CLI](https://github.com/openai/codex) | `AGENTS.md` | Thin routing + reference to `agents/source.md` |
| [opencode](https://opencode.ai) | `AGENTS.md` | Thin routing + reference to `agents/source.md` |
| Other | `AGENTS.md` | Read natively by most AI coding tools |

## Updating the operating manual

Edit **`agents/source.md`** only. `AGENTS.md` and `CLAUDE.md` reference it — no sync needed.

For Claude-specific changes (skill routing, skills index): edit `CLAUDE.md` directly.

## Adding a new agent

Most agents read `AGENTS.md` natively — nothing to do. If yours needs a dedicated file, point it
to `agents/source.md` for the operating manual content.
