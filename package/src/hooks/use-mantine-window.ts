import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage, useResizeObserver, useViewportSize } from '@mantine/hooks';
import { convertToPixels } from '../lib/convert-to-pixels';
import type { WindowBaseProps, WindowPosition, WindowSize } from '../Window';

export type ResizeDirection =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left';

const CURSOR_MAP: Record<ResizeDirection, string> = {
  topLeft: 'nwse-resize',
  top: 'ns-resize',
  topRight: 'nesw-resize',
  right: 'ew-resize',
  bottomRight: 'nwse-resize',
  bottom: 'ns-resize',
  bottomLeft: 'nesw-resize',
  left: 'ew-resize',
};

export interface ResizeHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

export function useMantineWindow(props: WindowBaseProps) {
  const {
    title,
    collapsed,
    opened,
    onClose,
    id,
    persistState = false,
    withinPortal = true,
    defaultPosition = { x: 20, y: 100 },
    defaultSize = { width: 400, height: 400 },
    minWidth = 250,
    minHeight = 100,
    maxWidth,
    maxHeight,
    dragBounds,
    onPositionChange,
    onSizeChange,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(collapsed ?? false);
  const [isVisible, setIsVisible] = useState(opened ?? false);
  const [zIndex, setZIndex] = useState(200);

  const key = (id || title)?.toLocaleLowerCase().replace(/\s+/g, '-') || 'window';

  // Use localStorage if persistState is true, otherwise use regular state
  const [positionStorage, setPositionStorage] = useLocalStorage({
    key: persistState && `${key}-window-position`,
    defaultValue: defaultPosition,
    getInitialValueInEffect: true,
  });

  const [sizeStorage, setSizeStorage] = useLocalStorage({
    key: persistState && `${key}-window-size`,
    defaultValue: defaultSize,
    getInitialValueInEffect: true,
  });

  const [positionState, setPositionState] = useState<WindowPosition>(defaultPosition);
  const [sizeState, setSizeState] = useState<WindowSize>(defaultSize);

  // Select the appropriate state based on persistState
  const position = persistState ? positionStorage : positionState;
  const size = persistState ? sizeStorage : sizeState;

  const setPosition = useCallback(
    (newPosition: WindowPosition | ((prev: WindowPosition) => WindowPosition)) => {
      const pos = typeof newPosition === 'function' ? newPosition(position) : newPosition;
      if (persistState) {
        setPositionStorage(pos);
      } else {
        setPositionState(pos);
      }
      onPositionChange?.(pos);
    },
    [persistState, position, setPositionStorage, onPositionChange]
  );

  const setSize = useCallback(
    (newSize: WindowSize | ((prev: WindowSize) => WindowSize)) => {
      const sz = typeof newSize === 'function' ? newSize(size) : newSize;
      if (persistState) {
        setSizeStorage(sz);
      } else {
        setSizeState(sz);
      }
      onSizeChange?.(sz);
    },
    [persistState, size, setSizeStorage, onSizeChange]
  );

  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  // Track viewport dimensions using Mantine's hook
  const viewportDimensions = useViewportSize();

  // Track container dimensions using Mantine's resize observer
  const [containerRef, containerRect] = useResizeObserver();

  // Attach resize observer to parent container when not in portal mode
  useEffect(() => {
    if (!windowRef.current?.offsetParent || withinPortal) {
      // Reset ref when in portal mode
      if (containerRef.current) {
        containerRef.current = null;
      }
      return;
    }

    const parent = windowRef.current.offsetParent;
    if (parent instanceof HTMLElement) {
      containerRef.current = parent;
    }
  }, [withinPortal, containerRef]);

  useEffect(() => {
    setIsVisible(opened ?? false);
  }, [opened]);

  useEffect(() => {
    setIsCollapsed(collapsed ?? false);
  }, [collapsed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
        setZIndex(199);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const bringToFront = useCallback(() => {
    setZIndex(200);
  }, []);

  // Handle dragging (mouse)
  const handleMouseDownDrag = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
        return;
      }

      bringToFront();
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      document.body.style.userSelect = 'none';
      e.preventDefault();
    },
    [position, bringToFront]
  );

  // Handle dragging (touch)
  const handleTouchStartDrag = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('[data-resize-handle]')) {
        return;
      }

      const touch = e.touches[0];
      bringToFront();
      isDragging.current = true;
      dragStart.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
      document.body.style.userSelect = 'none';
      e.preventDefault();
    },
    [position, bringToFront]
  );

  // Handle resizing
  const resizeDirection = useRef<ResizeDirection | ''>('');

  // Factory function to create resize handlers for a specific direction
  const createResizeHandlers = useCallback(
    (direction: ResizeDirection): ResizeHandlers => {
      const onMouseDown = (e: React.MouseEvent) => {
        bringToFront();
        isResizing.current = true;
        resizeDirection.current = direction;
        resizeStart.current = {
          x: e.clientX,
          y: e.clientY,
          width: size.width,
          height: size.height,
          posX: position.x,
          posY: position.y,
        };
        document.body.style.cursor = CURSOR_MAP[direction];
        document.body.style.userSelect = 'none';
        e.preventDefault();
        e.stopPropagation();
      };

      const onTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        bringToFront();
        isResizing.current = true;
        resizeDirection.current = direction;
        resizeStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          width: size.width,
          height: size.height,
          posX: position.x,
          posY: position.y,
        };
        document.body.style.userSelect = 'none';
        e.stopPropagation();
      };

      return { onMouseDown, onTouchStart };
    },
    [size, position, bringToFront]
  );

  // Memoized resize handlers for each direction
  const resizeHandlers = useMemo(
    () => ({
      topLeft: createResizeHandlers('topLeft'),
      top: createResizeHandlers('top'),
      topRight: createResizeHandlers('topRight'),
      right: createResizeHandlers('right'),
      bottomRight: createResizeHandlers('bottomRight'),
      bottom: createResizeHandlers('bottom'),
      bottomLeft: createResizeHandlers('bottomLeft'),
      left: createResizeHandlers('left'),
    }),
    [createResizeHandlers]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      return onClose();
    }
    setIsVisible(false);
  }, [onClose]);

  // Memoize converted constraint values to avoid repeated conversions during drag/resize
  const constraintsPx = useMemo(() => {
    const refWidth = withinPortal ? viewportDimensions.width : containerRect.width;
    const refHeight = withinPortal ? viewportDimensions.height : containerRect.height;

    return {
      minWidth: convertToPixels(minWidth, refWidth) ?? 250,
      maxWidth: convertToPixels(maxWidth, refWidth),
      minHeight: convertToPixels(minHeight, refHeight) ?? 100,
      maxHeight: convertToPixels(maxHeight, refHeight),
      containerMaxWidth: withinPortal ? Infinity : containerRect.width,
      containerMaxHeight: withinPortal ? Infinity : containerRect.height,
    };
  }, [
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    withinPortal,
    viewportDimensions.width,
    viewportDimensions.height,
    containerRect.width,
    containerRect.height,
  ]);

  // Memoize converted drag bounds
  const dragBoundsPx = useMemo(() => {
    if (!dragBounds) {
      return null;
    }

    const refWidth = withinPortal ? viewportDimensions.width : containerRect.width;
    const refHeight = withinPortal ? viewportDimensions.height : containerRect.height;

    return {
      minX: convertToPixels(dragBounds.minX, refWidth),
      maxX: convertToPixels(dragBounds.maxX, refWidth),
      minY: convertToPixels(dragBounds.minY, refHeight),
      maxY: convertToPixels(dragBounds.maxY, refHeight),
    };
  }, [
    dragBounds,
    withinPortal,
    viewportDimensions.width,
    viewportDimensions.height,
    containerRect.width,
    containerRect.height,
  ]);

  // Helper to clamp width and height
  const clampWidth = useCallback(
    (w: number) => {
      let clamped = Math.max(constraintsPx.minWidth, w);
      if (constraintsPx.maxWidth !== undefined) {
        clamped = Math.min(constraintsPx.maxWidth, clamped);
      }

      // Constrain to container size when not using portal
      if (constraintsPx.containerMaxWidth !== Infinity) {
        clamped = Math.min(clamped, constraintsPx.containerMaxWidth);
      }

      return clamped;
    },
    [constraintsPx]
  );

  const clampHeight = useCallback(
    (h: number) => {
      let clamped = Math.max(constraintsPx.minHeight, h);
      if (constraintsPx.maxHeight !== undefined) {
        clamped = Math.min(constraintsPx.maxHeight, clamped);
      }

      // Constrain to container size when not using portal
      if (constraintsPx.containerMaxHeight !== Infinity) {
        clamped = Math.min(clamped, constraintsPx.containerMaxHeight);
      }

      return clamped;
    },
    [constraintsPx]
  );

  // Helper to apply bounds during drag
  const applyDragBounds = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      let boundedX = newX;
      let boundedY = newY;

      if (dragBoundsPx) {
        // Use memoized converted bounds
        if (dragBoundsPx.minX !== undefined) {
          boundedX = Math.max(dragBoundsPx.minX, boundedX);
        }
        if (dragBoundsPx.maxX !== undefined) {
          boundedX = Math.min(dragBoundsPx.maxX, boundedX);
        }
        if (dragBoundsPx.minY !== undefined) {
          boundedY = Math.max(dragBoundsPx.minY, boundedY);
        }
        if (dragBoundsPx.maxY !== undefined) {
          boundedY = Math.min(dragBoundsPx.maxY, boundedY);
        }
      } else if (withinPortal) {
        // Global viewport bounds
        boundedX = Math.max(0, Math.min(boundedX, viewportDimensions.width - size.width));
        boundedY = Math.max(0, Math.min(boundedY, viewportDimensions.height - size.height));
      } else {
        // Parent container bounds
        boundedX = Math.max(0, Math.min(boundedX, containerRect.width - size.width));
        boundedY = Math.max(0, Math.min(boundedY, containerRect.height - size.height));
      }

      return { x: boundedX, y: boundedY };
    },
    [
      dragBoundsPx,
      withinPortal,
      size.width,
      size.height,
      viewportDimensions.width,
      viewportDimensions.height,
      containerRect.width,
      containerRect.height,
    ]
  );

  // Helper to handle resize logic
  const handleResize = useCallback(
    (clientX: number, clientY: number) => {
      const deltaX = clientX - resizeStart.current.x;
      const deltaY = clientY - resizeStart.current.y;

      let newWidth = size.width;
      let newHeight = size.height;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;

      // Use memoized container constraints
      const containerMaxWidth = constraintsPx.containerMaxWidth;
      const containerMaxHeight = constraintsPx.containerMaxHeight;

      switch (resizeDirection.current) {
        case 'topLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          // Prevent negative position in container mode
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = resizeStart.current.width + resizeStart.current.posX;
            newX = 0;
          }
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = resizeStart.current.height + resizeStart.current.posY;
            newY = 0;
          }
          break;
        case 'top':
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          // Prevent negative position in container mode
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = resizeStart.current.height + resizeStart.current.posY;
            newY = 0;
          }
          break;
        case 'topRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          // Limit width based on position and container
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          // Prevent negative position in container mode
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = resizeStart.current.height + resizeStart.current.posY;
            newY = 0;
          }
          break;
        case 'right':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          // Limit width based on position and container
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          break;
        case 'bottomRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          // Limit width based on position and container
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          // Limit height based on position and container
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          break;
        case 'bottom':
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          // Limit height based on position and container
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          break;
        case 'bottomLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          // Limit height based on position and container
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          // Prevent negative position in container mode
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = resizeStart.current.width + resizeStart.current.posX;
            newX = 0;
          }
          break;
        case 'left':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          // Prevent negative position in container mode
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = resizeStart.current.width + resizeStart.current.posX;
            newX = 0;
          }
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      if (newX !== resizeStart.current.posX || newY !== resizeStart.current.posY) {
        setPosition({ x: newX, y: newY });
      }
    },
    [size.width, size.height, clampWidth, clampHeight, setSize, setPosition, constraintsPx]
  );

  // Mouse and touch move/up/end handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const newPos = applyDragBounds(
          e.clientX - dragStart.current.x,
          e.clientY - dragStart.current.y
        );
        setPosition(newPos);
      }

      if (isResizing.current) {
        handleResize(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current || isResizing.current) {
        const touch = e.touches[0];
        if (isDragging.current) {
          const newPos = applyDragBounds(
            touch.clientX - dragStart.current.x,
            touch.clientY - dragStart.current.y
          );
          setPosition(newPos);
        }

        if (isResizing.current) {
          handleResize(touch.clientX, touch.clientY);
        }

        // Prevent scrolling while dragging/resizing
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current || isResizing.current) {
        isDragging.current = false;
        isResizing.current = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    const handleTouchEnd = () => {
      if (isDragging.current || isResizing.current) {
        isDragging.current = false;
        isResizing.current = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    // Always attach listeners
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
  }, [applyDragBounds, handleResize, setPosition]);

  return {
    isCollapsed,
    setIsCollapsed,
    isVisible,
    setIsVisible,
    zIndex,
    position,
    size,
    windowRef,
    handleMouseDownDrag,
    handleTouchStartDrag,
    resizeHandlers,
    handleClose,
    bringToFront,
  } as const;
}
