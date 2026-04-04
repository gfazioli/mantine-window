import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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

  /** Initial layout to apply after windows have registered. Applied once on mount. */
  defaultLayout?: WindowLayout;

  /** Ref to access group API imperatively (applyLayout, closeAll, etc.) */
  groupRef?: React.Ref<WindowGroupContextValue>;

  /** Called when a layout is applied */
  onLayoutChange?: (layout: WindowLayout) => void;

  /** Children (Window components) */
  children?: React.ReactNode;
}

export type WindowGroupStylesNames = 'root';

export type WindowGroupFactory = Factory<{
  props: WindowGroupProps;
  ref: HTMLDivElement;
  stylesNames: WindowGroupStylesNames;
}>;

const defaultGroupProps: Partial<WindowGroupProps> = {
  withinPortal: false,
  showToolsButton: true,
};

export const WindowGroup = factory<WindowGroupFactory>((_props) => {
  const props = useProps('WindowGroup', defaultGroupProps, _props);
  const {
    id: groupId = 'window-group',
    withinPortal = false,
    showToolsButton = true,
    defaultLayout,
    groupRef,
    onLayoutChange,
    children,
    style,
    ...others
  } = props;

  // Window registry: state snapshots + callbacks
  const registryRef = useRef<Map<string, WindowGroupWindowState>>(new Map());
  const callbacksRef = useRef<Map<string, WindowCallbacks>>(new Map());
  const [registryVersion, forceUpdate] = useState(0);

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

      if (w <= 0 || h <= 0) {
        return;
      }

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

      // Group layouts only — single-window layouts are handled by the Window itself
      switch (layout) {
        case 'arrange-columns': {
          const count = visibleWindows.length;
          const colW = Math.max(0, (w - gap * (count - 1)) / count);
          visibleWindows.forEach(([id], i) => {
            positionWindow(id, i * (colW + gap), 0, colW, h);
          });
          break;
        }
        case 'arrange-rows': {
          const count = visibleWindows.length;
          const rowH = Math.max(0, (h - gap * (count - 1)) / count);
          visibleWindows.forEach(([id], i) => {
            positionWindow(id, 0, i * (rowH + gap), w, rowH);
          });
          break;
        }
        case 'tile': {
          const count = visibleWindows.length;
          const cols = Math.ceil(Math.sqrt(count));
          const rows = Math.ceil(count / cols);
          const cellW = Math.max(0, (w - gap * (cols - 1)) / cols);
          const cellH = Math.max(0, (h - gap * (rows - 1)) / rows);
          visibleWindows.forEach(([id], i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            positionWindow(id, col * (cellW + gap), row * (cellH + gap), cellW, cellH);
          });
          break;
        }
        default:
          // Single-window layouts (snap-left, etc.) are not handled by the Group
          return;
      }
      onLayoutChangeRef.current?.(layout);
    },
    [containerWidth, containerHeight, updateWindowState]
  );

  // ─── Global actions — call Window callbacks directly ──────────────

  const closeAll = useCallback(() => {
    callbacksRef.current.forEach((cb) => cb.setIsVisible(false));
  }, []);

  const collapseAll = useCallback(() => {
    callbacksRef.current.forEach((cb, windowId) => {
      const state = registryRef.current.get(windowId);
      if (state?.collapsable) {
        cb.setIsCollapsed(true);
      }
    });
  }, []);

  const expandAll = useCallback(() => {
    callbacksRef.current.forEach((cb, windowId) => {
      const state = registryRef.current.get(windowId);
      if (state?.collapsable) {
        cb.setIsCollapsed(false);
      }
    });
  }, []);

  // ─── Apply default layout after windows register ───────────────────

  const defaultLayoutAppliedRef = useRef(false);

  useEffect(() => {
    if (!defaultLayout || defaultLayoutAppliedRef.current) {
      return;
    }

    // Wait for windows to register and container to be measured
    const raf = requestAnimationFrame(() => {
      if (registryRef.current.size > 0 && containerWidth > 0 && containerHeight > 0) {
        applyLayout(defaultLayout);
        defaultLayoutAppliedRef.current = true;
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [defaultLayout, applyLayout, containerWidth, containerHeight, registryVersion]);

  // ─── Context value ──────────────────────────────────────────────────

  const contextValue: WindowGroupContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  // Expose group API via groupRef for external control
  useImperativeHandle(groupRef, () => contextValue, [contextValue]);

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
