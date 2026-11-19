import type { ReactNode } from "react";

const base =
  "transition-[opacity,filter,scale] duration-300 [transition-timing-function:cubic-bezier(0.2,0,0,1)]";
const shown = "scale-100 opacity-100 blur-0";
const hidden = "scale-[0.25] opacity-0 blur-[4px]";

/** Cross-fades two icons (scale 0.25 to 1, opacity, blur). Both stay mounted, so no animation on first paint. */
export function IconSwap({
  active,
  on,
  off,
}: {
  active: boolean;
  on: ReactNode;
  off: ReactNode;
}) {
  return (
    <span className="relative grid place-items-center" aria-hidden>
      <span className={`${base} ${active ? hidden : shown}`}>{off}</span>
      <span className={`absolute inset-0 grid place-items-center ${base} ${active ? shown : hidden}`}>
        {on}
      </span>
    </span>
  );
}
