import { Window, WindowProps } from '@gfazioli/mantine-window';
import { Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: WindowProps) {
  return (
    <Window {...props} opened>
      <Title order={4}>This is a window with data</Title>
    </Window>
  );
}

const code = `
import { Window } from "@gfazioli/mantine-window";
import { data } from './data';

function Demo() {
  return <Window{{props}} data={data} maxDepth={1} defaultExpanded/>;
}
`;

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code: [{ fileName: 'Demo.tsx', code, language: 'tsx' }],
  controls: [
    { type: 'string', prop: 'title', initialValue: undefined as any, libraryValue: null },
    { type: 'boolean', prop: 'withBorder', initialValue: true, libraryValue: true },
  ],
};
