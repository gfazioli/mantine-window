import { useCallback, useEffect, useRef, useState } from 'react';
import type { WindowPosition, WindowSize } from '../Window';

// Separate z-index counters for portal (high, above page chrome) and container (low, local stacking)
let portalZIndex = 200;
let containerZIndex = 1;

interface WindowPersistedState {
  position: WindowPosition;
  size: WindowSize;
  collapsed: boolean;
}

// Manual localStorage functions for unified state
const getPersistedWindowState = (
  key: string,
  defaultPosition: WindowPosition,
  defaultSize: WindowSize,
  defaultCollapsed: boolean
): WindowPersistedState => {
  if (typeof window === 'undefined') {
    return {
      position: defaultPosition,
      size: defaultSize,
      collapsed: defaultCollapsed,
    };
  }

  try {
    const item = window.localStorage.getItem(`${key}-window-state`);
    if (item) {
      const parsed = JSON.parse(item) as WindowPersistedState;
      return {
        position: parsed.position || defaultPosition,
        size: parsed.size || defaultSize,
        collapsed: parsed.collapsed ?? defaultCollapsed,
      };
    }
  } catch {
    // Ignore parsing errors
  }

  return {
    position: defaultPosition,
    size: defaultSize,
    collapsed: defaultCollapsed,
  };
};

const setPersistedWindowState = (key: string, state: WindowPersistedState): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(`${key}-window-state`, JSON.stringify(state));
  } catch {
    // Ignore errors (e.g., quota exceeded)
  }
};

export interface UseWindowStateOptions {
  id?: string;
  title?: string;
  opened?: boolean;
  collapsed?: boolean;
  persistState?: boolean;
  withinPortal?: boolean;

  // Controlled values (undefined = uncontrolled for that axis)
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;

  // Uncontrolled defaults
  defaultX?: number | string;
  defaultY?: number | string;
  defaultWidth?: number | string;
  defaultHeight?: number | string;

