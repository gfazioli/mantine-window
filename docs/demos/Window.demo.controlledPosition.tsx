import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Box, Slider, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Box, Slider, Stack, Text, Title } from '@mantine/core';

function Demo() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(300);

  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Stack gap="xs" style={{ position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 100 }}>
        <Text size="sm">X: {x}</Text>
        <Slider value={x} onChange={setX} min={0} max={400} />
        <Text size="sm">Y: {y}</Text>
        <Slider value={y} onChange={setY} min={0} max={300} />
        <Text size="sm">Width: {width}</Text>
        <Slider value={width} onChange={setWidth} min={200} max={500} />
      </Stack>
      <Window
        title="Controlled"
        opened
        x={x}
        y={y}
        width={width}
        defaultHeight={180}
        onPositionChange={(pos) => { setX(pos.x); setY(pos.y); }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Drag me or use sliders</Title>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(300);

  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Stack
        gap="xs"
        style={{ position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 100 }}
      >
        <Text size="sm">X: {x}</Text>
        <Slider value={x} onChange={setX} min={0} max={400} />
        <Text size="sm">Y: {y}</Text>
        <Slider value={y} onChange={setY} min={0} max={300} />
        <Text size="sm">Width: {width}</Text>
        <Slider value={width} onChange={setWidth} min={200} max={500} />
      </Stack>
      <Window
        title="Controlled"
        opened
        x={x}
        y={y}
        width={width}
        defaultHeight={180}
        onPositionChange={(pos) => {
          setX(pos.x);
          setY(pos.y);
        }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Drag me or use sliders</Title>
      </Window>
    </Box>
  );
}

export const controlledPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
