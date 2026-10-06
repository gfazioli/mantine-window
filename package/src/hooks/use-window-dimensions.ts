import { useMounted, useViewportSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export interface UseWindowDimensionsOptions {
  withinPortal?: boolean;
  /** The mounted element, or `null` while it is not rendered. */
  element: HTMLElement | null;
}

const UNMEASURED = { width: 0, height: 0 };

export function useWindowDimensions(options: UseWindowDimensionsOptions) {
  const { withinPortal = true, element } = options;

  // Use Mantine's useMounted hook to detect client-side mount (SSR-safe)
  const isMounted = useMounted();

  // Track viewport dimensions using Mantine's hook
  const viewportDimensions = useViewportSize();

  // Track the positioned parent with a ResizeObserver when not in portal mode
  const [containerDimensions, setContainerDimensions] = useState(UNMEASURED);

  useEffect(() => {
    const parent = element?.offsetParent;

    if (withinPortal || !(parent instanceof HTMLElement)) {
      setContainerDimensions(UNMEASURED);
      return undefined;
    }

    // Get initial dimensions immediately to avoid flicker
    setContainerDimensions({
      width: parent.clientWidth,
      height: parent.clientHeight,
    });

    // Observe for resize changes
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(parent);

    return () => observer.disconnect();
  }, [withinPortal, element]);

  return {
    isMounted,
    viewportDimensions,
    containerDimensions,
  };
}
