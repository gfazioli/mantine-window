import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { WindowBaseProps } from '../Window';

const MIN_WIDTH = 250;
const MIN_HEIGHT = 100;
const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 400;

export function useMantineWindow(props: WindowBaseProps) {
  const { title } = props;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [zIndex, setZIndex] = useState(9998);

  const key = title.toLocaleLowerCase().replace(/\s+/g, '-');

  const [position, setPosition] = useLocalStorage({
    key: `${key}-debug-position`,
    defaultValue: { x: 20, y: 100 },
    getInitialValueInEffect: false,
  });

  const [size, setSize] = useLocalStorage({
    key: `${key}-debug-size`,
    defaultValue: { width: INITIAL_WIDTH, height: INITIAL_HEIGHT },
    getInitialValueInEffect: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
        setZIndex(9998);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize position on client side only
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      //setPosition({ x: 20, y: Math.max(100, window.innerHeight - 500) });
    }
  }, []);

  const bringToFront = useCallback(() => {
    setZIndex(9999);
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
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    },
    [position, bringToFront]
  );

  // Handle resizing
  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      bringToFront();
      isResizing.current = true;
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      };
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    },
    [size, bringToFront]
  );

  // Mouse move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const newX = Math.max(
          0,
          Math.min(e.clientX - dragStart.current.x, window.innerWidth - size.width)
        );
        const newY = Math.max(
          0,
          Math.min(e.clientY - dragStart.current.y, window.innerHeight - 50)
        );

        setPosition({ x: newX, y: newY });
      }

      if (isResizing.current) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        const newWidth = Math.max(MIN_WIDTH, resizeStart.current.width + deltaX);
        const newHeight = Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY);

        setSize({ width: newWidth, height: newHeight });
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
      document.body.style.cursor = '';
    };
  }, [size.width, size.height]);

  return {
    isCollapsed,
    setIsCollapsed,
    isVisible,
    setIsVisible,
    zIndex,
    position,
    size,
    isMounted,
    windowRef,
    handleMouseDownDrag,
    handleMouseDownResize,
    bringToFront,
  } as const;
}
