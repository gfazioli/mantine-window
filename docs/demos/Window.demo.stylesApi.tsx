import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { WindowStylesApi } from '../styles-api/Window.styles-api';

const code = `
import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Window{{props}}
      title="Styles API"
    />
  );
}
`;

function Demo(props: any) {
  return (
    <Box pos="relative" style={{ width: 500, height: 500 }}>
      <Window
        title="Styles API"
        opened
        defaultX={0}
        defaultY={0}
        defaultWidth={320}
        defaultHeight={256}
        maxWidth={500}
        maxHeight={500}
        persistState={false}
        withinPortal={false}
        {...props}
      >
        <Title order={4}>This is a window with data</Title>
      </Window>
    </Box>
  );
}

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: WindowStylesApi,
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
};
