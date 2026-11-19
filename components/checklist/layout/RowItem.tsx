"use client";

import { Check, EyeOff } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { FOCUS } from "@/components/checklist/layout/Trackables";
import type { Check as CheckTrackable, Entry, Section } from "@/lib/games/schema";
import { isEntryHidden } from "@/lib/games/visibility";
import { cn } from "@/lib/utils";

/**
 * One entry in a `rows` section that has a single check (a mission, a side
 * quest, a can): a tile with a tick box, the name and its note. The whole tile
 * is the button. A hidden spoiler shows only "Spoiler · tap to reveal" — the
 * name isn't in the page at all, so nothing leaks to search or screen readers.
 */

/** The entry's only live trackable, if it is a check; otherwise the entry needs a card. */
export function singleCheck(entry: Entry): CheckTrackable | null {
  const live = entry.trackables.filter((t) => !t.retired);
  return live.length === 1 && live[0]!.kind === "check" ? live[0]! : null;
}

export function RowItem({ entry, check, section }: { entry: Entry; check: CheckTrackable; section: Section }) {
  const { progress, toggleCheck } = useChecklist();
  const { isRevealed, reveal, highlighted } = useChecklistUi();
  const done = (progress.get(check.id) ?? 0) >= 1;
  const hidden = isEntryHidden(section, entry, progress, isRevealed);
  const tile = cn(
    FOCUS,
    "flex min-h-14 w-full scroll-mt-24 items-start gap-3 rounded-[calc(var(--radius-card)*0.75)] border px-4 py-3 text-left transition-[background-color,border-color] duration-200 motion-safe:active:scale-[0.99]",
    done ? "border-(--done-border)/40 bg-(--done-bg)" : "border-(--border) bg-(--surface) hover:border-(--accent)",
    highlighted === entry.id && "ring-4 ring-(--accent)/40",
  );
  const box = (on: boolean) =>
    cn(
      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors duration-150",
      on ? "border-(--accent) bg-(--accent) text-(--on-accent)" : "border-(--muted)/60",
    );

  if (hidden) {
    return (
      <button id={entry.id} type="button" onClick={() => reveal(entry.id)} aria-label="Hidden spoiler. Reveal it" className={cn(tile, "items-center text-(--muted)")}>
        <span aria-hidden="true" className={box(false)} />
        <span aria-hidden="true" className="h-3 flex-1 rounded-full bg-(--surface-2)" />
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-(--surface-2) px-2.5 py-1 text-xs font-bold">
          <EyeOff aria-hidden="true" className="size-3.5" /> Spoiler
        </span>
      </button>
    );
  }

  return (
    <button id={entry.id} type="button" aria-pressed={done} aria-label={`${entry.name}: ${check.label}`} onClick={() => toggleCheck(check)} className={tile}>
      <span aria-hidden="true" className={box(done)}>
        <Check className={cn("size-3.5 transition-transform duration-150", done ? "scale-100" : "scale-0")} strokeWidth={3.5} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[15px] leading-snug font-semibold">{entry.name}</span>
        {entry.note && <span className="text-xs leading-snug text-(--muted)">{entry.note}</span>}
      </span>
    </button>
  );
}
