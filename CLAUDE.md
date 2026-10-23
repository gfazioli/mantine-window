# CLAUDE.md

`@gfazioli/mantine-window` — a Mantine extension that renders draggable, resizable floating windows with persistent state, customizable boundaries, collapsible content, z-index management, and flexible control over position, size and interaction modes. `WindowGroup` manages multiple windows with shared layouts. Public exports: `Window`, `WindowGroup`, `useResponsiveValue`, `useDragResize` (the headless hook `Window` is built on) and their types. Hooks, touch handling and test traps: `.claude/rules/internals.md` (loads with `package/src`).

After changing the public API (props, types, exports), always run `yarn clean && yarn build` before `yarn test`, because `yarn docgen` needs the fresh build output.

Touch invariants: a gesture follows only the finger that started it (`changedTouches` identifier, never `touches[0]`); one touch gesture at a time; never `preventDefault()` on `touchstart` (React registers it passive); with `draggable="both"` only the root has drag handlers.

## API facts

- **Flat position/size (v2)**: uncontrolled `defaultX`, `defaultY`, `defaultWidth`, `defaultHeight`; controlled `x`, `y`, `width`, `height` (the component does not manage that value). All accept `ResponsiveValue<number | string>` (breakpoint objects or scalars), as do `radius` and `shadow`.
- **Units**: pixels (number), `vw`/`vh` and `%`, all converted by `lib/convert-to-pixels.ts`. SSR-safe: viewport and percentage values resolve to default pixels during SSR and convert client-side after mount, preventing hydration mismatches.
- `withinPortal`: `fixed` (viewport) vs `absolute` (parent container) positioning. `bringToFront` reorders overlapping windows on interaction.
- `withScrollArea` (default `true`): `false` replaces the internal `ScrollArea` with a plain `Box` with `overflow: hidden` (overflow is clipped).
- `controlsPosition` (`'left'` macOS-style, default | `'right'` Windows-style); `controlsOrder` defaults to `['close', 'collapse', 'tools']` on the left and the reverse on the right.
- `WindowGroup` uses React `createContext`/`useContext`: `createOptionalContext` was removed in Mantine 9.
