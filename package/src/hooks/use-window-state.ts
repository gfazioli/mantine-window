import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { WindowPosition, WindowSize } from '../Window';

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

  const [isCollapsed, setIsCollapsed] = useState(collapsed ?? false);
  const [isVisible, setIsVisible] = useState(opened ?? false);
  const [zIndex, setZIndex] = useState(200);

  const key = (id || title)?.toLocaleLowerCase().replace(/\s+/g, '-') || 'window';

  // Use localStorage if persistState is true, otherwise use regular state
  const [positionStorage, setPositionStorage] = useLocalStorage({
    key: persistState ? `${key}-window-position` : `${key}-window-position-volatile`,
    defaultValue: defaultPosition,
    getInitialValueInEffect: true,
  });

  const [sizeStorage, setSizeStorage] = useLocalStorage({
    key: persistState ? `${key}-window-size` : `${key}-window-size-volatile`,
    defaultValue: defaultSize,
    getInitialValueInEffect: true,
  });

  const [positionState, setPositionState] = useState<WindowPosition>(defaultPosition);
  const [sizeState, setSizeState] = useState<WindowSize>(defaultSize);

  // Select the appropriate state based on persistState
  const position = persistState ? positionStorage : positionState;
  const size = persistState ? sizeStorage : sizeState;

  const setPosition = useCallback(
    (newPosition: WindowPosition | ((prev: WindowPosition) => WindowPosition)) => {
      const pos = typeof newPosition === 'function' ? newPosition(position) : newPosition;
      if (persistState) {
        setPositionStorage(pos);
      } else {
        setPositionState(pos);
      }
      onPositionChange?.(pos);
    },
    [persistState, position, setPositionStorage, onPositionChange]
  );

  const setSize = useCallback(
    (newSize: WindowSize | ((prev: WindowSize) => WindowSize)) => {
      const sz = typeof newSize === 'function' ? newSize(size) : newSize;
      if (persistState) {
        setSizeStorage(sz);
      } else {
        setSizeState(sz);
      }
      onSizeChange?.(sz);
    },
    [persistState, size, setSizeStorage, onSizeChange]
  );

  const bringToFront = useCallback(() => {
    setZIndex(200);
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

  useEffect(() => {
    setIsCollapsed(collapsed ?? false);
  }, [collapsed]);

  return {
    isCollapsed,
    setIsCollapsed,
    isVisible,
    setIsVisible,
    zIndex,
    setZIndex,
    position,
    size,
    setPosition,
    setSize,
    bringToFront,
    handleClose,
  };
}
