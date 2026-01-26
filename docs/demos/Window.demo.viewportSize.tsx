import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: '40vw', height: '50vh' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Size with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 40vw, height: 50vh
          </Text>
          <Text>
            The window size scales proportionally with the viewport. Try resizing your browser
            window to see the window adapt!
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: '40vw', height: '50vh' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Size with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 40vw, height: 50vh
          </Text>
          <Text>
            The window size scales proportionally with the viewport. Try resizing your browser
            window to see the window adapt!
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const viewportSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
