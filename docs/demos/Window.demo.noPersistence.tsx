import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="No Persistence"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position and size are not saved</Title>
        <p>Refresh the page and this window will return to default position</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="No Persistence"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position and size are not saved</Title>
        <p>Refresh the page and this window will return to default position</p>
      </Window>
    </Box>
  );
}

export const noPersistence: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
