import { useCallback, useRef } from 'react';
import { applyDragBounds, type DragConstraints } from '../lib/window-constraints';
import type { WindowPosition } from '../Window';

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
    setPosition,
    bringToFront,
  } = options;

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const applyBounds = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      // When collapsed, use the header height (40px) instead of the full window height
      const effectiveHeight = isCollapsed ? 40 : sizePx.height;

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
