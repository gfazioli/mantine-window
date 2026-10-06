# CLAUDE.md

## Project
`@gfazioli/mantine-window` — a Mantine extension that renders draggable, resizable floating windows with persistent state, customizable boundaries, collapsible content, z-index management, and flexible control over position, size, and interaction modes. Includes a `WindowGroup` compound component for managing multiple windows with shared layouts.

## Commands
| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package via Rollup |
| `yarn dev` | Start the Next.js docs dev server (port 9281) |
| `yarn test` | Full test suite (syncpack + oxfmt + typecheck + lint + jest) |
| `yarn jest` | Run only Jest unit tests |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn docs:build` | Build the Next.js docs site for production |
| `yarn docs:deploy` | Build and deploy docs to GitHub Pages |
| `yarn lint` | Run oxlint + Stylelint |
| `yarn format:write` | Format all files with oxfmt |
| `yarn storybook` | Start Storybook dev server |
| `yarn clean` | Remove build artifacts |
| `yarn release:patch` | Bump patch version and deploy docs |
| `diny yolo` | AI-assisted commit (stage all, generate message, commit + push); it needs a TTY, so from Claude Code commit with `git commit` + `git push` |

> **Important**: After changing the public API (props, types, exports), always run `yarn clean && yarn build` before `yarn test`, because `yarn docgen` needs the fresh build output.

## Architecture

### Workspace Layout
Yarn workspaces monorepo with two workspaces: `package/` (npm package) and `docs/` (Next.js 16 documentation site).

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
│   ├── use-mantine-window.ts       # Window orchestrator: responsive values, state, group, on top of use-drag-resize
│   ├── use-drag-resize.ts          # PUBLIC headless hook: units, boundary, drag, resize, keyboard (exported)
│   ├── use-drag-resize.test.tsx
│   ├── use-window-drag.ts          # Mouse/touch drag handling, axis lock
│   ├── use-window-resize.ts        # Pointer resize for all 8 directions
│   ├── use-window-state.ts         # Visibility, collapse, z-index, localStorage persistence
│   ├── use-window-dimensions.ts    # Viewport size + offset-parent ResizeObserver
│   ├── use-window-constraints.ts   # Unit conversion of position, size, min/max, drag bounds
│   └── use-responsive-value.ts     # Responsive value utility (exported publicly)
└── lib/
    ├── convert-to-pixels.ts        # Converts vw/vh/% to px (SSR-safe)
    ├── convert-to-pixels.test.ts
    ├── keyboard-resize.ts          # Pure keyboard-resize math: key map, ranges, clamps
    ├── keyboard-resize.test.ts
    ├── window-constraints.ts       # Constraint resolution (clamp within bounds)
    └── window-constraints.test.ts
```

Public exports: `Window`, `WindowGroup`, `useResponsiveValue`, `useDragResize`, plus all associated types (`WindowProps`, `WindowFactory`, `WindowStylesNames`, `WindowGroupProps`, `WindowGroupFactory`, `WindowGroupContextValue`, `WindowLayout`, `ResponsiveValue`, `UseDragResizeOptions`, `UseDragResizeReturnValue`, `ResizeDirection`, etc.).

### Build Pipeline
Rollup bundles to dual ESM (`dist/esm/`) and CJS (`dist/cjs/`) with `'use client'` banner. CSS modules are hashed with `hash-css-selector` (prefix `me`). TypeScript declarations via `rollup-plugin-dts`. CSS is split into `styles.css` and `styles.layer.css` (layered version).

### Docs (`docs/`)
Next.js 16 site with interactive demos in `docs/demos/`. Each demo is a `Window.demo.*.tsx` file. Pages live in `docs/pages/`. Shared shell/footer components come from the `mantine-base-component` template.

## Component Details

### Hook Architecture
`Window` is built on the public headless hook, so the hook and the component cannot drift apart:

