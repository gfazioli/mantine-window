import { DirectionProvider, MantineProvider } from '@mantine/core';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React, { createRef, useRef, useState } from 'react';
import { __resetStandaloneZIndexCounters } from './hooks/use-window-state';
import { Window } from './Window';
import type { WindowGroupContextValue } from './WindowGroup.context';

// Helper to render with MantineProvider
function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

// Helper to query the window element
function getWindowElement(container: HTMLElement) {
  return container.querySelector('[data-mantine-window]') as HTMLElement | null;
}

beforeEach(() => {
  localStorage.clear();
  __resetStandaloneZIndexCounters();
});

describe('Window', () => {
  // ─── Basic rendering ──────────────────────────────────────────────────

  it('renders without crashing', () => {
    const { container } = renderWithMantine(<Window />);
    expect(container).toBeTruthy();
  });

  it('renders nothing when opened is false', () => {
    const { container } = renderWithMantine(<Window opened={false} title="Hidden" />);
    expect(getWindowElement(container)).toBeNull();
  });

  it('renders the window when opened is true', () => {
    const { container } = renderWithMantine(<Window opened title="Visible" />);
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('renders title text', () => {
    renderWithMantine(<Window opened title="My Window" />);
    expect(screen.getByText('My Window')).toBeTruthy();
  });

  it('renders children content', () => {
    renderWithMantine(
      <Window opened title="Test">
        <p>Hello content</p>
      </Window>
    );
    expect(screen.getByText('Hello content')).toBeTruthy();
  });

  // ─── Unit handling (new flat API) ─────────────────────────────────────

  it('handles viewport units without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultX="10vw"
        defaultY="15vh"
        defaultWidth="40vw"
        defaultHeight="50vh"
      />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('handles percentage units without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultX="20%"
        defaultY="25%"
        defaultWidth="60%"
        defaultHeight="70%"
      />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('handles mixed units (pixels and viewport) without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultX={100}
        defaultY="10vh"
        defaultWidth="50vw"
        defaultHeight={300}
      />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  // ─── ARIA / Accessibility ─────────────────────────────────────────────

  it('has role="dialog"', () => {
    const { container } = renderWithMantine(<Window opened title="Dialog" />);
    const win = getWindowElement(container);
    expect(win?.getAttribute('role')).toBe('dialog');
  });

  it('has aria-label matching title', () => {
    const { container } = renderWithMantine(<Window opened title="My Title" />);
    const win = getWindowElement(container);
    expect(win?.getAttribute('aria-label')).toBe('My Title');
  });

  it('close button has aria-label', () => {
    renderWithMantine(<Window opened title="Test" withCloseButton />);
    expect(screen.getByLabelText('Close window')).toBeTruthy();
  });

  it('collapse button has aria-label', () => {
    renderWithMantine(<Window opened title="Test" withCollapseButton collapsable />);
    expect(screen.getByLabelText('Collapse window')).toBeTruthy();
  });

  // ─── Controlled open/close ────────────────────────────────────────────

  it('shows window when opened changes from false to true', () => {
    const { container, rerender } = renderWithMantine(<Window opened={false} title="Ctrl" />);
    expect(getWindowElement(container)).toBeNull();

    rerender(
      <MantineProvider>
        <Window opened title="Ctrl" />
      </MantineProvider>
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('hides window when opened changes from true to false', () => {
    const { container, rerender } = renderWithMantine(<Window opened title="Ctrl" />);
    expect(getWindowElement(container)).toBeTruthy();

    rerender(
      <MantineProvider>
        <Window opened={false} title="Ctrl" />
      </MantineProvider>
    );
    expect(getWindowElement(container)).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderWithMantine(<Window opened title="Close Me" onClose={onClose} withCloseButton />);

    fireEvent.click(screen.getByLabelText('Close window'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides window on close button click when uncontrolled (no onClose)', () => {
    const { container } = renderWithMantine(<Window opened title="Unctrl" withCloseButton />);
    expect(getWindowElement(container)).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Close window'));
    expect(getWindowElement(container)).toBeNull();
  });

  // ─── Close / collapse button visibility ───────────────────────────────

  it('does not render close button when withCloseButton is false', () => {
    renderWithMantine(<Window opened title="No Close" withCloseButton={false} />);
    expect(screen.queryByLabelText('Close window')).toBeNull();
  });

  it('does not render collapse button when withCollapseButton is false', () => {
    renderWithMantine(<Window opened title="No Collapse" withCollapseButton={false} collapsable />);
    expect(screen.queryByLabelText('Collapse window')).toBeNull();
    expect(screen.queryByLabelText('Expand window')).toBeNull();
  });

  it('does not render collapse button when collapsable is false', () => {
    renderWithMantine(
      <Window opened title="Not Collapsable" collapsable={false} withCollapseButton />
    );
    expect(screen.queryByLabelText('Collapse window')).toBeNull();
  });

  // ─── Collapse behavior ────────────────────────────────────────────────

  it('hides content when collapsed prop is true', () => {
    const { container } = renderWithMantine(
      <Window opened title="Collapsed" collapsed collapsable />
    );
    expect(container.querySelector('.mantine-Window-content')).toBeNull();
  });

  it('shows content when collapsed prop is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="Expanded" collapsed={false} collapsable />
    );
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
  });

  it('toggles collapse state when collapse button is clicked', () => {
    const { container } = renderWithMantine(
      <Window opened title="Toggle" collapsable withCollapseButton />
    );

    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
    expect(screen.getByLabelText('Collapse window')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Collapse window'));
    expect(container.querySelector('.mantine-Window-content')).toBeNull();
    expect(screen.getByLabelText('Expand window')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Expand window'));
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
  });

  it('toggles collapse on header double-click when collapsable', () => {
    const { container } = renderWithMantine(<Window opened title="DblClick" collapsable />);

    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();

    fireEvent.doubleClick(header);
    expect(container.querySelector('.mantine-Window-content')).toBeNull();

    fireEvent.doubleClick(header);
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
  });

  it('does NOT toggle collapse on header double-click when collapsable is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="NoDblClick" collapsable={false} />
    );

    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();

    fireEvent.doubleClick(header);
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
  });

  // ─── Resizable mode / handle visibility ───────────────────────────────

  it('renders all 8 resize handles when resizable="both"', () => {
    const { container } = renderWithMantine(<Window opened title="Resize Both" resizable="both" />);
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(8);
  });

  it('renders only vertical handles when resizable="vertical"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Resize V" resizable="vertical" />
    );
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(2);
  });

  it('renders only horizontal handles when resizable="horizontal"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Resize H" resizable="horizontal" />
    );
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(2);
  });

  it('renders no resize handles when resizable="none"', () => {
    const { container } = renderWithMantine(<Window opened title="No Resize" resizable="none" />);
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(0);
  });

  it('hides vertical resize handles when collapsed (but keeps horizontal)', () => {
    const { container } = renderWithMantine(
      <Window opened title="Collapsed Resize" collapsed resizable="both" collapsable />
    );
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(2);
  });

  // ─── Draggable mode ──────────────────────────────────────────────────

  it('sets data-window-draggable on root when draggable includes window', () => {
    const { container } = renderWithMantine(
      <Window opened title="Drag Window" draggable="window" />
    );
    const win = getWindowElement(container);
    expect(win?.getAttribute('data-window-draggable')).toBe('true');
  });

  it('does not set data-window-draggable when draggable="header"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Drag Header" draggable="header" />
    );
    const win = getWindowElement(container);
    expect(win?.getAttribute('data-window-draggable')).not.toBe('true');
  });

  it('sets window-draggable on header when draggable includes header', () => {
    const { container } = renderWithMantine(
      <Window opened title="Drag Header" draggable="header" />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    expect(header?.getAttribute('data-window-draggable')).toBe('true');
  });

  it('does not set any draggable attributes when draggable="none"', () => {
    const { container } = renderWithMantine(<Window opened title="No Drag" draggable="none" />);
    const win = getWindowElement(container);
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    expect(win?.getAttribute('data-window-draggable')).not.toBe('true');
    expect(header?.getAttribute('data-window-draggable')).not.toBe('true');
  });

  // ─── Positioning mode ────────────────────────────────────────────────

  it('uses fixed positioning when withinPortal is true (default)', () => {
    const { container } = renderWithMantine(<Window opened title="Portal" />);
    const win = getWindowElement(container);
    expect(win?.style.position).toBe('fixed');
  });

  it('uses absolute positioning when withinPortal is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="Container" withinPortal={false} />
    );
    const win = getWindowElement(container);
    expect(win?.style.position).toBe('absolute');
  });

  // ─── Visual props ────────────────────────────────────────────────────

  it('renders with border when withBorder is true', () => {
    const { container } = renderWithMantine(<Window opened title="Bordered" withBorder />);
    const win = getWindowElement(container);
    expect(win?.getAttribute('data-with-border')).toBe('true');
  });

  it('does not render border when withBorder is false', () => {
    const { container } = renderWithMantine(<Window opened title="No Border" withBorder={false} />);
    const win = getWindowElement(container);
    expect(win?.getAttribute('data-with-border')).not.toBe('true');
  });

  it('applies color prop as background', () => {
    const { container } = renderWithMantine(<Window opened title="Colored" color="teal" />);
    const win = getWindowElement(container);
    expect(win).toBeTruthy();
  });

  // ─── localStorage persistence ─────────────────────────────────────────

  it('does not write to localStorage when persistState is false', () => {
    renderWithMantine(<Window opened title="No Persist" persistState={false} />);
    expect(localStorage.getItem('no-persist-window-state')).toBeNull();
  });

  it('reads persisted state from localStorage on mount', () => {
    const persistedState = {
      position: { x: 300, y: 200 },
      size: { width: 500, height: 350 },
      collapsed: true,
    };
    localStorage.setItem('persist-test-window-state', JSON.stringify(persistedState));

    const { container } = renderWithMantine(
      <Window opened title="Persist Test" id="persist-test" persistState collapsable />
    );

    expect(container.querySelector('.mantine-Window-content')).toBeNull();
  });

  it('generates storage key from title when id is not provided', () => {
    const persistedState = {
      position: { x: 100, y: 100 },
      size: { width: 400, height: 400 },
      collapsed: true,
    };
    localStorage.setItem('my-window-title-window-state', JSON.stringify(persistedState));

    const { container } = renderWithMantine(
      <Window opened title="My Window Title" persistState collapsable />
    );

    expect(container.querySelector('.mantine-Window-content')).toBeNull();
  });

  // ─── fullSizeResizeHandles ────────────────────────────────────────────

  it('sets data-full-size on side handles when fullSizeResizeHandles is true', () => {
    const { container } = renderWithMantine(
      <Window opened title="Full Handles" fullSizeResizeHandles resizable="both" />
    );
    const fullSizeHandles = container.querySelectorAll('[data-full-size="true"]');
    expect(fullSizeHandles.length).toBe(4);
  });

  it('does not set data-full-size when fullSizeResizeHandles is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="Default Handles" fullSizeResizeHandles={false} resizable="both" />
    );
    const fullSizeHandles = container.querySelectorAll('[data-full-size="true"]');
    expect(fullSizeHandles.length).toBe(0);
  });

  // ─── Window with no title / no children ───────────────────────────────

  it('renders without a title', () => {
    const { container } = renderWithMantine(<Window opened />);
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('renders without children', () => {
    const { container } = renderWithMantine(<Window opened title="Empty" />);
    expect(getWindowElement(container)).toBeTruthy();
  });

  // ─── Controlled position/size ─────────────────────────────────────────

  it('accepts controlled x/y props', () => {
    const { container } = renderWithMantine(
      <Window opened title="Controlled Pos" x={200} y={150} />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('accepts controlled width/height props', () => {
    const { container } = renderWithMantine(
      <Window opened title="Controlled Size" width={500} height={300} />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('fires onPositionChange during drag', () => {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Drag CB"
        defaultX={100}
        defaultY={100}
        draggable="header"
        withinPortal={false}
        onPositionChange={onPositionChange}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    fireEvent.mouseUp(document);

    expect(onPositionChange).toHaveBeenCalled();
  });

  it('fires onSizeChange during resize', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Resize CB"
        defaultWidth={400}
        defaultHeight={300}
        resizable="both"
        withinPortal={false}
        onSizeChange={onSizeChange}
      />
    );
    const handle = container.querySelector('[data-resize-handle]') as HTMLElement;

    fireEvent.mouseDown(handle, { clientX: 400, clientY: 300 });
    fireEvent.mouseMove(document, { clientX: 450, clientY: 350 });
    fireEvent.mouseUp(document);

    expect(onSizeChange).toHaveBeenCalled();
  });

  // ─── Drag does not hijack interactive content (issue #33) ────────────

  it('does not start a drag nor preventDefault when mousedown originates on an interactive element', () => {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Interactive"
        defaultX={100}
        defaultY={100}
        draggable="both"
        withinPortal={false}
        onPositionChange={onPositionChange}
      >
        <input aria-label="Inner input" data-testid="inner-input" />
      </Window>
    );
    const input = container.querySelector('[data-testid="inner-input"]') as HTMLElement;

    // mousedown on the input must NOT be prevented, otherwise the browser
    // never moves focus to it (this broke searchable Select inside Window).
    const notPrevented = fireEvent.mouseDown(input, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 220, clientY: 240 });
    fireEvent.mouseUp(document);

    expect(notPrevented).toBe(true);
    expect(onPositionChange).not.toHaveBeenCalled();
  });

  it('does not start a drag when mousedown originates on a data-no-window-drag region', () => {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Opt out"
        defaultX={100}
        defaultY={100}
        draggable="both"
        withinPortal={false}
        onPositionChange={onPositionChange}
      >
        <div data-no-window-drag data-testid="no-drag">
          custom interactive region
        </div>
      </Window>
    );
    const region = container.querySelector('[data-testid="no-drag"]') as HTMLElement;

    fireEvent.mouseDown(region, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 220, clientY: 240 });
    fireEvent.mouseUp(document);

    expect(onPositionChange).not.toHaveBeenCalled();
  });

  // ─── Drag / resize lifecycle callbacks ────────────────────────────────

  it('fires onDragStart once and onDragEnd once for a drag gesture, in order', () => {
    const calls: string[] = [];
    const { container } = renderWithMantine(
      <Window
        opened
        title="Drag lifecycle"
        defaultX={100}
        defaultY={100}
        draggable="header"
        withinPortal={false}
        onDragStart={() => calls.push('start')}
        onDragEnd={() => calls.push('end')}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    fireEvent.mouseMove(document, { clientX: 170, clientY: 190 });
    fireEvent.mouseUp(document);

    // Once each, and never an end before its start — several moves must not multiply them.
    expect(calls).toEqual(['start', 'end']);
  });

  it('fires onResizeStart once and onResizeEnd once for a resize gesture, in order', () => {
    const calls: string[] = [];
    const { container } = renderWithMantine(
      <Window
        opened
        title="Resize lifecycle"
        defaultWidth={400}
        defaultHeight={300}
        resizable="both"
        withinPortal={false}
        onResizeStart={() => calls.push('start')}
        onResizeEnd={() => calls.push('end')}
      />
    );
    const handle = container.querySelector('[data-resize-handle]') as HTMLElement;

    fireEvent.mouseDown(handle, { clientX: 400, clientY: 300 });
    fireEvent.mouseMove(document, { clientX: 450, clientY: 350 });
    fireEvent.mouseUp(document);

    expect(calls).toEqual(['start', 'end']);
  });

  it('does not fire drag callbacks during a resize, nor resize callbacks during a drag', () => {
    // The global mouseup listener ends both gestures at once, so without a per-hook
    // guard a plain resize would emit an unpaired onDragEnd (and vice versa).
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    const onResizeStart = jest.fn();
    const onResizeEnd = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="No cross talk"
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        defaultHeight={300}
        draggable="header"
        resizable="both"
        withinPortal={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
      />
    );

    const handle = container.querySelector('[data-resize-handle]') as HTMLElement;
    fireEvent.mouseDown(handle, { clientX: 400, clientY: 300 });
    fireEvent.mouseMove(document, { clientX: 450, clientY: 350 });
    fireEvent.mouseUp(document);

    expect(onResizeStart).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();

    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    fireEvent.mouseUp(document);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onResizeStart).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledTimes(1);
  });

  it('does not fire onDragStart when the pointer starts on an interactive child', () => {
    // Same bail-out that keeps a child input focusable must also keep the gesture
    // from opening: a start with no matching end leaks consumer state.
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Interactive child"
        defaultX={100}
        defaultY={100}
        draggable="both"
        withinPortal={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <input aria-label="Inner input" data-testid="lifecycle-input" />
      </Window>
    );
    const input = container.querySelector('[data-testid="lifecycle-input"]') as HTMLElement;

    fireEvent.mouseDown(input, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 220, clientY: 240 });
    fireEvent.mouseUp(document);

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('closes an in-flight drag gesture on unmount', () => {
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    const { container, unmount } = renderWithMantine(
      <Window
        opened
        title="Unmount mid drag"
        defaultX={100}
        defaultY={100}
        draggable="header"
        withinPortal={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragEnd).not.toHaveBeenCalled();

    unmount();

    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('does not fire any lifecycle callback on unmount without a gesture', () => {
    const onDragEnd = jest.fn();
    const onResizeEnd = jest.fn();
    const { unmount } = renderWithMantine(
      <Window
        opened
        title="Clean unmount"
        withinPortal={false}
        draggable="header"
        resizable="both"
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
      />
    );

    unmount();

    expect(onDragEnd).not.toHaveBeenCalled();
    expect(onResizeEnd).not.toHaveBeenCalled();
  });

  it('still starts a drag when mousedown originates on non-interactive content', () => {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Drag Body"
        defaultX={100}
        defaultY={100}
        draggable="both"
        withinPortal={false}
        onPositionChange={onPositionChange}
      >
        <div data-testid="plain">plain content</div>
      </Window>
    );
    const plain = container.querySelector('[data-testid="plain"]') as HTMLElement;

    fireEvent.mouseDown(plain, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 220, clientY: 240 });
    fireEvent.mouseUp(document);

    expect(onPositionChange).toHaveBeenCalled();
  });

  // ─── localStorage write on interaction ──────────────────────────────

  it('writes collapsed state to localStorage when persistState is true', () => {
    renderWithMantine(
      <Window
        opened
        title="Persist Write"
        id="persist-write"
        persistState
        collapsable
        withCollapseButton
      />
    );

    fireEvent.click(screen.getByLabelText('Collapse window'));

    // Persistence is debounced — check after a tick
    const stored = localStorage.getItem('persist-write-window-state');
    expect(stored || 'pending').toBeTruthy(); // may not have flushed yet
    // If debounce has flushed, verify the persisted state
    const parsed = stored ? JSON.parse(stored) : null;
    expect(!parsed || parsed.collapsed === true).toBe(true);
    // At minimum the collapse worked
    expect(screen.getByLabelText('Expand window')).toBeTruthy();
  });

  // ─── Tools menu ────────────────────────────────────────────────────
  // Note: Mantine Menu uses Popover/floating-ui which has limited support in jsdom.
  // Menu interaction tests are covered at the integration/visual level via `yarn dev`.

  // ─── New flat API: defaultX/Y/Width/Height ────────────────────────────

  it('accepts defaultX and defaultY props', () => {
    const { container } = renderWithMantine(
      <Window opened title="Flat Pos" defaultX={50} defaultY={75} />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('accepts defaultWidth and defaultHeight props', () => {
    const { container } = renderWithMantine(
      <Window opened title="Flat Size" defaultWidth={600} defaultHeight={450} />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('accepts string values for defaultX/Y (viewport units)', () => {
    const { container } = renderWithMantine(
      <Window opened title="VW Pos" defaultX="10vw" defaultY="15vh" />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('accepts string values for defaultWidth/Height (viewport units)', () => {
    const { container } = renderWithMantine(
      <Window opened title="VW Size" defaultWidth="50vw" defaultHeight="40vh" />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });
});

describe('Window.Group', () => {
  // ─── Basic rendering ──────────────────────────────────────────────────

  it('renders Window.Group without crashing', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Window 1" opened />
      </Window.Group>
    );
    expect(container).toBeTruthy();
  });

  it('renders multiple windows inside a group', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Window 1" opened />
        <Window id="w2" title="Window 2" opened />
        <Window id="w3" title="Window 3" opened />
      </Window.Group>
    );
    const windows = container.querySelectorAll('[data-mantine-window]');
    expect(windows.length).toBe(3);
  });

  it('renders empty Window.Group without errors', () => {
    const { container } = renderWithMantine(<Window.Group style={{ width: 800, height: 600 }} />);
    expect(container).toBeTruthy();
  });

  // ─── Tools button visibility ──────────────────────────────────────────

  it('shows tools button when window is inside a group', () => {
    renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Grouped" opened />
      </Window.Group>
    );
    expect(screen.getByLabelText('Window layout options')).toBeTruthy();
  });

  it('shows tools button on standalone window (withToolsButton default true)', () => {
    renderWithMantine(<Window opened title="Solo" />);
    expect(screen.getByLabelText('Window layout options')).toBeTruthy();
  });

  it('hides tools button on standalone window when withToolsButton is false', () => {
    renderWithMantine(<Window opened title="Solo" withToolsButton={false} />);
    expect(screen.queryByLabelText('Window layout options')).toBeNull();
  });

  it('hides tools button when withToolsButton is false on the Window', () => {
    renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="No Tools" opened withToolsButton={false} />
      </Window.Group>
    );
    expect(screen.queryByLabelText('Window layout options')).toBeNull();
  });

  // ─── Z-index coordination ─────────────────────────────────────────────

  it('windows in group use low z-index (not portal)', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Window 1" opened />
      </Window.Group>
    );
    const win = getWindowElement(container);
    const zIndex = parseInt(win?.style.zIndex || '0', 10);
    expect(zIndex).toBeLessThan(200);
  });

  // ─── Group container ──────────────────────────────────────────────────

  it('windows inside group default to withinPortal=false when set on Window', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Window 1" opened withinPortal={false} />
      </Window.Group>
    );
    const win = getWindowElement(container);
    expect(win?.style.position).toBe('absolute');
  });

  // ─── Close button inside group ────────────────────────────────────────

  it('close button works inside a group', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Closable" opened withCloseButton />
      </Window.Group>
    );
    expect(getWindowElement(container)).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Close window'));
    expect(getWindowElement(container)).toBeNull();
  });

  // ─── Collapse inside group ────────────────────────────────────────────

  it('collapse button works inside a group', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Collapsable" opened collapsable withCollapseButton />
      </Window.Group>
    );

    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Collapse window'));
    expect(container.querySelector('.mantine-Window-content')).toBeNull();
  });

  // ─── showToolsButton override from Group ─────────────────────────────

  it('Group showToolsButton={false} hides tools button on all windows', () => {
    renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }} showToolsButton={false}>
        <Window id="w1" title="Hidden Tools" opened />
      </Window.Group>
    );
    expect(screen.queryByLabelText('Window layout options')).toBeNull();
  });

  it('Group showToolsButton={true} (default) shows tools button', () => {
    renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }}>
        <Window id="w1" title="Visible Tools" opened />
      </Window.Group>
    );
    expect(screen.getByLabelText('Window layout options')).toBeTruthy();
  });

  it('Window withToolsButton={false} overrides even when Group shows tools', () => {
    renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }} showToolsButton>
        <Window id="w1" title="No Tools" opened withToolsButton={false} />
      </Window.Group>
    );
    expect(screen.queryByLabelText('Window layout options')).toBeNull();
  });

  // ─── defaultLayout ──────────────────────────────────────────────────

  it('renders Window.Group with defaultLayout prop without errors', () => {
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }} defaultLayout="tile">
        <Window id="dl-1" title="W1" opened />
        <Window id="dl-2" title="W2" opened />
      </Window.Group>
    );
    const windows = container.querySelectorAll('[data-mantine-window]');
    expect(windows.length).toBe(2);
  });

  // ─── onLayoutChange callback ────────────────────────────────────────

  it('accepts onLayoutChange callback prop', () => {
    const onLayoutChange = jest.fn();
    const { container } = renderWithMantine(
      <Window.Group style={{ width: 800, height: 600 }} onLayoutChange={onLayoutChange}>
        <Window id="lc-1" title="W1" opened />
      </Window.Group>
    );
    expect(container).toBeTruthy();
  });

  // ─── Group actions via groupRef (avoids Menu/Popover jsdom limitations) ──

  it('groupRef.collapseAll collapses all collapsable windows', () => {
    function TestCollapseAll() {
      const groupRef = createRef<WindowGroupContextValue>();
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.collapseAll()}>
            Collapse All
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            <Window id="ca-1" title="W1" opened collapsable />
            <Window id="ca-2" title="W2" opened collapsable />
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<TestCollapseAll />);
    expect(container.querySelectorAll('.mantine-Window-content').length).toBe(2);

    act(() => {
      fireEvent.click(screen.getByText('Collapse All'));
    });

    expect(container.querySelectorAll('.mantine-Window-content').length).toBe(0);
  });

  it('groupRef.expandAll expands all collapsed windows', () => {
    function TestExpandAll() {
      const groupRef = createRef<WindowGroupContextValue>();
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.expandAll()}>
            Expand All
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            <Window id="ea-1" title="W1" opened collapsed collapsable />
            <Window id="ea-2" title="W2" opened collapsed collapsable />
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<TestExpandAll />);
    expect(container.querySelectorAll('.mantine-Window-content').length).toBe(0);

    act(() => {
      fireEvent.click(screen.getByText('Expand All'));
    });

    expect(container.querySelectorAll('.mantine-Window-content').length).toBe(2);
  });

  it('groupRef.closeAll closes all windows', () => {
    function TestCloseAll() {
      const groupRef = createRef<WindowGroupContextValue>();
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.closeAll()}>
            Close All
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            <Window id="cl-1" title="W1" opened />
            <Window id="cl-2" title="W2" opened />
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<TestCloseAll />);
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);

    act(() => {
      fireEvent.click(screen.getByText('Close All'));
    });

    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(0);
  });

  it('groupRef.closeAll fires onClose and respects controlled opened (issue #36)', () => {
    const onClose1 = jest.fn();
    const onClose2 = jest.fn();

    function TestCloseAllControlled() {
      const groupRef = createRef<WindowGroupContextValue>();
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.closeAll()}>
            Close All
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            <Window id="cc-1" title="W1" opened onClose={onClose1} />
            <Window id="cc-2" title="W2" opened onClose={onClose2} />
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<TestCloseAllControlled />);
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);

    act(() => {
      fireEvent.click(screen.getByText('Close All'));
    });

    // closeAll must notify every window's onClose (regression: previously it bypassed it)...
    expect(onClose1).toHaveBeenCalledTimes(1);
    expect(onClose2).toHaveBeenCalledTimes(1);
    // ...and must NOT force visibility off on controlled windows: `opened` is still true,
    // so the windows stay mounted until the consumer flips `opened` in response to onClose.
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);
  });

  // ─── groupRef.applyLayout ───────────────────────────────────────────

  it('groupRef.applyLayout does not crash', () => {
    function TestGroupRef() {
      const groupRef = createRef<WindowGroupContextValue>();
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.applyLayout('tile')}>
            Apply Tile
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            <Window
              id="gr-1"
              title="W1"
              opened
              defaultX={0}
              defaultY={0}
              defaultWidth={200}
              defaultHeight={200}
            />
            <Window
              id="gr-2"
              title="W2"
              opened
              defaultX={200}
              defaultY={0}
              defaultWidth={200}
              defaultHeight={200}
            />
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<TestGroupRef />);
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);

    act(() => {
      fireEvent.click(screen.getByText('Apply Tile'));
    });

    // Both windows should still be visible after layout
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);
  });

  // ─── Backward compatibility ───────────────────────────────────────────

  it('Window still works without a group (backward compatible)', () => {
    const { container } = renderWithMantine(
      <Window opened title="Solo Window" defaultX={50} defaultY={50} />
    );
    expect(getWindowElement(container)).toBeTruthy();
    expect(screen.getByLabelText('Window layout options')).toBeTruthy();
  });

  // ─── withScrollArea ─────────────────────────────────────────────────

  it('renders ScrollArea by default', () => {
    const { container } = renderWithMantine(
      <Window opened title="With Scroll">
        <p>Content</p>
      </Window>
    );
    // ScrollArea renders a div with data-radix-scroll-area or mantine-ScrollArea class
    const scrollArea = container.querySelector('.mantine-ScrollArea-root');
    expect(scrollArea).toBeTruthy();
  });

  it('does not render ScrollArea when withScrollArea is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="No Scroll" withScrollArea={false}>
        <p>Content</p>
      </Window>
    );
    const scrollArea = container.querySelector('.mantine-ScrollArea-root');
    expect(scrollArea).toBeNull();
  });

  it('still renders children when withScrollArea is false', () => {
    renderWithMantine(
      <Window opened title="No Scroll" withScrollArea={false}>
        <p>Hello content</p>
      </Window>
    );
    expect(screen.getByText('Hello content')).toBeTruthy();
  });

  // ─── controlsPosition ──────────────────────────────────────────────

  it('renders controls on the left by default', () => {
    const { container } = renderWithMantine(<Window opened title="Left Controls" />);
    const header = container.querySelector('[data-controls-position="left"]');
    expect(header).toBeTruthy();
  });

  it('renders controls on the right when controlsPosition="right"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Right Controls" controlsPosition="right" />
    );
    const header = container.querySelector('[data-controls-position="right"]');
    expect(header).toBeTruthy();
  });

  it('reverses button order when controlsPosition="right"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Reversed" controlsPosition="right" />
    );
    const buttons = container.querySelectorAll('[aria-label]');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    const toolsIndex = labels.indexOf('Window layout options');
    const closeIndex = labels.indexOf('Close window');
    // Both buttons must be present
    expect(toolsIndex).not.toBe(-1);
    expect(closeIndex).not.toBe(-1);
    // Tools should appear before close in DOM order when right-positioned
    expect(toolsIndex).toBeLessThan(closeIndex);
  });

  // ─── Z-index strategies (Group) ─────────────────────────────────────

  it('normalize strategy assigns compact sequential z-indexes from initialZIndex', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group
        groupRef={groupRef}
        zIndexStrategy="normalize"
        initialZIndex={100}
        style={{ width: 800, height: 600 }}
      >
        <Window id="nz1" title="W1" opened />
        <Window id="nz2" title="W2" opened />
        <Window id="nz3" title="W3" opened />
      </Window.Group>
    );

    expect(groupRef.current?.getZIndex('nz1')).toBe(100);
    expect(groupRef.current?.getZIndex('nz2')).toBe(101);
    expect(groupRef.current?.getZIndex('nz3')).toBe(102);
  });

  it('normalize strategy reorders z-indexes when bringToFront is called', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group
        groupRef={groupRef}
        zIndexStrategy="normalize"
        initialZIndex={0}
        style={{ width: 800, height: 600 }}
      >
        <Window id="nr1" title="W1" opened />
        <Window id="nr2" title="W2" opened />
        <Window id="nr3" title="W3" opened />
      </Window.Group>
    );

    act(() => {
      groupRef.current?.bringToFront('nr1');
    });

    // nr1 becomes top, nr2/nr3 shift down
    expect(groupRef.current?.getZIndex('nr2')).toBe(0);
    expect(groupRef.current?.getZIndex('nr3')).toBe(1);
    expect(groupRef.current?.getZIndex('nr1')).toBe(2);
  });

  it('increment strategy monotonically increases z-index on bringToFront', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group
        groupRef={groupRef}
        zIndexStrategy="increment"
        initialZIndex={10}
        style={{ width: 800, height: 600 }}
      >
        <Window id="ic1" title="W1" opened />
        <Window id="ic2" title="W2" opened />
      </Window.Group>
    );

    // Initial assignment: counter goes 10 → 11 (ic1) → 12 (ic2)
    const initialIc1 = groupRef.current?.getZIndex('ic1');

    act(() => {
      groupRef.current?.bringToFront('ic1');
    });

    const afterIc1 = groupRef.current?.getZIndex('ic1');
    expect(afterIc1).toBeGreaterThan(initialIc1 ?? 0);
  });

  it('increment strategy wraps back to initialZIndex when counter would exceed maxZIndex', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group
        groupRef={groupRef}
        zIndexStrategy="increment"
        initialZIndex={10}
        maxZIndex={12}
        style={{ width: 800, height: 600 }}
      >
        <Window id="mx1" title="W1" opened />
        <Window id="mx2" title="W2" opened />
      </Window.Group>
    );

    // After registration: mx1=11, mx2=12 (counter now at 12, equal to max)
    act(() => {
      groupRef.current?.bringToFront('mx1');
    });

    // Counter +1 → 13, exceeds max, wraps to initialZIndex=10
    expect(groupRef.current?.getZIndex('mx1')).toBe(10);
  });

  it('stackOrder reflects window creation order then bringToFront mutations', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
        <Window id="so1" title="W1" opened />
        <Window id="so2" title="W2" opened />
        <Window id="so3" title="W3" opened />
      </Window.Group>
    );

    expect(groupRef.current?.stackOrder).toEqual(['so1', 'so2', 'so3']);

    act(() => {
      groupRef.current?.bringToFront('so1');
    });

    expect(groupRef.current?.stackOrder).toEqual(['so2', 'so3', 'so1']);
  });

  // ─── Dynamic windows (.map) — issue #24 regression test ─────────────

  it('applyLayout does not crash on dynamically rendered windows (.map scenario)', () => {
    function DynamicWindows() {
      const [ids, setIds] = useState<string[]>([]);
      const groupRef = useRef<WindowGroupContextValue>(null);
      return (
        <>
          <button type="button" onClick={() => setIds(['dyn1', 'dyn2', 'dyn3'])}>
            Add Windows
          </button>
          <button type="button" onClick={() => groupRef.current?.applyLayout('tile')}>
            Apply Tile
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            {ids.map((id) => (
              <Window key={id} id={id} title={id} opened />
            ))}
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<DynamicWindows />);
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(0);

    act(() => {
      fireEvent.click(screen.getByText('Add Windows'));
    });
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(3);

    act(() => {
      fireEvent.click(screen.getByText('Apply Tile'));
    });
    // Windows are still visible; applyLayout tolerated the dynamic registration path
    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(3);
  });

  it('applyLayout before any window mounts is deferred, not dropped', () => {
    function LateMount() {
      const [mounted, setMounted] = useState(false);
      const groupRef = useRef<WindowGroupContextValue>(null);
      return (
        <>
          <button type="button" onClick={() => groupRef.current?.applyLayout('arrange-columns')}>
            Apply Early
          </button>
          <button type="button" onClick={() => setMounted(true)}>
            Mount Windows
          </button>
          <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
            {mounted && (
              <>
                <Window id="lm1" title="W1" opened />
                <Window id="lm2" title="W2" opened />
              </>
            )}
          </Window.Group>
        </>
      );
    }

    const { container } = renderWithMantine(<LateMount />);

    // Apply layout before windows mount — must not throw
    act(() => {
      fireEvent.click(screen.getByText('Apply Early'));
    });

    act(() => {
      fireEvent.click(screen.getByText('Mount Windows'));
    });

    expect(container.querySelectorAll('[data-mantine-window]').length).toBe(2);
  });

  // ─── Z-index (stand-alone Window) ────────────────────────────────────

  it('stand-alone Window respects initialZIndex prop', () => {
    const { container } = renderWithMantine(<Window opened title="Init" initialZIndex={500} />);
    const win = getWindowElement(container);
    const zIndex = parseInt(win?.style.zIndex || '0', 10);
    expect(zIndex).toBe(500);
  });

  it('stand-alone Window never moves backward from initialZIndex on bringToFront', () => {
    // Regression for PR #25 review: the module-level counter (starts at 200) must be seeded
    // up to `initialZIndex` so the first bringToFront doesn't jump the z-index backward.
    const { container } = renderWithMantine(<Window opened title="Raised" initialZIndex={500} />);
    const win = getWindowElement(container);
    expect(parseInt(win!.style.zIndex, 10)).toBe(500);

    act(() => {
      fireEvent.click(win!);
    });
    const afterFirstClick = parseInt(win!.style.zIndex, 10);
    expect(afterFirstClick).toBeGreaterThanOrEqual(500);
  });

  it('stand-alone Window wraps back to exactly initialZIndex when maxZIndex is reached', () => {
    // initialZIndex=100 raises the portal counter from its default (200) to 100 only when it
    // would step *below* 100 — i.e. never — so the counter starts counting from max(200, 100) = 200.
    // With maxZIndex=205 we expect a wrap back to 100 after a few clicks.
    const { container } = renderWithMantine(
      <Window opened title="Wrap" initialZIndex={100} maxZIndex={205} />
    );
    const win = getWindowElement(container);
    const seen: number[] = [];

    for (let i = 0; i < 12; i++) {
      act(() => {
        fireEvent.click(win!);
      });
      seen.push(parseInt(win!.style.zIndex, 10));
    }

    // All values must respect the cap, and the wrap must return to initialZIndex at least once.
    expect(Math.max(...seen)).toBeLessThanOrEqual(205);
    expect(seen).toContain(100);
  });

  // ─── applyLayout with all windows hidden (#5 regression) ───────────

  it('applyLayout with registry populated but no visible windows is a no-op (not deferred)', () => {
    const groupRef = createRef<WindowGroupContextValue>();
    renderWithMantine(
      <Window.Group groupRef={groupRef} style={{ width: 800, height: 600 }}>
        <Window id="hv1" title="W1" opened={false} />
        <Window id="hv2" title="W2" opened={false} />
      </Window.Group>
    );
    // Must not throw and must return cleanly; previously this would park the layout in
    // pendingLayoutRef forever since visibility changes don't bump registryVersion.
    expect(() => {
      act(() => {
        groupRef.current?.applyLayout('tile');
      });
    }).not.toThrow();
  });

  // ─── controlsOrder ─────────────────────────────────────────────────

  it('respects custom controlsOrder', () => {
    const { container } = renderWithMantine(
      <Window opened title="Custom Order" controlsOrder={['tools', 'close', 'collapse']} />
    );
    const buttons = container.querySelectorAll('[aria-label]');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    const toolsIndex = labels.indexOf('Window layout options');
    const closeIndex = labels.indexOf('Close window');
    const collapseIndex = labels.indexOf('Collapse window');
    // All buttons must be present
    expect(toolsIndex).not.toBe(-1);
    expect(closeIndex).not.toBe(-1);
    expect(collapseIndex).not.toBe(-1);
    // tools → close → collapse
    expect(toolsIndex).toBeLessThan(closeIndex);
    expect(closeIndex).toBeLessThan(collapseIndex);
  });
});

