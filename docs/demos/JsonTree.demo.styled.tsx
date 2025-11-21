import { JsonTree } from '@gfazioli/mantine-json-tree';
import { MantineDemo } from '@mantinex/demo';
import { data, dataCode } from './data';
import classes from './JsonTree.module.css';

const code = `
import { JsonTree } from "@gfazioli/mantine-json-tree";
import { data } from './data';
import classes from './JsonTree.module.css';

function Demo() {
  return (
    <JsonTree
      classNames={classes}
      title="demo.json"
      showIndentGuides
      defaultExpanded
      showItemsCount
      maxDepth={1}
      data={data}
    />
  );
}
`;

const moduleCss = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(100, 149, 237, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(100, 149, 237, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(100, 149, 237, 0);
  }
}

.header {
  background-color: var(--mantine-color-dark-7);
  border-radius: var(--mantine-radius-sm);
  border: 1px solid var(--mantine-color-dark-5);

  @mixin where-light {
    background-color: var(--mantine-color-gray-0);
    border: 1px solid var(--mantine-color-gray-1);
  }
}

.value {
  &[data-type='string'] {
    border: 1px solid var(--mantine-primary-color-6);
    animation: pulse 2s infinite;

    &[data-value='"js"'] {
      border: 1px solid var(--mantine-color-red-6);
      animation: none;
    }
  }
}

.itemsCount {
  background-color: var(--mantine-primary-color-6);
  animation: pulse 2s infinite reverse;
}
`;

function Demo() {
  return (
    <JsonTree
      classNames={classes}
      title="demo.json"
      showIndentGuides
      defaultExpanded
      showItemsCount
      maxDepth={1}
      data={data}
    />
  );
}

export const styled: MantineDemo = {
  type: 'code',
  component: Demo,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.tsx', code, language: 'tsx' },
    { fileName: 'JsonTree.module.css', code: moduleCss, language: 'css' },
    { fileName: 'data.ts', code: dataCode, language: 'tsx' },
  ],
};
