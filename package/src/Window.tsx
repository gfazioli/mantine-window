import React from 'react';
import { IconGripVertical, IconMinus, IconSearch, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  createVarsResolver,
  Factory,
  factory,
  Flex,
  Paper,
  ScrollArea,
  StylesApiProps,
  Text,
  useMantineTheme,
  useProps,
  useStyles,
  type BoxProps,
} from '@mantine/core';
import { useMantineWindow } from './hooks/use-mantine-window';
import classes from './Window.module.css';

export type WindowStylesNames = 'root';

export type WindowCssVariables = {
  root: '--mantine-window-background';
};

export interface WindowBaseProps {
  title?: string;
  children?: React.ReactNode;
}

export interface WindowProps extends BoxProps, WindowBaseProps, StylesApiProps<WindowFactory> {}

export type WindowFactory = Factory<{
  props: WindowProps;
  ref: HTMLDivElement;
  stylesNames: WindowStylesNames;
  vars: WindowCssVariables;
}>;

export const defaultProps: Partial<WindowProps> = {};

const varsResolver = createVarsResolver<WindowFactory>((_, {}) => {
  return {
    root: {
      '--mantine-window-background': 'var(--mantine-color-default)',
    },
  };
});

export const Window = factory<WindowFactory>((_props, ref) => {
  const props = useProps('Window', defaultProps, _props);

  const {
    title,
    children,

    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,

    ...others
  } = props;

  const getStyles = useStyles<WindowFactory>({
    name: 'Window',
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const theme = useMantineTheme();

  const {
    bringToFront,
    windowRef,
    position,
    size,
    isCollapsed,
    setIsCollapsed,
    isVisible,
    setIsVisible,
    zIndex,
    handleMouseDownDrag,
    handleMouseDownResize,
  } = useMantineWindow(props);

  return (
    <Paper
      ref={windowRef}
      onClick={bringToFront}
      {...getStyles('root', {
        style: {
          left: position.x,
          top: position.y,
          width: size.width,
          height: isCollapsed ? 'auto' : size.height,
          zIndex,
        },
      })}
    >
      {/* Header */}
      <div
        className={classes.header}
        onMouseDown={handleMouseDownDrag}
        onDoubleClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Flex align="center" gap="xs" miw={0}>
          <IconGripVertical size={16} style={{ cursor: 'move' }} />
          <Flex align="center" gap="xs" miw={0}>
            <IconSearch size={14} />
            <Text size="sm" fw={600} truncate>
              {title}
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" gap={4}>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="gray"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <IconMinus size={14} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" color="gray" onClick={() => setIsVisible(false)}>
            <IconX size={14} />
          </ActionIcon>
        </Flex>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          <ScrollArea className={classes.content} style={{ height: size.height - 40 }}>
            {children}
          </ScrollArea>

          {/* Resize handle */}
          <div
            className={classes.resizeHandle}
            data-resize-handle
            onMouseDown={handleMouseDownResize}
          />
        </>
      )}
    </Paper>
  );
});

Window.classes = classes;
Window.displayName = 'Window';
