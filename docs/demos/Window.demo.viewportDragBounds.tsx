import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport-based Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: '10vw',
          maxX: '70vw',
          minY: '10vh',
          maxY: '70vh',
        }}
        persistState={false}
        withinPortal={false}
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
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport-based Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: '10vw',
          maxX: '70vw',
          minY: '10vh',
          maxY: '70vh',
        }}
        persistState={false}
        withinPortal={false}
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
    </Box>
  );
}

export const viewportDragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
