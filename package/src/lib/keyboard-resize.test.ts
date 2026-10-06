import {
  computeKeyboardResize,
  getKeyboardResizeRange,
  getResizeAxes,
  type KeyboardResizeLimits,
} from './keyboard-resize';

const geometry = { x: 100, y: 50, width: 400, height: 300 };

const limits: KeyboardResizeLimits = {
  minWidth: 250,
  minHeight: 100,
  areaWidth: 1000,
  areaHeight: 800,
};

describe('getResizeAxes', () => {
  it('maps edges and corners to the dimensions they change', () => {
    expect(getResizeAxes('right')).toEqual({ width: true, height: false });
    expect(getResizeAxes('bottom')).toEqual({ width: false, height: true });
    expect(getResizeAxes('bottomRight')).toEqual({ width: true, height: true });
    expect(getResizeAxes('topLeft')).toEqual({ width: true, height: true });
  });
});

describe('getKeyboardResizeRange', () => {
  it('stops at the boundary edge on the side the handle moves', () => {
    const range = getKeyboardResizeRange('bottomRight', geometry, limits);
    // Right edge can travel to x = 1000, bottom edge to y = 800.
    expect(range.width).toEqual({ min: 250, max: 900 });
    expect(range.height).toEqual({ min: 100, max: 750 });
  });

  it('measures the room on the left / top for handles on those edges', () => {
    const range = getKeyboardResizeRange('topLeft', geometry, limits);
    // The opposite edges stay at x = 500 and y = 350.
    expect(range.width).toEqual({ min: 250, max: 500 });
    expect(range.height).toEqual({ min: 100, max: 350 });
  });

  it('takes the smaller of the max size and the room to the edge', () => {
    const range = getKeyboardResizeRange('right', geometry, { ...limits, maxWidth: 600 });
    expect(range.width).toEqual({ min: 250, max: 600 });
    expect(range.height).toBeNull();
  });

  it('has no edge limit while the boundary is unmeasured', () => {
    const range = getKeyboardResizeRange('bottomRight', geometry, {
      ...limits,
      areaWidth: 0,
      areaHeight: 0,
    });
    expect(range.width?.max).toBe(Infinity);
    expect(range.height?.max).toBe(Infinity);
  });

  it('lets the edge win over the min size, as a pointer resize does', () => {
    // 100px of room to the right edge, below the 250px min.
    const range = getKeyboardResizeRange('right', { ...geometry, x: 900 }, limits);
    expect(range.width).toEqual({ min: 100, max: 100 });
  });

  it('lets the max size win over the min size, as a pointer resize does', () => {
    const range = getKeyboardResizeRange('right', geometry, { ...limits, maxWidth: 200 });
    expect(range.width).toEqual({ min: 200, max: 200 });
  });

  it('floors the range at 0 when the origin is already past the edge', () => {
    const range = getKeyboardResizeRange('right', { ...geometry, x: 1200 }, limits);
    expect(range.width).toEqual({ min: 0, max: 0 });
  });
});