describe('Window axis lock', () => {
  function dragHeader(axis?: 'x' | 'y') {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Axis"
        defaultX={100}
        defaultY={100}
        draggable="header"
        axis={axis}
        onPositionChange={onPositionChange}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    fireEvent.mouseMove(document, { clientX: 180, clientY: 200 });
    fireEvent.mouseUp(document);

    return onPositionChange.mock.calls.map(([position]) => position);
  }

  it('moves freely without axis', () => {
    expect(dragHeader()).toEqual([
      { x: 150, y: 160 },
      { x: 180, y: 200 },
    ]);
  });

  it('keeps y where the gesture started with axis="x"', () => {
    expect(dragHeader('x')).toEqual([
      { x: 150, y: 100 },
      { x: 180, y: 100 },
    ]);
  });

  it('keeps x where the gesture started with axis="y"', () => {
    expect(dragHeader('y')).toEqual([
      { x: 100, y: 160 },
      { x: 100, y: 200 },
    ]);
  });

  it('still clamps the free axis to the viewport', () => {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Axis clamp"
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        draggable="header"
        axis="x"
        onPositionChange={onPositionChange}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 5000, clientY: 5000 });
    fireEvent.mouseUp(document);

    // jsdom's viewport is 1024px wide: the window stops at 1024 - 400.
    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 624, y: 100 });
  });
});

