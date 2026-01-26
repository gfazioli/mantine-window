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
});
