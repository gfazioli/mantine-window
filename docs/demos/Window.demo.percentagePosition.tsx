import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500, border: '2px dashed gray' }}>
      <Window
        title="Percentage Position"
        opened
        defaultPosition={{ x: '10%', y: '15%' }}
        defaultSize={{ width: 400, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position with Percentage</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10%, y: 15%
          </Text>
          <Text>
            <strong>Reference:</strong> Parent container (dashed border)
          </Text>
          <Text size="sm" c="dimmed">
            With <code>withinPortal=false</code>, percentage units are calculated relative to the
            parent container, not the viewport. The parent must have <code>position: relative</code>.
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
        title="Percentage Position"
        opened
        defaultPosition={{ x: '10%', y: '15%' }}
        defaultSize={{ width: 400, height: 250 }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Position with Percentage</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10%, y: 15%
          </Text>
          <Text>
            <strong>Reference:</strong> Parent container (dashed border)
          </Text>
          <Text size="sm" c="dimmed">
            With <code>withinPortal={`{false}`}</code>, percentage units are calculated relative to
            the parent container, not the viewport. The parent must have{' '}
            <code>position: relative</code>.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const percentagePosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
