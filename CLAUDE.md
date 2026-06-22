# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Documentation site for **Comprobot** — an open-source, customizable Discord bot built with Python. The site is built with **Quartz 4.4.0** (a static site generator) and deployed to GitHub Pages.

## Commands

All commands run from the `source/` directory:

```bash
cd source

# Install dependencies
npm install

# Build the site (output → source/public/)
npx quartz build

# Build and serve locally with hot reload
npx quartz build --serve

# Type check + prettier check
npm run check

# Format all files
npm run format

# Run tests (path utils + dependency graph)
npm test
```

## Architecture

```
source/
  content/          # Obsidian vault — all docs as Markdown
  quartz.config.ts  # Quartz config: theme, plugins, baseUrl
  quartz.layout.ts  # Page layout: which components go where
  quartz/           # Quartz framework internals (don't touch)
  public/           # Build output (gitignored in normal Quartz, but present here)
  raw_html/         # HTML files copied into public/ at deploy time (CI only)
```

**Content** lives entirely in `source/content/` as Obsidian-flavored Markdown. Pages use `[[WikiLinks]]` for internal links. Frontmatter supports `title` and `position` (controls sidebar nav order).

**Build pipeline**: `quartz.config.ts` defines transformers (remark/rehype plugins), filters, and emitters. `quartz.layout.ts` defines the left/right sidebar and body components per page type (content page vs. list/folder page).

**Deploy**: CI runs `npx quartz build` from `source/`, then copies `source/raw_html/*` into `source/public/`, and deploys to GitHub Pages. `baseUrl` in `quartz.config.ts` must match the deployment URL.

## Content conventions

- Content sections map to top-level folders: `Commands/`, `Customization/`, `CLI/`
- Each folder has an `index.md` with `position` frontmatter for nav ordering
- `ignorePatterns` in `quartz.config.ts` excludes `private`, `templates`, `.obsidian`
- The `source/content/.obsidian/` directory holds Obsidian vault settings — don't edit manually
