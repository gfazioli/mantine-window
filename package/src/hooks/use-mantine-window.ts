import { useCallback, useEffect, useRef } from 'react';
import { useMergedRef } from '@mantine/hooks';
import type { WindowBaseProps, WindowBounds } from '../Window';
import { useWindowGroupContext } from '../WindowGroup.context';
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
    collapsable,
    opened,
    onClose,
    id,
    persistState,
    withinPortal: withinPortalProp,
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

  // ─── Group context (optional) ─────────────────────────────────────

  const groupCtx = useWindowGroupContext();
  const isInGroup = groupCtx != null;
  const windowId = id || title || 'window';

  // When inside a group, use the group's withinPortal setting
  const withinPortal = isInGroup ? groupCtx.withinPortal : (withinPortalProp ?? true);

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

  // ─── Group integration: register callbacks so Group can control us ──

  useEffect(() => {
    if (isInGroup) {
      groupCtx.registerWindow(
        windowId,
        {
          id: windowId,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          isVisible: state.isVisible,
          isCollapsed: state.isCollapsed,
          collapsable: collapsable !== false,
        },
        {
          setPosition: state.setPosition,
          setSize: state.setSize,
          setIsCollapsed: (v) => state.setIsCollapsed(v),
          setIsVisible: (v) => state.setIsVisible(v),
        }
      );
      return () => groupCtx.unregisterWindow(windowId);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state methods are stable; adding state would cause infinite re-registration
  }, [isInGroup, windowId]);

  // ─── Group: override bringToFront and zIndex when in group ──────────

  const groupBringToFront = useCallback(() => {
    if (isInGroup) {
      groupCtx.bringToFront(windowId);
    } else {
      state.bringToFront();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state.bringToFront is a stable method
  }, [isInGroup, groupCtx, windowId]);

  const zIndex = isInGroup ? groupCtx.getZIndex(windowId) : state.zIndex;

  // ─── Group: sync visibility/collapsed state to group registry ───────

  const prevStateRef = useRef({ isVisible: state.isVisible, isCollapsed: state.isCollapsed });

  useEffect(() => {
    if (isInGroup) {
      const changed =
        prevStateRef.current.isVisible !== state.isVisible ||
        prevStateRef.current.isCollapsed !== state.isCollapsed;
      if (changed) {
        groupCtx.updateWindowState(windowId, {
          isVisible: state.isVisible,
          isCollapsed: state.isCollapsed,
        });
        prevStateRef.current = { isVisible: state.isVisible, isCollapsed: state.isCollapsed };
      }
    }
  }, [isInGroup, groupCtx, windowId, state.isVisible, state.isCollapsed]);

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

  // ─── Single-window layout (works with or without Group) ──────────────

  const applySingleLayout = useCallback(
    (layout: 'snap-left' | 'snap-right' | 'snap-top' | 'snap-bottom' | 'fill') => {
      // Use group container dims if in group, else viewport/container dims
      const refW = isInGroup
        ? groupCtx.containerWidth
        : withinPortal
          ? dimensions.viewportDimensions.width
          : dimensions.containerDimensions.width;
      const refH = isInGroup
        ? groupCtx.containerHeight
        : withinPortal
          ? dimensions.viewportDimensions.height
          : dimensions.containerDimensions.height;

      if (refW === 0 || refH === 0) {
        return;
      }

      switch (layout) {
        case 'snap-left':
          state.setPosition({ x: 0, y: 0 });
          state.setSize({ width: refW / 2, height: refH });
          break;
        case 'snap-right':
          state.setPosition({ x: refW / 2, y: 0 });
          state.setSize({ width: refW / 2, height: refH });
          break;
        case 'snap-top':
          state.setPosition({ x: 0, y: 0 });
          state.setSize({ width: refW, height: refH / 2 });
          break;
        case 'snap-bottom':
          state.setPosition({ x: 0, y: refH / 2 });
          state.setSize({ width: refW, height: refH / 2 });
          break;
        case 'fill':
          state.setPosition({ x: 0, y: 0 });
          state.setSize({ width: refW, height: refH });
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state methods are stable
    [isInGroup, groupCtx, withinPortal, dimensions]
  );

  // ─── Sync pixel values back to group registry ───────────────────────

  useEffect(() => {
    if (isInGroup) {
      groupCtx.updateWindowState(windowId, {
        x: constraints.positionPx.x,
        y: constraints.positionPx.y,
        width: constraints.sizePx.width,
        height: constraints.sizePx.height,
      });
    }
  }, [
    isInGroup,
    groupCtx,
    windowId,
    constraints.positionPx.x,
    constraints.positionPx.y,
    constraints.sizePx.width,
    constraints.sizePx.height,
  ]);

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
    bringToFront: groupBringToFront,
  });

  // ─── Resize functionality ───────────────────────────────────────────

  const resize = useWindowResize({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    constraintsPx: constraints.constraintsPx,
    setPosition: state.setPosition,
    setSize: state.setSize,
    bringToFront: groupBringToFront,
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
    zIndex,
    withinPortal,
    position: constraints.positionPx,
    size: constraints.sizePx,
    windowRef: mergedRef,
    handleMouseDownDrag: drag.handleMouseDownDrag,
    handleTouchStartDrag: drag.handleTouchStartDrag,
    resizeHandlers: resize.resizeHandlers,
    handleClose: state.handleClose,
    bringToFront: groupBringToFront,
    applySingleLayout,
    groupCtx: isInGroup ? groupCtx : undefined,
  } as const;
}
