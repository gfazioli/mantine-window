import { useCallback, useRef } from 'react';
import { applyDragBounds, type DragConstraints } from '../lib/window-constraints';
import type { WindowPosition } from '../Window';

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

export interface UseWindowDragOptions {
  positionPx: { x: number; y: number };
  sizePx: { width: number; height: number };
  dragBoundsPx: { minX?: number; maxX?: number; minY?: number; maxY?: number } | null;
  withinPortal: boolean;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth: number;
  containerHeight: number;
  isCollapsed: boolean;
  windowRef: React.RefObject<HTMLDivElement | null>;
  setPosition: (position: WindowPosition) => void;
  bringToFront: () => void;
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
    isCollapsed,
    windowRef,
    setPosition,
    bringToFront,
    onDragStart,
    onDragEnd,
  } = options;

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Kept in refs so a consumer passing an inline arrow does not re-create the
  // memoized pointer handlers on every render.
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const applyBounds = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      // When collapsed, use the actual measured height from the DOM
      // This ensures we account for all borders, paddings, and margins
      let effectiveHeight = sizePx.height;

      if (isCollapsed && windowRef.current) {
        // Get the actual rendered height of the window element
        const rect = windowRef.current.getBoundingClientRect();
        effectiveHeight = rect.height;
      }

      const constraints: DragConstraints = {
        dragBounds: dragBoundsPx,
        withinPortal,
        windowWidth: sizePx.width,
        windowHeight: effectiveHeight,
        viewportWidth,
        viewportHeight,
        containerWidth,
        containerHeight,
      };

      return applyDragBounds(newX, newY, constraints);
    },
    [
      dragBoundsPx,
      withinPortal,
      sizePx,
      isCollapsed,
      windowRef,
      viewportWidth,
      viewportHeight,
      containerWidth,
      containerHeight,
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

      bringToFront();
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - positionPx.x,
        y: e.clientY - positionPx.y,
      };
      document.body.style.userSelect = 'none';
      e.preventDefault();
      // Emitted only past the bail-outs above: a mousedown on a resize handle or on an
      // interactive child is not a drag, and must not open a gesture that never closes.
      onDragStartRef.current?.();
    },
    [positionPx, bringToFront]
  );

  const handleTouchStartDrag = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
        return;
      }

      // Don't hijack interactive elements (inputs, buttons, links, …): calling
      // preventDefault() here would stop the browser from focusing them.
      if (isInteractiveTarget(e.target)) {
        return;
      }

      const touch = e.touches[0];
      bringToFront();
      isDragging.current = true;
      dragStart.current = {
        x: touch.clientX - positionPx.x,
        y: touch.clientY - positionPx.y,
      };
      document.body.style.userSelect = 'none';
      e.preventDefault();
      onDragStartRef.current?.();
    },
    [positionPx, bringToFront]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging.current) {
        return;
      }

      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      const bounded = applyBounds(newX, newY);

      setPosition({ x: bounded.x, y: bounded.y });
    },
    [applyBounds, setPosition]
  );

  const handleDragEnd = useCallback(() => {
    // The global mouseup/touchend listener calls this whenever EITHER gesture is
    // active, so a plain resize would otherwise emit an unpaired onDragEnd.
    const wasDragging = isDragging.current;
    isDragging.current = false;
    if (wasDragging) {
      onDragEndRef.current?.();
    }
  }, []);

  return {
    isDragging,
    handleMouseDownDrag,
    handleTouchStartDrag,
    handleDragMove,
    handleDragEnd,
  };
}
