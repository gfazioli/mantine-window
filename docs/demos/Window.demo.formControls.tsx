import { Window } from '@gfazioli/mantine-window';
import { Box, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, NumberInput, Select, Stack, TextInput } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 420 }}>
      <Window
        title="Profile settings"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={360}
        defaultHeight={340}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="sm">
          <TextInput label="Display name" placeholder="Jane Doe" />
          {/* Searchable Select: focus, typing and filtering work while inside the Window */}
          <Select
            label="Favorite library"
            placeholder="Pick value"
            data={['React', 'Angular', 'Vue', 'Svelte']}
            searchable
          />
          <NumberInput label="Years of experience" placeholder="0" min={0} />
        </Stack>
      </Window>
    </Box>
  );
}`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 420 }}>
      <Window
        title="Profile settings"
        opened
        defaultX={30}
        defaultY={30}
        defaultWidth={360}
        defaultHeight={340}
        persistState={false}
        withinPortal={false}
      >
        <Stack gap="sm">
          <TextInput label="Display name" placeholder="Jane Doe" />
          {/* Searchable Select: focus, typing and filtering work while inside the Window */}
          <Select
            label="Favorite library"
            placeholder="Pick value"
            data={['React', 'Angular', 'Vue', 'Svelte']}
            searchable
          />
          <NumberInput label="Years of experience" placeholder="0" min={0} />
        </Stack>
      </Window>
    </Box>
  );
}

export const formControls: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
