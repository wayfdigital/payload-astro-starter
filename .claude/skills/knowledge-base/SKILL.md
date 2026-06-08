---
name: knowledge-base
description: >-
  Company knowledge base over MCP. Use whenever you are about to implement a
  feature, fix a bug, or make a technical decision in this repo: call get_context
  FIRST to pull relevant coding patterns, tool skills, and project memories, then
  record durable learnings with create_memory afterwards. Also documents how to
  connect this repo to the hosted knowledge-base server.
---

# Knowledge base

This repo can talk to the **knowledge-base** MCP server, backed by a shared company
database. It stores three kinds of entries:

- **Patterns** — project-agnostic coding conventions (data fetching, error handling,
  testing, …). Owner-curated, global.
- **Skills** — how to use a specific tool/library. `shared` skills are global
  (owner-curated); `project` skills are scoped to THIS repo's project.
- **Memories** — decisions, gotchas, and facts specific to THIS repo's project.

Retrieval is semantic (embeddings + optional reranking), so paraphrasing works — you
don't need to match exact wording.

**Language — English only:** ALWAYS write titles and content in **English**, no matter
the conversation language. Queries can be in any language, but everything stored must
be English.

---

## 1. Setup (one-time per machine / repo)

The knowledge-base **server is already hosted and running** — you do NOT start or
manage it (no Docker, no database, no API to boot). You only connect to it.

### Prerequisites
- **`http://localhost:3131`** — the hosted API URL (e.g. `https://kb.wayf.dev`). Ask the
  owner if you don't have it. This becomes `KB_API_URL`.
- **`KB_TOKEN`** — a token for that server (see below).
- **Local MCP runtime** — the `wayf-mcp` repo checked out locally with `npm install`
  run once. Claude Code launches it to compute embeddings/reranking on YOUR machine
  and call the hosted API; only this small piece runs locally. Path = `/Users/kacperzawojski/code/wayf-mcp`.
  Node 22.

### Get a token
An **owner** issues you a token from the hosted Admin UI (`http://localhost:3131` → Admin →
token panel); it's shown once. Keep it in your shell / secret manager — never commit it.

### Pick this repo's project
Each repo maps to a knowledge-base **project** (by slug). Ask the owner which slug to
use (or to have one created) and set it as `KB_PROJECT`. `demo` works for trying things.

### Wire up `.mcp.json` in THIS repo
Create `.mcp.json` at the repo root:
```json
{
  "mcpServers": {
    "knowledge-base": {
      "command": "/Users/kacperzawojski/code/wayf-mcp/node_modules/.bin/tsx",
      "args": ["/Users/kacperzawojski/code/wayf-mcp/local-mcp/src/server.ts"],
      "env": {
        "KB_API_URL": "http://localhost:3131",
        "KB_PROJECT": "payload-starter",
        "KB_TOKEN": "${KB_TOKEN}"
      }
    }
  }
}
```
- `command` points at `tsx` directly (`/Users/kacperzawojski/code/wayf-mcp/node_modules/.bin/tsx`) rather
  than `npx tsx`, because `npx` won't reliably resolve `tsx` from a repo that isn't
  `wayf-mcp`. `KB_TOKEN` can be hardcoded (then add `.mcp.json` to `.gitignore`) or use
  `${KB_TOKEN}` env expansion so the secret never lands in the repo.
- Optional env: `KB_RERANK=1` (better ranking via a local CPU cross-encoder, slower
  first call), `KB_TOP_N=5`, `KB_MODEL_CACHE=<abs path>` (shared model cache).

### Activate
Install this skill at `.claude/skills/knowledge-base/SKILL.md` (where you're reading
it) and **reload Claude Code**. Confirm with `/mcp` — you should see `knowledge-base`
with **13 tools**. First tool call downloads the embedding model (~0.5 GB) once.

---

## 2. Commands / tools

MCP tools (exposed to the agent):

