import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Window } from './Window';

export default {
  title: 'Window',
  args: {},
  argTypes: {},
};

export function Usage() {
  return (
    <Stack>
      <Window title="Hello World" opened>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export function Color() {
  return (
    <Stack>
      <Window title="Hello World" opened color="teal">
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

export function CustomPosition() {
  return (
    <Stack>
      <Window title="Custom Position" opened defaultPosition={{ x: 300, y: 200 }}>
        <Title order={4}>This window starts at x:300, y:200</Title>
      </Window>
    </Stack>
  );
}

export function CustomSize() {
  return (
    <Stack>
      <Window title="Custom Size" opened defaultSize={{ width: 600, height: 500 }}>
        <Title order={4}>This window is 600x500 pixels</Title>
      </Window>
    </Stack>
  );
}

export function WithMinMaxSize() {
  return (
    <Stack>
      <Window
        title="Constrained Resize"
        opened
        minWidth={300}
        minHeight={200}
        maxWidth={800}
        maxHeight={600}
      >
        <Title order={4}>Try resizing this window</Title>
        <p>Min: 300x200px</p>
        <p>Max: 800x600px</p>
      </Window>
    </Stack>
  );
}

export function WithDragBounds() {
  return (
    <Stack>
      <Window
        title="Bounded Dragging"
        opened
        dragBounds={{
          minX: 50,
          maxX: 800,
          minY: 50,
          maxY: 500,
        }}
      >
        <Title order={4}>Try dragging this window</Title>
        <p>It can only move within specific bounds:</p>
        <p>X: 50-800, Y: 50-500</p>
      </Window>
    </Stack>
  );
}

export function NoPersistence() {
  return (
    <Stack>
      <Window title="No Persistence" opened persistState={false}>
        <Title order={4}>Position and size are not saved</Title>
        <p>Refresh the page and this window will return to default position</p>
      </Window>
    </Stack>
  );
}

export function WithCallbacks() {
  return (
    <Stack>
      <Window
        title="With Callbacks"
        opened
        onPositionChange={(pos) => {
          // eslint-disable-next-line no-console
          console.log('Position changed:', pos);
        }}
        onSizeChange={(size) => {
          // eslint-disable-next-line no-console
          console.log('Size changed:', size);
        }}
      >
        <Title order={4}>Open console to see callbacks</Title>
        <p>Move or resize this window to trigger callbacks</p>
      </Window>
    </Stack>
  );
}

export function Centered() {
  return (
    <Stack>
      <Window
        title="Centered Window"
        opened
        defaultPosition={{
          x: typeof window !== 'undefined' ? (window.innerWidth - 500) / 2 : 400,
          y: typeof window !== 'undefined' ? (window.innerHeight - 400) / 2 : 200,
        }}
        defaultSize={{ width: 500, height: 400 }}
        resizable="none"
        draggable="none"
      >
        <Title order={4}>Centered, fixed window</Title>
        <p>This window is centered and cannot be moved or resized</p>
      </Window>
    </Stack>
  );
}

export function WithinContainer() {
  return (
    <Stack>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 600,
          border: '2px dashed var(--mantine-color-blue-5)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--mantine-color-default)',
          padding: 10,
        }}
      >
        <Title
          order={5}
          style={{
            marginBottom: 10,
            color: 'var(--mantine-color-blue-5)',
          }}
        >
          Container with position: relative
        </Title>
        <Window
          title="Window in Container"
          id="container-window"
          opened
          withinPortal={false}
          defaultPosition={{ x: 50, y: 80 }}
          defaultSize={{ width: 400, height: 300 }}
          persistState={false}
        >
          <Stack gap="sm">
            <Title order={4}>Contained Window</Title>
            <p>✅ This window is positioned relative to its parent container</p>
            <p>✅ Try dragging it - it cannot leave the blue bordered area</p>
            <p>✅ Position is absolute, not fixed</p>
            <p>
              <strong>withinPortal={'{false}'}</strong>
            </p>
          </Stack>
        </Window>
      </div>
    </Stack>
  );
}

export function MultipleContainers() {
  return (
    <Stack gap="xl">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 400,
          border: '2px dashed var(--mantine-color-red-5)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--mantine-color-gray-0)',
        }}
      >
        <Title
          order={5}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'var(--mantine-color-red-5)',
          }}
        >
          Container 1
        </Title>
        <Window
          title="Window 1"
          id="multi-container-1"
          opened
          withinPortal={false}
          defaultPosition={{ x: 20, y: 50 }}
          defaultSize={{ width: 350, height: 250 }}
          persistState={false}
        >
          <Title order={4}>Container 1 Window</Title>
          <p>This window lives in container 1</p>
        </Window>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 400,
          border: '2px dashed var(--mantine-color-green-5)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--mantine-color-gray-0)',
        }}
      >
        <Title
          order={5}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'var(--mantine-color-green-5)',
          }}
        >
          Container 2
        </Title>
        <Window
          title="Window 2"
          id="multi-container-2"
          opened
          withinPortal={false}
          defaultPosition={{ x: 20, y: 50 }}
          defaultSize={{ width: 350, height: 250 }}
          persistState={false}
        >
          <Title order={4}>Container 2 Window</Title>
          <p>This window lives in container 2</p>
        </Window>
      </div>
    </Stack>
  );
}

export function FullExample() {
  return (
    <Stack>
      <Window
        title="Full Configuration"
        id="full-config-window"
        opened
        defaultPosition={{ x: 100, y: 100 }}
        defaultSize={{ width: 700, height: 550 }}
        minWidth={400}
        minHeight={300}
        maxWidth={1200}
        maxHeight={900}
        dragBounds={{
          minX: 0,
          maxX: typeof window !== 'undefined' ? window.innerWidth - 100 : 1000,
          minY: 0,
          maxY: typeof window !== 'undefined' ? window.innerHeight - 100 : 700,
        }}
        persistState
        resizable="both"
        draggable="both"
        withBorder
        shadow="lg"
        radius="md"
        onPositionChange={(pos) => {
          // eslint-disable-next-line no-console
          console.log('Position:', pos);
        }}
        onSizeChange={(size) => {
          // eslint-disable-next-line no-console
          console.log('Size:', size);
        }}
      >
        <Title order={4}>Fully Configured Window</Title>
        <Stack gap="sm">
          <p>
            <strong>Position:</strong> Starts at 100x100
          </p>
          <p>
            <strong>Size:</strong> 700x550 (min: 400x300, max: 1200x900)
          </p>
          <p>
            <strong>Drag bounds:</strong> Cannot leave viewport
          </p>
          <p>
            <strong>Persistence:</strong> Enabled (position/size saved)
          </p>
          <p>
            <strong>Callbacks:</strong> Check console for events
          </p>
        </Stack>
      </Window>
    </Stack>
  );
}
