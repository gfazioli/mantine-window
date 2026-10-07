import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useDragResize, type UseDragResizeOptions } from './use-drag-resize';

let api: ReturnType<typeof useDragResize<HTMLDivElement>>;

function Box(props: UseDragResizeOptions & { children?: React.ReactNode }) {
  const { children, ...options } = props;
  api = useDragResize<HTMLDivElement>(options);
  return (
    <div
      ref={api.ref}
      data-testid="box"
      data-dragging={api.isDragging || undefined}
      data-resizing={api.isResizing || undefined}
      style={{
        position: 'fixed',
        left: api.position.x,
        top: api.position.y,
        width: api.size.width,
        height: api.size.height,
      }}
    >
      <div data-testid="grip" {...api.getDragHandleProps()}>
        grip
        {children}
      </div>
      <div data-testid="corner" {...api.getResizeHandleProps('bottomRight', { keyboard: true })} />
      <div data-testid="left" {...api.getResizeHandleProps('left')} />
    </div>
  );
}

function drag(target: HTMLElement, from: [number, number], to: [number, number]) {
  fireEvent.mouseDown(target, { clientX: from[0], clientY: from[1] });
  fireEvent.mouseMove(document, { clientX: to[0], clientY: to[1] });
  fireEvent.mouseUp(document);
}

describe('useDragResize', () => {
  it('positions and sizes an uncontrolled element from its defaults, in any unit', () => {
    const { getByTestId } = render(
      <Box defaultPosition={{ x: '10vw', y: 40 }} defaultSize={{ width: '50%', height: 200 }} />
    );
    const box = getByTestId('box');

    // jsdom's viewport is 1024 × 768.
    expect(box.style.left).toBe('102.4px');
    expect(box.style.top).toBe('40px');
    expect(box.style.width).toBe('512px');
    expect(api.boundarySize).toEqual({ width: 1024, height: 768 });
  });

  it('drags from the drag handle and moves the element when uncontrolled', () => {
    const onPositionChange = jest.fn();
    const { getByTestId } = render(
      <Box defaultPosition={{ x: 100, y: 100 }} onPositionChange={onPositionChange} />
    );

    drag(getByTestId('grip'), [100, 100], [160, 130]);

    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 160, y: 130 });
    expect(getByTestId('box').style.left).toBe('160px');
    expect(getByTestId('box').style.top).toBe('130px');
  });

  it('reports isDragging during a gesture and isResizing during a pointer resize', () => {
    const { getByTestId } = render(<Box defaultPosition={{ x: 100, y: 100 }} />);
    const box = getByTestId('box');

    fireEvent.mouseDown(getByTestId('grip'), { clientX: 100, clientY: 100 });
    expect(box.getAttribute('data-dragging')).toBe('true');
    fireEvent.mouseUp(document);
    expect(box.getAttribute('data-dragging')).toBeNull();

    fireEvent.mouseDown(getByTestId('left'), { clientX: 100, clientY: 200 });
    expect(box.getAttribute('data-resizing')).toBe('true');
    expect(box.getAttribute('data-dragging')).toBeNull();
    fireEvent.mouseUp(document);
    expect(box.getAttribute('data-resizing')).toBeNull();
  });

  it('never starts a drag from an interactive child', () => {
    const onDragStart = jest.fn();
    const { getByLabelText } = render(
      <Box onDragStart={onDragStart}>
        <input aria-label="field" />
      </Box>
    );

    const notPrevented = fireEvent.mouseDown(getByLabelText('field'), { clientX: 10, clientY: 10 });

    expect(notPrevented).toBe(true);
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('locks the drag to one axis', () => {
    const onPositionChange = jest.fn();
    const { getByTestId } = render(
      <Box defaultPosition={{ x: 100, y: 100 }} axis="y" onPositionChange={onPositionChange} />
    );

    drag(getByTestId('grip'), [100, 100], [300, 180]);

    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 100, y: 180 });
  });

  it('resizes from a left edge, moving the origin and keeping the right edge', () => {
    const onSizeChange = jest.fn();
    const onPositionChange = jest.fn();
    const { getByTestId } = render(
      <Box
        defaultPosition={{ x: 200, y: 100 }}
        defaultSize={{ width: 400, height: 300 }}
        onSizeChange={onSizeChange}
        onPositionChange={onPositionChange}
      />
    );

    drag(getByTestId('left'), [200, 200], [150, 200]);

    expect(onSizeChange).toHaveBeenLastCalledWith({ width: 450, height: 300 });
    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 150, y: 100 });
  });

  it('marks every resize handle and makes only the keyboard one a separator', () => {
    const { getByTestId } = render(<Box defaultSize={{ width: 400, height: 300 }} />);
    const corner = getByTestId('corner');
    const left = getByTestId('left');

    expect(corner.getAttribute('data-resize-handle')).toBe('bottomRight');
    expect(left.getAttribute('data-resize-handle')).toBe('left');
    expect(corner.getAttribute('role')).toBe('separator');
    expect(corner.getAttribute('aria-label')).toBe('Resize');
    expect(left.getAttribute('role')).toBeNull();
    expect(left.getAttribute('tabindex')).toBeNull();
  });

  it('resizes from the keyboard handle and re-renders the element', () => {
    const { getByTestId } = render(
      <Box defaultPosition={{ x: 0, y: 0 }} defaultSize={{ width: 400, height: 300 }} />
    );
    const corner = getByTestId('corner');

    fireEvent.keyDown(corner, { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(corner, { key: 'ArrowDown' });

    expect(getByTestId('box').style.width).toBe('450px');
    expect(getByTestId('box').style.height).toBe('310px');
    expect(corner.getAttribute('aria-valuetext')).toBe('450 × 310');
  });

  it('does not move a controlled element by itself, and reports the change', () => {
    const onPositionChange = jest.fn();
    const { getByTestId } = render(
      <Box position={{ x: 100, y: 100 }} onPositionChange={onPositionChange} />
    );

    drag(getByTestId('grip'), [100, 100], [160, 130]);

    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 160, y: 130 });
    expect(getByTestId('box').style.left).toBe('100px');
  });

  it('moves and resizes from code with setPosition / setSize', () => {
    const { getByTestId } = render(<Box />);

    act(() => {
      api.setPosition({ x: 30, y: 40 });
      api.setSize({ width: 320, height: 240 });
    });

    const box = getByTestId('box');
    expect(box.style.left).toBe('30px');
    expect(box.style.top).toBe('40px');
    expect(box.style.width).toBe('320px');
    expect(box.style.height).toBe('240px');
  });

  it('reports an unmeasured parent boundary as 0', () => {
    // jsdom has no layout, so an element never has an offsetParent.
    render(<Box boundary="parent" />);
    expect(api.boundarySize).toEqual({ width: 0, height: 0 });
  });
});

