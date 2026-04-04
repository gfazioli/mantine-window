import React from 'react';
import { Button, Stack, Text, Title } from '@mantine/core';
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

export function WithoutShadow() {
  return (
    <Stack>
      <Window title="Hello World" opened shadow="none">
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
      <Window title="Custom Position" opened defaultX={300} defaultY={200}>
        <Title order={4}>This window starts at x:300, y:200</Title>
      </Window>
    </Stack>
  );
}

export function CustomSize() {
  return (
    <Stack>
      <Window title="Custom Size" opened defaultWidth={600} defaultHeight={500}>
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

export function Persistence() {
  return (
    <Stack>
      <Window title="Persistence Example" opened persistState>
        <Title order={4}>Position and size are saved</Title>
        <p>Refresh the page and this window will remember its position and size</p>
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
        defaultX={typeof window !== 'undefined' ? (window.innerWidth - 500) / 2 : 400}
        defaultY={typeof window !== 'undefined' ? (window.innerHeight - 400) / 2 : 200}
        defaultWidth={500}
        defaultHeight={400}
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
          defaultX={50}
          defaultY={80}
          defaultWidth={400}
          defaultHeight={300}
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
          defaultX={20}
          defaultY={50}
          defaultWidth={350}
          defaultHeight={250}
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
          defaultX={20}
          defaultY={50}
          defaultWidth={350}
          defaultHeight={250}
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
        defaultX={100}
        defaultY={100}
        defaultWidth={700}
        defaultHeight={550}
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

export function ViewportConstraints() {
  return (
    <Stack>
      <Window
        title="Viewport-based Constraints"
        opened
        defaultX={50}
        defaultY={50}
        defaultWidth={500}
        defaultHeight={400}
        minWidth="30vw"
        minHeight="20vh"
        maxWidth="80vw"
        maxHeight="70vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Min/Max Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Min:</strong> 30vw x 20vh
          </p>
          <p>
            <strong>Max:</strong> 80vw x 70vh
          </p>
          <p>Try resizing your browser window to see the constraints adapt!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function MixedConstraints() {
  return (
    <Stack>
      <Window
        title="Mixed Unit Constraints"
        opened
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        defaultHeight={350}
        minWidth={300}
        minHeight="15vh"
        maxWidth="60vw"
        maxHeight={600}
        persistState={false}
      >
        <Title order={4}>Mixed Units</Title>
        <Stack gap="sm">
          <p>
            <strong>Min Width:</strong> 300px (fixed)
          </p>
          <p>
            <strong>Min Height:</strong> 15vh (viewport-based)
          </p>
          <p>
            <strong>Max Width:</strong> 60vw (viewport-based)
          </p>
          <p>
            <strong>Max Height:</strong> 600px (fixed)
          </p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function ViewportDragBounds() {
  return (
    <Stack>
      <Window
        title="Viewport-based Drag Bounds"
        opened
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        defaultHeight={300}
        dragBounds={{
          minX: '10vw',
          maxX: '70vw',
          minY: '10vh',
          maxY: '70vh',
        }}
        persistState={false}
      >
        <Title order={4}>Viewport-based Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>X Bounds:</strong> 10vw to 70vw
          </p>
          <p>
            <strong>Y Bounds:</strong> 10vh to 70vh
          </p>
          <p>Try dragging this window - it stays within viewport-based boundaries!</p>
          <p>Resize your browser to see bounds adapt.</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function PercentageDragBounds() {
  return (
    <Stack>
      <Window
        title="Percentage Drag Bounds"
        opened
        defaultX={50}
        defaultY={50}
        defaultWidth={350}
        defaultHeight={280}
        dragBounds={{
          minX: '5%',
          maxX: '75%',
          minY: '5%',
          maxY: '75%',
        }}
        persistState={false}
      >
        <Title order={4}>Percentage Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>X Bounds:</strong> 5% to 75%
          </p>
          <p>
            <strong>Y Bounds:</strong> 5% to 75%
          </p>
          <p>Boundaries are percentage of viewport/container size.</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function MixedDragBounds() {
  return (
    <Stack>
      <Window
        title="Mixed Unit Drag Bounds"
        opened
        defaultX={100}
        defaultY={100}
        defaultWidth={400}
        defaultHeight={300}
        dragBounds={{
          minX: 50,
          maxX: '80vw',
          minY: '10vh',
          maxY: 600,
        }}
        persistState={false}
      >
        <Title order={4}>Mixed Unit Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>Min X:</strong> 50px (fixed)
          </p>
          <p>
            <strong>Max X:</strong> 80vw (viewport-based)
          </p>
          <p>
            <strong>Min Y:</strong> 10vh (viewport-based)
          </p>
          <p>
            <strong>Max Y:</strong> 600px (fixed)
          </p>
          <p>Mix different unit types for flexible boundaries!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function ViewportPosition() {
  return (
    <Stack>
      <Window
        title="Viewport Position"
        opened
        defaultX="10vw"
        defaultY="15vh"
        defaultWidth={400}
        defaultHeight={300}
        persistState={false}
      >
        <Title order={4}>Viewport-based Position</Title>
        <Stack gap="sm">
          <p>
            <strong>X:</strong> 10vw (10% of viewport width)
          </p>
          <p>
            <strong>Y:</strong> 15vh (15% of viewport height)
          </p>
          <p>Position adapts to viewport size. Try resizing the window!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function ViewportSize() {
  return (
    <Stack>
      <Window
        title="Viewport Size"
        opened
        defaultX={50}
        defaultY={50}
        defaultWidth="40vw"
        defaultHeight="50vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Width:</strong> 40vw (40% of viewport width)
          </p>
          <p>
            <strong>Height:</strong> 50vh (50% of viewport height)
          </p>
          <p>Size adapts to viewport size. Try resizing the window!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function PercentagePosition() {
  return (
    <Stack>
      <Window
        title="Percentage Position"
        opened
        defaultX="20%"
        defaultY="25%"
        defaultWidth={350}
        defaultHeight={250}
        persistState={false}
      >
        <Title order={4}>Percentage-based Position</Title>
        <Stack gap="sm">
          <p>
            <strong>X:</strong> 20% (of container/viewport width)
          </p>
          <p>
            <strong>Y:</strong> 25% (of container/viewport height)
          </p>
          <p>Position is calculated as percentage of available space.</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function PercentageSize() {
  return (
    <Stack>
      <Window
        title="Percentage Size"
        opened
        defaultX={100}
        defaultY={80}
        defaultWidth="60%"
        defaultHeight="70%"
        persistState={false}
      >
        <Title order={4}>Percentage-based Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Width:</strong> 60% (of container/viewport width)
          </p>
          <p>
            <strong>Height:</strong> 70% (of container/viewport height)
          </p>
          <p>Size is calculated as percentage of available space.</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function ResponsiveWindow() {
  return (
    <Stack>
      <Window
        title="Fully Responsive Window"
        opened
        defaultX="5vw"
        defaultY="10vh"
        defaultWidth="50vw"
        defaultHeight="40vh"
        minWidth="300px"
        maxWidth="90vw"
        minHeight="200px"
        maxHeight="80vh"
        dragBounds={{
          minX: '2vw',
          maxX: '90vw',
          minY: '5vh',
          maxY: '90vh',
        }}
        persistState={false}
      >
        <Title order={4}>Responsive Configuration</Title>
        <Stack gap="sm">
          <p>
            <strong>Position:</strong> 5vw, 10vh
          </p>
          <p>
            <strong>Size:</strong> 50vw × 40vh
          </p>
          <p>
            <strong>Min Size:</strong> 300px × 200px
          </p>
          <p>
            <strong>Max Size:</strong> 90vw × 80vh
          </p>
          <p>
            <strong>Drag Bounds:</strong> 2-90vw, 5-90vh
          </p>
          <p>Complete responsive setup using viewport units!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function MixedUnitsPositionAndSize() {
  return (
    <Stack>
      <Window
        title="Mixed Units"
        opened
        defaultX="15vw"
        defaultY={100}
        defaultWidth={450}
        defaultHeight="35vh"
        persistState={false}
      >
        <Title order={4}>Mixed Unit Types</Title>
        <Stack gap="sm">
          <p>
            <strong>X:</strong> 15vw (viewport-based)
          </p>
          <p>
            <strong>Y:</strong> 100px (fixed)
          </p>
          <p>
            <strong>Width:</strong> 450px (fixed)
          </p>
          <p>
            <strong>Height:</strong> 35vh (viewport-based)
          </p>
          <p>Mix viewport units and pixels for flexible layouts!</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function FullSizeResizeHandles() {
  return (
    <Stack>
      <Window
        title="Full Size Resize Handles"
        id="full-size-handles"
        opened
        fullSizeResizeHandles
        defaultWidth={500}
        defaultHeight={350}
      >
        <Stack p="md">
          <Title order={4}>Full Size Resize Handles</Title>
          <p>
            When <code>fullSizeResizeHandles</code> is enabled, the side handles (top, bottom, left,
            right) span the entire width or height of the window.
          </p>
          <p>
            This makes it much easier to resize the window from any edge, while still preserving the
            corner handles for diagonal resizing.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--mantine-color-dimmed)' }}>
            Corner handles remain 14x14px for diagonal resizing.
          </p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function FullSizeResizeHandlesComparison() {
  return (
    <Stack>
      <Window
        title="Default Handles (Centered)"
        id="default-handles"
        opened
        fullSizeResizeHandles={false}
        defaultX={50}
        defaultY={50}
        defaultWidth={400}
        defaultHeight={300}
      >
        <Stack p="md">
          <p>
            <strong>fullSizeResizeHandles:</strong> false (default)
          </p>
          <p>Side handles are only 40px wide/tall and centered on each edge.</p>
        </Stack>
      </Window>
      <Window
        title="Full Size Handles"
        id="full-handles"
        opened
        fullSizeResizeHandles
        defaultX={500}
        defaultY={50}
        defaultWidth={400}
        defaultHeight={300}
      >
        <Stack p="md">
          <p>
            <strong>fullSizeResizeHandles:</strong> true
          </p>
          <p>Side handles span the entire edge, avoiding corner handles.</p>
        </Stack>
      </Window>
    </Stack>
  );
}

export function WindowGroupBasic() {
  return (
    <Window.Group style={{ width: '100%', height: 600, border: '2px dashed gray' }}>
      <Window
        id="g-editor"
        title="Editor"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Editor</Title>
        <p>Click the green button for layout options</p>
      </Window>
      <Window
        id="g-preview"
        title="Preview"
        opened
        defaultX={320}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Preview</Title>
      </Window>
      <Window
        id="g-console"
        title="Console"
        opened
        defaultX={10}
        defaultY={270}
        defaultWidth={610}
        defaultHeight={200}
      >
        <Title order={4}>Console</Title>
      </Window>
    </Window.Group>
  );
}

export function WindowGroupTile() {
  return (
    <Window.Group style={{ width: '100%', height: 600, border: '2px dashed gray' }}>
      <Window
        id="tile-1"
        title="Window 1"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={200}
        defaultHeight={150}
      >
        <Title order={4}>Window 1</Title>
      </Window>
      <Window
        id="tile-2"
        title="Window 2"
        opened
        defaultX={220}
        defaultY={10}
        defaultWidth={200}
        defaultHeight={150}
      >
        <Title order={4}>Window 2</Title>
      </Window>
      <Window
        id="tile-3"
        title="Window 3"
        opened
        defaultX={10}
        defaultY={170}
        defaultWidth={200}
        defaultHeight={150}
      >
        <Title order={4}>Window 3</Title>
      </Window>
      <Window
        id="tile-4"
        title="Window 4"
        opened
        defaultX={220}
        defaultY={170}
        defaultWidth={200}
        defaultHeight={150}
      >
        <Title order={4}>Window 4</Title>
      </Window>
    </Window.Group>
  );
}

export function WithoutScrollArea() {
  const lines = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet`);
  return (
    <Stack>
      <Window title="With ScrollArea" opened defaultWidth={300} defaultHeight={200}>
        {lines.map((line, i) => (
          <Text key={i} size="sm">
            {line}
          </Text>
        ))}
      </Window>
      <Window
        title="Without ScrollArea"
        opened
        withScrollArea={false}
        defaultX={320}
        defaultWidth={300}
        defaultHeight={200}
      >
        {lines.map((line, i) => (
          <Text key={i} size="sm">
            {line}
          </Text>
        ))}
      </Window>
    </Stack>
  );
}

export function ControlsRight() {
  return (
    <Stack>
      <Window title="macOS style (left)" opened defaultWidth={300} defaultHeight={150}>
        <Text size="sm">Controls on the left</Text>
      </Window>
      <Window
        title="Windows style (right)"
        opened
        controlsPosition="right"
        defaultX={320}
        defaultWidth={300}
        defaultHeight={150}
      >
        <Text size="sm">Controls on the right — auto-reversed order</Text>
      </Window>
    </Stack>
  );
}

export function CustomControlsOrder() {
  return (
    <Stack>
      <Window
        title="Custom: tools, close, collapse"
        opened
        controlsOrder={['tools', 'close', 'collapse']}
        defaultWidth={350}
        defaultHeight={150}
      >
        <Text size="sm">Custom button order</Text>
      </Window>
      <Window
        title="Custom: collapse, tools, close"
        opened
        controlsOrder={['collapse', 'tools', 'close']}
        defaultX={370}
        defaultWidth={350}
        defaultHeight={150}
      >
        <Text size="sm">Another custom order</Text>
      </Window>
    </Stack>
  );
}
