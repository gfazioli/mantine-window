import { Window } from '@gfazioli/mantine-window';
import { Box, Button, Group, Menu, Paper, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { useState } from 'react';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Box, Button, Group, Menu, Paper, Stack, Text } from '@mantine/core';

const densities = { compact: 'xs', comfortable: 'sm', spacious: 'lg' } as const;

function Demo() {
  const [query, setQuery] = useState('');
  const [layers, setLayers] = useState(['Layer 1', 'Layer 2']);
  const [nextLayer, setNextLayer] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [density, setDensity] = useState<keyof typeof densities>('comfortable');

  // Every File command really operates on the canvas
  const commands = [
    {
      label: 'New layer',
      action: () => {
        setLayers((current) => [...current, \`Layer \${nextLayer}\`]);
        setNextLayer((n) => n + 1);
      },
    },
    {
      label: 'Duplicate layer',
      action: () => {
        setLayers((current) =>
          current.length > 0 ? [...current, \`\${current[current.length - 1]} copy\`] : current
        );
      },
    },
    {
      label: 'Remove layer',
      action: () => setLayers((current) => current.slice(0, -1)),
    },
    { label: 'Export as PNG', action: () => {} },
  ];

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const runCommand = (command: (typeof commands)[number]) => {
    command.action();
    setLastAction(command.label);
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={440}
        defaultHeight={340}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="sm" h="100%">
          {/* The menu bar */}
          <Group gap={4}>
            <Menu shadow="md" width={240} position="bottom-start">
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
                {filtered.length > 0 ? (
                  filtered.map((command) => (
                    <Menu.Item key={command.label} onClick={() => runCommand(command)}>
                      {command.label}
                    </Menu.Item>
                  ))
                ) : (
                  <Text c="dimmed" size="sm" ta="center" py="xs">
                    Nothing found
                  </Text>
                )}
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={220} position="bottom-start" closeOnItemClick={false}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  View
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Canvas</Menu.Label>
                <Menu.CheckboxItem checked={showGrid} onChange={setShowGrid}>
                  Show grid
                </Menu.CheckboxItem>
                <Menu.Divider />
                <Menu.Label>Density</Menu.Label>
                <Menu.RadioGroup
                  value={density}
                  onChange={(value) => setDensity(value as keyof typeof densities)}
                >
                  <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
                  <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
                  <Menu.RadioItem value="spacious">Spacious</Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* The canvas: layers, grid and density all react to the menus */}
          <Box
            flex={1}
            p="sm"
            style={{
              overflow: 'auto',
              borderRadius: 'var(--mantine-radius-sm)',
              border: '1px solid var(--mantine-color-default-border)',
              backgroundImage: showGrid
                ? 'radial-gradient(var(--mantine-color-default-border) 1px, transparent 0)'
                : undefined,
              backgroundSize: '16px 16px',
            }}
          >
            {layers.length > 0 ? (
              <Stack gap={densities[density]}>
                {layers.map((layer, index) => (
                  <Paper key={index} withBorder p={densities[density]}>
                    {layer}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" size="sm" ta="center" py="lg">
                No layers — use File → New layer
              </Text>
            )}
          </Box>

          {/* Status bar: File menu commands land here */}
          <Text size="xs" c="dimmed">
            {lastAction ? \`Last action: \${lastAction}\` : 'Run a command from the File menu'}
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

const densities = { compact: 'xs', comfortable: 'sm', spacious: 'lg' } as const;

function Demo() {
  const [query, setQuery] = useState('');
  const [layers, setLayers] = useState(['Layer 1', 'Layer 2']);
  const [nextLayer, setNextLayer] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [density, setDensity] = useState<keyof typeof densities>('comfortable');

  const commands = [
    {
      label: 'New layer',
      action: () => {
        setLayers((current) => [...current, `Layer ${nextLayer}`]);
        setNextLayer((n) => n + 1);
      },
    },
    {
      label: 'Duplicate layer',
      action: () => {
        setLayers((current) =>
          current.length > 0 ? [...current, `${current[current.length - 1]} copy`] : current
        );
      },
    },
    {
      label: 'Remove layer',
      action: () => setLayers((current) => current.slice(0, -1)),
    },
    { label: 'Export as PNG', action: () => {} },
  ];

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const runCommand = (command: (typeof commands)[number]) => {
    command.action();
    setLastAction(command.label);
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={440}
        defaultHeight={340}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="sm" h="100%">
          <Group gap={4}>
            <Menu shadow="md" width={240} position="bottom-start">
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
                {filtered.length > 0 ? (
                  filtered.map((command) => (
                    <Menu.Item key={command.label} onClick={() => runCommand(command)}>
                      {command.label}
                    </Menu.Item>
                  ))
                ) : (
                  <Text c="dimmed" size="sm" ta="center" py="xs">
                    Nothing found
                  </Text>
                )}
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={220} position="bottom-start" closeOnItemClick={false}>
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-sm">
                  View
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Canvas</Menu.Label>
                <Menu.CheckboxItem checked={showGrid} onChange={setShowGrid}>
                  Show grid
                </Menu.CheckboxItem>
                <Menu.Divider />
                <Menu.Label>Density</Menu.Label>
                <Menu.RadioGroup
                  value={density}
                  onChange={(value) => setDensity(value as keyof typeof densities)}
                >
                  <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
                  <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
                  <Menu.RadioItem value="spacious">Spacious</Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Box
            flex={1}
            p="sm"
            style={{
              overflow: 'auto',
              borderRadius: 'var(--mantine-radius-sm)',
              border: '1px solid var(--mantine-color-default-border)',
              backgroundImage: showGrid
                ? 'radial-gradient(var(--mantine-color-default-border) 1px, transparent 0)'
                : undefined,
              backgroundSize: '16px 16px',
            }}
          >
            {layers.length > 0 ? (
              <Stack gap={densities[density]}>
                {layers.map((layer, index) => (
                  <Paper key={index} withBorder p={densities[density]}>
                    {layer}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" size="sm" ta="center" py="lg">
                No layers — use File → New layer
              </Text>
            )}
          </Box>

          <Text size="xs" c="dimmed">
            {lastAction ? `Last action: ${lastAction}` : 'Run a command from the File menu'}
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
