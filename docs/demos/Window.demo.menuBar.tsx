import { Window } from '@gfazioli/mantine-window';
import { Badge, Box, Button, Group, Menu, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Badge, Box, Button, Group, Menu, Stack, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

const commands = [
  'New note',
  'Rename workspace',
  'Move window left',
  'Move window right',
  'Toggle command bar',
  'Open recent project',
];

function Demo() {
  const [query, setQuery] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [density, setDensity] = useState('comfortable');

  const filteredCommands = commands.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={420}
        defaultHeight={300}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="md">
          <Group gap={6} wrap="nowrap">
            <Menu shadow="md" width={250}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  File
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Search
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search commands"
                />

                {filteredCommands.length > 0 ? (
                  filteredCommands.map((item) => <Menu.Item key={item}>{item}</Menu.Item>)
                ) : (
                  <Text c="dimmed" size="sm" ta="center" py="xs">
                    Nothing found
                  </Text>
                )}
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={240} closeOnItemClick={false}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  View
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Canvas options</Menu.Label>
                <Menu.CheckboxItem
                  checked={showGrid}
                  onChange={setShowGrid}
                >
                  Show grid
                </Menu.CheckboxItem>
                <Menu.CheckboxItem
                  checked={showRulers}
                  onChange={setShowRulers}
                >
                  Show rulers
                </Menu.CheckboxItem>
                <Menu.Divider />
                <Menu.Label>Density</Menu.Label>
                <Menu.RadioGroup value={density} onChange={setDensity}>
                  <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
                  <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
                  <Menu.RadioItem value="spacious">Spacious</Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group gap="xs">
            <Badge variant={showGrid ? 'filled' : 'light'} leftSection={<IconCheck size={10} />}>
              Grid {showGrid ? 'on' : 'off'}
            </Badge>
            <Badge
              variant={showRulers ? 'filled' : 'light'}
              leftSection={<IconCheck size={10} />}
            >
              Rulers {showRulers ? 'on' : 'off'}
            </Badge>
            <Badge variant="light">Density: {density}</Badge>
          </Group>

          <Text c="dimmed" size="sm">
            This menu bar keeps desktop-style window controls close to the content.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

const commands = [
  'New note',
  'Rename workspace',
  'Move window left',
  'Move window right',
  'Toggle command bar',
  'Open recent project',
];

function Demo() {
  const [query, setQuery] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [density, setDensity] = useState('comfortable');

  const filteredCommands = commands.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={420}
        defaultHeight={300}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="md">
          <Group gap={6} wrap="nowrap">
            <Menu shadow="md" width={250}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  File
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Search
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search commands"
                />

                {filteredCommands.length > 0 ? (
                  filteredCommands.map((item) => <Menu.Item key={item}>{item}</Menu.Item>)
                ) : (
                  <Text c="dimmed" size="sm" ta="center" py="xs">
                    Nothing found
                  </Text>
                )}
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={240} closeOnItemClick={false}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  View
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Canvas options</Menu.Label>
                <Menu.CheckboxItem checked={showGrid} onChange={setShowGrid}>
                  Show grid
                </Menu.CheckboxItem>
                <Menu.CheckboxItem checked={showRulers} onChange={setShowRulers}>
                  Show rulers
                </Menu.CheckboxItem>
                <Menu.Divider />
                <Menu.Label>Density</Menu.Label>
                <Menu.RadioGroup value={density} onChange={setDensity}>
                  <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
                  <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
                  <Menu.RadioItem value="spacious">Spacious</Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group gap="xs">
            <Badge variant={showGrid ? 'filled' : 'light'} leftSection={<IconCheck size={10} />}>
              Grid {showGrid ? 'on' : 'off'}
            </Badge>
            <Badge variant={showRulers ? 'filled' : 'light'} leftSection={<IconCheck size={10} />}>
              Rulers {showRulers ? 'on' : 'off'}
            </Badge>
            <Badge variant="light">Density: {density}</Badge>
          </Group>

          <Text c="dimmed" size="sm">
            This menu bar keeps desktop-style window controls close to the content.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const menuBar: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
