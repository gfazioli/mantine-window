import React from 'react';
import {
  IconArrowsMaximize,
  IconLayoutColumns,
  IconLayoutGrid,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
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
  getShadow,
  Menu,
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
import { useResponsiveValue, type ResponsiveValue } from './hooks/use-responsive-value';
import { WindowGroup } from './WindowGroup';
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

/** Internal type for position state and callbacks */
export interface WindowPosition {
  x: number | string;
  y: number | string;
}

/** Internal type for size state and callbacks */
export interface WindowSize {
  width: number | string;
  height: number | string;
}

/** Dimension value type: pixels (number), viewport units ('50vw', '30vh'), or percentages ('80%') */
type DimensionValue = ResponsiveValue<number | string>;

export interface WindowBaseProps {
  /** Whether the window is opened for controlled usage */
  opened?: boolean;

  /** Color of the window */
  color?: MantineColor;

  /** Unique id of the window. Used to store window position and size. If not provided, the title is used */
  id?: string;

  /** Title of the window. Used as a fallback id if no id is provided */
  title?: string;

  /** Radius of the window. Supports responsive values. */
  radius?: ResponsiveValue<MantineRadius | (string & {}) | number>;

  /** Whether the window has a border */
  withBorder?: boolean;

  /** Shadow of the window. Supports responsive values. */
  shadow?: ResponsiveValue<MantineShadow>;

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

  // ─── Position (controlled) ──────────────────────────────────────────

  /** Controlled X position. When set, the component does not manage X internally. Supports responsive values. */
  x?: DimensionValue;

  /** Controlled Y position. When set, the component does not manage Y internally. Supports responsive values. */
  y?: DimensionValue;

  // ─── Position (uncontrolled) ────────────────────────────────────────

  /** Initial X position (uncontrolled). Default: 20. Supports responsive values. */
  defaultX?: DimensionValue;

  /** Initial Y position (uncontrolled). Default: 100. Supports responsive values. */
  defaultY?: DimensionValue;

  // ─── Size (controlled) ──────────────────────────────────────────────

  /** Controlled width. When set, the component does not manage width internally. Supports responsive values. */
  width?: DimensionValue;

  /** Controlled height. When set, the component does not manage height internally. Supports responsive values. */
  height?: DimensionValue;

  // ─── Size (uncontrolled) ────────────────────────────────────────────

  /** Initial width (uncontrolled). Default: 400. Supports responsive values. */
  defaultWidth?: DimensionValue;

  /** Initial height (uncontrolled). Default: 400. Supports responsive values. */
  defaultHeight?: DimensionValue;

  // ─── Constraints ────────────────────────────────────────────────────

  /** Minimum width during resize. Supports responsive values. Default: 250 */
  minWidth?: DimensionValue;

  /** Minimum height during resize. Supports responsive values. Default: 100 */
  minHeight?: DimensionValue;

  /** Maximum width during resize. Supports responsive values. If not provided, no maximum limit */
  maxWidth?: DimensionValue;

  /** Maximum height during resize. Supports responsive values. If not provided, no maximum limit */
  maxHeight?: DimensionValue;

  /** Boundaries for dragging the window. Supports responsive values. If not provided, window can be dragged anywhere within viewport */
  dragBounds?: ResponsiveValue<WindowBounds>;

  // ─── Behavior ───────────────────────────────────────────────────────

  /** Whether to persist position and size in localStorage. You have to set the `id` or `title` prop for persistence to work. Default: false */
  persistState?: boolean;

  /** If true, window is positioned relative to the viewport. If false, positioned relative to parent container. Default: true */
  withinPortal?: boolean;

  /** Called when the window is moved. Receives pixel values. */
  onPositionChange?: (position: { x: number; y: number }) => void;

  /** Called when the window is resized. Receives pixel values. */
  onSizeChange?: (size: { width: number; height: number }) => void;

  /** Window content */
  children?: React.ReactNode;
}

export interface WindowProps extends BoxProps, WindowBaseProps, StylesApiProps<WindowFactory> {}

export type WindowFactory = Factory<{
  props: WindowProps;
  ref: HTMLDivElement;
  stylesNames: WindowStylesNames;
  vars: WindowCssVariables;
  staticComponents: {
    Group: typeof WindowGroup;
  };
}>;

/** Height of the window header in pixels — must match .header { height } in Window.module.css */
const HEADER_HEIGHT = 40;

export const defaultProps: Partial<WindowProps> = {
  withBorder: true,
  shadow: 'md',
  resizable: 'both',
  draggable: 'both',
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
    shadow,
    withinPortal,
    persistState,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    dragBounds,
    x,
    y,
    defaultX,
    defaultY,
    width,
    height,
    defaultWidth,
    defaultHeight,
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

  // Resolve responsive radius/shadow before passing to varsResolver
  const resolvedRadius = useResponsiveValue(radius, undefined);
  const resolvedShadow = useResponsiveValue(shadow, 'md' as MantineShadow);

  // Create props with resolved values for varsResolver
  const resolvedProps = { ...props, radius: resolvedRadius, shadow: resolvedShadow };

  const getStyles = useStyles<WindowFactory>({
    name: 'Window',
    props: resolvedProps,
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
    withinPortal: resolvedWithinPortal,
    handleMouseDownDrag,
    handleTouchStartDrag,
    resizeHandlers,
    handleClose,
    groupCtx,
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
      role="dialog"
      aria-label={title}
      data-mantine-window
      {...others}
      {...getStyles('root', {
        style: {
          position: resolvedWithinPortal ? 'fixed' : 'absolute',
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
                  aria-label="Close window"
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
                  aria-label={isCollapsed ? 'Expand window' : 'Collapse window'}
                  {...getStyles('collapseButton')}
                >
                  {isCollapsed ? <IconPlus size={14} /> : <IconMinus size={14} />}
                </ActionIcon>
              )}
              {groupCtx?.showToolsButton && (
                <Menu shadow="md" width={200} position="bottom-start" withArrow>
                  <Menu.Target>
                    <ActionIcon
                      radius={256}
                      color="green"
                      aria-label="Window layout options"
                      {...getStyles('windowToolsButton')}
                    >
                      <IconLayoutGrid size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Move and resize</Menu.Label>
                    <Menu.Item
                      leftSection={<IconLayoutSidebarLeftCollapse size={16} />}
                      onClick={() => groupCtx.applyLayout('snap-left')}
                    >
                      Snap left
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconLayoutSidebarRightCollapse size={16} />}
                      onClick={() => groupCtx.applyLayout('snap-right')}
                    >
                      Snap right
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconArrowsMaximize size={16} />}
                      onClick={() => groupCtx.applyLayout('fill')}
                    >
                      Fill
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Arrange</Menu.Label>
                    <Menu.Item
                      leftSection={<IconLayoutColumns size={16} />}
                      onClick={() => groupCtx.applyLayout('tile')}
                    >
                      Tile all
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={() => groupCtx.collapseAll()}>Collapse all</Menu.Item>
                    <Menu.Item onClick={() => groupCtx.expandAll()}>Expand all</Menu.Item>
                    <Menu.Item color="red" onClick={() => groupCtx.closeAll()}>
                      Close all
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
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
                  height: Math.max(0, size.height - HEADER_HEIGHT),
                },
              })}
            >
              {children}
            </ScrollArea>

            {/* Resize handles - only when not collapsed */}
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
              </>
            )}
          </>
        )}

        {/* Horizontal handles - always available for horizontal resize even when collapsed */}
        {resizable !== 'none' && (resizable === 'horizontal' || resizable === 'both') && (
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
      </Box>
    </Box>
  );
});

Window.classes = classes;
Window.displayName = 'Window';
Window.Group = WindowGroup;
