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
        title="Viewport Position"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
      >
        <Title order={4}>Position with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10vw, y: 15vh
          </Text>
          <Text>
            <strong>Reference:</strong> Viewport (browser window)
          </Text>
          <Text size="sm" c="dimmed">
            Viewport units (vw/vh) are always relative to the browser viewport. The position adapts
            proportionally when resizing the browser window.
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
        title="Viewport Position"
        opened={opened}
        onClose={close}
        defaultPosition={{ x: '10vw', y: '15vh' }}
        defaultSize={{ width: 400, height: 300 }}
        persistState={false}
      >
        <Title order={4}>Position with Viewport Units</Title>
        <Stack gap="sm">
          <Text>
            <strong>Position:</strong> x: 10vw, y: 15vh
          </Text>
          <Text>
            <strong>Reference:</strong> Viewport (browser window)
          </Text>
          <Text size="sm" c="dimmed">
            Viewport units (vw/vh) are always relative to the browser viewport. The position adapts
            proportionally when resizing the browser window.
          </Text>
        </Stack>
      </Window>
    </>
  );
}

export const viewportPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
