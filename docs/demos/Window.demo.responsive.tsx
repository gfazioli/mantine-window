import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Stack, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Responsive Window"
        opened
        defaultX={{ base: 10, md: 50 }}
        defaultY={20}
        defaultWidth={{ base: 280, sm: 350, md: 450 }}
        defaultHeight={{ base: 200, md: 300 }}
        minWidth={{ base: 200, md: 300 }}
        radius={{ base: 'sm', md: 'lg' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Responsive Props</Title>
        <Stack gap="xs">
          <Text size="sm">
            <strong>defaultWidth:</strong>{' '}
            {'{ base: 280, sm: 350, md: 450 }'}
          </Text>
          <Text size="sm">
            <strong>defaultHeight:</strong>{' '}
            {'{ base: 200, md: 300 }'}
          </Text>
          <Text size="sm">
            <strong>minWidth:</strong>{' '}
            {'{ base: 200, md: 300 }'}
          </Text>
          <Text size="sm">
            <strong>radius:</strong>{' '}
            {'{ base: "sm", md: "lg" }'}
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Resize your browser to see values change at breakpoints.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="Responsive Window"
        opened
        defaultX={{ base: 10, md: 50 }}
        defaultY={20}
        defaultWidth={{ base: 280, sm: 350, md: 450 }}
        defaultHeight={{ base: 200, md: 300 }}
        minWidth={{ base: 200, md: 300 }}
        radius={{ base: 'sm', md: 'lg' }}
        persistState={false}
        withinPortal={false}
      >
        <Title order={4}>Responsive Props</Title>
        <Stack gap="xs">
          <Text size="sm">
            <strong>defaultWidth:</strong> {'{ base: 280, sm: 350, md: 450 }'}
          </Text>
          <Text size="sm">
            <strong>defaultHeight:</strong> {'{ base: 200, md: 300 }'}
          </Text>
          <Text size="sm">
            <strong>minWidth:</strong> {'{ base: 200, md: 300 }'}
          </Text>
          <Text size="sm">
            <strong>radius:</strong> {'{ base: "sm", md: "lg" }'}
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Resize your browser to see values change at breakpoints.
          </Text>
        </Stack>
      </Window>
    </Box>
  );
}

export const responsive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
