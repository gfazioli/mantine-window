import { useCallback, useMemo, useRef } from 'react';
import { clampHeight, clampWidth, type SizeConstraints } from '../lib/window-constraints';
import type { WindowPosition, WindowSize } from '../Window';

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

export interface UseWindowResizeOptions {
  positionPx: { x: number; y: number };
  sizePx: { width: number; height: number };
  constraintsPx: SizeConstraints;
  setPosition: (position: WindowPosition) => void;
  setSize: (size: WindowSize) => void;
  bringToFront: () => void;
}

export function useWindowResize(options: UseWindowResizeOptions) {
  const { positionPx, sizePx, constraintsPx, setPosition, setSize, bringToFront } = options;

  const isResizing = useRef(false);
  const resizeDirection = useRef<ResizeDirection | ''>('');
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const handleResize = useCallback(
    (clientX: number, clientY: number) => {
      const deltaX = clientX - resizeStart.current.x;
      const deltaY = clientY - resizeStart.current.y;

      let newWidth = sizePx.width;
      let newHeight = sizePx.height;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;

      const containerMaxWidth = constraintsPx.containerMaxWidth;
      const containerMaxHeight = constraintsPx.containerMaxHeight;

      switch (resizeDirection.current) {
        case 'topLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX, constraintsPx);
          newHeight = clampHeight(resizeStart.current.height - deltaY, constraintsPx);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = clampWidth(newWidth + newX, constraintsPx);
            newX = 0;
          }
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = clampHeight(newHeight + newY, constraintsPx);
            newY = 0;
          }
          break;

        case 'top':
          newHeight = clampHeight(resizeStart.current.height - deltaY, constraintsPx);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = clampHeight(newHeight + newY, constraintsPx);
            newY = 0;
          }
          break;

        case 'topRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX, constraintsPx);
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          newHeight = clampHeight(resizeStart.current.height - deltaY, constraintsPx);
          newY = resizeStart.current.posY + (resizeStart.current.height - newHeight);
          if (containerMaxHeight !== Infinity && newY < 0) {
            newHeight = clampHeight(newHeight + newY, constraintsPx);
            newY = 0;
          }
          break;

        case 'right':
          newWidth = clampWidth(resizeStart.current.width + deltaX, constraintsPx);
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          break;

        case 'bottomRight':
          newWidth = clampWidth(resizeStart.current.width + deltaX, constraintsPx);
          if (containerMaxWidth !== Infinity && newX + newWidth > containerMaxWidth) {
            newWidth = containerMaxWidth - newX;
          }
          newHeight = clampHeight(resizeStart.current.height + deltaY, constraintsPx);
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          break;

        case 'bottom':
          newHeight = clampHeight(resizeStart.current.height + deltaY, constraintsPx);
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          break;

        case 'bottomLeft':
          newWidth = clampWidth(resizeStart.current.width - deltaX, constraintsPx);
          newHeight = clampHeight(resizeStart.current.height + deltaY, constraintsPx);
          if (containerMaxHeight !== Infinity && newY + newHeight > containerMaxHeight) {
            newHeight = containerMaxHeight - newY;
          }
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = clampWidth(newWidth + newX, constraintsPx);
            newX = 0;
          }
          break;

        case 'left':
          newWidth = clampWidth(resizeStart.current.width - deltaX, constraintsPx);
          newX = resizeStart.current.posX + (resizeStart.current.width - newWidth);
          if (containerMaxWidth !== Infinity && newX < 0) {
            newWidth = clampWidth(newWidth + newX, constraintsPx);
            newX = 0;
          }
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      if (newX !== resizeStart.current.posX || newY !== resizeStart.current.posY) {
        setPosition({ x: newX, y: newY });
      }
    },
    [sizePx, constraintsPx, setSize, setPosition]
  );

  const createResizeHandlers = useCallback(
    (direction: ResizeDirection): ResizeHandlers => {
      const onMouseDown = (e: React.MouseEvent) => {
        bringToFront();
        isResizing.current = true;
        resizeDirection.current = direction;
        resizeStart.current = {
          x: e.clientX,
          y: e.clientY,
          width: sizePx.width,
          height: sizePx.height,
          posX: positionPx.x,
          posY: positionPx.y,
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
          width: sizePx.width,
          height: sizePx.height,
          posX: positionPx.x,
          posY: positionPx.y,
        };
        document.body.style.userSelect = 'none';
        e.stopPropagation();
      };

      return { onMouseDown, onTouchStart };
    },
    [sizePx, positionPx, bringToFront]
  );

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

  const handleResizeEnd = useCallback(() => {
    isResizing.current = false;
  }, []);

  return {
    isResizing,
    resizeHandlers,
    handleResize,
    handleResizeEnd,
  };
}
