import { useCallback, useEffect, useRef } from 'react';
import type { WindowBaseProps, WindowBounds } from '../Window';
import { useWindowGroupContext } from '../WindowGroup.context';
import { useDragResize } from './use-drag-resize';
import { useResponsiveValue } from './use-responsive-value';
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
    keepInBounds,
    axis,
    resizeStep,
    resizeShiftStep,
    onPositionChange,
    onSizeChange,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
    initialZIndex,
    maxZIndex,
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
    initialZIndex,
    maxZIndex,
    onClose,
    onPositionChange,
    onSizeChange,
  });

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
          requestClose: () => state.handleClose(),
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

  // ─── Geometry: units, boundary, drag and resize (the public headless hook) ──

  const dragResize = useDragResize<HTMLDivElement>({
    position: state.position,
    size: state.size,
    minWidth: resolvedMinWidth,
    maxWidth: resolvedMaxWidth,
    minHeight: resolvedMinHeight,
    maxHeight: resolvedMaxHeight,
    dragBounds: resolvedDragBounds,
    boundary: withinPortal ? 'viewport' : 'parent',
    axis,
    keepInBounds,
    resizeStep,
    resizeShiftStep,
    // Always controlled: useWindowState owns the values, per-axis control and persistence.
    onPositionChange: state.setPosition,
    onSizeChange: state.setSize,
    onDragStart: () => {
      groupBringToFront();
      onDragStart?.();
    },
    onDragEnd,
    onResizeStart: () => {
      groupBringToFront();
      onResizeStart?.();
    },
    onResizeEnd,
  });

  // ─── Single-window layout (works with or without Group) ──────────────

  const applySingleLayout = useCallback(
    (layout: 'snap-left' | 'snap-right' | 'snap-top' | 'snap-bottom' | 'fill') => {
      // Use group container dims if in group, else viewport/container dims
      const refW = isInGroup ? groupCtx.containerWidth : dragResize.boundarySize.width;
      const refH = isInGroup ? groupCtx.containerHeight : dragResize.boundarySize.height;

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
    [isInGroup, groupCtx, dragResize.boundarySize]
  );

  // ─── Sync pixel values back to group registry ───────────────────────

  useEffect(() => {
    if (isInGroup) {
      groupCtx.updateWindowState(windowId, {
        x: dragResize.position.x,
        y: dragResize.position.y,
        width: dragResize.size.width,
        height: dragResize.size.height,
      });
    }
  }, [
    isInGroup,
    groupCtx,
    windowId,
    dragResize.position.x,
    dragResize.position.y,
    dragResize.size.width,
    dragResize.size.height,
  ]);

  return {
    isCollapsed: state.isCollapsed,
    setIsCollapsed: state.setIsCollapsed,
    isVisible: state.isVisible,
    setIsVisible: state.setIsVisible,
    zIndex,
    withinPortal,
    position: dragResize.position,
    size: dragResize.size,
    windowRef: dragResize.ref,
    getDragHandleProps: dragResize.getDragHandleProps,
    getResizeHandleProps: dragResize.getResizeHandleProps,
    handleClose: state.handleClose,
    bringToFront: groupBringToFront,
    applySingleLayout,
    groupCtx: isInGroup ? groupCtx : undefined,
  } as const;
}
