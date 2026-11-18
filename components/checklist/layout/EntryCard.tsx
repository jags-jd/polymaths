"use client";

import { EyeOff } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { CardSides, splitSides } from "@/components/checklist/layout/CardSides";
import { Blocks } from "@/components/checklist/layout/Blocks";
import { FOCUS } from "@/components/checklist/layout/Trackables";
import { entryProgress } from "@/lib/games/progress";
import type { Entry, Section } from "@/lib/games/schema";
import { isEntryHidden } from "@/lib/games/visibility";
import { cn } from "@/lib/utils";

/**
 * One entry as a card (`cards` layout): kind, name, "x / y found", a % pill,
 * then its trackables in data order. Consecutive checks share a chip row;
 * each `group` ("Craft requests", "Flip Side") sits in its own tinted panel.
 * An entry with both ungrouped and grouped trackables is a two-sided card
 * (CardSides): the course on the front, the grouped extras on the back.
 * A card that reaches 100% fades to the done colours with a soft glow.
 */

export function EntryCard({ entry, section }: { entry: Entry; section: Section | null }) {
  const { progress } = useChecklist();
  const { isRevealed, reveal, highlighted } = useChecklistUi();
  const p = entryProgress(entry, progress);
  const hidden = isEntryHidden(section, entry, progress, isRevealed);
  const live = entry.trackables.filter((t) => !t.retired);
  const complete = p.percent === 100;
  const sides = splitSides(live);
  const card = cn(
    "flex scroll-mt-24 flex-col gap-4 rounded-(--radius-card) border-2 p-4 transition-[background-color,border-color,box-shadow] duration-300 sm:p-5",
    complete ? "border-(--done-border) bg-(--done-bg) shadow-[0_0_0_4px_color-mix(in_srgb,var(--done-border)_14%,transparent)]" : "border-(--border) bg-(--surface)",
    highlighted === entry.id && "ring-4 ring-(--accent)/40",
  );

  if (hidden) {
    return (
      <button id={entry.id} type="button" onClick={() => reveal(entry.id)} aria-label="Hidden spoiler. Reveal it" className={cn(card, FOCUS, "min-h-32 items-center justify-center text-(--muted)")}>
        <EyeOff aria-hidden="true" className="size-6" />
        <span className="text-sm font-bold">Spoiler · tap to reveal</span>
      </button>
    );
  }

  return (
    <article id={entry.id} aria-labelledby={`${entry.id}-name`} className={card}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-bold tracking-wider text-(--muted) uppercase">{entry.kind}</span>
          <h3 id={`${entry.id}-name`} className="m-0 text-lg leading-tight font-extrabold">
            {entry.name}
          </h3>
          <span className="text-sm text-(--muted) tabular-nums">
            {p.done} / {p.total} found
          </span>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-extrabold tabular-nums", complete ? "bg-(--accent) text-(--on-accent)" : "bg-(--surface-2) text-(--muted)")}>
          {p.percent}%
        </span>
      </header>
      {entry.note && <p className="m-0 text-sm text-(--muted)">{entry.note}</p>}
      {sides ? <CardSides entry={entry} sides={sides} complete={complete} /> : <Blocks entryName={entry.name} items={live} complete={complete} />}
    </article>
  );
}
