import { useMemo } from 'react';
import { convertToPixels } from '../lib/convert-to-pixels';
import type { WindowBounds, WindowPosition, WindowSize } from '../Window';

export interface UseWindowConstraintsOptions {
  position: WindowPosition;
  size: WindowSize;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  dragBounds?: WindowBounds;
  withinPortal?: boolean;
  isMounted: boolean;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export function useWindowConstraints(options: UseWindowConstraintsOptions) {
  const {
    position,
    size,
    minWidth = 250,
    maxWidth,
    minHeight = 100,
    maxHeight,
    dragBounds,
    withinPortal = true,
    isMounted,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
  } = options;

  // Convert position values to pixels
  const positionPx = useMemo(() => {
    // During SSR, return safe default values to avoid hydration mismatch
    if (!isMounted) {
      return {
        x: typeof position.x === 'number' ? position.x : 20,
        y: typeof position.y === 'number' ? position.y : 100,
      };
    }

    const refWidth = withinPortal ? viewportWidth : containerWidth;
    const refHeight = withinPortal ? viewportHeight : containerHeight;

    return {
      x: convertToPixels(position.x, refWidth) ?? 20,
      y: convertToPixels(position.y, refHeight) ?? 100,
    };
  }, [
    position.x,
    position.y,
    withinPortal,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
    isMounted,
  ]);

  // Convert size values to pixels
  const sizePx = useMemo(() => {
    // During SSR, return safe default values to avoid hydration mismatch
    if (!isMounted) {
      return {
        width: typeof size.width === 'number' ? size.width : 400,
        height: typeof size.height === 'number' ? size.height : 400,
      };
    }

    const refWidth = withinPortal ? viewportWidth : containerWidth;
    const refHeight = withinPortal ? viewportHeight : containerHeight;

    return {
      width: convertToPixels(size.width, refWidth) ?? 400,
      height: convertToPixels(size.height, refHeight) ?? 400,
    };
  }, [
    size.width,
    size.height,
    withinPortal,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
    isMounted,
  ]);

  // Memoize converted constraint values to avoid repeated conversions during drag/resize
  const constraintsPx = useMemo(() => {
    const refWidth = withinPortal ? viewportWidth : containerWidth;
    const refHeight = withinPortal ? viewportHeight : containerHeight;

    return {
      minWidth: convertToPixels(minWidth, refWidth) ?? 250,
      maxWidth: convertToPixels(maxWidth, refWidth),
      minHeight: convertToPixels(minHeight, refHeight) ?? 100,
      maxHeight: convertToPixels(maxHeight, refHeight),
      containerMaxWidth: withinPortal ? Infinity : containerWidth,
      containerMaxHeight: withinPortal ? Infinity : containerHeight,
    };
  }, [
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    withinPortal,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
  ]);

  // Memoize converted drag bounds
  const dragBoundsPx = useMemo(() => {
    if (!dragBounds) {
      return null;
    }

    const refWidth = withinPortal ? viewportWidth : containerWidth;
    const refHeight = withinPortal ? viewportHeight : containerHeight;

    return {
      minX: convertToPixels(dragBounds.minX, refWidth),
      maxX: convertToPixels(dragBounds.maxX, refWidth),
      minY: convertToPixels(dragBounds.minY, refHeight),
      maxY: convertToPixels(dragBounds.maxY, refHeight),
    };
  }, [dragBounds, withinPortal, viewportWidth, viewportHeight, containerWidth, containerHeight]);

  return {
    positionPx,
    sizePx,
    constraintsPx,
    dragBoundsPx,
  };
}
