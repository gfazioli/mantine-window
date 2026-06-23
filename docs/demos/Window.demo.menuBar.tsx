import { Window } from '@gfazioli/mantine-window';
import { Box, Menu, Menubar, Paper, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { useState } from 'react';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Box, Menu, Menubar, Paper, Stack, Text } from '@mantine/core';

const densities = { compact: 'xs', comfortable: 'sm', spacious: 'lg' } as const;

function Demo() {
  const [layers, setLayers] = useState(['Layer 1', 'Layer 2']);
  const [nextLayer, setNextLayer] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [density, setDensity] = useState<keyof typeof densities>('comfortable');

  const run = (label: string, fn?: () => void) => {
    fn?.();
    setLastAction(label);
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={460}
        defaultHeight={360}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="sm" h="100%">
          {/* Mantine 9.4 Menubar — a real desktop-style menu bar with keyboard navigation */}
          <Menubar trigger="click">
            <Menubar.Menu width={240}>
              <Menubar.Target>File</Menubar.Target>
              <Menubar.Dropdown>
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘N
                    </Text>
                  }
                  onClick={() =>
                    run('New layer', () => {
                      setLayers((current) => [...current, \`Layer \${nextLayer}\`]);
                      setNextLayer((n) => n + 1);
                    })
                  }
                >
                  New layer
                </Menu.Item>
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘D
                    </Text>
                  }
                  onClick={() =>
                    run('Duplicate layer', () =>
                      setLayers((current) =>
                        current.length > 0
                          ? [...current, \`\${current[current.length - 1]} copy\`]
                          : current
                      )
                    )
                  }
                >
                  Duplicate layer
                </Menu.Item>
                <Menu.Item onClick={() => run('Remove layer', () => setLayers((c) => c.slice(0, -1)))}>
                  Remove layer
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘E
                    </Text>
                  }
                  onClick={() => run('Export as PNG')}
                >
                  Export as PNG
                </Menu.Item>
              </Menubar.Dropdown>
            </Menubar.Menu>

            <Menubar.Menu width={220}>
              <Menubar.Target>Edit</Menubar.Target>
              <Menubar.Dropdown>
                <Menu.Item color="red" onClick={() => run('Clear all layers', () => setLayers([]))}>
                  Clear all layers
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    run('Reset view', () => {
                      setShowGrid(true);
                      setDensity('comfortable');
                    })
                  }
                >
                  Reset view
                </Menu.Item>
              </Menubar.Dropdown>
            </Menubar.Menu>

            <Menubar.Menu width={220} closeOnItemClick={false}>
              <Menubar.Target>View</Menubar.Target>
              <Menubar.Dropdown>
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
              </Menubar.Dropdown>
            </Menubar.Menu>
          </Menubar>

          {/* The canvas reacts to every menu action */}
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

          {/* Status bar: every menu command lands here */}
          <Text size="xs" c="dimmed">
            {lastAction ? \`Last action: \${lastAction}\` : 'Pick a command from the menu bar'}
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}`;

const densities = { compact: 'xs', comfortable: 'sm', spacious: 'lg' } as const;

function Demo() {
  const [layers, setLayers] = useState(['Layer 1', 'Layer 2']);
  const [nextLayer, setNextLayer] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [density, setDensity] = useState<keyof typeof densities>('comfortable');

  const run = (label: string, fn?: () => void) => {
    fn?.();
    setLastAction(label);
  };

  return (
    <Box pos="relative" style={{ width: '100%', height: 520 }}>
      <Window
        title="Design Workspace"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={460}
        defaultHeight={360}
        persistState={false}
        withinPortal={false}
        withScrollArea={false}
      >
        <Stack gap="sm" h="100%">
          {/* Mantine 9.4 Menubar — a real desktop-style menu bar with keyboard navigation */}
          <Menubar trigger="click">
            <Menubar.Menu width={240}>
              <Menubar.Target>File</Menubar.Target>
              <Menubar.Dropdown>
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘N
                    </Text>
                  }
                  onClick={() =>
                    run('New layer', () => {
                      setLayers((current) => [...current, `Layer ${nextLayer}`]);
                      setNextLayer((n) => n + 1);
                    })
                  }
                >
                  New layer
                </Menu.Item>
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘D
                    </Text>
                  }
                  onClick={() =>
                    run('Duplicate layer', () =>
                      setLayers((current) =>
                        current.length > 0
                          ? [...current, `${current[current.length - 1]} copy`]
                          : current
                      )
                    )
                  }
                >
                  Duplicate layer
                </Menu.Item>
                <Menu.Item
                  onClick={() => run('Remove layer', () => setLayers((c) => c.slice(0, -1)))}
                >
                  Remove layer
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘E
                    </Text>
                  }
                  onClick={() => run('Export as PNG')}
                >
                  Export as PNG
                </Menu.Item>
              </Menubar.Dropdown>
            </Menubar.Menu>

            <Menubar.Menu width={220}>
              <Menubar.Target>Edit</Menubar.Target>
              <Menubar.Dropdown>
                <Menu.Item color="red" onClick={() => run('Clear all layers', () => setLayers([]))}>
                  Clear all layers
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    run('Reset view', () => {
                      setShowGrid(true);
                      setDensity('comfortable');
                    })
                  }
                >
                  Reset view
                </Menu.Item>
              </Menubar.Dropdown>
            </Menubar.Menu>

            <Menubar.Menu width={220} closeOnItemClick={false}>
              <Menubar.Target>View</Menubar.Target>
              <Menubar.Dropdown>
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
              </Menubar.Dropdown>
            </Menubar.Menu>
          </Menubar>

          {/* The canvas reacts to every menu action */}
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

          {/* Status bar: every menu command lands here */}
          <Text size="xs" c="dimmed">
            {lastAction ? `Last action: ${lastAction}` : 'Pick a command from the menu bar'}
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
