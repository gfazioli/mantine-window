import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Bounded Dragging"
        opened
        defaultPosition={{ x: 100, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: 500,
          minY: 50,
          maxY: 400,
        }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Try dragging this window</Title>
        <p>It can only move within specific bounds:</p>
        <p>X: 50-500, Y: 50-400</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Bounded Dragging"
        opened
        defaultPosition={{ x: 100, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: 500,
          minY: 50,
          maxY: 400,
        }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Try dragging this window</Title>
        <p>It can only move within specific bounds:</p>
        <p>X: 50-500, Y: 50-400</p>
      </Window>
    </Box>
  );
}

export const dragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
