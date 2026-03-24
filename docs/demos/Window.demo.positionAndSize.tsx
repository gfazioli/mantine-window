import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Position & Size"
        opened
        defaultX={150}
        defaultY={80}
        defaultWidth={350}
        defaultHeight={250}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position: x=150, y=80</Title>
        <p>Size: 350 x 250</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Custom Position & Size"
        opened
        defaultX={150}
        defaultY={80}
        defaultWidth={350}
        defaultHeight={250}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position: x=150, y=80</Title>
        <p>Size: 350 x 250</p>
      </Window>
    </Box>
  );
}

export const positionAndSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
