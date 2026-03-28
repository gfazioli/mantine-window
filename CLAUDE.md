# CLAUDE.md

## Project
`@gfazioli/mantine-window` — a Mantine extension that renders draggable, resizable floating windows with persistent state, customizable boundaries, collapsible content, z-index management, and flexible control over position, size, and interaction modes. Includes a `WindowGroup` compound component for managing multiple windows with shared layouts.

## Commands
| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package via Rollup |
| `yarn dev` | Start the Next.js docs dev server (port 9281) |
| `yarn test` | Full test suite (syncpack + prettier + typecheck + lint + jest) |
| `yarn jest` | Run only Jest unit tests |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn docs:build` | Build the Next.js docs site for production |
| `yarn docs:deploy` | Build and deploy docs to GitHub Pages |
| `yarn lint` | Run ESLint |
| `yarn prettier:write` | Format all files with Prettier |
| `yarn storybook` | Start Storybook dev server |
| `yarn clean` | Remove build artifacts |
| `yarn release:patch` | Bump patch version and deploy docs |
| `diny yolo` | AI-assisted commit (stage all, generate message, commit + push) |

> **Important**: After changing the public API (props, types, exports), always run `yarn clean && yarn build` before `yarn test`, because `yarn docgen` needs the fresh build output.

## Architecture

### Workspace Layout
Yarn workspaces monorepo with two workspaces: `package/` (npm package) and `docs/` (Next.js 15 documentation site).

### Package Source (`package/src/`)

```
package/src/
├── Window.tsx                  # Main component (Mantine factory pattern)
├── Window.module.css           # CSS Modules (hashed via hash-css-selector)
├── WindowGroup.tsx             # Compound component for managing multiple windows
├── WindowGroup.context.ts      # Context for WindowGroup (WindowLayout type)
├── LayoutIcons.tsx             # Layout icons used by WindowGroup
├── index.ts                    # Public API barrel file
├── Window.test.tsx             # Component tests
├── Window.story.tsx            # Storybook stories
├── hooks/
│   ├── use-mantine-window.ts       # Orchestrator — composes all hooks into unified API
│   ├── use-window-drag.ts          # Mouse/touch drag handling
│   ├── use-window-resize.ts        # Resize handle interaction (all 8 directions)
│   ├── use-window-state.ts         # Visibility, collapse, localStorage persistence
│   ├── use-window-dimensions.ts    # Position and size state management
│   ├── use-window-constraints.ts   # Min/max width/height enforcement
│   └── use-responsive-value.ts     # Responsive value utility (exported publicly)
└── lib/
    ├── convert-to-pixels.ts        # Converts vw/vh/% to px (SSR-safe)
    ├── convert-to-pixels.test.ts
    ├── window-constraints.ts       # Constraint resolution (clamp within bounds)
    └── window-constraints.test.ts
```

Public exports: `Window`, `WindowGroup`, `useResponsiveValue`, plus all associated types (`WindowProps`, `WindowFactory`, `WindowStylesNames`, `WindowGroupProps`, `WindowGroupFactory`, `WindowGroupContextValue`, `WindowLayout`, `ResponsiveValue`, etc.).

### Build Pipeline
Rollup bundles to dual ESM (`dist/esm/`) and CJS (`dist/cjs/`) with `'use client'` banner. CSS modules are hashed with `hash-css-selector` (prefix `me`). TypeScript declarations via `rollup-plugin-dts`. CSS is split into `styles.css` and `styles.layer.css` (layered version).

### Docs (`docs/`)
Next.js 15 site with interactive demos in `docs/demos/`. Each demo is a `Window.demo.*.tsx` file. Pages live in `docs/pages/`. Shared shell/footer components come from the `mantine-base-component` template.

## Component Details

### 6-Hook Architecture
The window logic is split into composable hooks, all orchestrated by `use-mantine-window`:

| Hook | Responsibility |
|------|---------------|
| `use-mantine-window` | Orchestrator — composes all other hooks, returns the unified API used by `Window.tsx` |
| `use-window-drag` | Mouse/touch drag handling |
| `use-window-resize` | Resize handle interaction for all 8 directions |
| `use-window-state` | Visibility, collapse state, localStorage persistence |
| `use-window-dimensions` | Position and size state management |
| `use-window-constraints` | Min/max width/height enforcement |

### Utility Library (`package/src/lib/`)
- **`convert-to-pixels.ts`** — Converts viewport units (`vw`, `vh`), percentages (`%`), and raw numbers to pixel values. Critical for SSR hydration safety: returns defaults during SSR and converts client-side after mount.
- **`window-constraints.ts`** — Constraint resolution logic (clamp values within min/max bounds).

### Flat Position/Size API (v2)
Position and size use flat props instead of objects:
- **Uncontrolled**: `defaultX`, `defaultY`, `defaultWidth`, `defaultHeight`
- **Controlled**: `x`, `y`, `width`, `height` (component does not manage that value internally)
- All accept `ResponsiveValue<number | string>` — Mantine breakpoint objects or scalar values
- `radius` and `shadow` also accept responsive values

### Multi-Unit Support
Position/size values support multiple unit types: pixels (number), viewport units (`vw`/`vh`), and percentages (`%`). All conversions go through `convert-to-pixels.ts`.

### SSR Hydration Safety
Viewport and percentage values are resolved to default pixel values during SSR and converted client-side after mount, preventing hydration mismatches.

### Positioning Context
`withinPortal` controls positioning context: `fixed` (viewport) vs `absolute` (parent container).

### Z-Index Management
`bringToFront` enables multiple overlapping windows to dynamically reorder their stacking context on interaction.

### Mantine Styles API
The component uses Mantine's full Styles API (`getStyles`, `classNames`, `styles`, `unstyled`, `vars`, `varsResolver`) via `factory()` pattern with `useProps`, `useStyles`, and `createVarsResolver`.

### WindowGroup Compound Component
`WindowGroup` provides shared context (`WindowGroupContextValue`) for managing multiple `Window` instances with predefined layouts (`WindowLayout`). Uses React context via `WindowGroup.context.ts`.

## Testing
Jest with `jsdom` environment, `esbuild-jest` transform, CSS mocked via `identity-obj-proxy`. Component tests use `@testing-library/react` with a custom `renderWithMantine` helper that wraps components in `MantineProvider`.

Test files:
- `package/src/Window.test.tsx` — Component tests (75 tests: rendering, controlled/uncontrolled, collapse, drag/resize callbacks, accessibility, persistence, Window.Group with groupRef API)
- `package/src/lib/convert-to-pixels.test.ts` — Unit conversion tests
- `package/src/lib/window-constraints.test.ts` — Constraint logic tests

Run a single test file: `yarn jest --testPathPattern=Window.test`

**Note:** Mantine `Menu` (Popover/floating-ui) does not work in jsdom — menu interaction tests are covered visually via `yarn dev`.

## Ecosystem
This repo is part of the Mantine Extensions ecosystem, derived from the `mantine-base-component` template. See the workspace `CLAUDE.md` (in the parent directory) for:
- Development checklist (code -> test -> build -> docs -> release)
- Cross-cutting patterns (compound components, responsive CSS, GitHub sync)
- Update packages workflow
- Release process
