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

export interface WindowBounds {
  /** Minimum x coordinate (left boundary) */
  minX?: number;
  /** Maximum x coordinate (right boundary) */
  maxX?: number;
  /** Minimum y coordinate (top boundary) */
  minY?: number;
  /** Maximum y coordinate (bottom boundary) */
  maxY?: number;
}

export interface WindowSize {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

export interface WindowPosition {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

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

  /** Initial position of the window. If not provided, defaults to { x: 20, y: 100 } */
  defaultPosition?: WindowPosition;

  /** Initial size of the window. If not provided, defaults to { width: 400, height: 400 } */
  defaultSize?: WindowSize;

  /** Minimum width in pixels during resize. Default: 250 */
  minWidth?: number;

  /** Minimum height in pixels during resize. Default: 100 */
  minHeight?: number;

  /** Maximum width in pixels during resize. If not provided, no maximum limit */
  maxWidth?: number;

  /** Maximum height in pixels during resize. If not provided, no maximum limit */
  maxHeight?: number;

  /** Boundaries for dragging the window. If not provided, window can be dragged anywhere within viewport */
  dragBounds?: WindowBounds;

  /** Whether to persist position and size in localStorage. Default: true */
  persistState?: boolean;

  /** If true, window is positioned relative to the viewport. If false, positioned relative to parent container. Default: true */
  withinPortal?: boolean;

  /** Called when the window is moved */
  onPositionChange?: (position: WindowPosition) => void;

  /** Called when the window is resized */
  onSizeChange?: (size: WindowSize) => void;

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
  persistState: true,
  withinPortal: true,
  minWidth: 250,
  minHeight: 100,
};

const varsResolver = createVarsResolver<WindowFactory>((_, { radius }) => {
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

export const Window = factory<WindowFactory>((_props, _) => {
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
    withinPortal,

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          position: withinPortal ? 'fixed' : 'absolute',
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
        <Box
          {...getStyles('header')}
          onClick={bringToFront}
          mod={{ 'window-draggable': draggableHeader }}
          onMouseDown={draggableHeader ? handleMouseDownDrag : undefined}
          onDoubleClick={() => collapsable && setIsCollapsed(!isCollapsed)}
        >
          <Flex align="center" gap="xs" miw={0}>
            <Flex align="center" gap={8}>
              {withCloseButton && (
                <ActionIcon
                  radius={256}
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
        </Box>

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
