import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { WindowBaseProps, WindowPosition, WindowSize } from '../Window';

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
    },
    [position, bringToFront]
  );

  // Handle resizing
  const resizeDirection = useRef<string>('');

  const handleMouseDownResizeTopLeft = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'topLeft';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeTopLeft = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'topLeft';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeTop = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'top';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeTop = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'top';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeTopRight = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'topRight';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'nesw-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeTopRight = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'topRight';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeRight = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'right';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeRight = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'right';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeBottomRight = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottomRight';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeBottomRight = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottomRight';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeBottom = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottom';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeBottom = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottom';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeBottomLeft = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottomLeft';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'nesw-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeBottomLeft = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'bottomLeft';
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
    },
    [size, position, bringToFront]
  );

  const handleMouseDownResizeLeft = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'left';
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      };
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, position, bringToFront]
  );

  const handleTouchStartResizeLeft = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      bringToFront();
      isResizing.current = true;
      resizeDirection.current = 'left';
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
    },
    [size, position, bringToFront]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      return onClose();
    }
    setIsVisible(false);
  }, [onClose]);

  // Helper to clamp width and height
  const clampWidth = useCallback(
    (w: number) => {
      let clamped = Math.max(minWidth, w);
      if (maxWidth !== undefined) {
        clamped = Math.min(maxWidth, clamped);
      }
      return clamped;
    },
    [minWidth, maxWidth]
  );

  const clampHeight = useCallback(
    (h: number) => {
      let clamped = Math.max(minHeight, h);
      if (maxHeight !== undefined) {
        clamped = Math.min(maxHeight, clamped);
      }
      return clamped;
    },
    [minHeight, maxHeight]
  );

  // Helper to apply bounds during drag
  const applyDragBounds = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      let boundedX = newX;
      let boundedY = newY;

      if (dragBounds) {
        if (dragBounds.minX !== undefined) {
          boundedX = Math.max(dragBounds.minX, boundedX);
        }
        if (dragBounds.maxX !== undefined) {
          boundedX = Math.min(dragBounds.maxX, boundedX);
        }
        if (dragBounds.minY !== undefined) {
          boundedY = Math.max(dragBounds.minY, boundedY);
        }
        if (dragBounds.maxY !== undefined) {
          boundedY = Math.min(dragBounds.maxY, boundedY);
        }
      } else if (withinPortal) {
        // Global viewport bounds
        boundedX = Math.max(0, Math.min(boundedX, window.innerWidth - size.width));
        boundedY = Math.max(0, Math.min(boundedY, window.innerHeight - 50));
      } else {
        // Parent container bounds
        const parent = windowRef.current?.offsetParent;
        if (parent instanceof HTMLElement) {
          const parentWidth = parent.clientWidth;
          const parentHeight = parent.clientHeight;
          boundedX = Math.max(0, Math.min(boundedX, parentWidth - size.width));
          boundedY = Math.max(0, Math.min(boundedY, parentHeight - 50));
        }
      }

      return { x: boundedX, y: boundedY };
    },
    [dragBounds, withinPortal, size.width]
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

      switch (resizeDirection.current) {
        case 'topLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          break;
        case 'top':
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          break;
        case 'topRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          newHeight = clampHeight(resizeStart.current.height - deltaY);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          break;
        case 'right':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          break;
        case 'bottomRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX);
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          break;
        case 'bottom':
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          break;
        case 'bottomLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newHeight = clampHeight(resizeStart.current.height + deltaY);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          break;
        case 'left':
          newWidth = clampWidth(resizeStart.current.width - deltaX);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      if (newX !== resizeStart.current.posX || newY !== resizeStart.current.posY) {
        setPosition({ x: newX, y: newY });
      }
    },
    [size.width, size.height, clampWidth, clampHeight, setSize, setPosition]
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
    handleMouseDownResizeTopLeft,
    handleTouchStartResizeTopLeft,
    handleMouseDownResizeTop,
    handleTouchStartResizeTop,
    handleMouseDownResizeTopRight,
    handleTouchStartResizeTopRight,
    handleMouseDownResizeRight,
    handleTouchStartResizeRight,
    handleMouseDownResizeBottomRight,
    handleTouchStartResizeBottomRight,
    handleMouseDownResizeBottom,
    handleTouchStartResizeBottom,
    handleMouseDownResizeBottomLeft,
    handleTouchStartResizeBottomLeft,
    handleMouseDownResizeLeft,
    handleTouchStartResizeLeft,
    handleClose,
    bringToFront,
  } as const;
}
