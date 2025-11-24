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

export function Collapsed() {
  return (
    <Stack>
      <Window title="Hello World" collapsed>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function WithoutBorder() {
  return (
    <Stack>
      <Window title="Hello World" withBorder={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Radius() {
  return (
    <Stack>
      <Window title="Hello World" radius={4} withBorder>
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

export function ResizeNone() {
  return (
    <Stack>
      <Window title="Hello World" resizable="none">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function ResizeVertical() {
  return (
    <Stack>
      <Window title="Hello World" resizable="vertical">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function ResizeHorizontal() {
  return (
    <Stack>
      <Window title="Hello World" resizable="horizontal">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableNone() {
  return (
    <Stack>
      <Window title="Hello World" draggable="none">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableHeader() {
  return (
    <Stack>
      <Window title="Hello World" draggable="header">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableWindow() {
  return (
    <Stack>
      <Window title="Hello World" draggable="window">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}
