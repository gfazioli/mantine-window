import { Window } from '@gfazioli/mantine-window';
import { Badge, Box, Code, Group, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { useState } from 'react';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Badge, Box, Code, Group, Stack, Text } from '@mantine/core';

function Demo() {
  const [gesture, setGesture] = useState<'idle' | 'dragging' | 'resizing'>('idle');
  const [during, setDuring] = useState(0);
  const [atEnd, setAtEnd] = useState(0);

  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Drag or resize me"
        opened
        defaultX={50} defaultY={50}
        defaultWidth={420} defaultHeight={300}
        persistState={false}
        withinPortal={false}
        // Continuous: fires on every frame of the gesture
        onPositionChange={() => setDuring((n) => n + 1)}
        onSizeChange={() => setDuring((n) => n + 1)}
        // Lifecycle: one call each, at the edges of the gesture
        onDragStart={() => setGesture('dragging')}
        onDragEnd={() => { setGesture('idle'); setAtEnd((n) => n + 1); }}
        onResizeStart={() => setGesture('resizing')}
        onResizeEnd={() => { setGesture('idle'); setAtEnd((n) => n + 1); }}
      >
        <Stack gap="md" p="xs">
          <Group>
            <Text size="sm">State:</Text>
            <Badge color={gesture === 'idle' ? 'gray' : 'blue'}>{gesture}</Badge>
          </Group>

          <Text size="sm">
            Writes if you persisted on every change: <Code>{during}</Code>
          </Text>
          <Text size="sm">
            Writes if you persisted on end only: <Code>{atEnd}</Code>
          </Text>

          <Text size="xs" c="dimmed">
            Both numbers describe the same gesture. The second one is why the lifecycle
            callbacks exist.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  const [gesture, setGesture] = useState<'idle' | 'dragging' | 'resizing'>('idle');
  const [during, setDuring] = useState(0);
  const [atEnd, setAtEnd] = useState(0);

  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Drag or resize me"
        opened
        defaultX={50}
        defaultY={50}
        defaultWidth={420}
        defaultHeight={300}
        persistState={false}
        withinPortal={false}
        // Continuous: fires on every frame of the gesture
        onPositionChange={() => setDuring((n) => n + 1)}
        onSizeChange={() => setDuring((n) => n + 1)}
        // Lifecycle: one call each, at the edges of the gesture
        onDragStart={() => setGesture('dragging')}
        onDragEnd={() => {
          setGesture('idle');
          setAtEnd((n) => n + 1);
        }}
        onResizeStart={() => setGesture('resizing')}
        onResizeEnd={() => {
          setGesture('idle');
          setAtEnd((n) => n + 1);
        }}
      >
        <Stack gap="md" p="xs">
          <Group>
            <Text size="sm">State:</Text>
            <Badge color={gesture === 'idle' ? 'gray' : 'blue'}>{gesture}</Badge>
          </Group>

          <Text size="sm">
            Writes if you persisted on every change: <Code>{during}</Code>
          </Text>
          <Text size="sm">
            Writes if you persisted on end only: <Code>{atEnd}</Code>
          </Text>

          <Text size="xs" c="dimmed">
            Both numbers describe the same gesture. The second one is why the lifecycle callbacks
            exist.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const dragResizeLifecycle: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
