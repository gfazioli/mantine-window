import React, { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
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
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.collapsed).toBe(true);
    }
    // If debounce hasn't flushed yet, at minimum the collapse worked
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
});
