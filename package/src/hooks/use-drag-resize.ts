import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';
import {
  computeKeyboardResize,
  getKeyboardResizeRange,
  getResizeAxes,
  type KeyboardResizeLimits,
  type ResizeDirection,
} from '../lib/keyboard-resize';
import type { WindowBounds, WindowPosition, WindowSize } from '../Window';
import { useWindowConstraints } from './use-window-constraints';
import { useWindowDimensions } from './use-window-dimensions';
import { useWindowDrag } from './use-window-drag';
import { useWindowResize } from './use-window-resize';

/** Where the element lives: `viewport` for a `position: fixed` element, `parent` for one absolutely positioned in its offset parent. */
export type DragResizeBoundary = 'viewport' | 'parent';

export interface UseDragResizeOptions {
  /** Controlled position. Accepts pixels (number), viewport units (`'10vw'`, `'5vh'`) or percentages of the boundary (`'50%'`). */
  position?: WindowPosition;

  /** Initial position (uncontrolled), in the same units as `position`. @default { x: 20, y: 100 } */
  defaultPosition?: WindowPosition;

  /** Controlled size, in the same units as `position`. */
  size?: WindowSize;

  /** Initial size (uncontrolled). @default { width: 400, height: 400 } */
  defaultSize?: WindowSize;

  /** Minimum width reachable by resizing. @default 250 */
  minWidth?: number | string;

  /** Maximum width reachable by resizing. No limit when not set. */
  maxWidth?: number | string;

  /** Minimum height reachable by resizing. @default 100 */
  minHeight?: number | string;

  /** Maximum height reachable by resizing. No limit when not set. */
  maxHeight?: number | string;

  /** Rectangle the element's position is kept in while dragging. Defaults to the whole boundary. */
  dragBounds?: WindowBounds;

  /** Whether the element is positioned in the viewport or in its offset parent. @default 'viewport' */
  boundary?: DragResizeBoundary;

  /** Restricts dragging to one axis. Programmatic moves are not restricted. */
  axis?: 'x' | 'y';

  /** Pixels added or removed by an arrow key on a keyboard resize handle. @default 10 */
  resizeStep?: number;

  /** Pixels added or removed by Shift + an arrow key on a keyboard resize handle. @default 50 */
  resizeShiftStep?: number;

  /** Called whenever the position changes, with pixel values. */
  onPositionChange?: (position: { x: number; y: number }) => void;

  /** Called whenever the size changes, with pixel values. */
  onSizeChange?: (size: { width: number; height: number }) => void;

  /** Called once when a drag gesture starts. */
  onDragStart?: () => void;

  /** Called once when a drag gesture ends. Always paired with a preceding `onDragStart`. */
  onDragEnd?: () => void;

  /** Called once when a resize gesture starts. A key press on a keyboard handle is one gesture. */
  onResizeStart?: () => void;

  /** Called once when a resize gesture ends. Always paired with a preceding `onResizeStart`. */
  onResizeEnd?: () => void;
}

export interface DragResizeDragHandleProps {
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
}

export interface DragResizeHandleOptions {
  /** Makes this handle focusable and resizable with the keyboard, as a WAI-ARIA `separator`. Give it to one handle per element. */
  keyboard?: boolean;

  /** Accessible name of a keyboard handle. @default 'Resize' */
  label?: string;
}

