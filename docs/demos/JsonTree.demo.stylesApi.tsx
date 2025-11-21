import { JsonTree } from '@gfazioli/mantine-json-tree';
import { MantineDemo } from '@mantinex/demo';
import { JsonTreeStylesApi } from '../styles-api/JsonTree.styles-api';
import { data } from './data';

const code = `
import { JsonTree } from "@gfazioli/mantine-json-tree";
import { data } from './data';

function Demo() {
  return (
    <JsonTree{{props}}
      title="demo.json"
      showIndentGuides
      showItemsCount
      withCopyToClipboard
      withExpandAll
      defaultExpanded
      maxDepth={1}
      data={data}
    />
  );
}
`;

function Demo(props: any) {
  return (
    <JsonTree
      title="demo.json"
      showIndentGuides
      showItemsCount
      withCopyToClipboard
      withExpandAll
      defaultExpanded
      maxDepth={1}
      data={data}
      {...props}
    />
  );
}

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: JsonTreeStylesApi,
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
};
