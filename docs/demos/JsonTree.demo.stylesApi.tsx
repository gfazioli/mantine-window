import { Window } from '@gfazioli/mantine-window';
import { MantineDemo } from '@mantinex/demo';
import { WindowStylesApi } from '../styles-api/Window.styles-api';
import { data } from './data';

const code = `
import { Window } from "@gfazioli/mantine-window";
import { data } from './data';

function Demo() {
  return (
    <Window{{props}}
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
    <Window
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
  data: WindowStylesApi,
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
};
