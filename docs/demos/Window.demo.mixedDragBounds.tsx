import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Mixed Unit Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: '80vw',
          minY: '10vh',
          maxY: 450,
        }}
        persistState={false}
        withinPortal={false}
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
            <strong>Max Y:</strong> 450px (fixed)
          </p>
          <p>Mix different unit types for flexible boundaries!</p>
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
        title="Mixed Unit Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: '80vw',
          minY: '10vh',
          maxY: 450,
        }}
        persistState={false}
        withinPortal={false}
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
            <strong>Max Y:</strong> 450px (fixed)
          </p>
          <p>Mix different unit types for flexible boundaries!</p>
        </Stack>
      </Window>
    </Box>
  );
}

export const mixedDragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
