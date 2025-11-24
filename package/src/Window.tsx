import React from 'react';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBoxAlignLeftFilled,
  IconCaretUpDownFilled,
  IconMinus,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  createVarsResolver,
  Factory,
  factory,
  Flex,
  getRadius,
  Group,
  Paper,
  Popover,
  ScrollArea,
  Stack,
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
  | 'title'
  | 'closeButton'
  | 'collapseButton'
  | 'windowToolsButton'
  | 'resizeHandleTopLeft'
  | 'resizeHandleTop'
  | 'resizeHandleTopRight'
  | 'resizeHandleRight'
  | 'resizeHandleBottomRight'
  | 'resizeHandleBottom'
  | 'resizeHandleBottomLeft'
  | 'resizeHandleLeft';

export type WindowCssVariables = {
  root: '--window-background' | '--window-radius';
  container: never;
  header: never;
  title: never;
  closeButton: never;
  collapseButton: never;
  windowToolsButton: never;
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
  /** Whether the window is opened for controlled usage */
  opened?: boolean;

  /** Unique id of the window. Used to store window position and size. If not provided, the title is used */
  id?: string;

  /** Title of the window. Used as a fallback id if no id is provided */
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

  /** Whether the window is initially collapsed */
  collapsed?: boolean;

  /** Whether the window has a collapse button */
  withCollapseButton?: boolean;

  /** Whether the window is collapsable */
  collapsable?: boolean;

  /** Whether the window has a close button */
  withCloseButton?: boolean;

  /** Called when the window is closed */
  onClose?: () => void;

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
  shadow: 'md',
  resizable: 'both',
  draggable: 'both',
  collapsed: false,
  withCloseButton: true,
  withCollapseButton: true,
  collapsable: true,
};

const varsResolver = createVarsResolver<WindowFactory>((_, { radius, shadow }) => {
  return {
    root: {
      '--window-background': 'var(--mantine-color-default)',
      '--window-radius': radius === undefined ? 'var(--mantine-radius-lg)' : getRadius(radius),
    },
    container: {},
    header: {},
    title: {},
    closeButton: {},
    collapseButton: {},
    windowToolsButton: {},
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
    withCollapseButton,
    collapsable,
    withCloseButton,
    onClose,
    radius,

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
    handleClose,
  } = useMantineWindow(props);

  const draggableHeader = draggable === 'header' || draggable === 'both';
  const draggableWindow = draggable === 'window' || draggable === 'both';

  function WindowTools() {
    return (
      <Popover radius="md" width={200} position="bottom-start" withArrow shadow="md" withinPortal>
        <Popover.Target>
          <ActionIcon radius={256} size="xs" color="green" {...getStyles('windowToolsButton')}>
            <IconCaretUpDownFilled size={14} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Text size="xs" c="dimmed">
              Fill and position
            </Text>
            <Group>
              <ActionIcon variant="light">
                <IconArrowsMaximize size={14} />
              </ActionIcon>
              <ActionIcon variant="light">
                <IconArrowsMinimize size={14} />
              </ActionIcon>
              <ActionIcon variant="light">
                <IconBoxAlignLeftFilled size={14} />
              </ActionIcon>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    );
  }

  if (!isVisible) {
    return null;
  }

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
          onDoubleClick={() => collapsable && setIsCollapsed(!isCollapsed)}
        >
          <Flex align="center" gap="xs" miw={0}>
            <Flex align="center" gap="sm">
              {withCloseButton && (
                <ActionIcon
                  radius={256}
                  size="xs"
                  color="red"
                  onClick={handleClose}
                  {...getStyles('closeButton')}
                >
                  <IconX size={14} />
                </ActionIcon>
              )}
              {withCollapseButton && collapsable && (
                <ActionIcon
                  radius={256}
                  size="xs"
                  color="yellow"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  {...getStyles('collapseButton')}
                >
                  {isCollapsed ? <IconPlus size={14} /> : <IconMinus size={14} />}
                </ActionIcon>
              )}
            </Flex>
            <Flex align="center" gap="xs" miw={0}>
              <Text size="sm" truncate {...getStyles('title')}>
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
