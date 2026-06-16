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
  } = options;

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

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
    isDragging.current = false;
  }, []);

  return {
    isDragging,
    handleMouseDownDrag,
    handleTouchStartDrag,
    handleDragMove,
    handleDragEnd,
  };
}
