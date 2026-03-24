import { useState } from 'react';
import { Window, type WindowLayout } from '@gfazioli/mantine-window';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useState } from 'react';
import { Window, type WindowLayout } from '@gfazioli/mantine-window';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';

function Demo() {
  const [lastLayout, setLastLayout] = useState<WindowLayout | null>(null);

  return (
    <Stack gap="sm">
      <Group>
        <Text size="sm">Last layout applied:</Text>
        <Badge>{lastLayout ?? 'none'}</Badge>
      </Group>
      <Window.Group
        style={{ width: '100%', height: 500 }}
        defaultLayout="tile"
        onLayoutChange={setLastLayout}
      >
        <Window id="w1" title="Window 1" opened defaultX={10} defaultY={10} defaultWidth={250} defaultHeight={200}>
          <Title order={4}>Window 1</Title>
          <p>Use the green button to apply layouts</p>
        </Window>
        <Window id="w2" title="Window 2" opened defaultX={270} defaultY={10} defaultWidth={250} defaultHeight={200}>
          <Title order={4}>Window 2</Title>
        </Window>
        <Window id="w3" title="Window 3" opened defaultX={10} defaultY={220} defaultWidth={250} defaultHeight={200}>
          <Title order={4}>Window 3</Title>
        </Window>
        <Window id="w4" title="Window 4" opened defaultX={270} defaultY={220} defaultWidth={250} defaultHeight={200}>
          <Title order={4}>Window 4</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}
`;

function Demo() {
  const [lastLayout, setLastLayout] = useState<WindowLayout | null>(null);

  return (
    <Stack gap="sm">
      <Group>
        <Text size="sm">Last layout applied:</Text>
        <Badge>{lastLayout ?? 'none'}</Badge>
      </Group>
      <Window.Group
        style={{ width: '100%', height: 500 }}
        defaultLayout="tile"
        onLayoutChange={setLastLayout}
      >
        <Window
          id="w1"
          title="Window 1"
          opened
          defaultX={10}
          defaultY={10}
          defaultWidth={250}
          defaultHeight={200}
        >
          <Title order={4}>Window 1</Title>
          <p>Use the green button to apply layouts</p>
        </Window>
        <Window
          id="w2"
          title="Window 2"
          opened
          defaultX={270}
          defaultY={10}
          defaultWidth={250}
          defaultHeight={200}
        >
          <Title order={4}>Window 2</Title>
        </Window>
        <Window
          id="w3"
          title="Window 3"
          opened
          defaultX={10}
          defaultY={220}
          defaultWidth={250}
          defaultHeight={200}
        >
          <Title order={4}>Window 3</Title>
        </Window>
        <Window
          id="w4"
          title="Window 4"
          opened
          defaultX={270}
          defaultY={220}
          defaultWidth={250}
          defaultHeight={200}
        >
          <Title order={4}>Window 4</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}

export const groupLayout: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
