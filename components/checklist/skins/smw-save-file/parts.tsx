import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small shared pieces of the SMW save-file skin (docs/themes.md). */

/**
 * Gold panel: a `#F8C030` title bar over the cream body, 3px brown border,
 * 16px radius, 4px drop. The body runs to the border (no gold around it).
 */
export function FramedPanel({ id, className, children, labelledBy }: { id?: string; className?: string; children: ReactNode; labelledBy?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-4 overflow-hidden rounded-2xl border-3 border-(--smw-brown) bg-(--smw-frame) shadow-[0_4px_0_var(--smw-brown)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** The cream body under a panel's title bar, edge to edge. */
export function InnerBox({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("border-t-3 border-(--smw-brown) bg-(--smw-inner)", className)}>{children}</div>;
}

const STAR_PATH = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z";

/** Gold star (complete badges, goals). `outline` is the dashed not-done state. */
export function Star({ size = 14, outline = false, stroke = "var(--smw-brown)" }: { size?: number; outline?: boolean; stroke?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <path
        d={STAR_PATH}
        fill={outline ? "none" : "var(--smw-star)"}
        stroke={outline ? "var(--smw-off)" : stroke}
        strokeWidth="1.8"
        strokeDasharray={outline ? "2.6 2" : undefined}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Number like `19/46`. */
export function Score({ done, total, className }: { done: number; total: number; className?: string }) {
  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>
      {done}/{total}
    </span>
  );
}

/** Shared focus ring for every tappable thing in the skin. */
export const FOCUS = "outline-none focus-visible:ring-3 focus-visible:ring-(--smw-blue) focus-visible:ring-offset-1 rounded-md";