describe('useDragResize keepInBounds', () => {
  it('moves an element that starts outside the viewport back inside, and shrinks one larger than it', () => {
    const { getByTestId } = render(
      <Box defaultPosition={{ x: 900, y: 0 }} defaultSize={{ width: 2000, height: 200 }} />
    );
    const box = getByTestId('box');

    // jsdom's viewport is 1024 × 768.
    expect(box.style.width).toBe('1024px');
    expect(box.style.left).toBe('0px');
  });

  it('leaves it where it is with keepInBounds: false', () => {
    const { getByTestId } = render(
      <Box
        keepInBounds={false}
        defaultPosition={{ x: 900, y: 0 }}
        defaultSize={{ width: 400, height: 200 }}
      />
    );

    expect(getByTestId('box').style.left).toBe('900px');
  });
});

describe('useDragResize keepInBounds after programmatic moves', () => {
  it('fits to the boundary, not to dragBounds, so a layout keeps its place when the element resizes', () => {
    const observed: (() => void)[] = [];
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class {
      constructor(callback: () => void) {
        observed.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    try {
      const { getByTestId } = render(
        <Box defaultPosition={{ x: 100, y: 100 }} dragBounds={{ minX: 50 }} />
      );

      // A snap-left layout: x = 0 and half the viewport, from code.
      act(() => {
        api.setPosition({ x: 0, y: 0 });
        api.setSize({ width: 512, height: 768 });
      });
      act(() => observed.forEach((callback) => callback()));

      expect(getByTestId('box').style.left).toBe('0px');
    } finally {
      window.ResizeObserver = OriginalResizeObserver;
    }
  });
});
