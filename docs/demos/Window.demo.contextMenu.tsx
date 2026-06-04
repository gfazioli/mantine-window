import { Window } from '@gfazioli/mantine-window';
import { Box, Button, Center, Menu, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { IconCopy, IconX } from '@tabler/icons-react';
import { useState } from 'react';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Box, Button, Center, Menu, Text } from '@mantine/core';
import { IconCopy, IconX } from '@tabler/icons-react';

type Pane = { id: number; x: number; y: number };

function Demo() {
  const [panes, setPanes] = useState<Pane[]>([{ id: 1, x: 40, y: 40 }]);
  const [nextId, setNextId] = useState(2);

  const openPane = (x: number, y: number) => {
    setPanes((current) => [...current, { id: nextId, x, y }]);
    setNextId((id) => id + 1);
  };

  const closePane = (id: number) => {
    setPanes((current) => current.filter((pane) => pane.id !== id));
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 480 }}>
      {panes.length === 0 && (
        <Center h="100%">
          <Button onClick={() => openPane(40, 40)}>Open a window</Button>
        </Center>
      )}

      {panes.map((pane) => (
        <Window
          key={pane.id}
          title={\`Window \${pane.id}\`}
          opened
          defaultX={pane.x}
          defaultY={pane.y}
          defaultWidth={320}
          defaultHeight={220}
          persistState={false}
          withinPortal={false}
          withScrollArea={false}
          onClose={() => closePane(pane.id)}
        >
          <Menu shadow="md" width={210} withArrow>
            <Menu.ContextMenu>
              <Box p="md" h="100%" style={{ userSelect: 'none' }}>
                <Text fw={600}>Right-click here</Text>
                <Text c="dimmed" size="sm" mt={4}>
                  The context menu actions really drive this window: duplicate it or close it.
                </Text>
              </Box>
            </Menu.ContextMenu>

            <Menu.Dropdown>
              <Menu.Label>Window {pane.id}</Menu.Label>
              <Menu.Item
                leftSection={<IconCopy size={14} />}
                onClick={() => openPane(pane.x + 48, pane.y + 48)}
              >
                Duplicate window
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconX size={14} />}
                onClick={() => closePane(pane.id)}
              >
                Close window
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Window>
      ))}
    </Box>
  );
}
`;

type Pane = { id: number; x: number; y: number };

function Demo() {
  const [panes, setPanes] = useState<Pane[]>([{ id: 1, x: 40, y: 40 }]);
  const [nextId, setNextId] = useState(2);

  const openPane = (x: number, y: number) => {
    setPanes((current) => [...current, { id: nextId, x, y }]);
    setNextId((id) => id + 1);
  };

  const closePane = (id: number) => {
    setPanes((current) => current.filter((pane) => pane.id !== id));
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 480 }}>
      {panes.length === 0 && (
        <Center h="100%">
          <Button onClick={() => openPane(40, 40)}>Open a window</Button>
        </Center>
      )}

      {panes.map((pane) => (
        <Window
          key={pane.id}
          title={`Window ${pane.id}`}
          opened
          defaultX={pane.x}
          defaultY={pane.y}
          defaultWidth={320}
          defaultHeight={220}
          persistState={false}
          withinPortal={false}
          withScrollArea={false}
          onClose={() => closePane(pane.id)}
        >
          <Menu shadow="md" width={210} withArrow>
            <Menu.ContextMenu>
              <Box p="md" h="100%" style={{ userSelect: 'none' }}>
                <Text fw={600}>Right-click here</Text>
                <Text c="dimmed" size="sm" mt={4}>
                  The context menu actions really drive this window: duplicate it or close it.
                </Text>
              </Box>
            </Menu.ContextMenu>

            <Menu.Dropdown>
              <Menu.Label>Window {pane.id}</Menu.Label>
              <Menu.Item
                leftSection={<IconCopy size={14} />}
                onClick={() => openPane(pane.x + 48, pane.y + 48)}
              >
                Duplicate window
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconX size={14} />}
                onClick={() => closePane(pane.id)}
              >
                Close window
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Window>
      ))}
    </Box>
  );
}

export const contextMenu: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
