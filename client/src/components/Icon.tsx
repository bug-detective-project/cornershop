import type { ReactNode } from 'react';

// Line icons drawn on a 24×24 grid, in the color of the text around them.
const PATHS: Record<string, ReactNode> = {
  arrowLeft: <path d="M19 12H5m6 7-7-7 7-7" />,
  basket: <path d="M3 9h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.600a2 2 0 0 1-2-1.800L3 9Zm4 0 4-6m6 6-4-6M9 13v3m3-3v3m3-3v3" />,
  chevronLeft: <path d="m14 6-6 6 6 6" />,
  chevronRight: <path d="m10 6 6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  pencil: <path d="M4 20h4L19 9l-4-4L4 16v4Zm10-14 4 4" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.500a7 7 0 1 0-14 0C5 14.800 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  store: <path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M10 20v-5h4v5" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19" />
    </>
  ),
  trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
};

export type IconName = keyof typeof PATHS;

/** A decorative icon: the text or the label next to it says what it means. */
export function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      {PATHS[name]}
    </svg>
  );
}
