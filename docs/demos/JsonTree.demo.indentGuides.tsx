import { Window } from '@gfazioli/mantine-window';
import { MantineDemo } from '@mantinex/demo';
import { data, dataCode } from './data';

const code = `
import { Window } from "@gfazioli/mantine-window";
import { data } from './data';

function Demo() {
  return (
    <Window 
      data={data} 
      defaultExpanded 
      maxDepth={-1}
      showIndentGuides
      title="JSON with Indent Guides"
    />
  );
}
`;

function Demo() {
  return (
    <Window
      data={data}
      defaultExpanded
      maxDepth={-1}
      showIndentGuides
      title="JSON with Indent Guides"
    />
  );
}

export const indentGuides: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.tsx', code, language: 'tsx' },
    { fileName: 'data.ts', code: dataCode, language: 'tsx' },
  ],
  defaultExpanded: false,
};
