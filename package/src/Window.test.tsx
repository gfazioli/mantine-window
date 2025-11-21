import React from 'react';
import { render } from '@mantine-tests/core';
import { Window } from './Window';

describe('Window', () => {
  it('renders without crashing', () => {
    const { container } = render(<Window data={[]} />);
    expect(container).toBeTruthy();
  });
});
