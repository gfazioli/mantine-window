import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Constrained Resize"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        minWidth={300}
        minHeight={200}
        maxWidth={600}
        maxHeight={450}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Try resizing this window</Title>
        <p>Min: 300x200px</p>
        <p>Max: 600x450px</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Constrained Resize"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        minWidth={300}
        minHeight={200}
        maxWidth={600}
        maxHeight={450}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Try resizing this window</Title>
        <p>Min: 300x200px</p>
        <p>Max: 600x450px</p>
      </Window>
    </Box>
  );
}

export const minMaxSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
