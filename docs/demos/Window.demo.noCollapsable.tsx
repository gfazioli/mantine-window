import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="No Collapsable"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        collapsable={false}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window cannot be collapsed</Title>
        <p>Double-clicking the header will not collapse the window</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="No Collapsable"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        collapsable={false}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>This window cannot be collapsed</Title>
        <p>Double-clicking the header will not collapse the window</p>
      </Window>
    </Box>
  );
}

export const noCollapsable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
