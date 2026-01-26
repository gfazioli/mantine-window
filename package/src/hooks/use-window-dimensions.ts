import { useEffect, useState } from 'react';
import { useMounted, useResizeObserver, useViewportSize } from '@mantine/hooks';

export interface UseWindowDimensionsOptions {
  withinPortal?: boolean;
  isVisible: boolean;
  windowRef: React.RefObject<HTMLDivElement>;
}

export function useWindowDimensions(options: UseWindowDimensionsOptions) {
  const { withinPortal = true, isVisible, windowRef } = options;

  // Use Mantine's useMounted hook to detect client-side mount (SSR-safe)
  const isMounted = useMounted();

  // Track viewport dimensions using Mantine's hook
  const viewportDimensions = useViewportSize();

  // Track container dimensions using Mantine's resize observer
  const [containerRef, containerRect] = useResizeObserver();

  // Use local state to avoid flicker on first render when containerRect is not yet populated
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Sync containerRect with local state
  useEffect(() => {
    if (containerRect.width > 0 || containerRect.height > 0) {
      setContainerDimensions(containerRect);
    }
  }, [containerRect.width, containerRect.height]);

  // Attach resize observer to parent container when not in portal mode
  useEffect(() => {
    if (!isVisible || !windowRef.current?.offsetParent || withinPortal) {
      // Reset ref when in portal mode or not visible
      if (containerRef.current) {
        containerRef.current = null;
      }
      setContainerDimensions({ width: 0, height: 0 });
      return;
    }

    const parent = windowRef.current.offsetParent;
    if (parent instanceof HTMLElement) {
      containerRef.current = parent;
      // Get initial dimensions immediately to avoid flicker
      setContainerDimensions({
        width: parent.clientWidth,
        height: parent.clientHeight,
      });
    }
  }, [withinPortal, isVisible]);

  return {
    isMounted,
    viewportDimensions,
    containerDimensions,
  };
}
