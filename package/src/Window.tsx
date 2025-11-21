import React from 'react';
import { IconArrowsDiagonal2, IconMinus, IconX } from '@tabler/icons-react';
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
  type MantineRadius,
  type MantineShadow,
} from '@mantine/core';
import { useMantineWindow } from './hooks/use-mantine-window';
import classes from './Window.module.css';

export type WindowStylesNames = 'root' | 'header' | 'resizeHandle';

export type WindowCssVariables = {
  root: '--mantine-window-background';
  header: never;
  resizeHandle: never;
};

export interface WindowBaseProps {
  title?: string;

  radius?: MantineRadius | number;
  withBorder?: boolean;
  shadow?: MantineShadow;

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
    header: {},
    resizeHandle: {},
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
      {...others}
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
        {...getStyles('header')}
        onMouseDown={handleMouseDownDrag}
        onDoubleClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Flex align="center" gap="xs" miw={0}>
          <Flex align="center" gap="sm">
            <ActionIcon radius={256} size="xs" color="red" onClick={() => setIsVisible(false)}>
              <IconX size={14} />
            </ActionIcon>
            <ActionIcon
              radius={256}
              size="xs"
              color="yellow"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <IconMinus size={14} />
            </ActionIcon>
          </Flex>
          <Flex align="center" gap="xs" miw={0}>
            <Text size="sm" fw={600} truncate>
              {title}
            </Text>
          </Flex>
        </Flex>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          <ScrollArea className={classes.content} style={{ height: size.height - 40 }}>
            {children}
          </ScrollArea>

          {/* Resize handle */}
          <ActionIcon
            size="xs"
            variant="transparent"
            data-resize-handle
            onMouseDown={handleMouseDownResize}
            {...getStyles('resizeHandle')}
          >
            <IconArrowsDiagonal2 />
          </ActionIcon>
        </>
      )}
    </Paper>
  );
});

Window.classes = classes;
Window.displayName = 'Window';
