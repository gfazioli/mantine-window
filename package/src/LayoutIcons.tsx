import React from 'react';

interface LayoutIconProps {
  size?: number;
}

// 16:9 aspect ratio viewBox — generous padding for rounded border
const VW = 36;
const VH = 28;
const R = 4; // outer border radius
const IR = 2; // inner rect radius
const BX = 3; // border x
const BY = 3; // border y
const BW = VW - BX * 2; // border width
const BH = VH - BY * 2; // border height
const PAD = 3; // padding between border and highlighted area
const GAP = 2; // gap between split areas

// Derived layout constants
const IX = BX + PAD;
const IY = BY + PAD;
const FULL_W = BW - PAD * 2;
const FULL_H = BH - PAD * 2;
const HALF_W = (FULL_W - GAP) / 2;
const HALF_H = (FULL_H - GAP) / 2;

interface RectDef {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getRects(layout: string): RectDef[] {
  switch (layout) {
    case 'snap-left':
      return [{ x: IX, y: IY, width: HALF_W, height: FULL_H }];
    case 'snap-right':
      return [{ x: IX + HALF_W + GAP, y: IY, width: HALF_W, height: FULL_H }];
    case 'snap-top':
      return [{ x: IX, y: IY, width: FULL_W, height: HALF_H }];
    case 'snap-bottom':
      return [{ x: IX, y: IY + HALF_H + GAP, width: FULL_W, height: HALF_H }];
    case 'fill':
      return [{ x: IX, y: IY, width: FULL_W, height: FULL_H }];
    case 'columns':
      return [
        { x: IX, y: IY, width: HALF_W, height: FULL_H },
        { x: IX + HALF_W + GAP, y: IY, width: HALF_W, height: FULL_H },
      ];
    case 'rows':
      return [
        { x: IX, y: IY, width: FULL_W, height: HALF_H },
        { x: IX, y: IY + HALF_H + GAP, width: FULL_W, height: HALF_H },
      ];
    case 'tile':
      return [
        { x: IX, y: IY, width: HALF_W, height: HALF_H },
        { x: IX + HALF_W + GAP, y: IY, width: HALF_W, height: HALF_H },
        { x: IX, y: IY + HALF_H + GAP, width: HALF_W, height: HALF_H },
        { x: IX + HALF_W + GAP, y: IY + HALF_H + GAP, width: HALF_W, height: HALF_H },
      ];
    default:
      return [];
  }
}

function LayoutIconBase({ layout, size = 28 }: { layout: string } & LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const rects = getRects(layout);
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width={w} height={h}>
      <rect
        x={BX}
        y={BY}
        width={BW}
        height={BH}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.width}
          height={r.height}
          rx={IR}
          fill="currentColor"
          opacity={0.45}
        />
      ))}
    </svg>
  );
}

/** Snap left — left half highlighted */
export function SnapLeftIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="snap-left" size={size} />;
}

/** Snap right — right half highlighted */
export function SnapRightIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="snap-right" size={size} />;
}

/** Snap top — top half highlighted */
export function SnapTopIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="snap-top" size={size} />;
}

/** Snap bottom — bottom half highlighted */
export function SnapBottomIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="snap-bottom" size={size} />;
}

/** Fill — entire area highlighted */
export function FillIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="fill" size={size} />;
}

/** Arrange columns — two vertical columns */
export function ArrangeColumnsIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="columns" size={size} />;
}

/** Arrange rows — two horizontal rows */
export function ArrangeRowsIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="rows" size={size} />;
}

/** Tile — 2x2 grid */
export function TileIcon({ size }: LayoutIconProps) {
  return <LayoutIconBase layout="tile" size={size} />;
}
