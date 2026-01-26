import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport Position"
        opened
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10vw, y: 15vh
          </Text>
          <Text>
            The window position adapts proportionally to the viewport size.
            Resize your browser window to see it maintain relative positioning!
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
        title="Viewport Position"
        opened
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10vw, y: 15vh
          </Text>
          <Text>
            The window position adapts proportionally to the viewport size. Resize your browser
            window to see it maintain relative positioning!
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const viewportPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
