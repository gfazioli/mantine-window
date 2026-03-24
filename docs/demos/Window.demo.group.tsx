import { Window } from '@gfazioli/mantine-window';
import { Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Window } from '@gfazioli/mantine-window';
import { Title } from '@mantine/core';

function Demo() {
  return (
    <Window.Group style={{ width: '100%', height: 500 }}>
      <Window
        id="editor"
        title="Editor"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Editor window</Title>
        <p>Try the green button for layout options</p>
      </Window>
      <Window
        id="preview"
        title="Preview"
        opened
        defaultX={320}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Preview window</Title>
      </Window>
      <Window
        id="console"
        title="Console"
        opened
        defaultX={10}
        defaultY={270}
        defaultWidth={610}
        defaultHeight={200}
      >
        <Title order={4}>Console window</Title>
      </Window>
    </Window.Group>
  );
}
`;

function Demo() {
  return (
    <Window.Group style={{ width: '100%', height: 500 }}>
      <Window
        id="editor"
        title="Editor"
        opened
        defaultX={10}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Editor window</Title>
        <p>Try the green button for layout options</p>
      </Window>
      <Window
        id="preview"
        title="Preview"
        opened
        defaultX={320}
        defaultY={10}
        defaultWidth={300}
        defaultHeight={250}
      >
        <Title order={4}>Preview window</Title>
      </Window>
      <Window
        id="console"
        title="Console"
        opened
        defaultX={10}
        defaultY={270}
        defaultWidth={610}
        defaultHeight={200}
      >
        <Title order={4}>Console window</Title>
      </Window>
    </Window.Group>
  );
}

export const group: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