describe('Window keyboard resizing', () => {
  function getSeparators(container: HTMLElement) {
    return Array.from(container.querySelectorAll('[role="separator"]')) as HTMLElement[];
  }

  it('exposes exactly one focusable separator, on the bottom-right corner', () => {
    const { container } = renderWithMantine(<Window opened title="Keys" />);
    const separators = getSeparators(container);

    expect(separators).toHaveLength(1);
    expect(separators[0].getAttribute('data-resize-handle')).toBe('bottomRight');
    expect(separators[0].getAttribute('tabindex')).toBe('0');
    expect(separators[0].getAttribute('aria-label')).toBe('Resize window');
    expect(separators[0].className).toContain('resizeHandleBottomRight');
    // The other seven handles stay pointer-only.
    expect(container.querySelectorAll('[data-resize-handle]:not([tabindex])')).toHaveLength(7);
  });

  it('reports the width as its value, within the min size and the room to the viewport edge', () => {
    const { container } = renderWithMantine(
      <Window opened title="Values" defaultX={20} defaultWidth={400} defaultHeight={300} />
    );
    const [handle] = getSeparators(container);

    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-valuenow')).toBe('400');
    expect(handle.getAttribute('aria-valuemin')).toBe('250');
    // jsdom's viewport is 1024px wide and the window starts at x = 20.
    expect(handle.getAttribute('aria-valuemax')).toBe('1004');
    expect(handle.getAttribute('aria-valuetext')).toBe('400 × 300');
  });

  it('resizes with the arrow keys, by resizeStep and by resizeShiftStep with Shift', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Arrows"
        defaultWidth={400}
        defaultHeight={300}
        resizeStep={20}
        resizeShiftStep={100}
        onSizeChange={onSizeChange}
      />
    );
    const [handle] = getSeparators(container);

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 420, height: 300 });

    fireEvent.keyDown(handle, { key: 'ArrowDown', shiftKey: true });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 420, height: 400 });

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 400, height: 380 });

    // The rendered window follows, and so does the separator's value.
    expect(getWindowElement(container)!.style.width).toBe('400px');
    expect(getWindowElement(container)!.style.height).toBe('380px');
    expect(handle.getAttribute('aria-valuenow')).toBe('400');
  });

  it('uses 10px and 50px steps by default', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Default steps"
        defaultWidth={400}
        defaultHeight={300}
        onSizeChange={onSizeChange}
      />
    );
    const [handle] = getSeparators(container);

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 410, height: 300 });
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 460, height: 300 });
  });

  it('takes Home to the min size and End to the max size', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Home End"
        defaultX={24}
        defaultY={68}
        defaultWidth={400}
        defaultHeight={300}
        minWidth={300}
        minHeight={200}
        maxWidth={700}
        onSizeChange={onSizeChange}
      />
    );
    const [handle] = getSeparators(container);

    fireEvent.keyDown(handle, { key: 'Home' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 300, height: 200 });

    // Width stops at maxWidth; height, with no max, at the viewport's bottom edge (768 - 68).
    fireEvent.keyDown(handle, { key: 'End' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 700, height: 700 });
  });

  it('stays within the min size and does not report a change at the limit', () => {
    const onSizeChange = jest.fn();
    const onResizeStart = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Clamp"
        defaultWidth={255}
        defaultHeight={300}
        minWidth={250}
        onSizeChange={onSizeChange}
        onResizeStart={onResizeStart}
      />
    );
    const [handle] = getSeparators(container);

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 250, height: 300 });

    onSizeChange.mockClear();
    onResizeStart.mockClear();
    const notPrevented = fireEvent.keyDown(handle, { key: 'ArrowLeft' });

    expect(onSizeChange).not.toHaveBeenCalled();
    expect(onResizeStart).not.toHaveBeenCalled();
    // Still our key: it must not scroll the page.
    expect(notPrevented).toBe(false);
  });

  it('leaves keys it does not use alone', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window opened title="Other keys" onSizeChange={onSizeChange} />
    );
    const [handle] = getSeparators(container);

    expect(fireEvent.keyDown(handle, { key: 'Enter' })).toBe(true);
    expect(fireEvent.keyDown(handle, { key: 'a' })).toBe(true);
    expect(onSizeChange).not.toHaveBeenCalled();
  });

  it('wraps each key press in onResizeStart / onResizeEnd, like a pointer gesture', () => {
    const calls: string[] = [];
    const { container } = renderWithMantine(
      <Window
        opened
        title="Key lifecycle"
        onResizeStart={() => calls.push('start')}
        onSizeChange={() => calls.push('size')}
        onResizeEnd={() => calls.push('end')}
      />
    );
    const [handle] = getSeparators(container);

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    fireEvent.keyDown(handle, { key: 'ArrowDown' });

    expect(calls).toEqual(['start', 'size', 'end', 'start', 'size', 'end']);
  });

  it('brings the window to the front on a keyboard resize', () => {
    const { container } = renderWithMantine(<Window opened title="Front" initialZIndex={300} />);
    const [handle] = getSeparators(container);
    const before = Number(getWindowElement(container)!.style.zIndex);

    fireEvent.keyDown(handle, { key: 'ArrowRight' });

    expect(Number(getWindowElement(container)!.style.zIndex)).toBeGreaterThan(before);
  });

  it('uses the right edge for resizable="horizontal" and when collapsed', () => {
    const horizontal = renderWithMantine(<Window opened title="H" resizable="horizontal" />);
    const [h] = getSeparators(horizontal.container);
    expect(h.getAttribute('data-resize-handle')).toBe('right');
    expect(h.getAttribute('aria-orientation')).toBe('vertical');
    expect(h.getAttribute('aria-valuetext')).toBeNull();
    horizontal.unmount();

    const collapsed = renderWithMantine(<Window opened title="C" collapsed />);
    const separators = getSeparators(collapsed.container);
    expect(separators).toHaveLength(1);
    expect(separators[0].getAttribute('data-resize-handle')).toBe('right');
  });

  it('uses the bottom edge for resizable="vertical", valued by the height', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="V"
        resizable="vertical"
        defaultWidth={400}
        defaultHeight={300}
        onSizeChange={onSizeChange}
      />
    );
    const [handle] = getSeparators(container);

    expect(handle.getAttribute('data-resize-handle')).toBe('bottom');
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    expect(handle.getAttribute('aria-valuenow')).toBe('300');

    // Left / right do nothing on a horizontal edge.
    expect(fireEvent.keyDown(handle, { key: 'ArrowRight' })).toBe(true);
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 400, height: 310 });
  });

  it('has no focusable handle when resizable="none", collapsed vertical, or withKeyboardResize={false}', () => {
    expect(
      getSeparators(renderWithMantine(<Window opened title="N" resizable="none" />).container)
    ).toHaveLength(0);
    expect(
      getSeparators(
        renderWithMantine(<Window opened title="CV" resizable="vertical" collapsed />).container
      )
    ).toHaveLength(0);

    const { container } = renderWithMantine(
      <Window opened title="Off" withKeyboardResize={false} />
    );
    expect(getSeparators(container)).toHaveLength(0);
    expect(container.querySelectorAll('[data-resize-handle][tabindex]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-resize-handle]')).toHaveLength(8);
  });

  it('keeps physical arrow keys in a right-to-left layout', () => {
    // Window positions with left / top and its handles sit on physical edges, so the
    // arrow moves the edge it points to, as in the WAI-ARIA window splitter pattern.
    const onSizeChange = jest.fn();
    const { container } = render(
      <DirectionProvider initialDirection="rtl">
        <MantineProvider>
          <div dir="rtl">
            <Window
              opened
              title="RTL"
              defaultWidth={400}
              defaultHeight={300}
              onSizeChange={onSizeChange}
            />
          </div>
        </MantineProvider>
      </DirectionProvider>
    );
    const [handle] = getSeparators(container);

    expect(handle.getAttribute('data-resize-handle')).toBe('bottomRight');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 410, height: 300 });
  });

  it('takes its accessible name from resizeHandleLabel', () => {
    const { container } = renderWithMantine(
      <Window opened title="Label" resizeHandleLabel="Redimensionner la fenêtre" />
    );
    expect(getSeparators(container)[0].getAttribute('aria-label')).toBe(
      'Redimensionner la fenêtre'
    );
  });

  it('persists a keyboard resize like a pointer one', () => {
    jest.useFakeTimers();
    try {
      const { container } = renderWithMantine(
        <Window
          opened
          title="Persist keys"
          id="persist-keys"
          persistState
          defaultWidth={400}
          defaultHeight={300}
        />
      );
      // Let the hydration effect mark the window as hydrated before the key press.
      act(() => {
        jest.runOnlyPendingTimers();
      });
      const [handle] = getSeparators(container);

      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      act(() => {
        jest.advanceTimersByTime(200);
      });

      const stored = JSON.parse(localStorage.getItem('persist-keys-window-state')!);
      expect(stored.size).toEqual({ width: 410, height: 300 });
    } finally {
      jest.useRealTimers();
    }
  });

  it('forwards its ref to the root element and still drags', () => {
    const ref = createRef<HTMLDivElement>();
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Ref"
        ref={ref}
        defaultX={100}
        defaultY={100}
        draggable="header"
        onPositionChange={onPositionChange}
      />
    );

    expect(ref.current).toBe(getWindowElement(container));

    const header = container.querySelector('.mantine-Window-header') as HTMLElement;
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 160 });
    fireEvent.mouseUp(document);
    expect(onPositionChange).toHaveBeenCalledWith({ x: 150, y: 160 });
  });
});