export interface DragResizeHandleProps {
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  'data-resize-handle': ResizeDirection;
  role?: 'separator';
  tabIndex?: number;
  'aria-label'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-valuenow'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuetext'?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export interface UseDragResizeReturnValue<T extends HTMLElement = HTMLDivElement> {
  /** Ref for the element that moves and resizes. */
  ref: RefCallback<T>;

  /** Current position in pixels. */
  position: { x: number; y: number };

  /** Current size in pixels. */
  size: { width: number; height: number };

  /** Moves the element. Not restricted by `axis` or `dragBounds`. */
  setPosition: (position: { x: number; y: number }) => void;

  /** Resizes the element. Not restricted by the min / max size. */
  setSize: (size: { width: number; height: number }) => void;

  /** `true` while a drag gesture is in progress. */
  isDragging: boolean;

  /** `true` while a pointer resize gesture is in progress. */
  isResizing: boolean;

  /** Size of the boundary (viewport or offset parent) in pixels; `0` until it has been measured. */
  boundarySize: { width: number; height: number };

  /** Props for the area that starts a drag. Presses on inputs, buttons, links and `data-no-window-drag` regions never start one. */
  getDragHandleProps: () => DragResizeDragHandleProps;

  /** Props for a resize handle on one edge or corner. */
  getResizeHandleProps: (
    direction: ResizeDirection,
    options?: DragResizeHandleOptions
  ) => DragResizeHandleProps;
}

const DEFAULT_POSITION: WindowPosition = { x: 20, y: 100 };
const DEFAULT_SIZE: WindowSize = { width: 400, height: 400 };

/**
 * Makes any element draggable and resizable from any edge or corner, with the same
 * geometry engine as `Window`: units (px, vw, vh, %), min / max sizes, viewport or parent
 * boundary, drag bounds, an axis lock and keyboard resizing.
 */
export function useDragResize<T extends HTMLElement = HTMLDivElement>(
  options: UseDragResizeOptions = {}
): UseDragResizeReturnValue<T> {
  const {
    position: positionProp,
    defaultPosition = DEFAULT_POSITION,
    size: sizeProp,
    defaultSize = DEFAULT_SIZE,
    minWidth = 250,
    maxWidth,
    minHeight = 100,
    maxHeight,
    dragBounds,
    boundary = 'viewport',
    axis,
    resizeStep = 10,
    resizeShiftStep = 50,
    onPositionChange,
    onSizeChange,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
  } = options;

  const withinPortal = boundary === 'viewport';

  // ─── Element ────────────────────────────────────────────────────────

  // Kept both as state (so measuring re-runs when it mounts) and as a ref (read in handlers).
  const elementRef = useRef<T | null>(null);
  const [element, setElement] = useState<T | null>(null);
  const ref = useCallback((node: T | null) => {
    elementRef.current = node;
    setElement(node);
  }, []);

  // ─── Position and size, controlled or not ───────────────────────────

  const [internalPosition, setInternalPosition] = useState<WindowPosition>(defaultPosition);
  const [internalSize, setInternalSize] = useState<WindowSize>(defaultSize);
  const position = positionProp ?? internalPosition;
  const size = sizeProp ?? internalSize;

  const controlledRef = useRef({ position: false, size: false });
  controlledRef.current = { position: positionProp !== undefined, size: sizeProp !== undefined };

  // Callbacks are read from refs so inline arrows do not re-create the handlers.
  const callbacksRef = useRef({
    onPositionChange,
    onSizeChange,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
  });
  callbacksRef.current = {
    onPositionChange,
    onSizeChange,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
  };

  const setPosition = useCallback((next: { x: number; y: number }) => {
    if (!controlledRef.current.position) {
      setInternalPosition(next);
    }
    callbacksRef.current.onPositionChange?.(next);
  }, []);

  const setSize = useCallback((next: { width: number; height: number }) => {
    if (!controlledRef.current.size) {
      setInternalSize(next);
    }
    callbacksRef.current.onSizeChange?.(next);
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // ─── Boundary and conversions ───────────────────────────────────────

  const dimensions = useWindowDimensions({ withinPortal, element });

  const constraints = useWindowConstraints({
    position,
    size,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    dragBounds,
    withinPortal,
    isMounted: dimensions.isMounted,
    viewportWidth: dimensions.viewportDimensions.width,
    viewportHeight: dimensions.viewportDimensions.height,
    containerWidth: dimensions.containerDimensions.width,
    containerHeight: dimensions.containerDimensions.height,
  });

  const boundarySize = withinPortal
    ? dimensions.viewportDimensions
    : dimensions.containerDimensions;

  // ─── Pointer gestures ───────────────────────────────────────────────

  const drag = useWindowDrag({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    dragBoundsPx: constraints.dragBoundsPx,
    withinPortal,
    viewportWidth: dimensions.viewportDimensions.width,
    viewportHeight: dimensions.viewportDimensions.height,
    containerWidth: dimensions.containerDimensions.width,
    containerHeight: dimensions.containerDimensions.height,
    axis,
    elementRef,
    setPosition,
    onDragStart: () => {
      setIsDragging(true);
      callbacksRef.current.onDragStart?.();
    },
    onDragEnd: () => {
      setIsDragging(false);
      callbacksRef.current.onDragEnd?.();
    },
  });

  const resize = useWindowResize({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    constraintsPx: constraints.constraintsPx,
    setPosition,
    setSize,
    onResizeStart: () => {
      setIsResizing(true);
      callbacksRef.current.onResizeStart?.();
    },
    onResizeEnd: () => {
      setIsResizing(false);
      callbacksRef.current.onResizeEnd?.();
    },
  });

  // Refs so the document listeners below are registered once and still call the latest handlers.
  const dragRef = useRef(drag);
  dragRef.current = drag;

  const resizeRef = useRef(resize);
  resizeRef.current = resize;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      dragRef.current.handleDragMove(e.clientX, e.clientY);

      if (resizeRef.current.isResizing.current) {
        resizeRef.current.handleResize(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragRef.current.isDragging.current || resizeRef.current.isResizing.current) {
        const touch = e.touches[0];
        dragRef.current.handleDragMove(touch.clientX, touch.clientY);

        if (resizeRef.current.isResizing.current) {
          resizeRef.current.handleResize(touch.clientX, touch.clientY);
        }
        e.preventDefault();
      }
    };

    const handleGestureEnd = () => {
      if (dragRef.current.isDragging.current || resizeRef.current.isResizing.current) {
        dragRef.current.handleDragEnd();
        resizeRef.current.handleResizeEnd();
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleGestureEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleGestureEnd);
    document.addEventListener('touchcancel', handleGestureEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleGestureEnd);
      document.removeEventListener('touchmove', handleTouchMove, {
        passive: false,
      } as EventListenerOptions);
      document.removeEventListener('touchend', handleGestureEnd);
      document.removeEventListener('touchcancel', handleGestureEnd);
      // Unmounting mid-gesture must still close it: a consumer that paused an expensive
      // child on onDragStart, or opened an undo entry, would otherwise never be told the
      // gesture is over. Both helpers no-op when their own gesture was not active.
      dragRef.current.handleDragEnd();
      resizeRef.current.handleResizeEnd();
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  // ─── Prop getters ───────────────────────────────────────────────────

  const getDragHandleProps = (): DragResizeDragHandleProps => ({
    onMouseDown: drag.handleMouseDownDrag,
    onTouchStart: drag.handleTouchStartDrag,
  });

  const { positionPx, sizePx, constraintsPx } = constraints;

  const getResizeHandleProps = (
    direction: ResizeDirection,
    handleOptions: DragResizeHandleOptions = {}
  ): DragResizeHandleProps => {
    const pointerProps: DragResizeHandleProps = {
      ...resize.resizeHandlers[direction],
      'data-resize-handle': direction,
    };

    if (!handleOptions.keyboard) {
      return pointerProps;
    }

    const geometry = { ...positionPx, ...sizePx };
    // On the keyboard the boundary is the hard limit, in the viewport too: a pointer cannot
    // drag an edge off-screen either, and a keyboard user would lose sight of it.
    const limits: KeyboardResizeLimits = {
      minWidth: constraintsPx.minWidth,
      maxWidth: constraintsPx.maxWidth,
      minHeight: constraintsPx.minHeight,
      maxHeight: constraintsPx.maxHeight,
      areaWidth: boundarySize.width,
      areaHeight: boundarySize.height,
    };

    const axes = getResizeAxes(direction);
    const range = getKeyboardResizeRange(direction, geometry, limits);
    // A separator has one value: the width for a vertical edge or a corner, the height for a horizontal edge.
    const current = axes.width ? sizePx.width : sizePx.height;
    const valueRange = (axes.width ? range.width : range.height)!;

    return {
      ...pointerProps,
      role: 'separator',
      tabIndex: 0,
      'aria-label': handleOptions.label ?? 'Resize',
      'aria-orientation': axes.width ? 'vertical' : 'horizontal',
      'aria-valuenow': Math.round(current),
      'aria-valuemin': Math.round(Math.min(valueRange.min, current)),
      'aria-valuemax': Number.isFinite(valueRange.max)
        ? Math.round(Math.max(valueRange.max, current))
        : undefined,
      'aria-valuetext':
        axes.width && axes.height
          ? `${Math.round(sizePx.width)} × ${Math.round(sizePx.height)}`
          : undefined,
      onKeyDown: (event: React.KeyboardEvent) => {
        const next = computeKeyboardResize(
          direction,
          event.key,
          event.shiftKey ? resizeShiftStep : resizeStep,
          geometry,
          limits
        );

        if (!next) {
          return;
        }

        // The key is ours even at a limit: it must not scroll the page instead.
        event.preventDefault();

        if (next.width === geometry.width && next.height === geometry.height) {
          return;
        }

        callbacksRef.current.onResizeStart?.();
        setSize({ width: next.width, height: next.height });
        if (next.x !== geometry.x || next.y !== geometry.y) {
          setPosition({ x: next.x, y: next.y });
        }
        callbacksRef.current.onResizeEnd?.();
      },
    };
  };

  return {
    ref,
    position: positionPx,
    size: sizePx,
    setPosition,
    setSize,
    isDragging,
    isResizing,
    boundarySize,
    getDragHandleProps,
    getResizeHandleProps,
  };
}
