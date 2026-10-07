import { useCallback, useRef } from 'react';
import { applyDragBounds, type DragConstraints } from '../lib/window-constraints';

/**
 * Selector matching interactive / focusable elements that must keep their native
 * pointer behavior (focus, text selection, value editing). When a drag starts on
 * one of these, the window must NOT initiate a drag nor call `preventDefault()` —
 * otherwise the browser never moves focus to the element (e.g. the search input of
 * a `searchable` Select rendered inside the window). Consumers can also opt a custom
 * region out of dragging with `data-no-window-drag`.
 */
const INTERACTIVE_TARGET_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  'label',
  // Any editable variant ("" / "true" / "plaintext-only" / bare attribute), but not "false".
  '[contenteditable]:not([contenteditable="false"])',
  'audio[controls]',
  'video[controls]',
  // ARIA interactive roles (e.g. combobox/menu options rendered inside the window
  // when their dropdown uses withinPortal={false}).
  '[role="option"]',
  '[role="menuitem"]',
  '[role="listbox"]',
  '[role="menu"]',
  // Consumer opt-out for custom interactive regions.
  '[data-no-window-drag]',
].join(', ');

/** Whether a pointer/touch event started on an element that should keep native focus behavior. */
function isInteractiveTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el?.closest?.(INTERACTIVE_TARGET_SELECTOR);
}

const SCROLLABLE_OVERFLOW = /(auto|scroll|overlay)/;

/**
 * Whether a touch started inside content that can scroll, between the target and the drag
 * handle. A finger has no wheel: on such content the swipe must scroll it, not move the window.
 */
function isInScrollableContent(target: EventTarget | null, handle: EventTarget | null): boolean {
  let el = target instanceof Element ? target : null;

  while (el && el !== handle) {
    if (el instanceof HTMLElement) {
      const style = window.getComputedStyle(el);
      if (
        (SCROLLABLE_OVERFLOW.test(style.overflowY) && el.scrollHeight > el.clientHeight) ||
        (SCROLLABLE_OVERFLOW.test(style.overflowX) && el.scrollWidth > el.clientWidth)
      ) {
        return true;
      }
    }
    el = el.parentElement;
  }

  return false;
}

export interface UseWindowDragOptions {
  positionPx: { x: number; y: number };
  sizePx: { width: number; height: number };
  dragBoundsPx: { minX?: number; maxX?: number; minY?: number; maxY?: number } | null;
  withinPortal: boolean;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth: number;
  containerHeight: number;
  /** Restricts the user's drag to one axis; the other keeps its value from the gesture start. */
  axis?: 'x' | 'y';
  /** Keeps the element inside the boundary even where `dragBounds` would let it out. */
  keepInBounds?: boolean;
  /** The dragged element, measured once per gesture so the bounds use its rendered size. */
  elementRef: React.RefObject<HTMLElement | null>;
  setPosition: (position: { x: number; y: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useWindowDrag(options: UseWindowDragOptions) {
  const {
    positionPx,
    sizePx,
    dragBoundsPx,
    withinPortal,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
    axis,
    keepInBounds = false,
    elementRef,
    setPosition,
    onDragStart,
    onDragEnd,
  } = options;

  const isDragging = useRef(false);
  // The finger a touch drag follows; `null` for a mouse drag.
  const touchId = useRef<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  // Where the element was when the gesture started: the locked axis of `axis` stays there.
  const dragOrigin = useRef({ x: 0, y: 0 });
  // The element's rendered size for this gesture (0 = not measured, use sizePx).
  const dragSize = useRef({ width: 0, height: 0 });

  // Kept in refs so a consumer passing an inline arrow does not re-create the
  // memoized pointer handlers on every render.
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  /**
   * Measures the element once at the start of a gesture. Its rendered size is what has
   * to stay inside the bounds: a collapsed window is only as tall as its header, and an
   * element driven by the headless hook may not use `size` at all. Layout sizes, not
   * `getBoundingClientRect`, so a transformed ancestor does not skew them.
   */
  const measureElement = useCallback(() => {
    const el = elementRef.current;
    dragSize.current = { width: el?.offsetWidth ?? 0, height: el?.offsetHeight ?? 0 };
  }, [elementRef]);

  const applyBounds = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      const constraints: DragConstraints = {
        dragBounds: dragBoundsPx,
        withinPortal,
        windowWidth: dragSize.current.width || sizePx.width,
        windowHeight: dragSize.current.height || sizePx.height,
        viewportWidth,
        viewportHeight,
        containerWidth,
        containerHeight,
        keepInBoundary: keepInBounds,
      };

      return applyDragBounds(newX, newY, constraints);
    },
    [
      dragBoundsPx,
      withinPortal,
      sizePx,
      viewportWidth,
      viewportHeight,
      containerWidth,
      containerHeight,
      keepInBounds,
    ]
  );

  const handleMouseDownDrag = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
        return;
      }

      // Don't hijack interactive elements (inputs, buttons, links, …): calling
      // preventDefault() here would stop the browser from focusing them.
      if (isInteractiveTarget(e.target)) {
        return;
      }

      isDragging.current = true;
      touchId.current = null;
      dragStart.current = {
        x: e.clientX - positionPx.x,
        y: e.clientY - positionPx.y,
      };
      dragOrigin.current = { x: positionPx.x, y: positionPx.y };
      measureElement();
      document.body.style.userSelect = 'none';
      e.preventDefault();
      // Emitted only past the bail-outs above: a mousedown on a resize handle or on an
      // interactive child is not a drag, and must not open a gesture that never closes.
      onDragStartRef.current?.();
    },
    [positionPx, measureElement]
  );

  const handleTouchStartDrag = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
        return;
      }

      if (isInteractiveTarget(e.target) || isInScrollableContent(e.target, e.currentTarget)) {
        return;
      }

      // The finger that just landed, not `touches[0]`: with a finger already on another
      // window, that one is first in the list and this window would follow it.
      const touch = e.changedTouches[0];
      isDragging.current = true;
      touchId.current = touch.identifier;
      dragStart.current = {
        x: touch.clientX - positionPx.x,
        y: touch.clientY - positionPx.y,
      };
      dragOrigin.current = { x: positionPx.x, y: positionPx.y };
      measureElement();
      document.body.style.userSelect = 'none';
      // No preventDefault(): React registers touchstart as a passive listener, so it would be
      // ignored and only log an error. The header's `touch-action: none` and the document's
      // non-passive touchmove listener are what keep the page from scrolling.
      onDragStartRef.current?.();
    },
    [positionPx, measureElement]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging.current) {
        return;
      }

      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      const bounded = applyBounds(newX, newY);

      setPosition({
        x: axis === 'y' ? dragOrigin.current.x : bounded.x,
        y: axis === 'x' ? dragOrigin.current.y : bounded.y,
      });
    },
    [applyBounds, setPosition, axis]
  );

  const handleDragEnd = useCallback(() => {
    // The global mouseup/touchend listener calls this whenever EITHER gesture is
    // active, so a plain resize would otherwise emit an unpaired onDragEnd.
    const wasDragging = isDragging.current;
    isDragging.current = false;
    touchId.current = null;
    if (wasDragging) {
      onDragEndRef.current?.();
    }
  }, []);

  return {
    isDragging,
    touchId,
    handleMouseDownDrag,
    handleTouchStartDrag,
    handleDragMove,
    handleDragEnd,
  };
}
