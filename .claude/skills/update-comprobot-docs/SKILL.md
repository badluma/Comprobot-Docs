---
name: update-comprobot-docs
description: Update the Comprobot documentation site (this repo) to match a release of the Comprobot bot source. Use when asked to "update the docs to the current version", "sync docs with the bot", "document a new command", refresh the version history/changelog, or reconcile the docs with the Comprobot Python source. Knows where the bot's source of truth lives, the doc conventions, and the common drift patterns.
---

# Update Comprobot docs to a release

This repo is the **Quartz documentation site** for Comprobot. Its job is to mirror the
behavior of the Comprobot bot (a Python Discord bot in a separate repo). When the bot
releases a new version, the docs drift. This skill makes reconciling them fast and accurate.

## Repos

- **Docs (this repo):** content lives in `source/content/` as Obsidian-flavored Markdown.
- **Bot source:** the Python package, typically at `/Users/badluma/Documents/Development/Python/Comprobot`
  (confirm with the user if it's not there). Repo: `github.com/badluma/comprobot`.

Always read the bot source fresh — never trust the docs as the source of truth, they are the thing being corrected.

## Source-of-truth map (bot repo → what it tells you)

| Bot file | Authoritative for |
| --- | --- |
| `src/templates.py` | **Default contents of every config file**: `ai`, `config`, `error_messages`, `keywords`, `moderation`, `active`, `descriptions`, `output`, `env`. This is the single most important file — the Customization docs are a prose rendering of it. |
| `src/data.py` | Real on-disk filenames (note hidden files like `.money.toml`), the data-dir location, and `ORDER` of category sections. |
| `src/commands.py`, `src/api.py`, `src/money_system.py`, `src/functions.py` | The functions shown in each command doc's `## Source code` block. |
| `src/process.py` | The Discord command wiring: command names, aliases (from `keywords`), which `active[...]` key gates each one, admin checks, and the AI-on-mention behavior. |
| `src/__main__.py` | The CLI: subcommands, flags, and top-level options (`-v`, etc.). |
| `src/dashboard.py`, `src/start.py`, `src/onboarding.py`, `src/testing.py` | Behavior of the `dashboard`, `start`, `onboard`, and `test` CLI commands. |
| `pyproject.toml` | Current version number and dependencies. |
| `README.md` | Supported package managers / install commands. |

## Process

1. **Get the version.** `pyproject.toml` `version`. Confirm the bot repo path with the user if unsure.
2. **Inventory the bot.** Read `templates.py` end to end, then `process.py` and `__main__.py`.
   Build the real command list (name + aliases + gating `active` key) and the real CLI surface.
3. **Diff against the docs.** Compare to `source/content/`. Look specifically for the drift
   patterns below — they recur every release.
4. **Edit in place, preserving style.** Match the existing writing voice, formatting, and length
   of each doc exactly (see Conventions). Add docs for new commands/CLI subcommands; delete docs
   for removed ones; fix renamed keys/files/categories.
5. **Update the version history** from git + GitHub releases (see that section).
6. **Verify.** From `source/`: `npm run check` (typecheck + prettier) and `npx quartz build`.
   Grep for leftover stale strings (see Verify).

## Doc conventions (match these exactly)

- **Per-command doc** (`Commands/<Category>/<Name>.md`, no frontmatter): opens with one sentence
  `The \`<keyword>\` command …` linking the upstream API; then `## Usage` (fenced `!command <args>`);
  an `Aliases: \`!x\`, \`!y\`` line **only if** the command has aliases; `## Example response`
  (often `User:`/`Bot:` fenced blocks); and `## Source code` with the relevant Python function
  copied from the bot, lightly trimmed. Keep the source block faithful to current code.
- **Customization doc** (`Customization/*.md`, frontmatter `title` + `position`): one-line intro
  naming the `.toml` file, `## Template` (the exact TOML from `templates.py`), `## Values` tables
  (Value | Type/Default | Description), and `## Examples`. The TOML must match `templates.py`
  key-for-key and section-for-section.
- **CLI doc** (`CLI/*.md`, no frontmatter): one-line intro, `## Usage`, an `## Options` table if it
  takes flags, and `## Notes`. Short.
- **Index pages** (`index.md`, frontmatter): keep command lists alphabetical; root `index.md` uses
  `[[WikiLinks]]` with tab-indented bullets; `Commands/index.md` has a category→commands table.
- **Version History** (`Version History.md`): newest first; top-level `- X.Y.Z` with tab-indented
  `- change` sub-bullets in past tense; group runs of patch releases as `- 2.3.1 – 2.3.4`.

## Common drift patterns (check every release)

- **Category rename:** command config sections are nested under `general` / `settings` / `money`
  (not a flat list, and not the old name `commands`). Output/keyword/active TOML use `[general]`,
  and source snippets use `output["general"][...]`. Historically these were `[commands]` /
  `output["commands"]` — fix any survivors.
- **Command set changes:** commands get added, removed, or restructured (e.g. the old `!image`
  group was split into standalone `!cat`/`!dog`/`!duck`). Cross-check the doc set against
  `keywords`/`active` in `templates.py`. Add/remove whole doc files and update both index pages.
- **File naming:** real files include hidden ones (`.money.toml`) and use underscores
  (`error_messages.toml`, not `error-messages.toml`). Source snippets call
  `get_data_path("<exact name>")`.
- **Renamed keys:** e.g. the AI system prompt key is `system_prompt_text`, not `system_prompt`.
  Verify every key in the Customization tables exists in `templates.py`.
- **New config keys:** new `config`/`ai` options appear (e.g. `whitelist`, `whitelist_mode`).
  Add them to the Template, Values table, and an Example.
- **Source-snippet rot:** `bot.user` → `client.user`, added `None` guards, changed save paths.
  Re-copy the function from the bot rather than patching the old snippet line by line.
- **New CLI surface:** new subcommands (e.g. `dashboard`, `reset`) and flags (`-d/--daemon`,
  `-p/--path`, `-v/--version`). Add CLI docs and update `CLI/index.md` + the root `index.md` CLI line.

## Version history from git + GitHub releases

The auto-generated GitHub release bodies are usually just "Full Changelog" links, so derive real
entries from commits between tags:

```sh
cd <bot repo>
git tag --sort=-creatordate                      # list released versions
git log --no-merges --pretty='%s' vA..vB          # commit subjects in a range
```

List releases via the GitHub MCP (`list_releases` for `badluma/comprobot`) to get tags + dates.
Translate notable commits into user-facing past-tense bullets; drop pure-CI/chore noise
(`chore: sync deps`, workflow fixes) unless it's the only change in a release. Place structural
changes (renames, command restructures) in the version where the commit landed.

## Verify

```sh
cd source
npm run check
npx quartz build
```

Then grep `source/content` for stale strings that shouldn't survive a sync:
`output["commands"]`, `!image` / `!picture`, `error-messages.toml`, `money.toml` (without the dot),
`system_prompt ` (the renamed key), and any command file that no longer exists in `keywords`.
