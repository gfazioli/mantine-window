import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Centered Window"
        opened
        defaultPosition={{ x: 190, y: 100 }}
        defaultSize={{ width: 420, height: 300 }}
        resizable="none"
        draggable="none"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Centered, fixed window</Title>
        <p>This window is centered and cannot be moved or resized</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Centered Window"
        opened
        defaultPosition={{ x: 190, y: 100 }}
        defaultSize={{ width: 420, height: 300 }}
        resizable="none"
        draggable="none"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Centered, fixed window</Title>
        <p>This window is centered and cannot be moved or resized</p>
      </Window>
    </Box>
  );
}

export const centered: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
