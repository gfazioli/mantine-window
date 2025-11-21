import { JsonTree } from '@gfazioli/mantine-json-tree';
import { Paper, Stack } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { dataCode } from './data';

const code = `
import { JsonTree } from "@gfazioli/mantine-json-tree";
import { Paper, Stack } from '@mantine/core';
import { data } from './data';

function Demo() {
  return (
    <Stack>
      <Paper withBorder>
        <JsonTree data="Hello, World!" defaultExpanded title="Simple string" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={42} defaultExpanded title="Number value" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={true} defaultExpanded title="Boolean value (true)" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={false} defaultExpanded title="Boolean value (false)" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={null} defaultExpanded title="Null value" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={{ key1: 'value1', key2: 123, key3: false, key4: null }} defaultExpanded title="Object value" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={['string', 456, true, null, { nestedKey: 'nestedValue' }]} defaultExpanded title="Array value" />
      </Paper>
    </Stack>
  );
}
`;

function Demo() {
  return (
    <Stack>
      <Paper withBorder>
        <JsonTree data="Hello, World!" defaultExpanded title="Simple string" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={42} defaultExpanded title="Number value" />
      </Paper>
      <Paper withBorder>
        <JsonTree data defaultExpanded title="Boolean value (true)" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={false} defaultExpanded title="Boolean value (false)" />
      </Paper>
      <Paper withBorder>
        <JsonTree data={null} defaultExpanded title="Null value" />
      </Paper>
      <Paper withBorder>
        <JsonTree
          data={{ key1: 'value1', key2: 123, key3: false, key4: null }}
          defaultExpanded
          title="Object value"
        />
      </Paper>
      <Paper withBorder>
        <JsonTree
          data={['string', 456, true, null, { nestedKey: 'nestedValue' }]}
          defaultExpanded
          title="Array value"
        />
      </Paper>
    </Stack>
  );
}

export const values: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.tsx', code, language: 'tsx' },
    { fileName: 'data.ts', code: dataCode, language: 'tsx' },
  ],
  defaultExpanded: false,
};
