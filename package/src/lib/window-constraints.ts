export interface SizeConstraints {
  minWidth: number;
  maxWidth?: number;
  minHeight: number;
  maxHeight?: number;
  containerMaxWidth: number;
  containerMaxHeight: number;
}

/**
 * Clamps a width value within the specified constraints
 */
export function clampWidth(width: number, constraints: SizeConstraints): number {
  let clamped = Math.max(constraints.minWidth, width);

  if (constraints.maxWidth !== undefined) {
    clamped = Math.min(constraints.maxWidth, clamped);
  }

  // Constrain to container size when not using portal
  if (constraints.containerMaxWidth !== Infinity) {
    clamped = Math.min(clamped, constraints.containerMaxWidth);
  }

  return clamped;
}

/**
 * Clamps a height value within the specified constraints
 */
export function clampHeight(height: number, constraints: SizeConstraints): number {
  let clamped = Math.max(constraints.minHeight, height);

  if (constraints.maxHeight !== undefined) {
    clamped = Math.min(constraints.maxHeight, clamped);
  }

  // Constrain to container size when not using portal
  if (constraints.containerMaxHeight !== Infinity) {
    clamped = Math.min(clamped, constraints.containerMaxHeight);
  }

  return clamped;
}

export interface DragBounds {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export interface DragConstraints {
  dragBounds: DragBounds | null;
  withinPortal: boolean;
  windowWidth: number;
  windowHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth: number;
  containerHeight: number;
  /**
   * With `dragBounds`, also keeps the window inside the viewport or container: `dragBounds` can
   * then only narrow it, and the boundary wins when the two disagree (bounds designed for a wide
   * screen, on a phone). A boundary of `0` (not measured yet) is ignored.
   */
  keepInBounds?: boolean;
}

/** Keeps a coordinate inside an area: never past its far edge, and never below 0. */
export function clampToArea(value: number, areaSize: number, size: number): number {
  return Math.max(0, Math.min(value, areaSize - size));
}

/**
 * Applies drag boundaries to position coordinates
 */
export function applyDragBounds(
  x: number,
  y: number,
  constraints: DragConstraints
): { x: number; y: number } {
  const { dragBounds, windowWidth, windowHeight } = constraints;
  const areaWidth = constraints.withinPortal
    ? constraints.viewportWidth
    : constraints.containerWidth;
  const areaHeight = constraints.withinPortal
    ? constraints.viewportHeight
    : constraints.containerHeight;

  if (!dragBounds) {
    return {
      x: clampToArea(x, areaWidth, windowWidth),
      y: clampToArea(y, areaHeight, windowHeight),
    };
  }

  let boundedX = x;
  let boundedY = y;

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

  if (constraints.keepInBounds) {
    if (areaWidth > 0) {
      boundedX = clampToArea(boundedX, areaWidth, windowWidth);
    }
    if (areaHeight > 0) {
      boundedY = clampToArea(boundedY, areaHeight, windowHeight);
    }
  }

  return { x: boundedX, y: boundedY };
}
