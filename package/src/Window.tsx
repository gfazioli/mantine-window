import React from 'react';
import { IconMinus, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
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

export type WindowStylesNames =
  | 'root'
  | 'container'
  | 'header'
  | 'resizeHandleTopLeft'
  | 'resizeHandleTop'
  | 'resizeHandleTopRight'
  | 'resizeHandleRight'
  | 'resizeHandleBottomRight'
  | 'resizeHandleBottom'
  | 'resizeHandleBottomLeft'
  | 'resizeHandleLeft';

export type WindowCssVariables = {
  root: '--mantine-window-background';
  container: never;
  header: never;
  resizeHandleTopLeft: never;
  resizeHandleTop: never;
  resizeHandleTopRight: never;
  resizeHandleRight: never;
  resizeHandleBottomRight: never;
  resizeHandleBottom: never;
  resizeHandleBottomLeft: never;
  resizeHandleLeft: never;
};

export type ResizableMode = 'none' | 'vertical' | 'horizontal' | 'both';
export type DraggableMode = 'none' | 'window' | 'header' | 'both';

export interface WindowBaseProps {
  /** Title of the window */
  title?: string;

  /** Radius of the window */
  radius?: MantineRadius | number;

  /** Whether the window has a border */
  withBorder?: boolean;

  /** Shadow of the window */
  shadow?: MantineShadow;

  /** Resizable mode of the window */
  resizable?: ResizableMode;

  /** Draggable mode of the window */
  draggable?: DraggableMode;

  collapsed?: boolean;

  /** Window content */
  children?: React.ReactNode;
}

export interface WindowProps extends BoxProps, WindowBaseProps, StylesApiProps<WindowFactory> {}

export type WindowFactory = Factory<{
  props: WindowProps;
  ref: HTMLDivElement;
  stylesNames: WindowStylesNames;
  vars: WindowCssVariables;
}>;

export const defaultProps: Partial<WindowProps> = {
  withBorder: true,
  resizable: 'both',
  draggable: 'both',
  collapsed: false,
};

const varsResolver = createVarsResolver<WindowFactory>((_, {}) => {
  return {
    root: {
      '--mantine-window-background': 'var(--mantine-color-default)',
    },
    container: {},
    header: {},
    resizeHandleTopLeft: {},
    resizeHandleTop: {},
    resizeHandleTopRight: {},
    resizeHandleRight: {},
    resizeHandleBottomRight: {},
    resizeHandleBottom: {},
    resizeHandleBottomLeft: {},
    resizeHandleLeft: {},
  };
});

export const Window = factory<WindowFactory>((_props, ref) => {
  const props = useProps('Window', defaultProps, _props);

  const {
    title,
    children,
    resizable,
    draggable,
    collapsed,

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
    handleMouseDownResizeTopLeft,
    handleMouseDownResizeTop,
    handleMouseDownResizeTopRight,
    handleMouseDownResizeRight,
    handleMouseDownResizeBottomRight,
    handleMouseDownResizeBottom,
    handleMouseDownResizeBottomLeft,
    handleMouseDownResizeLeft,
  } = useMantineWindow(props);

  const draggableHeader = draggable === 'header' || draggable === 'both';
  const draggableWindow = draggable === 'window' || draggable === 'both';

  return (
    <Paper
      ref={windowRef}
      onClick={bringToFront}
      data-window-draggable={draggableWindow ? true : undefined}
      onMouseDown={draggableWindow ? handleMouseDownDrag : undefined}
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
      <Box {...getStyles('container')}>
        {/* Header */}
        <div
          {...getStyles('header')}
          onClick={bringToFront}
          data-window-draggable={draggableHeader ? true : undefined}
          onMouseDown={draggableHeader ? handleMouseDownDrag : undefined}
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

            {/* Resize handles */}
            {resizable !== 'none' && (
              <>
                {/* Corner handles */}
                {resizable === 'both' && (
                  <>
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeTopLeft}
                      {...getStyles('resizeHandleTopLeft')}
                    />
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeTopRight}
                      {...getStyles('resizeHandleTopRight')}
                    />
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeBottomRight}
                      {...getStyles('resizeHandleBottomRight')}
                    />
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeBottomLeft}
                      {...getStyles('resizeHandleBottomLeft')}
                    />
                  </>
                )}

                {/* Vertical handles */}
                {(resizable === 'vertical' || resizable === 'both') && (
                  <>
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeTop}
                      {...getStyles('resizeHandleTop')}
                    />
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeBottom}
                      {...getStyles('resizeHandleBottom')}
                    />
                  </>
                )}

                {/* Horizontal handles */}
                {(resizable === 'horizontal' || resizable === 'both') && (
                  <>
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeRight}
                      {...getStyles('resizeHandleRight')}
                    />
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      data-resize-handle
                      onMouseDown={handleMouseDownResizeLeft}
                      {...getStyles('resizeHandleLeft')}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
});

Window.classes = classes;
Window.displayName = 'Window';
