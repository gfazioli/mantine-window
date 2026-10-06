import { Window } from '@gfazioli/mantine-window';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Window } from '@gfazioli/mantine-window';
import { Box, Text } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title='axis="x"'
        opened
        axis="x"
        defaultX={20}
        defaultY={20}
        defaultWidth={260}
        defaultHeight={160}
        withinPortal={false}
      >
        <Text size="sm">Drag me: I only slide left and right.</Text>
      </Window>

      <Window
        title='axis="y"'
        opened
        axis="y"
        defaultX={20}
        defaultY={220}
        defaultWidth={260}
        defaultHeight={160}
        withinPortal={false}
      >
        <Text size="sm">Drag me: I only slide up and down.</Text>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title='axis="x"'
        opened
        axis="x"
        defaultX={20}
        defaultY={20}
        defaultWidth={260}
        defaultHeight={160}
        withinPortal={false}
      >
        <Text size="sm">Drag me: I only slide left and right.</Text>
      </Window>

      <Window
        title='axis="y"'
        opened
        axis="y"
        defaultX={20}
        defaultY={220}
        defaultWidth={260}
        defaultHeight={160}
        withinPortal={false}
      >
        <Text size="sm">Drag me: I only slide up and down.</Text>
      </Window>
    </Box>
  );
}

export const axis: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