describe('computeKeyboardResize', () => {
  it('grows and shrinks the width from a right-edge handle', () => {
    expect(computeKeyboardResize('right', 'ArrowRight', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 410,
    });
    expect(computeKeyboardResize('right', 'ArrowLeft', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 390,
    });
  });

  it('moves a left edge in the arrow direction and keeps the right edge in place', () => {
    const grown = computeKeyboardResize('left', 'ArrowLeft', 10, geometry, limits);
    expect(grown).toEqual({ ...geometry, x: 90, width: 410 });
    expect(grown!.x + grown!.width).toBe(geometry.x + geometry.width);

    expect(computeKeyboardResize('left', 'ArrowRight', 10, geometry, limits)).toEqual({
      ...geometry,
      x: 110,
      width: 390,
    });
  });

  it('moves a top edge in the arrow direction and keeps the bottom edge in place', () => {
    expect(computeKeyboardResize('top', 'ArrowUp', 10, geometry, limits)).toEqual({
      ...geometry,
      y: 40,
      height: 310,
    });
  });

  it('resizes both dimensions from a corner, one key at a time', () => {
    expect(computeKeyboardResize('bottomRight', 'ArrowDown', 10, geometry, limits)).toEqual({
      ...geometry,
      height: 310,
    });
    expect(computeKeyboardResize('bottomRight', 'ArrowRight', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 410,
    });
  });

  it('returns null for keys the handle does not use', () => {
    expect(computeKeyboardResize('right', 'ArrowUp', 10, geometry, limits)).toBeNull();
    expect(computeKeyboardResize('bottom', 'ArrowLeft', 10, geometry, limits)).toBeNull();
    expect(computeKeyboardResize('bottomRight', 'Enter', 10, geometry, limits)).toBeNull();
  });

  it('clamps to the min size and to the boundary edge', () => {
    const atMin = { ...geometry, width: 255 };
    expect(computeKeyboardResize('right', 'ArrowLeft', 10, atMin, limits)!.width).toBe(250);

    const nearEdge = { ...geometry, width: 895 };
    expect(computeKeyboardResize('right', 'ArrowRight', 10, nearEdge, limits)!.width).toBe(900);
  });

  it('sends Home to the min size and End to the max size of each controlled dimension', () => {
    expect(computeKeyboardResize('bottomRight', 'Home', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 250,
      height: 100,
    });
    expect(computeKeyboardResize('bottomRight', 'End', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 900,
      height: 750,
    });
    expect(computeKeyboardResize('right', 'End', 10, geometry, limits)).toEqual({
      ...geometry,
      width: 900,
    });
  });

  it('leaves End alone when nothing bounds the size', () => {
    const unbounded = { ...limits, areaWidth: 0 };
    expect(computeKeyboardResize('right', 'End', 10, geometry, unbounded)).toEqual(geometry);
  });

  it('never shrinks on a grow key, nor on End, when the element already overflows its range', () => {
    // Right edge at 1100, past the 1000px boundary.
    const overflowing = { ...geometry, x: 700, width: 400 };
    expect(computeKeyboardResize('right', 'ArrowRight', 10, overflowing, limits)).toEqual(
      overflowing
    );
    expect(computeKeyboardResize('right', 'End', 10, overflowing, limits)).toEqual(overflowing);
    // A shrink key still works from there, one step at a time.
    expect(computeKeyboardResize('right', 'ArrowLeft', 10, overflowing, limits)!.width).toBe(390);
  });

  it('never grows past maxWidth, nor makes Home grow, when the max is below the min', () => {
    const atMax = { ...geometry, width: 200 };
    const capped = { ...limits, maxWidth: 200 };
    expect(computeKeyboardResize('right', 'ArrowRight', 10, atMax, capped)).toEqual(atMax);
    expect(computeKeyboardResize('right', 'Home', 10, atMax, capped)).toEqual(atMax);
    expect(computeKeyboardResize('right', 'ArrowLeft', 10, atMax, capped)).toEqual(atMax);
  });

  it('does not push the edge out of the area when there is less room than the min size', () => {
    // Right edge at exactly 1000, width already under the 250px min.
    const squeezed = { ...geometry, x: 800, width: 200 };
    expect(computeKeyboardResize('right', 'ArrowRight', 10, squeezed, limits)).toEqual(squeezed);
    expect(computeKeyboardResize('right', 'End', 10, squeezed, limits)).toEqual(squeezed);
  });

  it('never grows on a shrink key when the element is below its min size', () => {
    const tooSmall = { ...geometry, width: 200 };
    expect(computeKeyboardResize('right', 'ArrowLeft', 10, tooSmall, limits)).toEqual(tooSmall);
    // Home still takes it to the min.
    expect(computeKeyboardResize('right', 'Home', 10, tooSmall, limits)!.width).toBe(250);
  });
});
