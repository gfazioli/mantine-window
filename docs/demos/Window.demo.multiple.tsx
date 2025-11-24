import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Window 1"
        id="demo-window-1"
        opened
        defaultPosition={{ x: 20, y: 20 }}
        defaultSize={{ width: 300, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>First Window</Title>
        <p>Click on a window to bring it to front</p>
      </Window>
      <Window
        title="Window 2"
        id="demo-window-2"
        opened
        defaultPosition={{ x: 180, y: 80 }}
        defaultSize={{ width: 300, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Second Window</Title>
        <p>Click on a window to bring it to front</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Window 1"
        id="demo-window-1"
        opened
        defaultPosition={{ x: 20, y: 20 }}
        defaultSize={{ width: 300, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>First Window</Title>
        <p>Click on a window to bring it to front</p>
      </Window>
      <Window
        title="Window 2"
        id="demo-window-2"
        opened
        defaultPosition={{ x: 180, y: 80 }}
        defaultSize={{ width: 300, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Second Window</Title>
        <p>Click on a window to bring it to front</p>
      </Window>
    </Box>
  );
}

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
