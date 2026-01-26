import { Window } from '@gfazioli/mantine-window';
import { Button, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Button, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open window</Button>
      <Window
        title="Viewport-based Constraints"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 350 }}
        minWidth="30vw"
        minHeight="20vh"
        maxWidth="80vw"
        maxHeight="70vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Min/Max Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Min:</strong> 30vw x 20vh
          </p>
          <p>
            <strong>Max:</strong> 80vw x 70vh
          </p>
          <p>Try resizing your browser window to see the constraints adapt!</p>
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
        title="Viewport-based Constraints"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: 50, y: 50 }}
        defaultSize={{ width: 500, height: 350 }}
        minWidth="30vw"
        minHeight="20vh"
        maxWidth="80vw"
        maxHeight="70vh"
        persistState={false}
      >
        <Title order={4}>Viewport-based Min/Max Size</Title>
        <Stack gap="sm">
          <p>
            <strong>Min:</strong> 30vw x 20vh
          </p>
          <p>
            <strong>Max:</strong> 80vw x 70vh
          </p>
          <p>Try resizing your browser window to see the constraints adapt!</p>
        </Stack>
      </Window>
    </>
  );
}

export const viewportConstraints: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
