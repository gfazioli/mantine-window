import { Window } from '@gfazioli/mantine-window';
import { Box, Menu, Paper, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { IconArrowsMaximize, IconCopy, IconPinned, IconTrash } from '@tabler/icons-react';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Menu, Paper, Text } from '@mantine/core';
import {
  IconArrowsMaximize,
  IconCopy,
  IconPinned,
  IconTrash,
} from '@tabler/icons-react';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Project Files"
        opened
        defaultX={40}
        defaultY={40}
        defaultWidth={360}
        defaultHeight={260}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Menu shadow="md" width={220} withArrow>
          <Menu.ContextMenu>
            <Paper
              withBorder
              radius="md"
              p="lg"
              style={{
                minHeight: 150,
                userSelect: 'none',
                background: 'var(--mantine-color-gray-0)',
              }}
            >
              <Text fw={600}>Right-click anywhere in this workspace</Text>
              <Text c="dimmed" size="sm" mt={6}>
                The menu opens at the cursor to mimic desktop window actions.
              </Text>
            </Paper>
          </Menu.ContextMenu>

          <Menu.Dropdown>
            <Menu.Label>Window actions</Menu.Label>
            <Menu.Item leftSection={<IconArrowsMaximize size={14} />}>
              Maximize
            </Menu.Item>
            <Menu.Item leftSection={<IconCopy size={14} />}>
              Duplicate
            </Menu.Item>
            <Menu.Item leftSection={<IconPinned size={14} />}>
              Pin to workspace
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Close window
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Project Files"
        opened
        defaultX={40}
        defaultY={40}
        defaultWidth={360}
        defaultHeight={260}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Menu shadow="md" width={220} withArrow>
          <Menu.ContextMenu>
            <Paper
              withBorder
              radius="md"
              p="lg"
              style={{
                minHeight: 150,
                userSelect: 'none',
                background: 'var(--mantine-color-gray-0)',
              }}
            >
              <Text fw={600}>Right-click anywhere in this workspace</Text>
              <Text c="dimmed" size="sm" mt={6}>
                The menu opens at the cursor to mimic desktop window actions.
              </Text>
            </Paper>
          </Menu.ContextMenu>

          <Menu.Dropdown>
            <Menu.Label>Window actions</Menu.Label>
            <Menu.Item leftSection={<IconArrowsMaximize size={14} />}>Maximize</Menu.Item>
            <Menu.Item leftSection={<IconCopy size={14} />}>Duplicate</Menu.Item>
            <Menu.Item leftSection={<IconPinned size={14} />}>Pin to workspace</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Close window
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Window>
    </Box>
  );
}

export const contextMenu: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
