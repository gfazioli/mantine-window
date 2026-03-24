import { useMatches, type MantineBreakpoint } from '@mantine/core';

export type ResponsiveValue<T> = T | Partial<Record<MantineBreakpoint | 'base', T>>;

const BREAKPOINT_KEYS = new Set<string>(['base', 'xs', 'sm', 'md', 'lg', 'xl']);

function isBreakpointObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => BREAKPOINT_KEYS.has(k));
}

export function useResponsiveValue<T>(value: ResponsiveValue<T> | undefined, defaultValue: T): T {
  const isResponsive = value !== undefined && isBreakpointObject(value);
  const matchesInput = isResponsive
    ? (value as Partial<Record<MantineBreakpoint | 'base', T>>)
    : ({ base: value ?? defaultValue } as Partial<Record<MantineBreakpoint | 'base', T>>);
  return useMatches(matchesInput) ?? defaultValue;
}
