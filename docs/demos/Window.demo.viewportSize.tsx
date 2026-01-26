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
        title="Viewport Size"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '40vw', height: '50vh' }}
        persistState={false}
      >
        <Title order={4}>Size with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 40vw, height: 50vh
          </Text>
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            The window size and position scale proportionally with the viewport. Try resizing your
            browser window to see the window adapt!
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
        title="Viewport Size"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '5vw', y: '10vh' }}
        defaultSize={{ width: '40vw', height: '50vh' }}
        persistState={false}
      >
        <Title order={4}>Size with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Size:</strong> width: 40vw, height: 50vh
          </Text>
          <Text>
            <strong>Position:</strong> x: 5vw, y: 10vh
          </Text>
          <Text>
            The window size and position scale proportionally with the viewport. Try resizing your
            browser window to see the window adapt!
          </Text>
        </Stack>
      </Window>
    </>
  );
}

export const viewportSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
