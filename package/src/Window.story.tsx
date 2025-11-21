import React from 'react';
import { Stack, Title } from '@mantine/core';
import { Window } from './Window';

export default {
  title: 'Window',
  args: {},
  argTypes: {},
};

const data = {};

export function Usage() {
  return (
    <Stack>
      <Window title="Hello World">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function WithBorder() {
  return (
    <Stack>
      <Window title="Hello World" withBorder>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Radius() {
  return (
    <Stack>
      <Window title="Hello World" radius={32} withBorder>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Shadow() {
  return (
    <Stack>
      <Window title="Hello World" shadow="sm">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}
