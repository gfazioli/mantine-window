import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Responsive Window"
        opened
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '50vw', height: '40vh' }}
        minWidth="300px"
        minHeight="200px"
        maxWidth="90vw"
        maxHeight="80vh"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Viewport-based Position & Size</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            <strong>Size:</strong> width: 50vw, height: 40vh
          </Text>
          <Text>
            <strong>Min:</strong> 300px x 200px
          </Text>
          <Text>
            <strong>Max:</strong> 90vw x 80vh
          </Text>
          <Text size="sm" c="dimmed">
            This window combines viewport units for position and size with pixel-based minimum
            constraints and viewport-based maximum constraints. Perfect for creating truly
            responsive layouts!
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
        title="Responsive Window"
        opened
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '50vw', height: '40vh' }}
        minWidth="300px"
        minHeight="200px"
        maxWidth="90vw"
        maxHeight="80vh"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Viewport-based Position & Size</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            <strong>Size:</strong> width: 50vw, height: 40vh
          </Text>
          <Text>
            <strong>Min:</strong> 300px x 200px
          </Text>
          <Text>
            <strong>Max:</strong> 90vw x 80vh
          </Text>
          <Text size="sm" c="dimmed">
            This window combines viewport units for position and size with pixel-based minimum
            constraints and viewport-based maximum constraints. Perfect for creating truly
            responsive layouts!
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const responsiveWindow: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
