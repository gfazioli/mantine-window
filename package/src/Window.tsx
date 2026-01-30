import React from 'react';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  createVarsResolver,
  Factory,
  factory,
  Flex,
  getRadius,
  getShadow,
  ScrollArea,
  StylesApiProps,
  Text,
  useProps,
  useStyles,
  type BoxProps,
  type MantineColor,
  type MantineRadius,
  type MantineShadow,
} from '@mantine/core';
import { useMantineWindow } from './hooks/use-mantine-window';
import classes from './Window.module.css';

export type WindowStylesNames =
  | 'root'
  | 'container'
  | 'content'
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
  root: '--window-background' | '--window-radius' | '--window-shadow';
  container: never;
  content: never;
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
  /** Minimum x coordinate (left boundary). Supports pixels (number), viewport width ('10vw'), viewport height ('5vh'), or percentages ('10%'). */
  minX?: number | string;
  /** Maximum x coordinate (right boundary). Supports pixels (number), viewport width ('90vw'), viewport height ('95vh'), or percentages ('90%'). */
  maxX?: number | string;
  /** Minimum y coordinate (top boundary). Supports pixels (number), viewport width ('5vw'), viewport height ('10vh'), or percentages ('10%'). */
  minY?: number | string;
  /** Maximum y coordinate (bottom boundary). Supports pixels (number), viewport width ('95vw'), viewport height ('90vh'), or percentages ('90%'). */
  maxY?: number | string;
}

export interface WindowSize {
  /** Width. Supports pixels (number), viewport width ('50vw'), viewport height ('30vh'), or percentages ('80%'). */
  width: number | string;
  /** Height. Supports pixels (number), viewport width ('40vw'), viewport height ('50vh'), or percentages ('60%'). */
  height: number | string;
}

export interface WindowPosition {
  /** X coordinate. Supports pixels (number), viewport width ('10vw'), viewport height ('5vh'), or percentages ('20%'). */
  x: number | string;
  /** Y coordinate. Supports pixels (number), viewport width ('5vw'), viewport height ('10vh'), or percentages ('15%'). */
  y: number | string;
}

export interface WindowBaseProps {
  /** Whether the window is opened for controlled usage */
  opened?: boolean;

  /** Color of the window */
  color?: MantineColor;

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

  /** Whether resize handles (top, bottom, left, right) should span the full width/height instead of being centered. When true, side handles avoid corner handles. Default: false */
  fullSizeResizeHandles?: boolean;

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

  /** Minimum width during resize. Supports pixels (number), viewport units ('50vw', '30vh'), or percentages ('80%'). Default: 250 */
  minWidth?: number | string;

  /** Minimum height during resize. Supports pixels (number), viewport units ('50vh', '30vw'), or percentages ('60%'). Default: 100 */
  minHeight?: number | string;

  /** Maximum width during resize. Supports pixels (number), viewport units ('90vw', '70vh'), or percentages ('95%'). If not provided, no maximum limit */
  maxWidth?: number | string;

  /** Maximum height during resize. Supports pixels (number), viewport units ('90vh', '70vw'), or percentages ('85%'). If not provided, no maximum limit */
  maxHeight?: number | string;

  /** Boundaries for dragging the window. If not provided, window can be dragged anywhere within viewport */
  dragBounds?: WindowBounds;

  /** Whether to persist position and size in localStorage. You have to set the `id` or `title` prop for persistence to work. Default: false */
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
  persistState: false,
  withinPortal: true,
  minWidth: 250,
  minHeight: 100,
  fullSizeResizeHandles: false,
};

const varsResolver = createVarsResolver<WindowFactory>((_, { radius, shadow }) => {
  return {
    root: {
      '--window-background': 'var(--mantine-color-default)',
      '--window-radius': radius === undefined ? 'var(--mantine-radius-lg)' : getRadius(radius),
      '--window-shadow': getShadow(shadow),
    },
    container: {},
    content: {},
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
    opened,
    color,
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
    persistState,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    dragBounds,
    defaultPosition,
    defaultSize,
    onPositionChange,
    onSizeChange,
    withBorder,
    fullSizeResizeHandles,
    mod,

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
    handleTouchStartDrag,
    resizeHandlers,
    handleClose,
  } = useMantineWindow(props);

  const draggableHeader = draggable === 'header' || draggable === 'both';
  const draggableWindow = draggable === 'window' || draggable === 'both';

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      ref={windowRef}
      onClick={bringToFront}
      mod={[{ 'data-with-border': withBorder, 'data-window-draggable': draggableWindow }, mod]}
      onMouseDown={draggableWindow ? handleMouseDownDrag : undefined}
      onTouchStart={draggableWindow ? handleTouchStartDrag : undefined}
      bg={color}
      data-mantine-window
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
          onTouchStart={draggableHeader ? handleTouchStartDrag : undefined}
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
              <Text truncate {...getStyles('title')}>
                {title}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Content */}
        {!isCollapsed && (
          <>
            <ScrollArea
              {...getStyles('content', {
                style: {
                  height: size.height - 40,
                },
              })}
            >
              {children}
            </ScrollArea>

            {/* Resize handles */}
            {resizable !== 'none' && (
              <>
                {/* Corner handles */}
                {resizable === 'both' && (
                  <>
                    <Box
                      data-resize-handle
                      {...resizeHandlers.topLeft}
                      {...getStyles('resizeHandleTopLeft')}
                    />
                    <Box
                      data-resize-handle
                      {...resizeHandlers.topRight}
                      {...getStyles('resizeHandleTopRight')}
                    />
                    <Box
                      data-resize-handle
                      {...resizeHandlers.bottomRight}
                      {...getStyles('resizeHandleBottomRight')}
                    />
                    <Box
                      data-resize-handle
                      {...resizeHandlers.bottomLeft}
                      {...getStyles('resizeHandleBottomLeft')}
                    />
                  </>
                )}

                {/* Vertical handles */}
                {(resizable === 'vertical' || resizable === 'both') && (
                  <>
                    <Box
                      data-resize-handle
                      data-full-size={fullSizeResizeHandles || undefined}
                      {...resizeHandlers.top}
                      {...getStyles('resizeHandleTop')}
                    />
                    <Box
                      data-resize-handle
                      data-full-size={fullSizeResizeHandles || undefined}
                      {...resizeHandlers.bottom}
                      {...getStyles('resizeHandleBottom')}
                    />
                  </>
                )}

                {/* Horizontal handles */}
                {(resizable === 'horizontal' || resizable === 'both') && (
                  <>
                    <Box
                      data-resize-handle
                      data-full-size={fullSizeResizeHandles || undefined}
                      {...resizeHandlers.right}
                      {...getStyles('resizeHandleRight')}
                    />
                    <Box
                      data-resize-handle
                      data-full-size={fullSizeResizeHandles || undefined}
                      {...resizeHandlers.left}
                      {...getStyles('resizeHandleLeft')}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
});

Window.classes = classes;
Window.displayName = 'Window';