| Tool | Purpose | Who |
| --- | --- | --- |
| `get_context(query)` | Pull patterns + skills + project memories for a task | anyone |
| `search_patterns(query)` | Search only patterns | anyone |
| `search_skills(query)` | Search only skills (shared + this project) | anyone |
| `search_memories(query)` | Search only this project's memories | anyone |
| `get_entry_files(kind, id)` | Read the files bundled in a skill/pattern/memory | anyone |
| `create_pattern(title, content, category)` | Add a global coding pattern | **owner only** |
| `create_skill(title, content, tool, scope)` | Add a single-doc skill; `scope` = `shared` or `project` | shared → **owner**, project → anyone |
| `create_skill_files(path, scope, …)` | Add a MULTI-FILE skill from a local skill dir (SKILL.md + reference files) | shared → **owner**, project → anyone |
| `create_memory(title, content)` | Save a memory for this project | anyone |
| `update_skill(id, …)` | Edit a **project** skill | anyone |
| `update_memory(id, …)` | Edit a memory | anyone |
| `delete_skill(id)` | Delete a **project** skill (+ its files) | anyone |
| `delete_memory(id)` | Delete a memory (+ its files) | anyone |

Patterns and **editing** shared skills happen in the Admin UI (no MCP edit tool for
globals). But **creating** skills — including multi-file ones via `create_skill_files`
(point it at a local skill directory) — works over MCP. `get_entry_files` reads a
skill's bundled files back.

The server (API, database, Admin UI) is hosted — you don't run it. To manage
patterns/skills/tokens/users through the web UI, open `http://localhost:3131` and sign in
(ask an owner for access).

---

## 3. How to work with it — every coding task

1. **Before implementing**, call `get_context` with a natural-language description of
   what you're about to build. Read the returned patterns, skills, and memories and
   follow them — they are the team's source of truth for how code is written here.
2. Need depth on one category? Use `search_patterns` / `search_skills` / `search_memories`.
3. **Implement**, respecting what the knowledge base told you.
4. **After implementing**, if you learned something durable about THIS project (a
   decision, a non-obvious gotcha, a config quirk), call `create_memory`. Keep the
   title short and the content specific and actionable.

### Adding skills to the knowledge base
Publish skills directly over MCP — no Admin UI, no scripts:
- **Single-doc skill**: `create_skill(title, content, tool, scope)`.
- **Multi-file skill** — a `SKILL.md` plus reference files/subfolders (like the skills
  in this repo's `.claude/skills/`): use **`create_skill_files(path, scope, tool?, title?)`**.
  Point `path` at the skill directory; it reads `SKILL.md` as the indexed/preview
  content and uploads every bundled text file. Example — publish a local skill as a
  global (shared) skill: `create_skill_files(path=".claude/skills/<name>", scope="shared")`
  (use `scope="project"` to scope it to this repo).
- Read a skill's files back with `get_entry_files(kind="skill", id)`.
- Don't cram multiple files into `create_skill` — it takes one string; use
  `create_skill_files` whenever a skill ships more than one file.

### Permissions
- **Global** items (patterns, `scope="shared"` skills) are **owner only** to create,
  can ONLY be edited in the Admin UI (no MCP edit tools), and **cannot be deleted** at all.
- **Project skills** (`scope="project"`) and **memories** can be created, updated, and
  **deleted** via MCP (`create_*`, `update_*`, `delete_skill`/`delete_memory`) or the
  Admin UI, by anyone.

### Tips
- Write all entries in **English**.
- Memories are project-scoped — make sure `KB_PROJECT` matches this repo.
- Prefer one focused memory per learning over a long catch-all note.
- To revise something you wrote earlier, use `update_skill` / `update_memory` (you'll
  find the `id` in `get_context` / `search_*` results) rather than creating a duplicate.

---

## 4. Troubleshooting

- **401** from a tool (`central-api 401`): `KB_TOKEN` is missing, wrong, or revoked.
- **403**: permission — a member attempted an owner-only action (pattern / shared skill).
- **`fetch failed` / connection refused**: can't reach the hosted server. Check
  `KB_API_URL` is `http://localhost:3131`, you're on the network/VPN, and the server is up
  (ask the owner). Quick test: `curl -s http://localhost:3131/health`.
- **Empty results**: the project has no entries yet, or `KB_PROJECT` points at the
  wrong slug. Seed some patterns/skills, or check the slug.
- **Tools missing in `/mcp`**: reload Claude Code; verify `.mcp.json` path to
  `local-mcp/src/server.ts` is absolute and correct.
