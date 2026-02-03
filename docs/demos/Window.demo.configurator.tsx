import { Window, type WindowProps } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: WindowProps) {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        defaultPosition={{
          x: 0,
          y: 0,
        }}
        defaultSize={{
          width: 320,
          height: 256,
        }}
        maxWidth={500}
        maxHeight={500}
        withinPortal={false}
        {...props}
        opened
      >
        <Title order={4}>This is a window with data</Title>
      </Window>
    </Box>
  );
}

const code = `
import { Window, type WindowProps } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    {/** In this demo, the Window is positioned relative to its parent container. Check the docs below to learn more about the "withinPortal" prop. */}
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        defaultPosition={{ x: 0, y: 0}}
        defaultSize={{ width: 320, height: 256 }}
        withinPortal={false}
        maxWidth={500}
        maxHeight={500}
        opened
        {{props}}
      >
        <Title order={4}>This is a window with data</Title>
      </Window>
    </Box>
  );
}
`;

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  maxWidth: 500,
  code: [{ fileName: 'Demo.tsx', code, language: 'tsx' }],
  controls: [
    {
      prop: 'color',
      type: 'color',
      initialValue: 'var(--mantine-color-default)',
      libraryValue: 'var(--mantine-color-default)',
    },
    {
      type: 'string',
      prop: 'title',
      initialValue: 'Hello, World! Hello, Mantiners! Say Hello to the Window component',
      libraryValue: null,
    },
    {
      prop: 'draggable',
      type: 'select',
      initialValue: 'both',
      libraryValue: 'both',
      data: [
        { label: 'none', value: 'none' },
        { label: 'window', value: 'window' },
        { label: 'header', value: 'header' },
        { label: 'both', value: 'both' },
      ],
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
    { prop: 'shadow', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'radius', type: 'size', initialValue: 'lg', libraryValue: 'lg' },
    { type: 'boolean', prop: 'withBorder', initialValue: true, libraryValue: true },
    { type: 'boolean', prop: 'withCollapseButton', initialValue: true, libraryValue: true },
    { type: 'boolean', prop: 'withCloseButton', initialValue: true, libraryValue: true },
    { type: 'boolean', prop: 'collapsed', initialValue: false, libraryValue: false },
    {
      type: 'boolean',
      prop: 'fullSizeResizeHandles',
      initialValue: false,
      libraryValue: false,
    },
  ],
};
