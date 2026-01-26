import { Window } from '@gfazioli/mantine-window';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open window</Button>
      <Window
        title="Responsive Window"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '50vw', height: '40vh' }}
        minWidth="300px"
        minHeight="200px"
        maxWidth="90vw"
        maxHeight="80vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Position & Size</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            <strong>Size:</strong> width: 50vw, height: 40vh
          </Text>
          <Text>
            <strong>Min:</strong> 300px x 200px
          </Text>
          <Text>
            <strong>Max:</strong> 90vw x 80vh
          </Text>
          <Text size="sm" c="dimmed">
            This window combines viewport units for position and size with pixel-based minimum
            constraints and viewport-based maximum constraints. All units are relative to the
            viewport.
          </Text>
        </Stack>
      </Window>
    </>
  );
}
`;

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open window</Button>
      <Window
        title="Responsive Window"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '50vw', height: '40vh' }}
        minWidth="300px"
        minHeight="200px"
        maxWidth="90vw"
        maxHeight="80vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Position & Size</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            <strong>Size:</strong> width: 50vw, height: 40vh
          </Text>
          <Text>
            <strong>Min:</strong> 300px x 200px
          </Text>
          <Text>
            <strong>Max:</strong> 90vw x 80vh
          </Text>
          <Text size="sm" c="dimmed">
            This window combines viewport units for position and size with pixel-based minimum
            constraints and viewport-based maximum constraints. All units are relative to the
            viewport.
          </Text>
        </Stack>
      </Window>
    </>
  );
}

export const responsiveWindow: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
