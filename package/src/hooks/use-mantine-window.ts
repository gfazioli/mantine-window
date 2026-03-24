import { useEffect, useRef } from 'react';
import { useMergedRef } from '@mantine/hooks';
import type { WindowBaseProps, WindowBounds } from '../Window';
import { useResponsiveValue } from './use-responsive-value';
import { useWindowConstraints } from './use-window-constraints';
import { useWindowDimensions } from './use-window-dimensions';
import { useWindowDrag } from './use-window-drag';
import { useWindowResize } from './use-window-resize';
import { useWindowState } from './use-window-state';

export function useMantineWindow(props: WindowBaseProps) {
  const {
    title,
    collapsed,
    opened,
    onClose,
    id,
    persistState,
    withinPortal,
    // Controlled position/size
    x: xProp,
    y: yProp,
    width: widthProp,
    height: heightProp,
    // Uncontrolled defaults
    defaultX: defaultXProp,
    defaultY: defaultYProp,
    defaultWidth: defaultWidthProp,
    defaultHeight: defaultHeightProp,
    // Constraints
    minWidth: minWidthProp,
    minHeight: minHeightProp,
    maxWidth: maxWidthProp,
    maxHeight: maxHeightProp,
    dragBounds: dragBoundsProp,
    onPositionChange,
    onSizeChange,
  } = props;

  // ─── Resolve responsive values ──────────────────────────────────────

  const resolvedX = useResponsiveValue(xProp, undefined);
  const resolvedY = useResponsiveValue(yProp, undefined);
  const resolvedWidth = useResponsiveValue(widthProp, undefined);
  const resolvedHeight = useResponsiveValue(heightProp, undefined);

  const resolvedDefaultX = useResponsiveValue(defaultXProp, 20 as number | string);
  const resolvedDefaultY = useResponsiveValue(defaultYProp, 100 as number | string);
  const resolvedDefaultWidth = useResponsiveValue(defaultWidthProp, 400 as number | string);
  const resolvedDefaultHeight = useResponsiveValue(defaultHeightProp, 400 as number | string);

  const resolvedMinWidth = useResponsiveValue(minWidthProp, 250 as number | string);
  const resolvedMinHeight = useResponsiveValue(minHeightProp, 100 as number | string);
  const resolvedMaxWidth = useResponsiveValue(maxWidthProp, undefined);
  const resolvedMaxHeight = useResponsiveValue(maxHeightProp, undefined);

  const resolvedDragBounds = useResponsiveValue(
    dragBoundsProp,
    undefined as WindowBounds | undefined
  );

  // ─── State management ───────────────────────────────────────────────

  const state = useWindowState({
    id,
    title,
    opened,
    collapsed,
    persistState,
    withinPortal,
    // Controlled values (undefined = uncontrolled)
    x: resolvedX,
    y: resolvedY,
    width: resolvedWidth,
    height: resolvedHeight,
    // Uncontrolled defaults
    defaultX: resolvedDefaultX,
    defaultY: resolvedDefaultY,
    defaultWidth: resolvedDefaultWidth,
    defaultHeight: resolvedDefaultHeight,
    onClose,
    onPositionChange,
    onSizeChange,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // ─── Dimensions tracking (viewport and container) ───────────────────

  const dimensions = useWindowDimensions({
    withinPortal,
    isVisible: state.isVisible,
    windowRef,
  });

  // ─── Constraints and conversions ────────────────────────────────────

  const constraints = useWindowConstraints({
    position: state.position,
    size: state.size,
    minWidth: resolvedMinWidth,
    maxWidth: resolvedMaxWidth,
    minHeight: resolvedMinHeight,
    maxHeight: resolvedMaxHeight,
    dragBounds: resolvedDragBounds,
    withinPortal,
    isMounted: dimensions.isMounted,
    viewportWidth: dimensions.viewportDimensions.width,
    viewportHeight: dimensions.viewportDimensions.height,
    containerWidth: dimensions.containerDimensions.width,
    containerHeight: dimensions.containerDimensions.height,
  });

  // ─── Drag functionality ─────────────────────────────────────────────

  const drag = useWindowDrag({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    dragBoundsPx: constraints.dragBoundsPx,
    withinPortal,
    viewportWidth: dimensions.viewportDimensions.width,
    viewportHeight: dimensions.viewportDimensions.height,
    containerWidth: dimensions.containerDimensions.width,
    containerHeight: dimensions.containerDimensions.height,
    isCollapsed: state.isCollapsed,
    windowRef,
    setPosition: state.setPosition,
    bringToFront: state.bringToFront,
  });

  // ─── Resize functionality ───────────────────────────────────────────

  const resize = useWindowResize({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    constraintsPx: constraints.constraintsPx,
    setPosition: state.setPosition,
    setSize: state.setSize,
    bringToFront: state.bringToFront,
  });

  const mergedRef = useMergedRef(windowRef);

  // ─── Use refs for drag/resize handlers so global listeners stay stable

  const dragRef = useRef(drag);
  dragRef.current = drag;

  const resizeRef = useRef(resize);
  resizeRef.current = resize;

  // ─── Global mouse/touch event handlers — registered once ────────────

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

    const handleMouseUp = () => {
      if (dragRef.current.isDragging.current || resizeRef.current.isResizing.current) {
        dragRef.current.handleDragEnd();
        resizeRef.current.handleResizeEnd();
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    const handleTouchEnd = () => {
      if (dragRef.current.isDragging.current || resizeRef.current.isResizing.current) {
        dragRef.current.handleDragEnd();
        resizeRef.current.handleResizeEnd();
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove, {
        passive: false,
      } as EventListenerOptions);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  return {
    isCollapsed: state.isCollapsed,
    setIsCollapsed: state.setIsCollapsed,
    isVisible: state.isVisible,
    setIsVisible: state.setIsVisible,
    zIndex: state.zIndex,
    position: constraints.positionPx,
    size: constraints.sizePx,
    windowRef: mergedRef,
    handleMouseDownDrag: drag.handleMouseDownDrag,
    handleTouchStartDrag: drag.handleTouchStartDrag,
    resizeHandlers: resize.resizeHandlers,
    handleClose: state.handleClose,
    bringToFront: state.bringToFront,
  } as const;
}