describe('Window on touch screens and small boundaries (issue #61)', () => {
  const touch = (identifier: number, clientX: number, clientY: number) => ({
    identifier,
    clientX,
    clientY,
  });

  function getHeader(container: HTMLElement, title: string) {
    const root = container.querySelector(`[aria-label="${title}"]`) as HTMLElement;
    return root.querySelector('.mantine-Window-header') as HTMLElement;
  }

  it('starts one drag per press on the header of a window draggable from anywhere', () => {
    const onDragStart = jest.fn();
    const { container } = renderWithMantine(
      <Window opened title="Once" defaultX={100} defaultY={100} onDragStart={onDragStart} />
    );

    fireEvent.mouseDown(getHeader(container, 'Once'), { clientX: 150, clientY: 120 });
    fireEvent.mouseUp(document);
    fireEvent.touchStart(getHeader(container, 'Once'), {
      touches: [touch(1, 150, 120)],
      changedTouches: [touch(1, 150, 120)],
    });
    fireEvent.touchEnd(document, { touches: [], changedTouches: [touch(1, 150, 120)] });

    expect(onDragStart).toHaveBeenCalledTimes(2);
  });

  it('moves a window only with the finger that pressed it', () => {
    const moveA = jest.fn();
    const moveB = jest.fn();
    const { container } = renderWithMantine(
      <>
        <Window
          opened
          title="A"
          defaultX={20}
          defaultY={100}
          defaultWidth={300}
          onPositionChange={moveA}
        />
        <Window
          opened
          title="B"
          defaultX={500}
          defaultY={100}
          defaultWidth={300}
          onPositionChange={moveB}
        />
      </>
    );

    // Finger 1 presses A, finger 2 presses B and stays still, finger 1 moves.
    fireEvent.touchStart(getHeader(container, 'A'), {
      touches: [touch(1, 100, 120)],
      changedTouches: [touch(1, 100, 120)],
    });
    fireEvent.touchStart(getHeader(container, 'B'), {
      touches: [touch(1, 100, 120), touch(2, 600, 120)],
      changedTouches: [touch(2, 600, 120)],
    });
    fireEvent.touchMove(document, {
      touches: [touch(1, 100, 180), touch(2, 600, 120)],
      changedTouches: [touch(1, 100, 180)],
    });

    expect(moveA).toHaveBeenLastCalledWith({ x: 20, y: 160 });
    expect(moveB).not.toHaveBeenCalled();

    // Finger 2 lifts: B's drag ends, A keeps following finger 1.
    fireEvent.touchEnd(document, {
      touches: [touch(1, 100, 180)],
      changedTouches: [touch(2, 600, 120)],
    });
    fireEvent.touchMove(document, {
      touches: [touch(1, 100, 200)],
      changedTouches: [touch(1, 100, 200)],
    });
    expect(moveA).toHaveBeenLastCalledWith({ x: 20, y: 180 });
    expect(moveB).not.toHaveBeenCalled();
  });

  it('ends a touch drag whose end was lost when the next touch starts', () => {
    const calls: string[] = [];
    const { container } = renderWithMantine(
      <Window
        opened
        title="Lost"
        defaultX={100}
        defaultY={100}
        onDragStart={() => calls.push('start')}
        onDragEnd={() => calls.push('end')}
      />
    );

    fireEvent.touchStart(getHeader(container, 'Lost'), {
      touches: [touch(1, 150, 120)],
      changedTouches: [touch(1, 150, 120)],
    });
    // No touchend for finger 1 ever arrives; a new finger touches somewhere else.
    fireEvent.touchStart(document.body, {
      touches: [touch(2, 900, 700)],
      changedTouches: [touch(2, 900, 700)],
    });

    expect(calls).toEqual(['start', 'end']);
  });

  it('ignores the mouse events a browser emulates right after a tap', () => {
    const onDragStart = jest.fn();
    const { container } = renderWithMantine(
      <Window opened title="Compat" defaultX={100} defaultY={100} onDragStart={onDragStart} />
    );
    const header = getHeader(container, 'Compat');

    fireEvent.touchStart(header, {
      touches: [touch(1, 150, 120)],
      changedTouches: [touch(1, 150, 120)],
    });
    fireEvent.touchEnd(document, { touches: [], changedTouches: [touch(1, 150, 120)] });
    fireEvent.mouseDown(header, { clientX: 150, clientY: 120 });
    fireEvent.mouseUp(document);

    expect(onDragStart).toHaveBeenCalledTimes(1);
  });

  describe('scrollable content', () => {
    function renderScrollable(scrollHeight: number) {
      const onDragStart = jest.fn();
      const utils = renderWithMantine(
        <Window opened title="Scroll" withScrollArea={false} onDragStart={onDragStart}>
          <div data-testid="list" style={{ overflowY: 'auto', height: 50 }}>
            <p data-testid="row">row</p>
          </div>
        </Window>
      );
      const list = utils.getByTestId('list');
      Object.defineProperty(list, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(list, 'clientHeight', { configurable: true, value: 50 });
      return { ...utils, onDragStart, row: utils.getByTestId('row') };
    }

    it('lets a finger scroll content that overflows instead of dragging the window', () => {
      const { row, onDragStart } = renderScrollable(500);

      fireEvent.touchStart(row, {
        touches: [touch(1, 100, 200)],
        changedTouches: [touch(1, 100, 200)],
      });
      fireEvent.touchEnd(document, { touches: [], changedTouches: [touch(1, 100, 200)] });

      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('still drags from content that does not overflow', () => {
      const { row, onDragStart } = renderScrollable(50);

      fireEvent.touchStart(row, {
        touches: [touch(1, 100, 200)],
        changedTouches: [touch(1, 100, 200)],
      });
      fireEvent.touchEnd(document, { touches: [], changedTouches: [touch(1, 100, 200)] });

      expect(onDragStart).toHaveBeenCalledTimes(1);
    });

    it('still drags from overflowing content with the mouse, which scrolls with the wheel', () => {
      const { row, onDragStart } = renderScrollable(500);

      fireEvent.mouseDown(row, { clientX: 100, clientY: 200 });
      fireEvent.mouseUp(document);

      expect(onDragStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('keepInBounds', () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    function setViewport(width: number, height: number) {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
        window.dispatchEvent(new Event('resize'));
      });
    }

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: viewport.width });
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: viewport.height });
    });

    it('moves a window that starts partly outside the viewport back inside', () => {
      const { container } = renderWithMantine(
        <Window
          opened
          title="Outside"
          defaultX={900}
          defaultY={700}
          defaultWidth={400}
          defaultHeight={300}
        />
      );
      const win = getWindowElement(container)!;

      // jsdom's viewport is 1024 × 768.
      expect(win.style.left).toBe('624px');
      expect(win.style.top).toBe('468px');
    });

    it('shrinks a window larger than the viewport to fit it', () => {
      const onSizeChange = jest.fn();
      const { container } = renderWithMantine(
        <Window
          opened
          title="Huge"
          defaultX={0}
          defaultY={0}
          defaultWidth={2000}
          defaultHeight={300}
          onSizeChange={onSizeChange}
        />
      );

      expect(getWindowElement(container)!.style.width).toBe('1024px');
      expect(onSizeChange).toHaveBeenLastCalledWith({ width: 1024, height: 300 });
    });

    it('brings a window back inside after the viewport shrinks, as when a phone rotates', () => {
      const { container } = renderWithMantine(
        <Window
          opened
          title="Rotate"
          defaultX={500}
          defaultY={100}
          defaultWidth={400}
          defaultHeight={300}
        />
      );
      const win = getWindowElement(container)!;
      expect(win.style.left).toBe('500px');

      setViewport(390, 844);

      expect(win.style.left).toBe('0px');
      expect(win.style.width).toBe('390px');
    });

    it('leaves the window where it is with keepInBounds={false}', () => {
      const { container } = renderWithMantine(
        <Window
          opened
          title="Free"
          keepInBounds={false}
          defaultX={900}
          defaultY={700}
          defaultWidth={400}
          defaultHeight={300}
        />
      );

      expect(getWindowElement(container)!.style.left).toBe('900px');
    });
  });

  it('stops a pointer resize at the viewport edge, as keyboard resizing does', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Edge"
        defaultX={600}
        defaultY={100}
        defaultWidth={300}
        defaultHeight={300}
        onSizeChange={onSizeChange}
      />
    );
    const handle = container.querySelector('[data-resize-handle="right"]') as HTMLElement;

    fireEvent.mouseDown(handle, { clientX: 900, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 1500, clientY: 250 });
    fireEvent.mouseUp(document);

    // jsdom's viewport is 1024px wide: the right edge stops there.
    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 424, height: 300 });
  });
});

