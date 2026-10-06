import { useDragResize } from '@gfazioli/mantine-window';
import { Badge, Box, Code, Paper, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useDragResize } from '@gfazioli/mantine-window';
import { Badge, Box, Code, Paper, Stack, Text } from '@mantine/core';

function Demo() {
  const { ref, position, size, isDragging, isResizing, getDragHandleProps, getResizeHandleProps } =
    useDragResize({
      boundary: 'parent',
      defaultPosition: { x: 40, y: 40 },
      defaultSize: { width: 300, height: 190 },
      minWidth: 200,
      minHeight: 150,
      maxWidth: '90%',
    });

  return (
    <Box pos="relative" h={420} bg="var(--mantine-color-default-hover)">
      <Paper
        ref={ref}
        withBorder
        shadow={isDragging ? 'xl' : 'sm'}
        p="md"
        {...getDragHandleProps()}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <Stack gap="xs">
          <Text fw={600}>A plain Paper</Text>
          <Text size="sm">
            Drag it anywhere, resize it from the right, the bottom or the corner.
          </Text>
          <Code>
            {Math.round(size.width)} × {Math.round(size.height)} at {Math.round(position.x)},{' '}
            {Math.round(position.y)}
          </Code>
          <Badge variant="light" color={isDragging || isResizing ? 'blue' : 'gray'}>
            {isDragging ? 'dragging' : isResizing ? 'resizing' : 'idle'}
          </Badge>
        </Stack>

        <Box
          {...getResizeHandleProps('right')}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 8,
            cursor: 'ew-resize',
          }}
        />
        <Box
          {...getResizeHandleProps('bottom')}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            cursor: 'ns-resize',
          }}
        />
        <Box
          {...getResizeHandleProps('bottomRight', { keyboard: true, label: 'Resize card' })}
          className="mantine-focus-auto"
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 16,
            height: 16,
            cursor: 'nwse-resize',
            borderRadius: 2,
            background:
              'linear-gradient(135deg, transparent 50%, var(--mantine-color-dimmed) 50%, var(--mantine-color-dimmed) 60%, transparent 60%, transparent 75%, var(--mantine-color-dimmed) 75%, var(--mantine-color-dimmed) 85%, transparent 85%)',
          }}
        />
      </Paper>
    </Box>
  );
}
`;

function Demo() {
  const { ref, position, size, isDragging, isResizing, getDragHandleProps, getResizeHandleProps } =
    useDragResize({
      boundary: 'parent',
      defaultPosition: { x: 40, y: 40 },
      defaultSize: { width: 300, height: 190 },
      minWidth: 200,
      minHeight: 150,
      maxWidth: '90%',
    });

  return (
    <Box pos="relative" h={420} bg="var(--mantine-color-default-hover)">
      <Paper
        ref={ref}
        withBorder
        shadow={isDragging ? 'xl' : 'sm'}
        p="md"
        {...getDragHandleProps()}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <Stack gap="xs">
          <Text fw={600}>A plain Paper</Text>
          <Text size="sm">
            Drag it anywhere, resize it from the right, the bottom or the corner.
          </Text>
          <Code>
            {Math.round(size.width)} × {Math.round(size.height)} at {Math.round(position.x)},{' '}
            {Math.round(position.y)}
          </Code>
          <Badge variant="light" color={isDragging || isResizing ? 'blue' : 'gray'}>
            {isDragging ? 'dragging' : isResizing ? 'resizing' : 'idle'}
          </Badge>
        </Stack>

        <Box
          {...getResizeHandleProps('right')}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 8,
            cursor: 'ew-resize',
          }}
        />
        <Box
          {...getResizeHandleProps('bottom')}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            cursor: 'ns-resize',
          }}
        />
        <Box
          {...getResizeHandleProps('bottomRight', { keyboard: true, label: 'Resize card' })}
          className="mantine-focus-auto"
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 16,
            height: 16,
            cursor: 'nwse-resize',
            borderRadius: 2,
            background:
              'linear-gradient(135deg, transparent 50%, var(--mantine-color-dimmed) 50%, var(--mantine-color-dimmed) 60%, transparent 60%, transparent 75%, var(--mantine-color-dimmed) 75%, var(--mantine-color-dimmed) 85%, transparent 85%)',
          }}
        />
      </Paper>
    </Box>
  );
}

export const useDragResizeDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
