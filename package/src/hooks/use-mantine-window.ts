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
    getInitialValueInEffect: false,
  });

  const [sizeStorage, setSizeStorage] = useLocalStorage({
    key: persistState && `${key}-window-size`,
    defaultValue: defaultSize,
    getInitialValueInEffect: false,
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

  // Handle dragging
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

  const handleClose = useCallback(() => {
    if (onClose) {
      return onClose();
    }
    setIsVisible(false);
  }, [onClose]);

  // Mouse move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        let newX = e.clientX - dragStart.current.x;
        let newY = e.clientY - dragStart.current.y;

        // Apply drag bounds if provided
        if (dragBounds) {
          if (dragBounds.minX !== undefined) {
            newX = Math.max(dragBounds.minX, newX);
          }
          if (dragBounds.maxX !== undefined) {
            newX = Math.min(dragBounds.maxX, newX);
          }
          if (dragBounds.minY !== undefined) {
            newY = Math.max(dragBounds.minY, newY);
          }
          if (dragBounds.maxY !== undefined) {
            newY = Math.min(dragBounds.maxY, newY);
          }
        } else if (withinPortal) {
          // Global viewport bounds
          newX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
          newY = Math.max(0, Math.min(newY, window.innerHeight - 50));
        } else {
          // Parent container bounds
          const parent = windowRef.current?.offsetParent;
          if (parent instanceof HTMLElement) {
            const parentWidth = parent.clientWidth;
            const parentHeight = parent.clientHeight;
            newX = Math.max(0, Math.min(newX, parentWidth - size.width));
            newY = Math.max(0, Math.min(newY, parentHeight - 50));
          }
        }

        setPosition({ x: newX, y: newY });
      }

      if (isResizing.current) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newWidth = size.width;
        let newHeight = size.height;
        let newX = resizeStart.current.posX;
        let newY = resizeStart.current.posY;

        // Helper to clamp width and height
        const clampWidth = (w: number) => {
          let clamped = Math.max(minWidth, w);
          if (maxWidth !== undefined) {
            clamped = Math.min(maxWidth, clamped);
          }
          return clamped;
        };
        const clampHeight = (h: number) => {
          let clamped = Math.max(minHeight, h);
          if (maxHeight !== undefined) {
            clamped = Math.min(maxHeight, clamped);
          }
          return clamped;
        };

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

    // Always attach listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [
    size.width,
    size.height,
    position.x,
    position.y,
    dragBounds,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    withinPortal,
    setPosition,
    setSize,
  ]);

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
    handleMouseDownResizeTopLeft,
    handleMouseDownResizeTop,
    handleMouseDownResizeTopRight,
    handleMouseDownResizeRight,
    handleMouseDownResizeBottomRight,
    handleMouseDownResizeBottom,
    handleMouseDownResizeBottomLeft,
    handleMouseDownResizeLeft,
    handleClose,
    bringToFront,
  } as const;
}
