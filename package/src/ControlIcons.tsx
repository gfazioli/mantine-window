import React from 'react';

interface ControlIconProps {
  size?: number;
}

/**
 * Inline replicas of the three `@tabler/icons-react` outline icons used by the
 * window controls (x, plus, minus).
 *
 * Inlining them removes `@tabler/icons-react` as a peer dependency and avoids
 * the `LARGE_BARREL_MODULES` warning that the Rolldown/Vite dependency
 * optimizer raises when it has to resolve every entry of Tabler's 6000+
 * re-export barrel module (see issue #39). Geometry and stroke attributes match
 * the Tabler outline icons 1:1, so the rendered result is unchanged.
 */
function ControlIcon({ size = 24, children }: React.PropsWithChildren<ControlIconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Close control — replica of `@tabler/icons-react` `IconX` */
export function IconX({ size }: ControlIconProps) {
  return (
    <ControlIcon size={size}>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </ControlIcon>
  );
}

/** Expand control — replica of `@tabler/icons-react` `IconPlus` */
export function IconPlus({ size }: ControlIconProps) {
  return (
    <ControlIcon size={size}>
      <path d="M12 5l0 14" />
      <path d="M5 12l14 0" />
    </ControlIcon>
  );
}

/** Collapse control — replica of `@tabler/icons-react` `IconMinus` */
export function IconMinus({ size }: ControlIconProps) {
  return (
    <ControlIcon size={size}>
      <path d="M5 12l14 0" />
    </ControlIcon>
  );
}
