import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { SegmentedControl, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { SegmentedControl, Stack, Text, Title } from '@mantine/core';

function Demo() {
  const [strategy, setStrategy] = useState<'increment' | 'normalize'>('normalize');

  return (
    <Stack>
      <SegmentedControl
        value={strategy}
        onChange={(v) => setStrategy(v as 'increment' | 'normalize')}
        data={[
          { label: 'increment (legacy)', value: 'increment' },
          { label: 'normalize', value: 'normalize' },
        ]}
      />
      <Text size="sm" c="dimmed">
        Click each window in any order. With <code>normalize</code>, z-indexes always stay
        compact ({'{100..102}'}). With <code>increment</code>, the counter keeps growing
        unless <code>maxZIndex</code> is set.
      </Text>
      <Window.Group
        key={strategy}
        style={{ width: '100%', height: 500 }}
        zIndexStrategy={strategy}
        initialZIndex={100}
        maxZIndex={strategy === 'increment' ? 105 : undefined}
      >
        <Window id="z1" title="Alpha" opened defaultX={20} defaultY={20} defaultWidth={260} defaultHeight={180}>
          <Title order={5}>Alpha</Title>
        </Window>
        <Window id="z2" title="Beta" opened defaultX={80} defaultY={80} defaultWidth={260} defaultHeight={180}>
          <Title order={5}>Beta</Title>
        </Window>
        <Window id="z3" title="Gamma" opened defaultX={140} defaultY={140} defaultWidth={260} defaultHeight={180}>
          <Title order={5}>Gamma</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}
`;

function Demo() {
  const [strategy, setStrategy] = useState<'increment' | 'normalize'>('normalize');

  return (
    <Stack>
      <SegmentedControl
        value={strategy}
        onChange={(v) => setStrategy(v as 'increment' | 'normalize')}
        data={[
          { label: 'increment (legacy)', value: 'increment' },
          { label: 'normalize', value: 'normalize' },
        ]}
      />
      <Text size="sm" c="dimmed">
        Click each window in any order. With <code>normalize</code>, z-indexes always stay compact (
        {'{100..102}'}). With <code>increment</code>, the counter keeps growing unless{' '}
        <code>maxZIndex</code> is set.
      </Text>
      <Window.Group
        key={strategy}
        style={{ width: '100%', height: 500 }}
        zIndexStrategy={strategy}
        initialZIndex={100}
        maxZIndex={strategy === 'increment' ? 105 : undefined}
      >
        <Window
          id="z1"
          title="Alpha"
          opened
          defaultX={20}
          defaultY={20}
          defaultWidth={260}
          defaultHeight={180}
        >
          <Title order={5}>Alpha</Title>
        </Window>
        <Window
          id="z2"
          title="Beta"
          opened
          defaultX={80}
          defaultY={80}
          defaultWidth={260}
          defaultHeight={180}
        >
          <Title order={5}>Beta</Title>
        </Window>
        <Window
          id="z3"
          title="Gamma"
          opened
          defaultX={140}
          defaultY={140}
          defaultWidth={260}
          defaultHeight={180}
        >
          <Title order={5}>Gamma</Title>
        </Window>
      </Window.Group>
    </Stack>
  );
}

export const zIndexStrategy: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
