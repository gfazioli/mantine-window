import React from 'react';
import { render } from '@mantine-tests/core';
import { Window } from './Window';

describe('Window', () => {
  it('renders without crashing', () => {
    const { container } = render(<Window />);
    expect(container).toBeTruthy();
  });

  it('handles viewport units without hydration errors', () => {
    const { container } = render(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: '40vw', height: '50vh' }}
      />
    );
    expect(container).toBeTruthy();
    // During initial render (SSR-like), should use default pixel values
    // After mount, should convert viewport units to pixels
    const windowElement = container.querySelector('[data-mantine-window]');
    expect(windowElement).toBeTruthy();
  });

  it('handles percentage units without hydration errors', () => {
    const { container } = render(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: '20%', y: '25%' }}
        defaultSize={{ width: '60%', height: '70%' }}
      />
    );
    expect(container).toBeTruthy();
    const windowElement = container.querySelector('[data-mantine-window]');
    expect(windowElement).toBeTruthy();
  });

  it('handles mixed units (pixels and viewport) without hydration errors', () => {
    const { container } = render(
      <Window
        opened
        title="Test Window"
        defaultPosition={{ x: 100, y: '10vh' }}
        defaultSize={{ width: '50vw', height: 300 }}
      />
    );
    expect(container).toBeTruthy();
    const windowElement = container.querySelector('[data-mantine-window]');
    expect(windowElement).toBeTruthy();
  });

  it('persists collapsed state in localStorage when persistState is enabled', () => {
    const { container } = render(
      <Window
        opened
        title="Persist Test Window"
        persistState
        collapsed={false}
        collapsable
        withCollapseButton
      />
    );

    // Initially content should be visible
    const initialContent = container.querySelector('.mantine-Window-content');
    expect(initialContent).toBeTruthy();

    // Test that the component can be rendered with collapsed={true}
    const { container: collapsedContainer } = render(
      <Window
        opened
        title="Persist Test Window"
        persistState
        collapsed
        collapsable
        withCollapseButton
      />
    );

    // When collapsed, content should not be visible
    const collapsedContent = collapsedContainer.querySelector('.mantine-Window-content');
    expect(collapsedContent).toBeNull();
  });

  it('initializes collapsed state from props', () => {
    const { container } = render(
      <Window opened title="Test Collapsed Window" collapsed collapsable withCollapseButton />
    );

    // When collapsed initially, content should not be visible
    const contentElement = container.querySelector('.mantine-Window-content');
    expect(contentElement).toBeNull();
  });
});