| Hook | Responsibility |
|------|---------------|
| `use-mantine-window` | Window orchestrator: resolves responsive props, owns `use-window-state`, the `Window.Group` wiring and the single-window layouts; feeds `use-drag-resize` in controlled mode |
| `use-drag-resize` | **Public** (`useDragResize`): element ref, controlled/uncontrolled position and size in any unit, boundary tracking, drag, pointer and keyboard resize, the document listeners, prop getters |
| `use-window-drag` | Mouse/touch drag, the interactive-target bail-out, the `axis` lock; measures the element once per gesture for the bounds |
| `use-window-resize` | Pointer resize for all 8 directions |
| `use-window-state` | Visibility, collapse, z-index, localStorage persistence |
| `use-window-dimensions` | Viewport size and the offset parent's size (`0` until measured; jsdom never has an offset parent) |
| `use-window-constraints` | Converts position, size, min/max and drag bounds to px |

`bringToFront` runs from `Window`'s `onDragStart` / `onResizeStart` wrappers, not inside the gesture hooks.

### Keyboard Resizing
One handle per window is a focusable WAI-ARIA `separator` (`withKeyboardResize`, default on): bottom-right corner, the right edge when collapsed or `resizable="horizontal"`, the bottom edge for `resizable="vertical"`. Arrows move the handle's edge in the arrow's direction by `resizeStep` (10), Shift by `resizeShiftStep` (50), Home/End to min/max; the boundary (viewport or parent) is the hard limit. Each key press fires `onResizeStart` → `onSizeChange` → `onResizeEnd`. The focus mark is drawn inside the window (the root clips with `overflow: hidden`) plus a `:has()` outline on the root.

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

### ScrollArea Control
`withScrollArea` (default: `true`) — when `false`, the internal `ScrollArea` is replaced with a plain `Box` with `overflow: hidden`. Content that overflows is clipped. Useful when the consumer provides their own scrolling mechanism.

### Controls Position & Order
- `controlsPosition` (`'left'` | `'right'`, default: `'left'`) — macOS-style (left) or Windows-style (right) button placement
- `controlsOrder` (`('close' | 'collapse' | 'tools')[]`) — custom button ordering. When not set, defaults to `['close', 'collapse', 'tools']` for left and `['tools', 'collapse', 'close']` for right (automatically reversed).

### WindowGroup Compound Component
`WindowGroup` provides shared context (`WindowGroupContextValue`) for managing multiple `Window` instances with predefined layouts (`WindowLayout`). Uses standard React `createContext`/`useContext` (replaced `createOptionalContext` which was removed in Mantine 9).

## Testing
Jest with `jsdom` environment, `esbuild-jest` transform, CSS mocked via `identity-obj-proxy`. Component tests use `@testing-library/react` with a custom `renderWithMantine` helper that wraps components in `MantineProvider`.

Test files:
- `package/src/Window.test.tsx` — Component tests (rendering, controlled/uncontrolled, collapse, drag/resize callbacks, axis lock, keyboard resizing, accessibility, persistence, Window.Group with groupRef API)
- `package/src/hooks/use-drag-resize.test.tsx` — The headless hook on a plain element
- `package/src/lib/keyboard-resize.test.ts` — Keyboard-resize math
- `package/src/lib/convert-to-pixels.test.ts` — Unit conversion tests
- `package/src/lib/window-constraints.test.ts` — Constraint logic tests

Run a single test file: `yarn jest --testPathPattern=Window.test`

**Note:** Mantine `Menu` (Popover/floating-ui) does not work in jsdom — menu interaction tests are covered visually via `yarn dev`.

## Ecosystem
This repo is part of the Mantine Extensions ecosystem, derived from the `mantine-base-component` template. See the workspace (the parent directory) for:
- Development checklist and cross-cutting patterns (compound components, responsive CSS, GitHub sync): the workspace's `.claude/rules/component-development.md`, which loads with this repo's files
- Update packages workflow: the workspace's `fleet-maintenance` skill
- Release process: the workspace's `/release` command