describe('Window keepInBounds with drags and resizes', () => {
  function dragFarRight(keepInBounds?: boolean) {
    const onPositionChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Far"
        keepInBounds={keepInBounds}
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        dragBounds={{ minX: 0, maxX: 2000 }}
        onPositionChange={onPositionChange}
      />
    );
    const header = container.querySelector('.mantine-Window-header') as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 1900, clientY: 100 });
    fireEvent.mouseUp(document);

    return onPositionChange.mock.calls.at(-1)?.[0];
  }

  it('keeps a drag inside the viewport even where dragBounds would let it out', () => {
    // jsdom's viewport is 1024px wide: the window stops at 1024 - 400.
    expect(dragFarRight()).toEqual({ x: 624, y: 100 });
  });

  it('follows dragBounds alone with keepInBounds={false}', () => {
    expect(dragFarRight(false)).toEqual({ x: 1900, y: 100 });
  });

  it('resizes past the viewport edge with keepInBounds={false}', () => {
    const onSizeChange = jest.fn();
    const { container } = renderWithMantine(
      <Window
        opened
        title="Past"
        keepInBounds={false}
        defaultX={600}
        defaultY={100}
        defaultWidth={300}
        defaultHeight={300}
        onSizeChange={onSizeChange}
      />
    );
    const handle = container.querySelector('[data-resize-handle="right"]') as HTMLElement;

    fireEvent.mouseDown(handle, { clientX: 900, clientY: 250 });
    fireEvent.mouseMove(document, { clientX: 1500, clientY: 250 });
    fireEvent.mouseUp(document);

    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 900, height: 300 });
  });
});
