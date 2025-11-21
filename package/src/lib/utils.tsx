import { type TreeNodeData } from '@mantine/core';

export interface JSONTreeNodeData extends TreeNodeData {
  nodeData?: {
    type: ValueType;
    value: any;
    key?: string;
    path: string;
    itemCount?: number;
    depth?: number;
  };
}

/**
 * Type of a JSON value for rendering purposes.
 */
export type ValueType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'undefined';

/**
 * Get the type of a value for display purposes.
 */
export function getValueType(value: any): ValueType {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value as ValueType;
}

/**
 * Check if a value is expandable (object or array with content).
 */
export function isExpandable(value: any): boolean {
  const type = getValueType(value);
  if (type === 'object') {
    return Object.keys(value).length > 0;
  }
  if (type === 'array') {
    return value.length > 0;
  }
  return false;
}

/**
 * Format a primitive value for display.
 */
export function formatValue(value: any, type: ValueType): string {
  if (type === 'string') {
    return `"${value}"`;
  }
  if (type === 'null') {
    return 'null';
  }
  if (type === 'undefined') {
    return 'undefined';
  }
  return String(value);
}

/**
 * Get the count of items in an object or array.
 */
export function getItemCount(value: any): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length;
    return 0;
  }
}

/**
 * Convert JSON data to Mantine Tree format.
 */
export function convertToTreeData(
  value: any,
  key?: string,
  path: string = 'root',
  depth: number = 0
): JSONTreeNodeData {
  const type = getValueType(value);
  const expandable = isExpandable(value);
  const nodeValue = path;

  if (!expandable) {
    return {
      value: nodeValue,
      label: key || 'root',
      nodeData: { type, value, key, path, depth },
    };
  }

  const entries: [string, any][] =
    type === 'array'
      ? value.map((item: any, index: number) => [String(index), item] as [string, any])
      : Object.entries(value);

  const children = entries.map(([k, v]) => convertToTreeData(v, k, `${path}.${k}`, depth + 1));

  return {
    value: nodeValue,
    label: key || 'root',
    children,
    nodeData: { type, value, key, path, itemCount: getItemCount(value), depth },
  };
}
