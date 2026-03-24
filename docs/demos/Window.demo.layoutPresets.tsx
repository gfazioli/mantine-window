import { useRef, useState } from 'react';
import { Window, type WindowGroupContextValue, type WindowLayout } from '@gfazioli/mantine-window';
import { Select, Stack, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useRef, useState } from 'react';
import { Window, type WindowGroupContextValue, type WindowLayout } from '@gfazioli/mantine-window';
import { Select, Stack, Title } from '@mantine/core';

const layoutOptions = [
  { value: 'tile', label: 'Tile' },
  { value: 'arrange-columns', label: 'Columns' },
  { value: 'arrange-rows', label: 'Rows' },
];

function Demo() {
  const [layout, setLayout] = useState<string | null>('tile');
  const groupRef = useRef<WindowGroupContextValue>(null);

  return (
    <Stack gap="sm">
      <Select
        label="Layout"
        data={layoutOptions}
        value={layout}
        onChange={(value) => {
          setLayout(value);
          if (value) {
            groupRef.current?.applyLayout(value as WindowLayout);
          }
        }}
        w={200}
      />
      <Window.Group
        groupRef={groupRef}
        style={{ width: '100%', height: 450 }}
        defaultLayout="tile"
        onLayoutChange={(l) => setLayout(l)}
      >
        <Window id="lp-1" title="Window 1" opened>
          <Title order={4}>Window 1</Title>
        </Window>
        <Window id="lp-2" title="Window 2" opened>
          <Title order={4}>Window 2</Title>
        </Window>
        <Window id="lp-3" title="Window 3" opened>
          <Title order={4}>Window 3</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}
`;

const layoutOptions = [
  { value: 'tile', label: 'Tile' },
  { value: 'arrange-columns', label: 'Columns' },
  { value: 'arrange-rows', label: 'Rows' },
];

function Demo() {
  const [layout, setLayout] = useState<string | null>('tile');
  const groupRef = useRef<WindowGroupContextValue>(null);

  return (
    <Stack gap="sm">
      <Select
        label="Layout"
        data={layoutOptions}
        value={layout}
        onChange={(value) => {
          setLayout(value);
          if (value) {
            groupRef.current?.applyLayout(value as WindowLayout);
          }
        }}
        w={200}
      />
      <Window.Group
        groupRef={groupRef}
        style={{ width: '100%', height: 450 }}
        defaultLayout="tile"
        onLayoutChange={(l) => setLayout(l)}
      >
        <Window id="lp-1" title="Window 1" opened>
          <Title order={4}>Window 1</Title>
        </Window>
        <Window id="lp-2" title="Window 2" opened>
          <Title order={4}>Window 2</Title>
        </Window>
        <Window id="lp-3" title="Window 3" opened>
          <Title order={4}>Window 3</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}

export const layoutPresets: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
