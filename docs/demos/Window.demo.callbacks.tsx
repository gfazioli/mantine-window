import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="With Callbacks"
        opened
        defaultX={50} defaultY={50}
        defaultWidth={400} defaultHeight={300}
        persistState={false}
        withinPortal={false}
        onPositionChange={(pos) => {
          // eslint-disable-next-line no-console
          console.log('Position changed:', pos);
        }}
        onSizeChange={(size) => {
          // eslint-disable-next-line no-console
          console.log('Size changed:', size);
        }}
      >
        <Title order={4}>Open console to see callbacks</Title>
        <p>Move or resize this window to trigger callbacks</p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="With Callbacks"
        opened
        defaultX={50}
        defaultY={50}
        defaultWidth={400}
        defaultHeight={300}
        persistState={false}
        withinPortal={false}
        onPositionChange={(pos) => {
          // eslint-disable-next-line no-console
          console.log('Position changed:', pos);
        }}
        onSizeChange={(size) => {
          // eslint-disable-next-line no-console
          console.log('Size changed:', size);
        }}
      >
        <Title order={4}>Open console to see callbacks</Title>
        <p>Move or resize this window to trigger callbacks</p>
      </Window>
    </Box>
  );
}

export const callbacks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
