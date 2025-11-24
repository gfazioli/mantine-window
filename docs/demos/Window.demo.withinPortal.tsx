import { Window } from '@gfazioli/mantine-window';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [portalOpened, { open: openPortal, close: closePortal }] = useDisclosure(false);
  const [containerOpened, { open: openContainer, close: closeContainer }] = useDisclosure(false);

  return (
    <>
      <Group mb="md">
        <Button onClick={openPortal}>Open in Portal (Fixed)</Button>
        <Button onClick={openContainer}>Open in Container (Relative)</Button>
      </Group>

      {/* Window with withinPortal={true} (default) - fixed positioning */}
      <Window 
        title="Fixed Window (Portal)" 
        opened={portalOpened} 
        onClose={closePortal}
        withinPortal={true}
        persistState={false}
        defaultPosition={{ x: 100, y: 100 }}
      >
        <Stack p="md">
          <Title order={4}>Portal Window</Title>
          <Text size="sm">
            This window uses <strong>withinPortal=true</strong> (default).
            It is positioned fixed relative to the viewport and will stay in place even when scrolling.
          </Text>
        </Stack>
      </Window>

      {/* Container for relative window */}
      <Stack pos="relative" style={{ width: '100%', height: 400, border: '2px dashed gray' }} p="md">
        <Text c="dimmed" size="sm">Container with position: relative</Text>
        
        {/* Window with withinPortal={false} - absolute positioning */}
        <Window 
          title="Relative Window (Container)" 
          opened={containerOpened} 
          onClose={closeContainer}
          withinPortal={false}
          persistState={false}
          defaultPosition={{ x: 20, y: 50 }}
        >
          <Stack p="md">
            <Title order={4}>Container Window</Title>
            <Text size="sm">
              This window uses <strong>withinPortal=false</strong>.
              It is positioned absolute relative to its parent container and cannot be dragged outside.
            </Text>
          </Stack>
        </Window>
      </Stack>
    </>
  );
}
`;

function Demo() {
  const [portalOpened, { open: openPortal, close: closePortal }] = useDisclosure(false);
  const [containerOpened, { open: openContainer, close: closeContainer }] = useDisclosure(false);

  return (
    <>
      <Group mb="md">
        <Button onClick={openPortal}>Open in Portal (Fixed)</Button>
        <Button onClick={openContainer}>Open in Container (Relative)</Button>
      </Group>

      {/* Window with withinPortal={true} (default) - fixed positioning */}
      <Window
        title="Fixed Window (Portal)"
        opened={portalOpened}
        onClose={closePortal}
        withinPortal={true}
        persistState={false}
        defaultPosition={{ x: 100, y: 100 }}
      >
        <Stack p="md">
          <Title order={4}>Portal Window</Title>
          <Text size="sm">
            This window uses <strong>withinPortal=true</strong> (default). It is positioned fixed
            relative to the viewport and will stay in place even when scrolling.
          </Text>
        </Stack>
      </Window>

      {/* Container for relative window */}
      <Stack
        pos="relative"
        style={{ width: '100%', height: 400, border: '2px dashed gray' }}
        p="md"
      >
        <Text c="dimmed" size="sm">
          Container with position: relative
        </Text>

        {/* Window with withinPortal={false} - absolute positioning */}
        <Window
          title="Relative Window (Container)"
          opened={containerOpened}
          onClose={closeContainer}
          withinPortal={false}
          persistState={false}
          defaultPosition={{ x: 20, y: 50 }}
        >
          <Stack p="md">
            <Title order={4}>Container Window</Title>
            <Text size="sm">
              This window uses <strong>withinPortal=false</strong>. It is positioned absolute
              relative to its parent container and cannot be dragged outside.
            </Text>
          </Stack>
        </Window>
      </Stack>
    </>
  );
}

export const withinPortal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
