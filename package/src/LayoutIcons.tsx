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

/** Snap left — left half highlighted */
export function SnapLeftIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const iw = (BW - PAD * 2 - GAP) / 2;
  const ih = BH - PAD * 2;
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
      <rect x={ix} y={iy} width={iw} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Snap right — right half highlighted */
export function SnapRightIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const iw = (BW - PAD * 2 - GAP) / 2;
  const ih = BH - PAD * 2;
  const ix = BX + PAD + iw + GAP;
  const iy = BY + PAD;
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
      <rect x={ix} y={iy} width={iw} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Snap top — top half highlighted */
export function SnapTopIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const iw = BW - PAD * 2;
  const ih = (BH - PAD * 2 - GAP) / 2;
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
      <rect x={ix} y={iy} width={iw} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Snap bottom — bottom half highlighted */
export function SnapBottomIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const iw = BW - PAD * 2;
  const ih = (BH - PAD * 2 - GAP) / 2;
  const ix = BX + PAD;
  const iy = BY + PAD + ih + GAP;
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
      <rect x={ix} y={iy} width={iw} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Fill — entire area highlighted */
export function FillIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const iw = BW - PAD * 2;
  const ih = BH - PAD * 2;
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
      <rect x={ix} y={iy} width={iw} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Arrange columns — two vertical columns */
export function ArrangeColumnsIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const colW = (BW - PAD * 2 - GAP) / 2;
  const ih = BH - PAD * 2;
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
      <rect x={ix} y={iy} width={colW} height={ih} rx={IR} fill="currentColor" opacity={0.45} />
      <rect
        x={ix + colW + GAP}
        y={iy}
        width={colW}
        height={ih}
        rx={IR}
        fill="currentColor"
        opacity={0.45}
      />
    </svg>
  );
}

/** Arrange rows — two horizontal rows */
export function ArrangeRowsIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const iw = BW - PAD * 2;
  const rowH = (BH - PAD * 2 - GAP) / 2;
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
      <rect x={ix} y={iy} width={iw} height={rowH} rx={IR} fill="currentColor" opacity={0.45} />
      <rect
        x={ix}
        y={iy + rowH + GAP}
        width={iw}
        height={rowH}
        rx={IR}
        fill="currentColor"
        opacity={0.45}
      />
    </svg>
  );
}

/** Tile — 2x2 grid */
export function TileIcon({ size = 28 }: LayoutIconProps) {
  const w = size;
  const h = size * (VH / VW);
  const ix = BX + PAD;
  const iy = BY + PAD;
  const cellW = (BW - PAD * 2 - GAP) / 2;
  const cellH = (BH - PAD * 2 - GAP) / 2;
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
      <rect x={ix} y={iy} width={cellW} height={cellH} rx={IR} fill="currentColor" opacity={0.45} />
      <rect
        x={ix + cellW + GAP}
        y={iy}
        width={cellW}
        height={cellH}
        rx={IR}
        fill="currentColor"
        opacity={0.45}
      />
      <rect
        x={ix}
        y={iy + cellH + GAP}
        width={cellW}
        height={cellH}
        rx={IR}
        fill="currentColor"
        opacity={0.45}
      />
      <rect
        x={ix + cellW + GAP}
        y={iy + cellH + GAP}
        width={cellW}
        height={cellH}
        rx={IR}
        fill="currentColor"
        opacity={0.45}
      />
    </svg>
  );
}
