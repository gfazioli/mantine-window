import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
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
  type ZIndexStrategy,
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

  /**
   * Starting z-index for the stacking context of this group. Defaults to 200 when
   * `withinPortal` is true, 1 otherwise — matching the previous hardcoded values.
   */
  initialZIndex?: number;

  /**
   * Upper bound for z-index values. When the `'increment'` strategy would exceed this
   * value, the counter wraps back to `initialZIndex`. When `'normalize'` is in use,
   * the cap is only enforced if the stack grows larger than `maxZIndex - initialZIndex`.
   * Recommended when the group coexists with Mantine modals/menus.
   */
  maxZIndex?: number;

  /**
   * How z-indexes are assigned when a window is focused or registered.
   *
   * - `'increment'` (default): a counter monotonically increases. Preserves legacy
   *   behavior. Can exceed modal z-indexes unless `maxZIndex` is set.
   * - `'normalize'`: z-indexes are derived from the stacking order. Values always
   *   stay within `initialZIndex .. initialZIndex + N - 1`. Recommended for
   *   long-running applications or when Mantine modals/menus are used alongside.
   */
  zIndexStrategy?: ZIndexStrategy;

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
  zIndexStrategy: 'increment',
};

export const WindowGroup = factory<WindowGroupFactory>((_props) => {
  const props = useProps('WindowGroup', defaultGroupProps, _props);
  const {
    id: groupId = 'window-group',
    withinPortal = false,
    showToolsButton = true,
    defaultLayout,
    initialZIndex: initialZIndexProp,
    maxZIndex,
    zIndexStrategy = 'increment',
    groupRef,
    onLayoutChange,
    children,
    style,
    ...others
  } = props;

  const initialZIndex = initialZIndexProp ?? (withinPortal ? 200 : 1);

  // Registry: state snapshots + callbacks. Kept in refs because we don't want every Window
  // position update to invalidate consumers of the context. Changes are signaled via
  // `registryVersion` for callers that must react to registry topology.
  const registryRef = useRef<Map<string, WindowGroupWindowState>>(new Map());
  const callbacksRef = useRef<Map<string, WindowCallbacks>>(new Map());
  const [registryVersion, bumpRegistry] = useReducer((n: number) => n + 1, 0);

  // Stack order is bottom → top. Always maintained regardless of strategy so consumers can
  // introspect it and so `'normalize'` can derive z-indexes purely from position in the stack.
  const [stackOrder, setStackOrder] = useState<string[]>([]);

  // For the `'increment'` strategy: explicit z-index per window, driven by a monotonic counter.
  // Props `initialZIndex`, `maxZIndex`, `zIndexStrategy` are expected to be stable across
  // renders — we intentionally don't re-seed the counter when they change.
  const incrementCounterRef = useRef(initialZIndex);
  const [incrementMap, setIncrementMap] = useState<Map<string, number>>(() => new Map());

  // Container dimensions for layout calculations
  const [containerRef, containerRect] = useResizeObserver();
  const containerWidth = containerRect.width || 0;
  const containerHeight = containerRect.height || 0;

  const onLayoutChangeRef = useRef(onLayoutChange);
  onLayoutChangeRef.current = onLayoutChange;

  const bumpIncrementCounter = useCallback(
    (windowId: string) => {
      incrementCounterRef.current += 1;
      if (maxZIndex !== undefined && incrementCounterRef.current > maxZIndex) {
        incrementCounterRef.current = initialZIndex;
      }
      const assigned = incrementCounterRef.current;
      setIncrementMap((prev) => {
        const next = new Map(prev);
        next.set(windowId, assigned);
        return next;
      });
    },
    [initialZIndex, maxZIndex]
  );

  const registerWindow = useCallback(
    (windowId: string, state: WindowGroupWindowState, callbacks: WindowCallbacks) => {
      registryRef.current.set(windowId, state);
      callbacksRef.current.set(windowId, callbacks);

      setStackOrder((prev) => (prev.includes(windowId) ? prev : [...prev, windowId]));

      if (zIndexStrategy === 'increment' && !incrementMap.has(windowId)) {
        bumpIncrementCounter(windowId);
      }
      bumpRegistry();
    },
    [zIndexStrategy, incrementMap, bumpIncrementCounter]
  );

  const unregisterWindow = useCallback((windowId: string) => {
    registryRef.current.delete(windowId);
    callbacksRef.current.delete(windowId);
    setStackOrder((prev) =>
      prev.includes(windowId) ? prev.filter((id) => id !== windowId) : prev
    );
    setIncrementMap((prev) => {
      if (!prev.has(windowId)) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(windowId);
      return next;
    });
    bumpRegistry();
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
      if (zIndexStrategy === 'normalize') {
        const idx = stackOrder.indexOf(windowId);
        return idx < 0 ? initialZIndex : initialZIndex + idx;
      }
      return incrementMap.get(windowId) ?? initialZIndex;
    },
    [zIndexStrategy, stackOrder, incrementMap, initialZIndex]
  );

  const bringToFront = useCallback(
    (windowId: string) => {
      setStackOrder((prev) => {
        if (!prev.includes(windowId)) {
          return prev;
        }
        if (prev[prev.length - 1] === windowId) {
          return prev;
        }
        const filtered = prev.filter((id) => id !== windowId);
        filtered.push(windowId);
        return filtered;
      });
      if (zIndexStrategy === 'increment') {
        bumpIncrementCounter(windowId);
      }
    },
    [zIndexStrategy, bumpIncrementCounter]
  );

  const getWindowIds = useCallback(() => {
    return Array.from(registryRef.current.keys());
  }, []);

  // ─── Layout presets — call Window callbacks directly ──────────────

  const pendingLayoutRef = useRef<WindowLayout | null>(null);

  const applyLayout = useCallback(
    (layout: WindowLayout) => {
      const visibleWindows = Array.from(registryRef.current.entries()).filter(
        ([, state]) => state.isVisible && !state.isCollapsed
      );

      const w = containerWidth;
      const h = containerHeight;

      // Defer layout if the registry is empty (dynamic rendering not yet flushed) or the
      // container hasn't been measured. Flushed by the effect below once both become ready.
      if (visibleWindows.length === 0 || w <= 0 || h <= 0) {
        pendingLayoutRef.current = layout;
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
      pendingLayoutRef.current = null;
      onLayoutChangeRef.current?.(layout);
    },
    [containerWidth, containerHeight, updateWindowState]
  );

  // Flush any deferred layout when registry + container dimensions become ready
  useEffect(() => {
    const pending = pendingLayoutRef.current;
    if (pending && containerWidth > 0 && containerHeight > 0 && registryRef.current.size > 0) {
      const raf = requestAnimationFrame(() => {
        if (pendingLayoutRef.current === pending) {
          applyLayout(pending);
        }
      });
      return () => cancelAnimationFrame(raf);
    }
    return undefined;
  }, [registryVersion, containerWidth, containerHeight, applyLayout]);

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
      stackOrder,
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
      stackOrder,
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
