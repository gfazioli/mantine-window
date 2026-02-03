import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="With Persistence"
        id="persistent-window-demo"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState
        withinPortal={false}
      >
        <Title order={4}>Position, size, and collapsed state are saved in localStorage</Title>
        <p>Move, resize, or collapse/expand this window, then refresh the page</p>
        <p>The window will remember its last position, size, and collapsed state</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="With Persistence"
        id="persistent-window-demo"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        persistState
        withinPortal={false}
      >
        <Title order={4}>Position, size, and collapsed state are saved in localStorage</Title>
        <p>Move, resize, or collapse/expand this window, then refresh the page</p>
        <p>The window will remember its last position, size, and collapsed state</p>
      </Window>
    </Box>
  );
}

export const persistence: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
