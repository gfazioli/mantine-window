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
    <Stack pos="relative" style={{ width: '100%', height: 500 }}>
      <Button onClick={open}>Open window</Button>
      <Window title="Hello World" opened={opened} onClose={close} withinPortal={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}
`;

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack pos="relative" style={{ width: '100%', height: 500 }}>
      <Button onClick={open}>Open window</Button>
      <Window title="Hello World" opened={opened} onClose={close} withinPortal={false}>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}

export const controlled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
