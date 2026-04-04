import { Window } from '@gfazioli/mantine-window';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Text } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      {/* macOS style: close, collapse, tools on the left (default) */}
      <Window
        title="macOS style (default)"
        opened
        defaultX={20} defaultY={20}
        defaultWidth={300} defaultHeight={150}
        controlsPosition="left"
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Controls on the left — macOS style</Text>
      </Window>

      {/* Windows style: tools, collapse, close on the right (auto-reversed) */}
      <Window
        title="Windows style"
        opened
        defaultX={350} defaultY={20}
        defaultWidth={300} defaultHeight={150}
        controlsPosition="right"
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Controls on the right — Windows style</Text>
        <Text size="sm" c="dimmed">Button order is automatically reversed</Text>
      </Window>

      {/* Custom order: tools first, then close */}
      <Window
        title="Custom order"
        opened
        defaultX={20} defaultY={220}
        defaultWidth={300} defaultHeight={150}
        controlsOrder={['tools', 'close', 'collapse']}
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Custom order: tools, close, collapse</Text>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="macOS style (default)"
        opened
        defaultX={20}
        defaultY={20}
        defaultWidth={300}
        defaultHeight={150}
        controlsPosition="left"
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Controls on the left — macOS style</Text>
      </Window>

      <Window
        title="Windows style"
        opened
        defaultX={350}
        defaultY={20}
        defaultWidth={300}
        defaultHeight={150}
        controlsPosition="right"
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Controls on the right — Windows style</Text>
        <Text size="sm" c="dimmed">
          Button order is automatically reversed
        </Text>
      </Window>

      <Window
        title="Custom order"
        opened
        defaultX={20}
        defaultY={220}
        defaultWidth={300}
        defaultHeight={150}
        controlsOrder={['tools', 'close', 'collapse']}
        persistState={false}
        withinPortal={false}
      >
        <Text size="sm">Custom order: tools, close, collapse</Text>
      </Window>
    </Box>
  );
}

export const controlsPositionDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
