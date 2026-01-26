import { useEffect, useRef } from 'react';
import { useClickOutside, useMergedRef } from '@mantine/hooks';
import type { WindowBaseProps } from '../Window';
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
    defaultPosition,
    defaultSize,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    dragBounds,
    onPositionChange,
    onSizeChange,
  } = props;

  // State management
  const state = useWindowState({
    id,
    title,
    opened,
    collapsed,
    persistState,
    defaultPosition,
    defaultSize,
    onClose,
    onPositionChange,
    onSizeChange,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // Dimensions tracking (viewport and container)
  const dimensions = useWindowDimensions({
    withinPortal,
    isVisible: state.isVisible,
    windowRef,
  });

  // Constraints and conversions
  const constraints = useWindowConstraints({
    position: state.position,
    size: state.size,
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

  // Drag functionality
  const drag = useWindowDrag({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    dragBoundsPx: constraints.dragBoundsPx,
    withinPortal,
    viewportWidth: dimensions.viewportDimensions.width,
    viewportHeight: dimensions.viewportDimensions.height,
    containerWidth: dimensions.containerDimensions.width,
    containerHeight: dimensions.containerDimensions.height,
    setPosition: state.setPosition,
    bringToFront: state.bringToFront,
  });

  // Resize functionality
  const resize = useWindowResize({
    positionPx: constraints.positionPx,
    sizePx: constraints.sizePx,
    constraintsPx: constraints.constraintsPx,
    setPosition: state.setPosition,
    setSize: state.setSize,
    bringToFront: state.bringToFront,
  });

  // Click outside detection for z-index management
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => state.setZIndex(199));

  // Merge refs
  const mergedRef = useMergedRef(windowRef, clickOutsideRef);

  // Global mouse/touch event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      drag.handleDragMove(e.clientX, e.clientY);

      if (resize.isResizing.current) {
        resize.handleResize(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (drag.isDragging.current || resize.isResizing.current) {
        const touch = e.touches[0];
        drag.handleDragMove(touch.clientX, touch.clientY);

        if (resize.isResizing.current) {
          resize.handleResize(touch.clientX, touch.clientY);
        }
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (drag.isDragging.current || resize.isResizing.current) {
        drag.handleDragEnd();
        resize.handleResizeEnd();
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    const handleTouchEnd = () => {
      if (drag.isDragging.current || resize.isResizing.current) {
        drag.handleDragEnd();
        resize.handleResizeEnd();
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
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [drag, resize]);

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
