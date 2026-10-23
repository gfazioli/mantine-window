---
paths:
  - "package/src/**"
---

# Window internals

## Hooks (`package/src/hooks/`)

`Window` is built on the public headless hook, so the hook and the component cannot drift apart:
- `use-mantine-window`: the orchestrator; resolves responsive props, owns `use-window-state`, the `Window.Group` wiring and the single-window layouts; feeds `use-drag-resize` in controlled mode.
- `use-drag-resize` (**public** `useDragResize`): element ref, controlled/uncontrolled position and size in any unit, boundary tracking, drag, pointer and keyboard resize, the document listeners, prop getters.
- `use-window-drag`: mouse/touch drag, the interactive-target bail-out, the `axis` lock; measures the element once per gesture for the bounds.
- `use-window-resize`: pointer resize in all 8 directions. `use-window-state`: visibility, collapse, z-index, localStorage persistence. `use-window-dimensions`: viewport size and the offset parent's size (`0` until measured; jsdom never has an offset parent). `use-window-constraints`: position, size, min/max and drag bounds to px.
- `bringToFront` runs from `Window`'s `onDragStart` / `onResizeStart` wrappers, not inside the gesture hooks.

## Keyboard resizing

One handle per window is a focusable WAI-ARIA `separator` (`withKeyboardResize`, default on): the bottom-right corner, the right edge when collapsed or `resizable="horizontal"`, the bottom edge for `resizable="vertical"`. Arrows move the handle's edge by `resizeStep` (10), Shift by `resizeShiftStep` (50), Home/End to min/max; the boundary is the hard limit. Each key press fires `onResizeStart` → `onSizeChange` → `onResizeEnd`. The focus mark is drawn inside the window (the root clips with `overflow: hidden`) plus a `:has()` outline on the root.

## Touch screens and small boundaries (issue #61)

- **One finger per gesture**: a touch gesture records `changedTouches[0].identifier` at its start and follows only that finger (`touchmove` / `touchend` look it up in `changedTouches`); never `touches[0]`, which made a window follow another window's finger. A `touchstart` (document, capture) ends a touch gesture whose finger is gone.
- **One touch gesture at a time**: a second finger on the same element while the first drags or resizes it is ignored. `guardPress` in the prop getters applies this and the emulated-mouse check to every drag and resize handle; `activeTouchId()` reads the gesture hooks' `touchId`, cleared when their gesture ends.
- **Mouse events emulated after a tap** never start a gesture: Chromium's `sourceCapabilities.firesTouchEvents` decides when present, elsewhere a press within 800 ms and 16px of where a touch ended. Mouse events never move a touch gesture.
- **A swipe on overflowing content scrolls it** (touch only): `isInScrollableContent` walks from the target to the drag handle looking for an element with `overflow` auto / scroll / overlay that actually overflows. The mouse still drags from anywhere.
- **No `preventDefault()` on `touchstart`**: React registers it as passive (ignored, logs an error). The header's `touch-action: none` and the document's non-passive `touchmove` listener stop the page scrolling.
- **One drag handler per press**: with `draggable="both"` only the root has the handlers; a header handler too started every gesture twice. The header has no `onClick` either.
- **`keepInBounds`** (default `true`, in `useDragResize`; `false` = the 3.3 behaviour): when the boundary is measured or resized, and when the element itself resizes (a `ResizeObserver`: a collapsed window reopening), the element moves back inside the boundary (`clampToArea` on the rendered box) and shrinks to fit. Not into `dragBounds`: the fit also runs after programmatic resizes (snap / tile layouts), and dragBounds would pull a snapped window off its layout. Only what overflows as rendered shrinks: a collapsed window keeps its expanded height. During a drag, `dragBounds` can only narrow the boundary (`keepInBounds` in `applyDragBounds`). Pointer resizing stops at the viewport too (`containerMaxWidth` is the viewport in portal mode; `0` = unmeasured = no limit). Programmatic moves are applied as given until the next size change of the boundary or the element.
- **Coarse pointers** (CSS): bigger handle hit areas (inward), 20px title-bar buttons, glyphs visible under `(hover: none)`.
- To check on a real engine: puppeteer-core's `KnownDevices['iPhone 13']` with `page.touchscreen` (multi-touch through the returned `TouchHandle`) reproduces all of the above.

## Tests

Component tests use `@testing-library/react` with the custom `renderWithMantine` helper. Mantine `Menu` (Popover/floating-ui) does not work in jsdom: menu interactions are checked visually with `yarn dev`.
