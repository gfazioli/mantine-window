/**
 * Converts a CSS value (number, px, vh, vw) to pixels
 * @param value - The value to convert (number or string with units)
 * @param referenceSize - Optional reference size for percentage calculations
 * @returns The value in pixels
 *
 * @example
 * convertToPixels(300) // 300
 * convertToPixels('300px') // 300
 * convertToPixels('50vh') // 400 (if viewport height is 800px)
 * convertToPixels('80vw') // 1024 (if viewport width is 1280px)
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
    const result = (percentage / 100) * window.innerHeight;
    return isFinite(result) ? result : undefined;
  }

  // Handle viewport width (e.g., "80vw")
  if (stringValue.endsWith('vw')) {
    const percentage = parseFloat(stringValue);
    if (!isFinite(percentage)) {
      return undefined;
    }
    const result = (percentage / 100) * window.innerWidth;
    return isFinite(result) ? result : undefined;
  }

  // Handle percentage (e.g., "50%")
  if (stringValue.endsWith('%') && referenceSize !== undefined) {
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
