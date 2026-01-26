/**
 * Converts a CSS value (number, px, vh, vw, %) to pixels
 * @param value - The value to convert (number or string with units)
 * @param referenceSize - Optional reference size for percentage calculations
 * @returns The value in pixels, or undefined if the value cannot be converted
 *
 * Supported units:
 * - Pixels: number or 'px' string (e.g., 300 or '300px')
 * - Viewport width: 'vw' string (e.g., '50vw' = 50% of viewport width)
 * - Viewport height: 'vh' string (e.g., '30vh' = 30% of viewport height)
 * - Percentages: '%' string (e.g., '80%' = 80% of referenceSize, requires referenceSize parameter)
 *
 * @example
 * convertToPixels(300) // 300
 * convertToPixels('300px') // 300
 * convertToPixels('50vh') // 540 (if viewport height is 1080px)
 * convertToPixels('80vw') // 1536 (if viewport width is 1920px)
 * convertToPixels('50%', 800) // 400 (50% of 800)
 * convertToPixels('50%') // undefined (percentage without referenceSize)
 */
export function convertToPixels(
  value: number | string | undefined,
  referenceSize?: number
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  // If it's already a number, return it
  if (typeof value === 'number') {
    return value;
  }

  // Parse string values
  const stringValue = value.trim();

  // Handle pixels (e.g., "300px")
  if (stringValue.endsWith('px')) {
    const parsed = parseFloat(stringValue);
    return isFinite(parsed) ? parsed : undefined;
  }

  // Handle viewport height (e.g., "50vh")
  if (stringValue.endsWith('vh')) {
    const percentage = parseFloat(stringValue);
    if (!isFinite(percentage)) {
      return undefined;
    }
    // Check if window is defined (SSR compatibility)
    if (typeof window === 'undefined') {
      return undefined;
    }
    const result = (percentage / 100) * window.innerHeight;
    return isFinite(result) ? result : undefined;
  }

  // Handle viewport width (e.g., "80vw")
  if (stringValue.endsWith('vw')) {
    const percentage = parseFloat(stringValue);
    if (!isFinite(percentage)) {
      return undefined;
    }
    // Check if window is defined (SSR compatibility)
    if (typeof window === 'undefined') {
      return undefined;
    }
    const result = (percentage / 100) * window.innerWidth;
    return isFinite(result) ? result : undefined;
  }

  // Handle percentage (e.g., "50%")
  if (stringValue.endsWith('%')) {
    if (referenceSize === undefined) {
      return undefined;
    }
    const percentage = parseFloat(stringValue);
    if (!isFinite(percentage)) {
      return undefined;
    }
    const result = (percentage / 100) * referenceSize;
    return isFinite(result) ? result : undefined;
  }

  // If no unit is specified, try to parse as a number
  const parsed = parseFloat(stringValue);
  if (!isNaN(parsed)) {
    return parsed;
  }

  // Return undefined if we couldn't parse the value
  return undefined;
}
