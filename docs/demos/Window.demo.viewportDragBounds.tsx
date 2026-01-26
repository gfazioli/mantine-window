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
        title="Viewport-based Drag Bounds"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '10vw', y: '10vh' }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: '10vw',
          maxX: '70vw',
          minY: '10vh',
          maxY: '70vh',
        }}
        persistState={false}
      >
        <Title order={4}>Viewport-based Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>X Bounds:</strong> 10vw to 70vw
          </p>
          <p>
            <strong>Y Bounds:</strong> 10vh to 70vh
          </p>
          <p>Try dragging this window - it stays within viewport-based boundaries!</p>
          <p>Resize your browser to see bounds adapt.</p>
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
        title="Viewport-based Drag Bounds"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '10vw', y: '10vh' }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: '10vw',
          maxX: '70vw',
          minY: '10vh',
          maxY: '70vh',
        }}
        persistState={false}
      >
        <Title order={4}>Viewport-based Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>X Bounds:</strong> 10vw to 70vw
          </p>
          <p>
            <strong>Y Bounds:</strong> 10vh to 70vh
          </p>
          <p>Try dragging this window - it stays within viewport-based boundaries!</p>
          <p>Resize your browser to see bounds adapt.</p>
        </Stack>
      </Window>
    </>
  );
}

export const viewportDragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
