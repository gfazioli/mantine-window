import { Window } from '@gfazioli/mantine-window';
import { Box, Group, Slider, Stack, Switch, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { useState } from 'react';

const code = `
import { Window } from '@gfazioli/mantine-window';
import { Box, Group, Slider, Stack, Switch, Text } from '@mantine/core';
import { useState } from 'react';

const lines = Array.from({ length: 12 }, (_, i) => \`Line \${i + 1}: swipe me on a phone\`);

function Demo() {
  const [width, setWidth] = useState(100);
  const [keepInBounds, setKeepInBounds] = useState(true);

  return (
    <Stack>
      <Group grow align="end">
        <Stack gap={4}>
          <Text size="sm">Container width: {width}%</Text>
          <Slider value={width} onChange={setWidth} min={30} max={100} label={null} />
        </Stack>
        <Switch
          label="keepInBounds"
          checked={keepInBounds}
          onChange={(event) => setKeepInBounds(event.currentTarget.checked)}
        />
      </Group>

      <Box
        pos="relative"
        h={400}
        w={\`\${width}%\`}
        style={{ border: '2px dashed var(--mantine-color-default-border)' }}
      >
        <Window
          title="Shrink my container"
          opened
          withinPortal={false}
          keepInBounds={keepInBounds}
          defaultX={220}
          defaultY={60}
          defaultWidth={360}
          defaultHeight={240}
        >
          <Text size="sm" mb="xs">
            Narrow the container: the window moves back inside it, and shrinks once it is wider.
          </Text>
          {lines.map((line) => (
            <Text key={line} size="sm" c="dimmed">
              {line}
            </Text>
          ))}
        </Window>
      </Box>
    </Stack>
  );
}
`;

const lines = Array.from({ length: 12 }, (_, i) => `Line ${i + 1}: swipe me on a phone`);

function Demo() {
  const [width, setWidth] = useState(100);
  const [keepInBounds, setKeepInBounds] = useState(true);

  return (
    <Stack>
      <Group grow align="end">
        <Stack gap={4}>
          <Text size="sm">Container width: {width}%</Text>
          <Slider value={width} onChange={setWidth} min={30} max={100} label={null} />
        </Stack>
        <Switch
          label="keepInBounds"
          checked={keepInBounds}
          onChange={(event) => setKeepInBounds(event.currentTarget.checked)}
        />
      </Group>

      <Box
        pos="relative"
        h={400}
        w={`${width}%`}
        style={{ border: '2px dashed var(--mantine-color-default-border)' }}
      >
        <Window
          title="Shrink my container"
          opened
          withinPortal={false}
          keepInBounds={keepInBounds}
          defaultX={220}
          defaultY={60}
          defaultWidth={360}
          defaultHeight={240}
        >
          <Text size="sm" mb="xs">
            Narrow the container: the window moves back inside it, and shrinks once it is wider.
          </Text>
          {lines.map((line) => (
            <Text key={line} size="sm" c="dimmed">
              {line}
            </Text>
          ))}
        </Window>
      </Box>
    </Stack>
  );
}

export const keepInBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
