import React from 'react';
import { ScrollArea, Stack } from '@mantine/core';
import { JsonTree, JsonTreeProps } from './JsonTree';

export default {
  title: 'JsonTree Props',
  args: {
    defaultExpanded: false,
    maxDepth: 2,
    withExpandAll: false,
    showItemsCount: false,
    withCopyToClipboard: false,
    showIndentGuides: false,
    stickyHeader: false,
    stickyHeaderOffset: 0,
  },
  argTypes: {
    defaultExpanded: { control: 'boolean' },
    maxDepth: { control: 'number' },
    withExpandAll: { control: 'boolean' },
    title: { control: 'text' },
    showItemsCount: { control: 'boolean' },
    withCopyToClipboard: { control: 'boolean' },
    showIndentGuides: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    stickyHeaderOffset: { control: 'number' },
  },
};

const data = {
  name: 'John Doe',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  wife: null,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
  },
  action: { type: 'click', payload: undefined },
  projects: [
    {
      name: 'Project A',
      status: 'completed',
    },
    {
      name: 'Project B',
      status: 'in progress',
    },
  ],
};

export function UsageProps(props: JsonTreeProps) {
  return <JsonTree data={data} {...props} />;
}

export function WrapScrollAreaProps(props: JsonTreeProps) {
  return (
    <Stack style={{ border: '1px solid red' }} pos="relative">
      <ScrollArea style={{ height: 200 }} type="scroll">
        <JsonTree data={data} {...props} />
      </ScrollArea>
    </Stack>
  );
}
