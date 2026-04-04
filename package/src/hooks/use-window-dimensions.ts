import { useEffect, useRef, useState } from 'react';
import { useMounted, useViewportSize } from '@mantine/hooks';

export interface UseWindowDimensionsOptions {
  withinPortal?: boolean;
  isVisible: boolean;
  windowRef: React.RefObject<HTMLDivElement | null>;
}

export function useWindowDimensions(options: UseWindowDimensionsOptions) {
  const { withinPortal = true, isVisible, windowRef } = options;

  // Use Mantine's useMounted hook to detect client-side mount (SSR-safe)
  const isMounted = useMounted();

  // Track viewport dimensions using Mantine's hook
  const viewportDimensions = useViewportSize();

  // Track container dimensions with a manual ResizeObserver
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  // Attach resize observer to parent container when not in portal mode
  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!isVisible || !windowRef.current?.offsetParent || withinPortal) {
      setContainerDimensions({ width: 0, height: 0 });
      return;
    }

    const parent = windowRef.current.offsetParent;
    if (parent instanceof HTMLElement) {
      // Get initial dimensions immediately to avoid flicker
      setContainerDimensions({
        width: parent.clientWidth,
        height: parent.clientHeight,
      });

      // Observe for resize changes
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      observerRef.current.observe(parent);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [withinPortal, isVisible]);

  return {
    isMounted,
    viewportDimensions,
    containerDimensions,
  };
}
