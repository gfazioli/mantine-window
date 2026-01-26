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
}

/**
 * Applies drag boundaries to position coordinates
 */
export function applyDragBounds(
  x: number,
  y: number,
  constraints: DragConstraints
): { x: number; y: number } {
  let boundedX = x;
  let boundedY = y;

  if (constraints.dragBounds) {
    // Use converted bounds
    if (constraints.dragBounds.minX !== undefined) {
      boundedX = Math.max(constraints.dragBounds.minX, boundedX);
    }
    if (constraints.dragBounds.maxX !== undefined) {
      boundedX = Math.min(constraints.dragBounds.maxX, boundedX);
    }
    if (constraints.dragBounds.minY !== undefined) {
      boundedY = Math.max(constraints.dragBounds.minY, boundedY);
    }
    if (constraints.dragBounds.maxY !== undefined) {
      boundedY = Math.min(constraints.dragBounds.maxY, boundedY);
    }
  } else if (constraints.withinPortal) {
    // Global viewport bounds
    boundedX = Math.max(0, Math.min(boundedX, constraints.viewportWidth - constraints.windowWidth));
    boundedY = Math.max(
      0,
      Math.min(boundedY, constraints.viewportHeight - constraints.windowHeight)
    );
  } else {
    // Parent container bounds
    boundedX = Math.max(
      0,
      Math.min(boundedX, constraints.containerWidth - constraints.windowWidth)
    );
    boundedY = Math.max(
      0,
      Math.min(boundedY, constraints.containerHeight - constraints.windowHeight)
    );
  }

  return { x: boundedX, y: boundedY };
}
