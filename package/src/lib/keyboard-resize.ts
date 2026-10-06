/** The edge or corner a resize handle sits on. */
export type ResizeDirection =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left';

export interface ResizeGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KeyboardResizeLimits {
  minWidth: number;
  maxWidth?: number;
  minHeight: number;
  maxHeight?: number;
  /**
   * Size of the area the element lives in (the viewport, or its positioned parent).
   * A dimension of 0 means it has not been measured yet: that axis then has no edge limit.
   */
  areaWidth: number;
  areaHeight: number;
}

export interface KeyboardResizeRange {
  min: number;
  /** May be `Infinity` when neither a max size nor a measured area bounds it. */
  max: number;
}

const HORIZONTAL_EDGE: Record<ResizeDirection, 'left' | 'right' | null> = {
  topLeft: 'left',
  top: null,
  topRight: 'right',
  right: 'right',
  bottomRight: 'right',
  bottom: null,
  bottomLeft: 'left',
  left: 'left',
};

const VERTICAL_EDGE: Record<ResizeDirection, 'top' | 'bottom' | null> = {
  topLeft: 'top',
  top: 'top',
  topRight: 'top',
  right: null,
  bottomRight: 'bottom',
  bottom: 'bottom',
  bottomLeft: 'bottom',
  left: null,
};

/** Whether the handle in `direction` changes the width and/or the height. */
export function getResizeAxes(direction: ResizeDirection) {
  return {
    width: HORIZONTAL_EDGE[direction] !== null,
    height: VERTICAL_EDGE[direction] !== null,
  };
}

/**
 * The sizes a keyboard resize may reach from the handle in `direction`: from the min size
 * up to the max size, but never past the edge of the area on the side the handle moves.
 */
export function getKeyboardResizeRange(
  direction: ResizeDirection,
  geometry: ResizeGeometry,
  limits: KeyboardResizeLimits
): { width: KeyboardResizeRange | null; height: KeyboardResizeRange | null } {
  const hEdge = HORIZONTAL_EDGE[direction];
  const vEdge = VERTICAL_EDGE[direction];

  const range = (
    min: number,
    max: number | undefined,
    area: number,
    roomTowardsEdge: number
  ): KeyboardResizeRange => {
    const room = area > 0 ? roomTowardsEdge : Infinity;
    return { min, max: Math.max(min, Math.min(max ?? Infinity, room)) };
  };

  return {
    width:
      hEdge === null
        ? null
        : range(
            limits.minWidth,
            limits.maxWidth,
            limits.areaWidth,
            hEdge === 'right' ? limits.areaWidth - geometry.x : geometry.x + geometry.width
          ),
    height:
      vEdge === null
        ? null
        : range(
            limits.minHeight,
            limits.maxHeight,
            limits.areaHeight,
            vEdge === 'bottom' ? limits.areaHeight - geometry.y : geometry.y + geometry.height
          ),
  };
}

type Change = number | 'min' | 'max';

function resolveDimension(current: number, range: KeyboardResizeRange, change: Change): number {
  if (change === 'min') {
    return range.min;
  }
  if (change === 'max') {
    // Already past the max (the area shrank, or the max was lowered): End leaves it alone.
    return Number.isFinite(range.max) && range.max > current ? range.max : current;
  }
  const next = Math.min(Math.max(current + change, range.min), range.max);
  // A grow key never shrinks and a shrink key never grows, even when the element
  // already sits outside its range.
  if ((change > 0 && next < current) || (change < 0 && next > current)) {
    return current;
  }
  return next;
}

/**
 * Applies one key press to the handle in `direction`. Arrow keys move the handle's edge
 * in the arrow's direction by `step` pixels, so the same key grows the window from the
 * right edge and shrinks it from the left one. Home and End take each dimension the
 * handle controls to its min and max size.
 *
 * Returns `null` when the key does nothing on this handle, so the caller can leave the
 * event alone (an ArrowUp on a right-edge handle should still scroll the page).
 */
export function computeKeyboardResize(
  direction: ResizeDirection,
  key: string,
  step: number,
  geometry: ResizeGeometry,
  limits: KeyboardResizeLimits
): ResizeGeometry | null {
  const hEdge = HORIZONTAL_EDGE[direction];
  const vEdge = VERTICAL_EDGE[direction];

  let widthChange: Change | null = null;
  let heightChange: Change | null = null;

  switch (key) {
    case 'ArrowRight':
      widthChange = hEdge === null ? null : hEdge === 'right' ? step : -step;
      break;
    case 'ArrowLeft':
      widthChange = hEdge === null ? null : hEdge === 'right' ? -step : step;
      break;
    case 'ArrowDown':
      heightChange = vEdge === null ? null : vEdge === 'bottom' ? step : -step;
      break;
    case 'ArrowUp':
      heightChange = vEdge === null ? null : vEdge === 'bottom' ? -step : step;
      break;
    case 'Home':
      widthChange = hEdge === null ? null : 'min';
      heightChange = vEdge === null ? null : 'min';
      break;
    case 'End':
      widthChange = hEdge === null ? null : 'max';
      heightChange = vEdge === null ? null : 'max';
      break;
  }

  if (widthChange === null && heightChange === null) {
    return null;
  }

  const range = getKeyboardResizeRange(direction, geometry, limits);
  const width =
    widthChange === null || !range.width
      ? geometry.width
      : resolveDimension(geometry.width, range.width, widthChange);
  const height =
    heightChange === null || !range.height
      ? geometry.height
      : resolveDimension(geometry.height, range.height, heightChange);

  return {
    // The opposite edge stays put: a left or top handle moves the origin by what it adds.
    x: hEdge === 'left' ? geometry.x + (geometry.width - width) : geometry.x,
    y: vEdge === 'top' ? geometry.y + (geometry.height - height) : geometry.y,
    width,
    height,
  };
}
