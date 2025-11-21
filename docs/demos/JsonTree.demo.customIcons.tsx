import { JsonTree } from '@gfazioli/mantine-json-tree';
import { Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { data, dataCode } from './data';

const code = `
import { JsonTree } from "@gfazioli/mantine-json-tree";
import { Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { data } from './data';

function Demo() {
  return (
    <SimpleGrid cols={3}>
      <Paper withBorder p="md">
        <Title order={4}>Only Expand Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          expandControlIcon={<span>👉</span>}
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Only Collapse Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          collapseControlIcon={<span>👇</span>}
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Both Expand and Collapse Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          expandControlIcon={
            <Text fz={24} c="red">
              ⊕
            </Text>
          }
          collapseControlIcon={<Text fz={24}>⊖</Text>}
        />
      </Paper>
    </SimpleGrid>
  );
}
`;

function Demo() {
  return (
    <SimpleGrid cols={3}>
      <Paper withBorder p="md">
        <Title order={4}>Only Expand Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          expandControlIcon={<span>👉</span>}
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Only Collapse Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          collapseControlIcon={<span>👇</span>}
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Both Expand and Collapse Icons</Title>
        <JsonTree
          title="demo.json"
          showIndentGuides
          data={data}
          expandControlIcon={
            <Text fz={24} c="red">
              ⊕
            </Text>
          }
          collapseControlIcon={<Text fz={24}>⊖</Text>}
        />
      </Paper>
    </SimpleGrid>
  );
}

export const customIcons: MantineDemo = {
  type: 'code',
  component: Demo,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.tsx', code, language: 'tsx' },
    { fileName: 'data.ts', code: dataCode, language: 'tsx' },
  ],
};