  onClose?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export function useWindowState(options: UseWindowStateOptions) {
  const {
    id,
    title,
    opened,
    collapsed,
    persistState = false,
    withinPortal = true,
    // Controlled
    x: controlledX,
    y: controlledY,
    width: controlledWidth,
    height: controlledHeight,
    // Uncontrolled defaults
    defaultX = 20,
    defaultY = 100,
    defaultWidth = 400,
    defaultHeight = 400,
    onClose,
    onPositionChange,
    onSizeChange,
  } = options;

  const isXControlled = controlledX !== undefined;
  const isYControlled = controlledY !== undefined;
  const isWidthControlled = controlledWidth !== undefined;
  const isHeightControlled = controlledHeight !== undefined;

  const [isVisible, setIsVisible] = useState(opened ?? false);
  const [zIndex, setZIndex] = useState(withinPortal ? 200 : 1);
  const [isHydrated, setIsHydrated] = useState(false);

  const key = (id || title)?.toLocaleLowerCase().replace(/\s+/g, '-') || 'window';

  // Compose default objects for localStorage compatibility
  const defaultPosition: WindowPosition = { x: defaultX, y: defaultY };
  const defaultSize: WindowSize = { width: defaultWidth, height: defaultHeight };

  // Internal state — used only when uncontrolled
  const [internalPosition, setInternalPositionState] = useState<WindowPosition>(defaultPosition);
  const [internalSize, setInternalSizeState] = useState<WindowSize>(defaultSize);
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(collapsed ?? false);

  // Compute current position/size: controlled values override internal state
  const position: WindowPosition = {
    x: isXControlled ? controlledX : internalPosition.x,
    y: isYControlled ? controlledY : internalPosition.y,
  };

  const size: WindowSize = {
    width: isWidthControlled ? controlledWidth : internalSize.width,
    height: isHeightControlled ? controlledHeight : internalSize.height,
  };

  // Refs to avoid stale closures in callbacks
  const persistRef = useRef({
    persistState,
    isHydrated,
    key,
    defaultPosition,
    defaultSize,
    collapsed,
    isXControlled,
    isYControlled,
    isWidthControlled,
    isHeightControlled,
  });
  persistRef.current = {
    persistState,
    isHydrated,
    key,
    defaultPosition,
    defaultSize,
    collapsed,
    isXControlled,
    isYControlled,
    isWidthControlled,
    isHeightControlled,
  };

  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const onSizeChangeRef = useRef(onSizeChange);
  onSizeChangeRef.current = onSizeChange;

  const positionRef = useRef(position);
  positionRef.current = position;

  const sizeRef = useRef(size);
  sizeRef.current = size;

  const isCollapsedRef = useRef(isCollapsed);
  isCollapsedRef.current = isCollapsed;

  // ─── Hydration (localStorage) ───────────────────────────────────────

  useEffect(() => {
    if (!isHydrated) {
      setIsHydrated(true);

      if (persistState) {
        const persistedState = getPersistedWindowState(
          key,
          defaultPosition,
          defaultSize,
          collapsed ?? false
        );

        // Only hydrate uncontrolled values
        if (!isXControlled || !isYControlled) {
          setInternalPositionState(persistedState.position);
        }
        if (!isWidthControlled || !isHeightControlled) {
          setInternalSizeState(persistedState.size);
        }

        if (collapsed === undefined) {
          setIsCollapsedState(persistedState.collapsed);
        }
      }
    }
  }, [isHydrated]);

  // ─── Debounced persistence ──────────────────────────────────────────

  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPersistRef = useRef<Partial<WindowPersistedState>>({});

  const flushPersist = useCallback(() => {
    const {
      persistState: ps,
      isHydrated: ih,
      key: k,
      defaultPosition: dp,
      defaultSize: ds,
      collapsed: c,
    } = persistRef.current;

    if (ps && ih) {
      const currentState = getPersistedWindowState(k, dp, ds, c ?? false);
      setPersistedWindowState(k, { ...currentState, ...pendingPersistRef.current });
    }
    pendingPersistRef.current = {};
  }, []);

  const persistSideEffect = useCallback(
    (update: Partial<WindowPersistedState>) => {
      if (!persistRef.current.persistState) {
        return;
      }
      pendingPersistRef.current = { ...pendingPersistRef.current, ...update };

      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = setTimeout(flushPersist, 150);
    },
    [flushPersist]
  );

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        flushPersist();
      }
    };
  }, [flushPersist]);

  // ─── Setters ────────────────────────────────────────────────────────

  const setPosition = useCallback(
    (newPosition: WindowPosition | ((prev: WindowPosition) => WindowPosition)) => {
      const pos =
        typeof newPosition === 'function' ? newPosition(positionRef.current) : newPosition;

      const { isXControlled: xCtrl, isYControlled: yCtrl } = persistRef.current;

      // Only update internal state for uncontrolled axes
      if (!xCtrl || !yCtrl) {
        setInternalPositionState((prev) => ({
          x: xCtrl ? prev.x : pos.x,
          y: yCtrl ? prev.y : pos.y,
        }));
      }

      persistSideEffect({ position: pos });
      onPositionChangeRef.current?.(pos as { x: number; y: number });
    },
    [persistSideEffect]
  );

  const setSize = useCallback(
    (newSize: WindowSize | ((prev: WindowSize) => WindowSize)) => {
      const sz = typeof newSize === 'function' ? newSize(sizeRef.current) : newSize;

      const { isWidthControlled: wCtrl, isHeightControlled: hCtrl } = persistRef.current;

      // Only update internal state for uncontrolled dimensions
      if (!wCtrl || !hCtrl) {
        setInternalSizeState((prev) => ({
          width: wCtrl ? prev.width : sz.width,
          height: hCtrl ? prev.height : sz.height,
        }));
      }

      persistSideEffect({ size: sz });
      onSizeChangeRef.current?.(sz as { width: number; height: number });
    },
    [persistSideEffect]
  );

  const setIsCollapsed = useCallback(
    (newCollapsed: boolean | ((prev: boolean) => boolean)) => {
      const collapsedValue =
        typeof newCollapsed === 'function' ? newCollapsed(isCollapsedRef.current) : newCollapsed;
      setIsCollapsedState(collapsedValue);
      persistSideEffect({ collapsed: collapsedValue });
    },
    [persistSideEffect]
  );

  const withinPortalRef = useRef(withinPortal);
  withinPortalRef.current = withinPortal;

  const bringToFront = useCallback(() => {
    if (withinPortalRef.current) {
      portalZIndex += 1;
      setZIndex(portalZIndex);
    } else {
      containerZIndex += 1;
      setZIndex(containerZIndex);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      return onClose();
    }
    setIsVisible(false);
  }, [onClose]);

  // ─── Sync with props ────────────────────────────────────────────────

  useEffect(() => {
    setIsVisible(opened ?? false);
  }, [opened]);

  useEffect(() => {
    if (collapsed !== undefined) {
      setIsCollapsedState(collapsed);

      if (persistState && isHydrated) {
        const currentState = getPersistedWindowState(key, defaultPosition, defaultSize, false);
        setPersistedWindowState(key, {
          ...currentState,
          collapsed,
        });
      }
    }
  }, [collapsed]);

  return {
    isCollapsed,
    setIsCollapsed,
    isVisible,
    setIsVisible,
    zIndex,
    position,
    size,
    setPosition,
    setSize,
    bringToFront,
    handleClose,
  };
}
