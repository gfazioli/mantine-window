import { convertToPixels } from './convert-to-pixels';

describe('convertToPixels', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  it('should return undefined for undefined input', () => {
    expect(convertToPixels(undefined)).toBeUndefined();
  });

  it('should return number as is', () => {
    expect(convertToPixels(300)).toBe(300);
    expect(convertToPixels(0)).toBe(0);
    expect(convertToPixels(1000)).toBe(1000);
  });

  it('should parse px values', () => {
    expect(convertToPixels('300px')).toBe(300);
    expect(convertToPixels('100.5px')).toBe(100.5);
    expect(convertToPixels('0px')).toBe(0);
  });

  it('should convert vh values', () => {
    expect(convertToPixels('50vh')).toBe(540); // 50% of 1080
    expect(convertToPixels('100vh')).toBe(1080); // 100% of 1080
    expect(convertToPixels('25vh')).toBe(270); // 25% of 1080
  });

  it('should convert vw values', () => {
    expect(convertToPixels('50vw')).toBe(960); // 50% of 1920
    expect(convertToPixels('100vw')).toBe(1920); // 100% of 1920
    expect(convertToPixels('25vw')).toBe(480); // 25% of 1920
  });

  it('should handle percentage with reference size', () => {
    expect(convertToPixels('50%', 800)).toBe(400);
    expect(convertToPixels('100%', 500)).toBe(500);
    expect(convertToPixels('25%', 1000)).toBe(250);
  });

  it('should parse percentage without reference size as number', () => {
    // parseFloat('50%') returns 50, which is the expected behavior
    expect(convertToPixels('50%')).toBe(50);
  });

  it('should handle string numbers without units', () => {
    expect(convertToPixels('300')).toBe(300);
    expect(convertToPixels('100.5')).toBe(100.5);
  });

  it('should return undefined for invalid values', () => {
    expect(convertToPixels('invalid')).toBeUndefined();
    expect(convertToPixels('abc123')).toBeUndefined();
  });

  it('should trim whitespace', () => {
    expect(convertToPixels(' 300px ')).toBe(300);
    expect(convertToPixels(' 50vh ')).toBe(540);
    expect(convertToPixels(' 50vw ')).toBe(960);
  });

  it('should handle negative values', () => {
    expect(convertToPixels('-10px')).toBe(-10);
    expect(convertToPixels('-5vh')).toBe(-54); // -5% of 1080
    expect(convertToPixels('-20vw')).toBe(-384); // -20% of 1920
    expect(convertToPixels('-50%', 800)).toBe(-400);
  });

  it('should return undefined for NaN in unit strings', () => {
    // parseFloat('NaNvh') returns NaN, should return undefined
    expect(convertToPixels('NaNvh')).toBeUndefined();
    expect(convertToPixels('NaNvw')).toBeUndefined();
    expect(convertToPixels('NaNpx')).toBeUndefined();
    expect(convertToPixels('NaN%', 800)).toBeUndefined();
  });

  it('should return undefined for Infinity in unit strings', () => {
    // parseFloat('Infinitypx') returns Infinity, but result should be undefined
    expect(convertToPixels('Infinitypx')).toBeUndefined();
    expect(convertToPixels('Infinityvh')).toBeUndefined();
    expect(convertToPixels('Infinityvw')).toBeUndefined();
    expect(convertToPixels('Infinity%', 800)).toBeUndefined();
  });

  it('should return undefined for -Infinity in unit strings', () => {
    // parseFloat('-Infinitypx') returns -Infinity, should return undefined
    expect(convertToPixels('-Infinitypx')).toBeUndefined();
    expect(convertToPixels('-Infinityvh')).toBeUndefined();
    expect(convertToPixels('-Infinityvw')).toBeUndefined();
    expect(convertToPixels('-Infinity%', 800)).toBeUndefined();
  });

  it('should handle malformed unit strings', () => {
    // These start with non-numeric characters, parseFloat returns NaN
    expect(convertToPixels('abcpx')).toBeUndefined();
    expect(convertToPixels('xvh')).toBeUndefined();
    expect(convertToPixels('testvw')).toBeUndefined();
  });

  it('should handle zero with units', () => {
    expect(convertToPixels('0px')).toBe(0);
    expect(convertToPixels('0vh')).toBe(0);
    expect(convertToPixels('0vw')).toBe(0);
    expect(convertToPixels('0%', 1000)).toBe(0);
  });

  it('should handle very large numbers', () => {
    expect(convertToPixels('999999px')).toBe(999999);
    expect(convertToPixels('1000vh')).toBe(10800); // 1000% of 1080
    expect(convertToPixels('500vw')).toBe(9600); // 500% of 1920
  });

  it('should handle decimal values with units', () => {
    expect(convertToPixels('10.5px')).toBe(10.5);
    expect(convertToPixels('33.33vh')).toBeCloseTo(359.964, 2); // 33.33% of 1080
    expect(convertToPixels('25.5vw')).toBe(489.6); // 25.5% of 1920
    expect(convertToPixels('12.5%', 800)).toBe(100);
  });
});
