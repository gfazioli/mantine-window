import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Button, Group, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useState } from 'react';
import { Window } from '@gfazioli/mantine-window';
import { Button, Group, Title } from '@mantine/core';

function Demo() {
  const [ids, setIds] = useState<string[]>(['alpha', 'beta']);
  const nextId = () => String.fromCharCode(97 + ids.length);

  return (
    <>
      <Group mb="md">
        <Button onClick={() => setIds((prev) => [...prev, \`win_\${nextId()}\`])}>
          Add window
        </Button>
        <Button color="red" onClick={() => setIds((prev) => prev.slice(0, -1))}>
          Remove last
        </Button>
      </Group>
      <Window.Group style={{ width: '100%', height: 500 }}>
        {ids.map((id, i) => (
          <Window
            id={\`win_\${id}\`}
            key={\`win_\${id}\`}
            title={\`Window \${id}\`}
            opened
            defaultX={20 + i * 40}
            defaultY={20 + i * 40}
            defaultWidth={300}
            defaultHeight={200}
          >
            <Title order={4}>Dynamic {id}</Title>
            <p>Click the green tools button to apply a layout preset.</p>
          </Window>
        ))}
      </Window.Group>
    </>
  );
}
`;

function Demo() {
  const [ids, setIds] = useState<string[]>(['alpha', 'beta']);
  const nextId = () => String.fromCharCode(97 + ids.length);

  return (
    <>
      <Group mb="md">
        <Button onClick={() => setIds((prev) => [...prev, `win_${nextId()}`])}>Add window</Button>
        <Button color="red" onClick={() => setIds((prev) => prev.slice(0, -1))}>
          Remove last
        </Button>
      </Group>
      <Window.Group style={{ width: '100%', height: 500 }}>
        {ids.map((id, i) => (
          <Window
            id={`win_${id}`}
            key={`win_${id}`}
            title={`Window ${id}`}
            opened
            defaultX={20 + i * 40}
            defaultY={20 + i * 40}
            defaultWidth={300}
            defaultHeight={200}
          >
            <Title order={4}>Dynamic {id}</Title>
            <p>Click the green tools button to apply a layout preset.</p>
          </Window>
        ))}
      </Window.Group>
    </>
  );
}

export const dynamicWindows: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
