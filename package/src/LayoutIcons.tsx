import React from 'react';

interface LayoutIconProps {
  size?: number;
}

const S = 24; // viewBox size
const R = 3; // border radius
const P = 2; // padding from edge
const W = S - P * 2; // inner width/height

/** Snap left — left half highlighted */
export function SnapLeftIcon({ size = 20 }: LayoutIconProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={W / 2 - 1}
        height={W - 2}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Snap right — right half highlighted */
export function SnapRightIcon({ size = 20 }: LayoutIconProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + W / 2}
        y={P + 1}
        width={W / 2 - 1}
        height={W - 2}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Snap top — top half highlighted */
export function SnapTopIcon({ size = 20 }: LayoutIconProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={W - 2}
        height={W / 2 - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Snap bottom — bottom half highlighted */
export function SnapBottomIcon({ size = 20 }: LayoutIconProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + W / 2}
        width={W - 2}
        height={W / 2 - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Fill — entire area highlighted */
export function FillIcon({ size = 20 }: LayoutIconProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={W - 2}
        height={W - 2}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Arrange columns — two vertical columns */
export function ArrangeColumnsIcon({ size = 20 }: LayoutIconProps) {
  const gap = 1.5;
  const colW = (W - gap) / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={colW - 1}
        height={W - 2}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
      <rect
        x={P + colW + gap}
        y={P + 1}
        width={colW - 1}
        height={W - 2}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Arrange rows — two horizontal rows */
export function ArrangeRowsIcon({ size = 20 }: LayoutIconProps) {
  const gap = 1.5;
  const rowH = (W - gap) / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={W - 2}
        height={rowH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
      <rect
        x={P + 1}
        y={P + rowH + gap}
        width={W - 2}
        height={rowH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}

/** Tile — 2x2 grid */
export function TileIcon({ size = 20 }: LayoutIconProps) {
  const gap = 1.5;
  const cellW = (W - gap) / 2;
  const cellH = (W - gap) / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size}>
      <rect
        x={P}
        y={P}
        width={W}
        height={W}
        rx={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect
        x={P + 1}
        y={P + 1}
        width={cellW - 1}
        height={cellH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
      <rect
        x={P + cellW + gap}
        y={P + 1}
        width={cellW - 1}
        height={cellH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
      <rect
        x={P + 1}
        y={P + cellH + gap}
        width={cellW - 1}
        height={cellH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
      <rect
        x={P + cellW + gap}
        y={P + cellH + gap}
        width={cellW - 1}
        height={cellH - 1}
        rx={R - 1}
        fill="currentColor"
        opacity={0.4}
      />
    </svg>
  );
}
