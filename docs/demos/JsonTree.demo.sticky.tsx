import { JsonTree, JsonTreeProps } from '@gfazioli/mantine-json-tree';
import { ScrollArea } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { data, dataCode } from './data';

const code = `
import { JsonTree } from "@gfazioli/mantine-json-tree";
import { ScrollArea } from '@mantine/core';
import { data } from './data';

function Demo() {
  return (
    <ScrollArea style={{ height: 300 }}>
      <JsonTree{{props}}
        data={data}
        title="data.json"
        defaultExpanded
        withExpandAll
        styles={{
          header: { backgroundColor: 'var(--mantine-color-default)' },
        }}
      />
    </ScrollArea>
  );
}
`;

function Demo(props: JsonTreeProps) {
  return (
    <ScrollArea style={{ height: 300 }}>
      <JsonTree
        {...props}
        data={data}
        title="data.json"
        defaultExpanded
        withExpandAll
        styles={{
          header: { backgroundColor: 'var(--mantine-color-default)' },
        }}
      />
    </ScrollArea>
  );
}

export const sticky: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code: [
    { fileName: 'Demo.tsx', code, language: 'tsx' },
    { fileName: 'data.ts', code: dataCode, language: 'tsx' },
  ],
  controls: [
    { type: 'boolean', prop: 'stickyHeader', initialValue: true, libraryValue: false },
    {
      type: 'number',
      prop: 'stickyHeaderOffset',
      initialValue: 0,
      libraryValue: 0,
      min: -32,
      max: 32,
      step: 1,
    },
  ],
};
