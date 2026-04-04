import { Window } from '@gfazioli/mantine-window';
import { Box, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const lines = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet`);

const code = `import { Window } from '@gfazioli/mantine-window';
import { Box, Text, Title } from '@mantine/core';

function Demo() {
  const lines = Array.from({ length: 10 }, (_, i) =>
    \`Line \${i + 1}: Lorem ipsum dolor sit amet\`
  );

  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      {/* Default: ScrollArea wraps content — overflow is scrollable */}
      <Window
        title="With ScrollArea (default)"
        opened
        defaultX={20} defaultY={20}
        defaultWidth={300} defaultHeight={200}
        persistState={false}
        withinPortal={false}
      >
        <Title order={5}>Same content</Title>
        {lines.map((line, i) => (
          <Text key={i} size="sm">{line}</Text>
        ))}
      </Window>

      {/* withScrollArea={false}: no scroll wrapper — overflow is clipped */}
      <Window
        title="Without ScrollArea"
        opened
        defaultX={350} defaultY={20}
        defaultWidth={300} defaultHeight={200}
        withScrollArea={false}
        persistState={false}
        withinPortal={false}
      >
        <Title order={5}>Same content</Title>
        {lines.map((line, i) => (
          <Text key={i} size="sm">{line}</Text>
        ))}
      </Window>
    </Box>
  );
}
`;

function Demo() {
  return (
    <Box pos="relative" style={{ width: '100%', height: 500 }}>
      <Window
        title="With ScrollArea (default)"
        opened
        defaultX={20}
        defaultY={20}
        defaultWidth={300}
        defaultHeight={200}
        persistState={false}
        withinPortal={false}
      >
        <Title order={5}>Same content</Title>
        {lines.map((line, i) => (
          <Text key={i} size="sm">
            {line}
          </Text>
        ))}
      </Window>

      <Window
        title="Without ScrollArea"
        opened
        defaultX={350}
        defaultY={20}
        defaultWidth={300}
        defaultHeight={200}
        withScrollArea={false}
        persistState={false}
        withinPortal={false}
      >
        <Title order={5}>Same content</Title>
        {lines.map((line, i) => (
          <Text key={i} size="sm">
            {line}
          </Text>
        ))}
      </Window>
    </Box>
  );
}

export const withScrollAreaDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
