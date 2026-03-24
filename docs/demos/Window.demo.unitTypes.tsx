import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500, border: '2px dashed gray' }}>
      {/* Pixels */}
      <Window
        title="Pixels"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={200}
        defaultHeight={180}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm"><strong>defaultX:</strong> 10</Text>
          <Text size="sm"><strong>defaultWidth:</strong> 200</Text>
        </Stack>
      </Window>

      {/* Viewport units */}
      <Window
        title="Viewport Units"
        opened
        defaultX="40%"
        defaultY={10}
        defaultWidth={200}
        defaultHeight={180}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm"><strong>defaultX:</strong> "40%"</Text>
          <Text size="sm">Relative to container</Text>
        </Stack>
      </Window>

      {/* Percentages */}
      <Window
        title="Mixed"
        opened
        defaultX={10}
        defaultY="55%"
        defaultWidth="60%"
        defaultHeight={150}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm"><strong>defaultY:</strong> "55%"</Text>
          <Text size="sm"><strong>defaultWidth:</strong> "60%"</Text>
          <Text size="sm">Mix px, vw/vh, and % freely</Text>
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
        title="Pixels"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={200}
        defaultHeight={180}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm">
            <strong>defaultX:</strong> 10
          </Text>
          <Text size="sm">
            <strong>defaultWidth:</strong> 200
          </Text>
        </Stack>
      </Window>

      <Window
        title="Viewport Units"
        opened
        defaultX="40%"
        defaultY={10}
        defaultWidth={200}
        defaultHeight={180}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm">
            <strong>defaultX:</strong> &quot;40%&quot;
          </Text>
          <Text size="sm">Relative to container</Text>
        </Stack>
      </Window>

      <Window
        title="Mixed"
        opened
        defaultX={10}
        defaultY="55%"
        defaultWidth="60%"
        defaultHeight={150}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="xs">
          <Text size="sm">
            <strong>defaultY:</strong> &quot;55%&quot;
          </Text>
          <Text size="sm">
            <strong>defaultWidth:</strong> &quot;60%&quot;
          </Text>
          <Text size="sm">Mix px, vw/vh, and % freely</Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const unitTypes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
