import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Viewport-based Constraints"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 350 }}
        minWidth="30vw"
        minHeight="20vh"
        maxWidth="80vw"
        maxHeight="70vh"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Viewport-based Min/Max Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Min:</strong> 30vw x 20vh
          </p>
          <p>
            <strong>Max:</strong> 80vw x 70vh
          </p>
          <p>Try resizing your browser window to see the constraints adapt!</p>
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
        title="Viewport-based Constraints"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 350 }}
        minWidth="30vw"
        minHeight="20vh"
        maxWidth="80vw"
        maxHeight="70vh"
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Viewport-based Min/Max Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Min:</strong> 30vw x 20vh
          </p>
          <p>
            <strong>Max:</strong> 80vw x 70vh
          </p>
          <p>Try resizing your browser window to see the constraints adapt!</p>
        </Stack>
      </Window>
    </Box>
  );
}

export const viewportConstraints: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
