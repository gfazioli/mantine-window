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
        title="Mixed Unit Drag Bounds"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: 50, y: '10vh' }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: '80vw',
          minY: '10vh',
          maxY: 450,
        }}
        persistState={false}
      >
        <Title order={4}>Mixed Unit Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>Min X:</strong> 50px (fixed)
          </p>
          <p>
            <strong>Max X:</strong> 80vw (viewport-based)
          </p>
          <p>
            <strong>Min Y:</strong> 10vh (viewport-based)
          </p>
          <p>
            <strong>Max Y:</strong> 450px (fixed)
          </p>
          <p>Mix different unit types for flexible boundaries!</p>
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
        title="Mixed Unit Drag Bounds"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: 50, y: '10vh' }}
        defaultSize={{ width: 400, height: 300 }}
        dragBounds={{
          minX: 50,
          maxX: '80vw',
          minY: '10vh',
          maxY: 450,
        }}
        persistState={false}
      >
        <Title order={4}>Mixed Unit Boundaries</Title>
        <Stack gap="sm">
          <p>
            <strong>Min X:</strong> 50px (fixed)
          </p>
          <p>
            <strong>Max X:</strong> 80vw (viewport-based)
          </p>
          <p>
            <strong>Min Y:</strong> 10vh (viewport-based)
          </p>
          <p>
            <strong>Max Y:</strong> 450px (fixed)
          </p>
          <p>Mix different unit types for flexible boundaries!</p>
        </Stack>
      </Window>
    </>
  );
}

export const mixedDragBounds: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
