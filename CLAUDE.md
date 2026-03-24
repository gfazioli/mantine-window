# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`@gfazioli/mantine-window` — a Mantine extension component that renders draggable, resizable floating windows with persistent state, customizable boundaries, collapsible content, and flexible control over position, size, and interaction modes. Targets Mantine 8.x and React 19.

## Commands

| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package via Rollup → `package/dist/` |
| `yarn dev` | Start docs dev server on port 9281 |
| `yarn test` | Full suite: syncpack → prettier → typecheck → lint → jest |
| `yarn jest` | Run only Jest tests |
| `yarn jest --testPathPattern=Window.test` | Run a single test file |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn docs:build` | Build Next.js docs site (runs docgen first) |
| `yarn docs:deploy` | Build docs + deploy to GitHub Pages |
| `yarn eslint` | Run ESLint |
| `yarn stylelint` | Run Stylelint on CSS |
| `yarn prettier:check` | Check formatting |
| `yarn prettier:write` | Fix formatting |
| `yarn clean && yarn build` | Clean rebuild |
| `yarn release:patch` | Bump patch version + deploy docs |
| `diny yolo` | AI-assisted auto-commit (stages, generates message, commits) |

## Architecture

This repo uses **yarn workspaces** with two workspaces: `package/` (the npm package) and `docs/` (Next.js documentation site).

### Package Source (`package/src/`)

Single component architecture — one main `Window` component:

- **`Window.tsx`** — Main component using Mantine's `factory()` pattern with `useProps`, `useStyles`, `createVarsResolver`. Exports `Window` plus all types (`WindowProps`, `WindowFactory`, `WindowStylesNames`, etc.).
- **`Window.module.css`** — CSS Modules with hashed selectors (via `hash-css-selector` in Rollup).
- **`index.ts`** — Public API barrel file. All public types and the component are re-exported here.

### Hooks (`package/src/hooks/`)

The window logic is split across composable hooks:

| Hook | Responsibility |
|------|---------------|
| `use-mantine-window` | Orchestrator hook — composes all other hooks, returns the unified API used by `Window.tsx` |
| `use-window-drag` | Mouse/touch drag handling |
| `use-window-resize` | Resize handle interaction for all 8 directions |
| `use-window-state` | Visibility, collapse state, localStorage persistence |
| `use-window-dimensions` | Position and size state management |
| `use-window-constraints` | Min/max width/height enforcement |

### Utility Library (`package/src/lib/`)

- **`convert-to-pixels.ts`** — Converts viewport units (`vw`, `vh`), percentages (`%`), and raw numbers to pixel values. Critical for SSR hydration safety (returns defaults during SSR, converts after mount).
- **`window-constraints.ts`** — Constraint resolution logic (clamp values within min/max bounds).

Both have dedicated `.test.ts` files.

### Docs (`docs/`)

Next.js 15 site with interactive demos in `docs/demos/`. Each demo is a `Window.demo.*.tsx` file. Pages live in `docs/pages/`. Shared shell/footer components come from the `mantine-base-component` template.

### Build Pipeline

Rollup bundles `package/src/index.ts` → dual ESM (`.mjs`) + CJS (`.cjs`) output with source maps. CSS Modules are extracted to `dist/styles.css`. Non-index chunks get a `'use client'` banner. Type declarations are generated separately via `scripts/generate-dts`.

## Testing

- **Jest** with `jsdom` environment and `esbuild-jest` transform
- CSS imports are mocked via `identity-obj-proxy`
- Component tests use `@mantine-tests/core` render helper
- Test files: `package/src/Window.test.tsx`, `package/src/lib/*.test.ts`

## Key Patterns

- The component uses Mantine's **Styles API** (`getStyles`, `classNames`, `styles`, `unstyled`, `vars`, `varsResolver`) — follow this pattern for any style-related changes.
- Position/size values support **multiple unit types**: pixels (number), viewport units (`vw`/`vh`), and percentages (`%`). All conversions go through `convert-to-pixels.ts`.
- SSR hydration safety: viewport/percentage values are resolved to default pixel values during SSR and converted client-side after mount.
- `withinPortal` controls positioning context: `fixed` (viewport) vs `absolute` (parent container).
- z-index management via `bringToFront` enables multiple overlapping windows.
