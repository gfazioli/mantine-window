import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
      <Window title="Hello World" opened>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function LongTitle() {
  return (
    <Stack>
      <Window title="Hello, World! Very Long Title Example" opened>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Controlled() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack>
      <Button onClick={open}>Open window</Button>
      <Window title="Hello World" opened={opened} onClose={close}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Collapsed() {
  return (
    <Stack>
      <Window title="Hello World" opened collapsed>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function WithoutBorder() {
  return (
    <Stack>
      <Window title="Hello World" opened withBorder={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Radius() {
  return (
    <Stack>
      <Window title="Hello World" opened radius={4} withBorder>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Shadow() {
  return (
    <Stack>
      <Window title="Hello World" opened shadow="sm">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function ResizeNone() {
  return (
    <Stack>
      <Window title="Hello World" opened resizable="none">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function ResizeVertical() {
  return (
    <Stack>
      <Window title="Hello World" opened resizable="vertical">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function ResizeHorizontal() {
  return (
    <Stack>
      <Window title="Hello World" opened resizable="horizontal">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableNone() {
  return (
    <Stack>
      <Window title="Hello World" opened draggable="none">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableHeader() {
  return (
    <Stack>
      <Window title="Hello World" opened draggable="header">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function DraggableWindow() {
  return (
    <Stack>
      <Window title="Hello World" opened draggable="window">
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function WithoutCloseButton() {
  return (
    <Stack>
      <Window title="Hello World" opened withCloseButton={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function WithoutCollapseButton() {
  return (
    <Stack>
      <Window title="Hello World" opened withCollapseButton={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function NoCollapsable() {
  return (
    <Stack>
      <Window title="Hello World" opened collapsable={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Multiple() {
  return (
    <Stack>
      <Window title="Window 1" id="w-1" opened>
        <Title order={4}>This is a window</Title>
      </Window>
      <Window title="Window 2" id="w-2" opened>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}
