import { Window, type WindowProps } from '@gfazioli/mantine-window';
import { Box, Kbd, List, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: WindowProps) {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Resize me from the keyboard"
        opened
        defaultX={20}
        defaultY={20}
        defaultWidth={360}
        defaultHeight={260}
        withinPortal={false}
        {...props}
      >
        <Text size="sm">
          Press <Kbd>Tab</Kbd> until the resize handle is focused, then:
        </Text>
        <List size="sm" mt="xs">
          <List.Item>
            <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd> resize by the step
          </List.Item>
          <List.Item>
            <Kbd>Shift</Kbd> + arrows resize by the Shift step
          </List.Item>
          <List.Item>
            <Kbd>Home</Kbd> / <Kbd>End</Kbd> go to the min / max size
          </List.Item>
        </List>
      </Window>
    </Box>
  );
}

const code = `
import { Window } from '@gfazioli/mantine-window';
import { Box, Kbd, List, Text } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Resize me from the keyboard"
        opened
        defaultX={20}
        defaultY={20}
        defaultWidth={360}
        defaultHeight={260}
        withinPortal={false}
        {{props}}
      >
        <Text size="sm">
          Press <Kbd>Tab</Kbd> until the resize handle is focused, then:
        </Text>
        <List size="sm" mt="xs">
          <List.Item>
            <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd> resize by the step
          </List.Item>
          <List.Item>
            <Kbd>Shift</Kbd> + arrows resize by the Shift step
          </List.Item>
          <List.Item>
            <Kbd>Home</Kbd> / <Kbd>End</Kbd> go to the min / max size
          </List.Item>
        </List>
      </Window>
    </Box>
  );
}
`;

export const keyboardResize: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code: [{ fileName: 'Demo.tsx', code, language: 'tsx' }],
  controls: [
    { type: 'number', prop: 'resizeStep', initialValue: 10, libraryValue: 10, min: 1, max: 100 },
    {
      type: 'number',
      prop: 'resizeShiftStep',
      initialValue: 50,
      libraryValue: 50,
      min: 1,
      max: 200,
    },
    {
      prop: 'resizable',
      type: 'select',
      initialValue: 'both',
      libraryValue: 'both',
      data: [
        { label: 'none', value: 'none' },
        { label: 'vertical', value: 'vertical' },
        { label: 'horizontal', value: 'horizontal' },
        { label: 'both', value: 'both' },
      ],
    },
    { type: 'boolean', prop: 'withKeyboardResize', initialValue: true, libraryValue: true },
  ],
};
