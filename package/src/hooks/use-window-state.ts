import { useCallback, useEffect, useRef, useState } from 'react';
import type { WindowPosition, WindowSize } from '../Window';

// Global z-index counter shared across all Window instances
let globalZIndex = 200;

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
  defaultPosition?: WindowPosition;
  defaultSize?: WindowSize;
  onClose?: () => void;
  onPositionChange?: (position: WindowPosition) => void;
  onSizeChange?: (size: WindowSize) => void;
}

export function useWindowState(options: UseWindowStateOptions) {
  const {
    id,
    title,
    opened,
    collapsed,
    persistState = false,
    defaultPosition = { x: 20, y: 100 },
    defaultSize = { width: 400, height: 400 },
    onClose,
    onPositionChange,
    onSizeChange,
  } = options;

  const [isVisible, setIsVisible] = useState(opened ?? false);
  const [zIndex, setZIndex] = useState(200);
  const [isHydrated, setIsHydrated] = useState(false);

  const key = (id || title)?.toLocaleLowerCase().replace(/\s+/g, '-') || 'window';

  // Initialize state with SSR-safe defaults first
  const [position, setPositionState] = useState<WindowPosition>(defaultPosition);
  const [size, setSizeState] = useState<WindowSize>(defaultSize);
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(collapsed ?? false);

  // Refs to avoid stale closures in callbacks — keeps callbacks stable across renders
  const persistRef = useRef({
    persistState,
    isHydrated,
    key,
    defaultPosition,
    defaultSize,
    collapsed,
  });
  persistRef.current = { persistState, isHydrated, key, defaultPosition, defaultSize, collapsed };

  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const onSizeChangeRef = useRef(onSizeChange);
  onSizeChangeRef.current = onSizeChange;

  // Refs to track latest state values — avoids stale closures without adding deps
  const positionRef = useRef(position);
  positionRef.current = position;

  const sizeRef = useRef(size);
  sizeRef.current = size;

  const isCollapsedRef = useRef(isCollapsed);
  isCollapsedRef.current = isCollapsed;

  // Effect for hydration - runs only on client
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

        setPositionState(persistedState.position);
        setSizeState(persistedState.size);

        // Only use persisted collapsed state if collapsed prop is not explicitly set
        if (collapsed === undefined) {
          setIsCollapsedState(persistedState.collapsed);
        }
      }
    }
  }, [isHydrated, persistState, key, defaultPosition, defaultSize, collapsed]);

  // Debounced persistence — batches rapid updates (drag/resize) into a single localStorage write
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

  // Flush pending persistence on unmount
  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        flushPersist();
      }
    };
  }, [flushPersist]);

  const setPosition = useCallback(
    (newPosition: WindowPosition | ((prev: WindowPosition) => WindowPosition)) => {
      const pos =
        typeof newPosition === 'function' ? newPosition(positionRef.current) : newPosition;
      setPositionState(pos);
      persistSideEffect({ position: pos });
      onPositionChangeRef.current?.(pos);
    },
    [persistSideEffect]
  );

  const setSize = useCallback(
    (newSize: WindowSize | ((prev: WindowSize) => WindowSize)) => {
      const sz = typeof newSize === 'function' ? newSize(sizeRef.current) : newSize;
      setSizeState(sz);
      persistSideEffect({ size: sz });
      onSizeChangeRef.current?.(sz);
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

  const bringToFront = useCallback(() => {
    globalZIndex += 1;
    setZIndex(globalZIndex);
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      return onClose();
    }
    setIsVisible(false);
  }, [onClose]);

  // Sync with props
  useEffect(() => {
    setIsVisible(opened ?? false);
  }, [opened]);

  // Sync collapsed state with props (props have priority)
  useEffect(() => {
    if (collapsed !== undefined) {
      setIsCollapsedState(collapsed);

      // Also persist if persistState is enabled and we're hydrated
      if (persistState && isHydrated) {
        const currentState = getPersistedWindowState(key, defaultPosition, defaultSize, false);
        setPersistedWindowState(key, {
          ...currentState,
          collapsed,
        });
      }
    }
  }, [collapsed, persistState, isHydrated, key, defaultPosition, defaultSize]);

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
