import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Percentage Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 350, height: 280 }}
        dragBounds={{
          minX: '5%',
          maxX: '75%',
          minY: '5%',
          maxY: '75%',
        }}
        persistState={false}
        withinPortal={false}
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
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Percentage Drag Bounds"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 350, height: 280 }}
        dragBounds={{
          minX: '5%',
          maxX: '75%',
          minY: '5%',
          maxY: '75%',
        }}
        persistState={false}
        withinPortal={false}
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
    </Box>
  );
}

export const percentageDragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
