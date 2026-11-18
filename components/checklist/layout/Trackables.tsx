"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { ArtIcon, ChipIcon, hasArt } from "@/components/checklist/layout/TrackableIcon";
import { isPipDone, meterValue } from "@/lib/games/progress";
import type { Check, Meter, Pips } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * The three trackable kinds on the shared layouts — docs/spec.md ("Ticking"):
 * a check toggles; each pip toggles on its own; tapping the Nth meter step
 * sets the value to N, and tapping the current value lowers it by one.
 * Buttons are named "<entry>: <label>" so every one is unique and readable.
 */

export const FOCUS = "outline-none focus-visible:ring-3 focus-visible:ring-(--accent)/50";

export function CheckChip({ entryName, trackable }: { entryName: string; trackable: Check }) {
  const { progress, toggleCheck } = useChecklist();
  const done = (progress.get(trackable.id) ?? 0) >= 1;
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={`${entryName}: ${trackable.label}`}
      onClick={() => toggleCheck(trackable)}
      className={cn(
        FOCUS,
        "inline-flex min-h-10 items-center gap-1.5 rounded-(--radius-control) border-2 px-3.5 py-1.5 text-left text-sm font-bold transition-colors",
        done ? "border-(--accent) bg-(--accent) text-(--on-accent)" : "border-(--border) bg-(--surface) text-(--text) hover:border-(--accent)",
      )}
    >
      <ChipIcon icon={done ? "tick" : trackable.icon} className={done ? "" : "text-(--muted)"} />
      {trackable.label}
    </button>
  );
}

function BlockHeading({ label, done, total }: { label: string; done: number; total: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs font-bold tracking-wider text-(--muted) uppercase">{label}</span>
      <span className="text-sm font-bold tabular-nums">
        {done} / {total}
      </span>
    </div>
  );
}

/** One icon button per pip, each ticked on its own. */
export function PipRow({ entryName, trackable }: { entryName: string; trackable: Pips }) {
  const { progress, togglePip } = useChecklist();
  const pips = Array.from({ length: trackable.count }, (_, i) => i + 1);
  const done = pips.filter((n) => isPipDone(trackable, n, progress)).length;
  return (
    <div className="flex flex-col gap-1.5">
      <BlockHeading label={trackable.label} done={done} total={trackable.count} />
      <div className="flex flex-wrap gap-1">
        {pips.map((n) => {
          const on = isPipDone(trackable, n, progress);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              aria-label={`${entryName}: ${trackable.label} ${n} of ${trackable.count}`}
              onClick={() => togglePip(trackable, n)}
              className={cn(FOCUS, "flex size-11 items-center justify-center rounded-full")}
            >
              {hasArt(trackable.icon) ? (
                <ArtIcon icon={trackable.icon} filled={on} className="size-8" />
              ) : (
                <span className={cn("flex size-9 items-center justify-center rounded-full border-2", on ? "border-(--accent) bg-(--accent) text-(--on-accent)" : "border-(--border) text-(--muted)")}>
                  <ChipIcon icon={trackable.icon} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** A meter drawn as `max` steps, like a health bar: tap the number you reached. */
export function MeterRow({ entryName, trackable }: { entryName: string; trackable: Meter }) {
  const { progress, tapMeter } = useChecklist();
  const value = meterValue(trackable, progress);
  const steps = Array.from({ length: trackable.max }, (_, i) => i + 1);
  return (
    <div className="flex flex-col gap-1.5">
      <BlockHeading label={trackable.label} done={value} total={trackable.max} />
      <div className="flex flex-wrap gap-0.5">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={n <= value}
            aria-label={`${entryName}: ${trackable.label} ${n} of ${trackable.max}`}
            onClick={() => tapMeter(trackable, n)}
            className={cn(FOCUS, "flex size-10 items-center justify-center rounded-full")}
          >
            {hasArt(trackable.icon) ? (
              <ArtIcon icon={trackable.icon} filled={n <= value} className="size-7" />
            ) : (
              <span className={cn("size-5 rounded-full border-2", n <= value ? "border-(--accent) bg-(--accent)" : "border-(--border)")} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
