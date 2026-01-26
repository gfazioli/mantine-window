import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500, border: '2px dashed gray' }}>
      <Window
        title="Percentage Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: '60%', height: '50%' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Size with Percentage</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 60%, height: 50%
          </Text>
          <Text>
            <strong>Reference:</strong> Parent container (dashed border)
          </Text>
          <Text size="sm" c="dimmed">
            The window size is 60% of container width and 50% of container height. Percentage units
            with <code>withinPortal=false</code> are relative to the parent container.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500, border: '2px dashed gray' }}>
      <Window
        title="Percentage Size"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: '60%', height: '50%' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Size with Percentage</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 60%, height: 50%
          </Text>
          <Text>
            <strong>Reference:</strong> Parent container (dashed border)
          </Text>
          <Text size="sm" c="dimmed">
            The window size is 60% of container width and 50% of container height. Percentage units
            with <code>withinPortal={`{false}`}</code> are relative to the parent container.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const percentageSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
