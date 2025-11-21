import type { WindowFactory } from '@gfazioli/mantine-window';
import type { StylesApiData } from '../components/styles-api.types';

export const WindowStylesApi: StylesApiData<WindowFactory> = {
  selectors: {
    root: 'Root element',
    header: 'Header element',
    controls: 'Controls container',
    expandCollapse: 'Expand/collapse button',
    key: 'Element that renders object keys',
    keyValueSeparator: 'Element that renders the key-value separator (:)',
    value: 'Element that renders values (strings, numbers, booleans, null)',
    bracket: 'Element that renders brackets and punctuation (braces, commas, etc.)',
    itemsCount: 'Element that renders item counts for objects and arrays',
    indentGuide: 'Element that renders indent guides',
    copyButton: 'Copy to clipboard button',
    ellipsis: 'Element that renders ellipsis for collapsed nodes',
  },

  vars: {
    root: {
      '--window-font-family': 'Font family for the JSON tree',
      '--window-font-size': 'Font size for the JSON tree',
    },
    header: {
      '--window-header-background-color': 'Background color for the header',
      '--window-header-sticky-offset': 'Offset from the top when the header is sticky',
    },
    key: {
      '--window-color-key': 'Color for object keys',
    },

    value: {
      '--window-color-string': 'Color for string values',
      '--window-color-number': 'Color for number values',
      '--window-color-boolean': 'Color for boolean values',
      '--window-color-null': 'Color for null values',
    },
    bracket: {
      '--window-color-bracket': 'Color for brackets and punctuation',
    },
    indentGuide: {
      '--window-indent-guide-color-0': 'Color for indent guide at level 0 (and every 5th level)',
      '--window-indent-guide-color-1': 'Color for indent guide at level 1 (and every 5th level)',
      '--window-indent-guide-color-2': 'Color for indent guide at level 2 (and every 5th level)',
      '--window-indent-guide-color-3': 'Color for indent guide at level 3 (and every 5th level)',
      '--window-indent-guide-color-4': 'Color for indent guide at level 4 (and every 5th level)',
    },
    copyButton: {},
    expandCollapse: {},
    keyValueSeparator: {},
    ellipsis: {},
    itemsCount: {},
    controls: {},
  },

  //modifiers: [{ selector: 'root' }],
};
