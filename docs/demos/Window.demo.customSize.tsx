import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 400 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window is 500x400 pixels</Title>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 400 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window is 500x400 pixels</Title>
      </Window>
    </Box>
  );
}

export const customSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
