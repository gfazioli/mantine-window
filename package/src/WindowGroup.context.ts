import { createContext, useContext } from 'react';
import type { WindowPosition, WindowSize } from './Window';

/** Layouts that operate on a single window (no Group required) */
export type SingleWindowLayout = 'snap-left' | 'snap-right' | 'snap-top' | 'snap-bottom' | 'fill';

/** Layouts that operate on all windows in a Group */
export type GroupLayout = 'arrange-columns' | 'arrange-rows' | 'tile';

/** All layout types */
export type WindowLayout = SingleWindowLayout | GroupLayout;

export interface WindowGroupWindowState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
  isCollapsed: boolean;
  collapsable: boolean;
}

/** Callbacks that each Window registers with the Group so the Group can control it */
export interface WindowCallbacks {
  setPosition: (position: WindowPosition) => void;
  setSize: (size: WindowSize) => void;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsVisible: (visible: boolean) => void;
}

export interface WindowGroupContextValue {
  /** Unique group identifier */
  groupId: string;

  /** Whether this group uses portal or container positioning */
  withinPortal: boolean;

  /** Container dimensions (for layout calculations) */
  containerWidth: number;
  containerHeight: number;

  /** Register a window with the group (state + callbacks) */
  registerWindow: (id: string, state: WindowGroupWindowState, callbacks: WindowCallbacks) => void;

  /** Unregister a window from the group */
  unregisterWindow: (id: string) => void;

  /** Update a window's state snapshot in the registry (for Group to read) */
  updateWindowState: (id: string, state: Partial<WindowGroupWindowState>) => void;

  /** Get the z-index for a specific window */
  getZIndex: (windowId: string) => number;

  /** Bring a specific window to front within the group */
  bringToFront: (windowId: string) => void;

  /** Apply a layout preset to all visible windows */
  applyLayout: (layout: WindowLayout) => void;

  /** Close all windows in the group */
  closeAll: () => void;

  /** Minimize (collapse) all windows in the group */
  collapseAll: () => void;

  /** Expand all collapsed windows in the group */
  expandAll: () => void;

  /** Get all registered window IDs */
  getWindowIds: () => string[];

  /** Whether the tools button should be shown (true when inside a group) */
  showToolsButton: boolean;
}

const WindowGroupContext = createContext<WindowGroupContextValue | null>(null);

export const WindowGroupProvider = WindowGroupContext.Provider;

export function useWindowGroupContext(): WindowGroupContextValue | null {
  return useContext(WindowGroupContext);
}
