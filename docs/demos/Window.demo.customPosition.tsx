import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Position"
        opened
        defaultPosition={{ x: 200, y: 150 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window starts at x:200, y:150</Title>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Position"
        opened
        defaultPosition={{ x: 200, y: 150 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window starts at x:200, y:150</Title>
      </Window>
    </Box>
  );
}

export const customPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
