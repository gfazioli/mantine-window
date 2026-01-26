import {
  applyDragBounds,
  clampHeight,
  clampWidth,
  type DragConstraints,
  type SizeConstraints,
} from './window-constraints';

describe('window-constraints', () => {
  describe('clampWidth', () => {
    const baseConstraints: SizeConstraints = {
      minWidth: 200,
      maxWidth: 800,
      minHeight: 100,
      maxHeight: 600,
      containerMaxWidth: Infinity,
      containerMaxHeight: Infinity,
    };

    it('should return width when within min and max bounds', () => {
      expect(clampWidth(400, baseConstraints)).toBe(400);
      expect(clampWidth(500, baseConstraints)).toBe(500);
    });

    it('should clamp to minWidth when below minimum', () => {
      expect(clampWidth(100, baseConstraints)).toBe(200);
      expect(clampWidth(0, baseConstraints)).toBe(200);
      expect(clampWidth(-50, baseConstraints)).toBe(200);
    });

    it('should clamp to maxWidth when above maximum', () => {
      expect(clampWidth(900, baseConstraints)).toBe(800);
      expect(clampWidth(1000, baseConstraints)).toBe(800);
    });

    it('should respect minWidth when maxWidth is undefined', () => {
      const constraintsNoMax: SizeConstraints = {
        ...baseConstraints,
        maxWidth: undefined,
      };
      expect(clampWidth(100, constraintsNoMax)).toBe(200);
      expect(clampWidth(5000, constraintsNoMax)).toBe(5000);
    });

    it('should constrain to containerMaxWidth when not using portal', () => {
      const constraintsWithContainer: SizeConstraints = {
        ...baseConstraints,
        containerMaxWidth: 500,
      };
      expect(clampWidth(600, constraintsWithContainer)).toBe(500);
      expect(clampWidth(400, constraintsWithContainer)).toBe(400);
    });

    it('should prioritize smaller constraint when both maxWidth and containerMaxWidth exist', () => {
      const constraintsWithBoth: SizeConstraints = {
        ...baseConstraints,
        maxWidth: 800,
        containerMaxWidth: 600,
      };
      expect(clampWidth(700, constraintsWithBoth)).toBe(600);

      const constraintsMaxSmaller: SizeConstraints = {
        ...baseConstraints,
        maxWidth: 500,
        containerMaxWidth: 800,
      };
      expect(clampWidth(700, constraintsMaxSmaller)).toBe(500);
    });

    it('should handle edge case with minWidth equal to maxWidth', () => {
      const constraintsEqual: SizeConstraints = {
        ...baseConstraints,
        minWidth: 400,
        maxWidth: 400,
      };
      expect(clampWidth(300, constraintsEqual)).toBe(400);
      expect(clampWidth(400, constraintsEqual)).toBe(400);
      expect(clampWidth(500, constraintsEqual)).toBe(400);
    });

    it('should handle very large values', () => {
      expect(clampWidth(Infinity, baseConstraints)).toBe(800);
      expect(clampWidth(Number.MAX_SAFE_INTEGER, baseConstraints)).toBe(800);
    });

    it('should handle zero and negative values', () => {
      expect(clampWidth(0, baseConstraints)).toBe(200);
      expect(clampWidth(-100, baseConstraints)).toBe(200);
      expect(clampWidth(-Infinity, baseConstraints)).toBe(200);
    });
  });

  describe('clampHeight', () => {
    const baseConstraints: SizeConstraints = {
      minWidth: 200,
      maxWidth: 800,
      minHeight: 150,
      maxHeight: 700,
      containerMaxWidth: Infinity,
      containerMaxHeight: Infinity,
    };

    it('should return height when within min and max bounds', () => {
      expect(clampHeight(300, baseConstraints)).toBe(300);
      expect(clampHeight(500, baseConstraints)).toBe(500);
    });

    it('should clamp to minHeight when below minimum', () => {
      expect(clampHeight(100, baseConstraints)).toBe(150);
      expect(clampHeight(0, baseConstraints)).toBe(150);
      expect(clampHeight(-50, baseConstraints)).toBe(150);
    });

    it('should clamp to maxHeight when above maximum', () => {
      expect(clampHeight(800, baseConstraints)).toBe(700);
      expect(clampHeight(1000, baseConstraints)).toBe(700);
    });

    it('should respect minHeight when maxHeight is undefined', () => {
      const constraintsNoMax: SizeConstraints = {
        ...baseConstraints,
        maxHeight: undefined,
      };
      expect(clampHeight(100, constraintsNoMax)).toBe(150);
      expect(clampHeight(5000, constraintsNoMax)).toBe(5000);
    });

    it('should constrain to containerMaxHeight when not using portal', () => {
      const constraintsWithContainer: SizeConstraints = {
        ...baseConstraints,
        containerMaxHeight: 500,
      };
      expect(clampHeight(600, constraintsWithContainer)).toBe(500);
      expect(clampHeight(400, constraintsWithContainer)).toBe(400);
    });

    it('should prioritize smaller constraint when both maxHeight and containerMaxHeight exist', () => {
      const constraintsWithBoth: SizeConstraints = {
        ...baseConstraints,
        maxHeight: 700,
        containerMaxHeight: 600,
      };
      expect(clampHeight(650, constraintsWithBoth)).toBe(600);

      const constraintsMaxSmaller: SizeConstraints = {
        ...baseConstraints,
        maxHeight: 500,
        containerMaxHeight: 800,
      };
      expect(clampHeight(650, constraintsMaxSmaller)).toBe(500);
    });

    it('should handle edge case with minHeight equal to maxHeight', () => {
      const constraintsEqual: SizeConstraints = {
        ...baseConstraints,
        minHeight: 400,
        maxHeight: 400,
      };
      expect(clampHeight(300, constraintsEqual)).toBe(400);
      expect(clampHeight(400, constraintsEqual)).toBe(400);
      expect(clampHeight(500, constraintsEqual)).toBe(400);
    });

    it('should handle very large values', () => {
      expect(clampHeight(Infinity, baseConstraints)).toBe(700);
      expect(clampHeight(Number.MAX_SAFE_INTEGER, baseConstraints)).toBe(700);
    });

    it('should handle zero and negative values', () => {
      expect(clampHeight(0, baseConstraints)).toBe(150);
      expect(clampHeight(-100, baseConstraints)).toBe(150);
      expect(clampHeight(-Infinity, baseConstraints)).toBe(150);
    });
  });

  describe('applyDragBounds', () => {
    const baseConstraints: DragConstraints = {
      dragBounds: null,
      withinPortal: true,
      windowWidth: 400,
      windowHeight: 300,
      viewportWidth: 1920,
      viewportHeight: 1080,
      containerWidth: 1000,
      containerHeight: 800,
    };

    describe('with dragBounds specified', () => {
      it('should clamp to all specified bounds', () => {
        const constraintsWithBounds: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: 100,
            maxX: 1500,
            minY: 50,
            maxY: 700,
          },
        };

        expect(applyDragBounds(200, 100, constraintsWithBounds)).toEqual({ x: 200, y: 100 });
        expect(applyDragBounds(50, 30, constraintsWithBounds)).toEqual({ x: 100, y: 50 });
        expect(applyDragBounds(1600, 800, constraintsWithBounds)).toEqual({ x: 1500, y: 700 });
      });

      it('should handle partial bounds (only minX and minY)', () => {
        const constraintsMinOnly: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: 100,
            minY: 50,
          },
        };

        expect(applyDragBounds(50, 30, constraintsMinOnly)).toEqual({ x: 100, y: 50 });
        expect(applyDragBounds(500, 200, constraintsMinOnly)).toEqual({ x: 500, y: 200 });
      });

      it('should handle partial bounds (only maxX and maxY)', () => {
        const constraintsMaxOnly: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            maxX: 1500,
            maxY: 700,
          },
        };

        expect(applyDragBounds(1600, 800, constraintsMaxOnly)).toEqual({ x: 1500, y: 700 });
        expect(applyDragBounds(500, 200, constraintsMaxOnly)).toEqual({ x: 500, y: 200 });
      });

      it('should handle bounds with minX equal to maxX', () => {
        const constraintsEqualX: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: 500,
            maxX: 500,
            minY: 100,
            maxY: 600,
          },
        };

        expect(applyDragBounds(400, 200, constraintsEqualX)).toEqual({ x: 500, y: 200 });
        expect(applyDragBounds(500, 200, constraintsEqualX)).toEqual({ x: 500, y: 200 });
        expect(applyDragBounds(600, 200, constraintsEqualX)).toEqual({ x: 500, y: 200 });
      });

      it('should handle negative bounds', () => {
        const constraintsNegative: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: -100,
            maxX: 200,
            minY: -50,
            maxY: 150,
          },
        };

        expect(applyDragBounds(-150, -80, constraintsNegative)).toEqual({ x: -100, y: -50 });
        expect(applyDragBounds(0, 0, constraintsNegative)).toEqual({ x: 0, y: 0 });
        expect(applyDragBounds(300, 200, constraintsNegative)).toEqual({ x: 200, y: 150 });
      });
    });

    describe('without dragBounds and withinPortal=true (viewport bounds)', () => {
      it('should constrain to viewport dimensions', () => {
        const result = applyDragBounds(100, 100, baseConstraints);
        expect(result).toEqual({ x: 100, y: 100 });
      });

      it('should prevent negative coordinates', () => {
        const result = applyDragBounds(-50, -30, baseConstraints);
        expect(result).toEqual({ x: 0, y: 0 });
      });

      it('should prevent window from going beyond viewport right edge', () => {
        const result = applyDragBounds(2000, 100, baseConstraints);
        // maxX = viewportWidth - windowWidth = 1920 - 400 = 1520
        expect(result).toEqual({ x: 1520, y: 100 });
      });

      it('should prevent window from going beyond viewport bottom edge', () => {
        const result = applyDragBounds(100, 2000, baseConstraints);
        // maxY = viewportHeight - windowHeight = 1080 - 300 = 780
        expect(result).toEqual({ x: 100, y: 780 });
      });

      it('should handle corner cases (both edges exceeded)', () => {
        const result = applyDragBounds(-100, -50, baseConstraints);
        expect(result).toEqual({ x: 0, y: 0 });

        const result2 = applyDragBounds(3000, 2000, baseConstraints);
        expect(result2).toEqual({ x: 1520, y: 780 });
      });

      it('should handle window larger than viewport', () => {
        const constraintsLargeWindow: DragConstraints = {
          ...baseConstraints,
          windowWidth: 2500,
          windowHeight: 1500,
        };

        // When window is larger, maxX/maxY become negative, clamped to 0
        const result = applyDragBounds(100, 100, constraintsLargeWindow);
        expect(result).toEqual({ x: 0, y: 0 });
      });
    });

    describe('without dragBounds and withinPortal=false (container bounds)', () => {
      const containerConstraints: DragConstraints = {
        ...baseConstraints,
        withinPortal: false,
      };

      it('should constrain to container dimensions', () => {
        const result = applyDragBounds(100, 100, containerConstraints);
        expect(result).toEqual({ x: 100, y: 100 });
      });

      it('should prevent negative coordinates in container', () => {
        const result = applyDragBounds(-50, -30, containerConstraints);
        expect(result).toEqual({ x: 0, y: 0 });
      });

      it('should prevent window from going beyond container right edge', () => {
        const result = applyDragBounds(800, 100, containerConstraints);
        // maxX = containerWidth - windowWidth = 1000 - 400 = 600
        expect(result).toEqual({ x: 600, y: 100 });
      });

      it('should prevent window from going beyond container bottom edge', () => {
        const result = applyDragBounds(100, 700, containerConstraints);
        // maxY = containerHeight - windowHeight = 800 - 300 = 500
        expect(result).toEqual({ x: 100, y: 500 });
      });

      it('should handle window larger than container', () => {
        const constraintsLargeWindow: DragConstraints = {
          ...containerConstraints,
          windowWidth: 1500,
          windowHeight: 1200,
        };

        const result = applyDragBounds(100, 100, constraintsLargeWindow);
        expect(result).toEqual({ x: 0, y: 0 });
      });
    });

    describe('edge cases', () => {
      it('should handle zero dimensions', () => {
        const constraintsZero: DragConstraints = {
          ...baseConstraints,
          windowWidth: 0,
          windowHeight: 0,
        };

        const result = applyDragBounds(100, 100, constraintsZero);
        expect(result).toEqual({ x: 100, y: 100 });
      });

      it('should handle Infinity values in dragBounds', () => {
        const constraintsInfinity: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: -Infinity,
            maxX: Infinity,
            minY: -Infinity,
            maxY: Infinity,
          },
        };

        const result = applyDragBounds(10000, 10000, constraintsInfinity);
        expect(result).toEqual({ x: 10000, y: 10000 });
      });

      it('should handle very large coordinate values', () => {
        const result = applyDragBounds(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, {
          ...baseConstraints,
          dragBounds: null,
        });
        expect(result.x).toBeLessThanOrEqual(baseConstraints.viewportWidth);
        expect(result.y).toBeLessThanOrEqual(baseConstraints.viewportHeight);
      });

      it('should handle decimal coordinates', () => {
        const constraintsWithBounds: DragConstraints = {
          ...baseConstraints,
          dragBounds: {
            minX: 10.5,
            maxX: 100.7,
            minY: 20.3,
            maxY: 200.9,
          },
        };

        const result = applyDragBounds(50.6, 100.2, constraintsWithBounds);
        expect(result).toEqual({ x: 50.6, y: 100.2 });
      });
    });
  });
});
