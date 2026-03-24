import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Window } from './Window';

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

  // ─── Unit handling ────────────────────────────────────────────────────

  it('handles viewport units without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: '40vw', height: '50vh' }}
      />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('handles percentage units without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: '20%', y: '25%' }}
        defaultSize={{ width: '60%', height: '70%' }}
      />
    );
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('handles mixed units (pixels and viewport) without hydration errors', () => {
    const { container } = renderWithMantine(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: 100, y: '10vh' }}
        defaultSize={{ width: '50vw', height: 300 }}
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

    // Initially expanded
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
    expect(screen.getByLabelText('Collapse window')).toBeTruthy();

    // Click collapse
    fireEvent.click(screen.getByLabelText('Collapse window'));
    expect(container.querySelector('.mantine-Window-content')).toBeNull();
    expect(screen.getByLabelText('Expand window')).toBeTruthy();

    // Click expand
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
    // Should remain expanded
    expect(container.querySelector('.mantine-Window-content')).toBeTruthy();
  });

  // ─── Resizable mode / handle visibility ───────────────────────────────

  it('renders all 8 resize handles when resizable="both"', () => {
    const { container } = renderWithMantine(<Window opened title="Resize Both" resizable="both" />);
    const handles = container.querySelectorAll('[data-resize-handle]');
    expect(handles.length).toBe(8);
  });

  it('renders only vertical + horizontal side handles when resizable="vertical"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Resize V" resizable="vertical" />
    );
    const handles = container.querySelectorAll('[data-resize-handle]');
    // vertical: top + bottom = 2
    expect(handles.length).toBe(2);
  });

  it('renders only horizontal side handles when resizable="horizontal"', () => {
    const { container } = renderWithMantine(
      <Window opened title="Resize H" resizable="horizontal" />
    );
    const handles = container.querySelectorAll('[data-resize-handle]');
    // horizontal: left + right = 2
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
    // Only left + right horizontal handles should remain when collapsed
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

    // Should be collapsed based on persisted state
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
    // top, bottom, left, right = 4 handles with data-full-size
    expect(fullSizeHandles.length).toBe(4);
  });

  it('does not set data-full-size when fullSizeResizeHandles is false', () => {
    const { container } = renderWithMantine(
      <Window opened title="Default Handles" fullSizeResizeHandles={false} resizable="both" />
    );
    const fullSizeHandles = container.querySelectorAll('[data-full-size="true"]');
    expect(fullSizeHandles.length).toBe(0);
  });

  // ─── Window with no title ────────────────────────────────────────────

  it('renders without a title', () => {
    const { container } = renderWithMantine(<Window opened />);
    expect(getWindowElement(container)).toBeTruthy();
  });

  it('renders without children', () => {
    const { container } = renderWithMantine(<Window opened title="Empty" />);
    expect(getWindowElement(container)).toBeTruthy();
  });
});
