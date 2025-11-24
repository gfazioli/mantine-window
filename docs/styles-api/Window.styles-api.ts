import type { WindowFactory } from '@gfazioli/mantine-window';
import type { StylesApiData } from '../components/styles-api.types';

export const WindowStylesApi: StylesApiData<WindowFactory> = {
  selectors: {
    root: 'Root element',
    container: 'Container wrapping the window',
    header: 'Window header',
    title: 'Window title',
    closeButton: 'Close button',
    collapseButton: 'Collapse button',
    windowToolsButton: 'Window tools button',
    resizeHandleTopLeft: 'Resize handle at top left corner',
    resizeHandleTopRight: 'Resize handle at top right corner',
    resizeHandleBottomLeft: 'Resize handle at bottom left corner',
    resizeHandleBottomRight: 'Resize handle at bottom right corner',
    resizeHandleTop: 'Resize handle at top side',
    resizeHandleBottom: 'Resize handle at bottom side',
    resizeHandleLeft: 'Resize handle at left side',
    resizeHandleRight: 'Resize handle at right side',
  },

  vars: {
    root: {
      '--window-background': 'Background color of the window',
      '--window-radius': 'Border radius of the window',
    },
    header: {},
    title: {},
    closeButton: {},
    collapseButton: {},
    windowToolsButton: {},
    container: {},
    resizeHandleTopLeft: {},
    resizeHandleTopRight: {},
    resizeHandleBottomLeft: {},
    resizeHandleBottomRight: {},
    resizeHandleTop: {},
    resizeHandleBottom: {},
    resizeHandleLeft: {},
    resizeHandleRight: {},
  },

  //modifiers: [{ selector: 'root' }],
};
