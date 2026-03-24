import React, { useCallback, useRef, useState } from 'react';
import { Box, factory, Factory, useProps, type BoxProps } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import {
  WindowGroupProvider,
  type WindowCallbacks,
  type WindowGroupContextValue,
  type WindowGroupWindowState,
  type WindowLayout,
} from './WindowGroup.context';

export interface WindowGroupProps extends BoxProps {
  /** Unique group identifier */
  id?: string;

  /** Whether windows in this group use portal positioning. Default: false */
  withinPortal?: boolean;

  /** Whether to show the tools button on windows in this group. Default: true */
  showToolsButton?: boolean;

  /** Called when a layout is applied */
  onLayoutChange?: (layout: WindowLayout) => void;

  /** Children (Window components) */
  children?: React.ReactNode;
}

export type WindowGroupFactory = Factory<{
  props: WindowGroupProps;
  ref: HTMLDivElement;
}>;

const defaultGroupProps: Partial<WindowGroupProps> = {
  withinPortal: false,
  showToolsButton: true,
};

export const WindowGroup = factory<WindowGroupFactory>((_props, _ref) => {
  const props = useProps('WindowGroup', defaultGroupProps, _props);
  const {
    id: groupId = 'window-group',
    withinPortal = false,
    showToolsButton = true,
    onLayoutChange,
    children,
    style,
    ...others
  } = props;

  // Window registry: state snapshots + callbacks
  const registryRef = useRef<Map<string, WindowGroupWindowState>>(new Map());
  const callbacksRef = useRef<Map<string, WindowCallbacks>>(new Map());
  const [, forceUpdate] = useState(0);

  // Z-index tracking per group
  const zIndexMapRef = useRef<Map<string, number>>(new Map());
  const zIndexCounterRef = useRef(withinPortal ? 200 : 1);

  // Container dimensions for layout calculations
  const [containerRef, containerRect] = useResizeObserver();
  const containerWidth = containerRect.width || 0;
  const containerHeight = containerRect.height || 0;

  const onLayoutChangeRef = useRef(onLayoutChange);
  onLayoutChangeRef.current = onLayoutChange;

  const registerWindow = useCallback(
    (windowId: string, state: WindowGroupWindowState, callbacks: WindowCallbacks) => {
      registryRef.current.set(windowId, state);
      callbacksRef.current.set(windowId, callbacks);
      if (!zIndexMapRef.current.has(windowId)) {
        zIndexCounterRef.current += 1;
        zIndexMapRef.current.set(windowId, zIndexCounterRef.current);
      }
      forceUpdate((n) => n + 1);
    },
    []
  );

  const unregisterWindow = useCallback((windowId: string) => {
    registryRef.current.delete(windowId);
    callbacksRef.current.delete(windowId);
    zIndexMapRef.current.delete(windowId);
    forceUpdate((n) => n + 1);
  }, []);

  const updateWindowState = useCallback(
    (windowId: string, state: Partial<WindowGroupWindowState>) => {
      const current = registryRef.current.get(windowId);
      if (current) {
        registryRef.current.set(windowId, { ...current, ...state });
      }
    },
    []
  );

  const getZIndex = useCallback(
    (windowId: string) => {
      return zIndexMapRef.current.get(windowId) ?? (withinPortal ? 200 : 1);
    },
    [withinPortal]
  );

  const bringToFront = useCallback((windowId: string) => {
    zIndexCounterRef.current += 1;
    zIndexMapRef.current.set(windowId, zIndexCounterRef.current);
    forceUpdate((n) => n + 1);
  }, []);

  const getWindowIds = useCallback(() => {
    return Array.from(registryRef.current.keys());
  }, []);

  // ─── Layout presets — call Window callbacks directly ──────────────

  const applyLayout = useCallback(
    (layout: WindowLayout) => {
      const visibleWindows = Array.from(registryRef.current.entries()).filter(
        ([, state]) => state.isVisible && !state.isCollapsed
      );

      if (visibleWindows.length === 0) {
        return;
      }

      const w = containerWidth;
      const h = containerHeight;
      const gap = 4;

      const positionWindow = (
        windowId: string,
        x: number,
        y: number,
        width: number,
        height: number
      ) => {
        const cb = callbacksRef.current.get(windowId);
        if (cb) {
          cb.setPosition({ x, y });
          cb.setSize({ width, height });
        }
        updateWindowState(windowId, { x, y, width, height });
      };

      const layouts: Record<WindowLayout, () => void> = {
        'snap-left': () => {
          visibleWindows.forEach(([id]) => positionWindow(id, 0, 0, w / 2 - gap / 2, h));
        },
        'snap-right': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, w / 2 + gap / 2, 0, w / 2 - gap / 2, h)
          );
        },
        'snap-top': () => {
          visibleWindows.forEach(([id]) => positionWindow(id, 0, 0, w, h / 2 - gap / 2));
        },
        'snap-bottom': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, 0, h / 2 + gap / 2, w, h / 2 - gap / 2)
          );
        },
        'snap-top-left': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, 0, 0, w / 2 - gap / 2, h / 2 - gap / 2)
          );
        },
        'snap-top-right': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, w / 2 + gap / 2, 0, w / 2 - gap / 2, h / 2 - gap / 2)
          );
        },
        'snap-bottom-left': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, 0, h / 2 + gap / 2, w / 2 - gap / 2, h / 2 - gap / 2)
          );
        },
        'snap-bottom-right': () => {
          visibleWindows.forEach(([id]) =>
            positionWindow(id, w / 2 + gap / 2, h / 2 + gap / 2, w / 2 - gap / 2, h / 2 - gap / 2)
          );
        },
        fill: () => {
          visibleWindows.forEach(([id]) => positionWindow(id, 0, 0, w, h));
        },
        tile: () => {
          const count = visibleWindows.length;
          const cols = Math.ceil(Math.sqrt(count));
          const rows = Math.ceil(count / cols);
          const cellW = (w - gap * (cols - 1)) / cols;
          const cellH = (h - gap * (rows - 1)) / rows;

          visibleWindows.forEach(([id], i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            positionWindow(id, col * (cellW + gap), row * (cellH + gap), cellW, cellH);
          });
        },
      };

      layouts[layout]();
      onLayoutChangeRef.current?.(layout);
    },
    [containerWidth, containerHeight, updateWindowState]
  );

  // ─── Global actions — call Window callbacks directly ──────────────

  const closeAll = useCallback(() => {
    callbacksRef.current.forEach((cb) => cb.setIsVisible(false));
  }, []);

  const collapseAll = useCallback(() => {
    callbacksRef.current.forEach((cb) => cb.setIsCollapsed(true));
  }, []);

  const expandAll = useCallback(() => {
    callbacksRef.current.forEach((cb) => cb.setIsCollapsed(false));
  }, []);

  // ─── Context value ──────────────────────────────────────────────────

  const contextValue: WindowGroupContextValue = {
    groupId,
    withinPortal,
    containerWidth,
    containerHeight,
    registerWindow,
    unregisterWindow,
    updateWindowState,
    getZIndex,
    bringToFront,
    applyLayout,
    closeAll,
    collapseAll,
    expandAll,
    getWindowIds,
    showToolsButton,
  };

  const mergedStyle = {
    position: 'relative' as const,
    ...((typeof style === 'object' && style) || {}),
  };

  return (
    <Box ref={containerRef} style={mergedStyle} {...others}>
      <WindowGroupProvider value={contextValue}>{children}</WindowGroupProvider>
    </Box>
  );
});

WindowGroup.displayName = 'WindowGroup';
