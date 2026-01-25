import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Mixed Unit Constraints"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 350 }}
        minWidth={300}
        minHeight="15vh"
        maxWidth="60vw"
        maxHeight={600}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Mixed Units</Title>
        <Stack gap="sm">
          <p>
            <strong>Min Width:</strong> 300px (fixed)
          </p>
          <p>
            <strong>Min Height:</strong> 15vh (viewport-based)
          </p>
          <p>
            <strong>Max Width:</strong> 60vw (viewport-based)
          </p>
          <p>
            <strong>Max Height:</strong> 600px (fixed)
          </p>
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
        title="Mixed Unit Constraints"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 350 }}
        minWidth={300}
        minHeight="15vh"
        maxWidth="60vw"
        maxHeight={600}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Mixed Units</Title>
        <Stack gap="sm">
          <p>
            <strong>Min Width:</strong> 300px (fixed)
          </p>
          <p>
            <strong>Min Height:</strong> 15vh (viewport-based)
          </p>
          <p>
            <strong>Max Width:</strong> 60vw (viewport-based)
          </p>
          <p>
            <strong>Max Height:</strong> 600px (fixed)
          </p>
        </Stack>
      </Window>
    </Box>
  );
}

export const mixedConstraints: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
