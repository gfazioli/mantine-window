import React from 'react';
import { render } from '@mantine-tests/core';
import { JsonTree } from './JsonTree';

describe('JsonTree', () => {
  it('renders without crashing', () => {
    const { container } = render(<JsonTree data={[]} />);
    expect(container).toBeTruthy();
  });
});
