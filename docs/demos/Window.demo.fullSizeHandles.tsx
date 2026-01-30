import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Full Size Resize Handles"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 450, height: 350 }}
        fullSizeResizeHandles
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Full Size Resize Handles</Title>
        <p>
          With <code>fullSizeResizeHandles</code> enabled, the side handles (top, bottom, left,
          right) span the entire width or height of the window.
        </p>
        <p>
          This makes it easier to resize from any edge, while corner handles (14x14px) remain for
          diagonal resizing.
        </p>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Full Size Resize Handles"
        opened
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 450, height: 350 }}
        fullSizeResizeHandles
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Full Size Resize Handles</Title>
        <p>
          With <code>fullSizeResizeHandles</code> enabled, the side handles (top, bottom, left,
          right) span the entire width or height of the window.
        </p>
        <p>
          This makes it easier to resize from any edge, while corner handles (14x14px) remain for
          diagonal resizing.
        </p>
      </Window>
    </Box>
  );
}

export const fullSizeHandles: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
