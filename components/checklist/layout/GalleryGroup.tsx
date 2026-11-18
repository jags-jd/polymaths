"use client";

import { Check, EyeOff } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { FOCUS } from "@/components/checklist/layout/Trackables";
import { entryProgress, groupProgress, isComplete } from "@/lib/games/progress";
import type { Entry, EntryGroup, Section } from "@/lib/games/schema";
import { isEntryHidden } from "@/lib/games/visibility";
import { cn } from "@/lib/utils";

/**
 * A `gallery` extras group (e.g. a world's costumes): one square tile per
 * entry. A tile toggles the entry's first check. No art yet, so tiles show the
 * themed placeholder with initials (CLAUDE.md, "Art policy").
 */

function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function Tile({ entry, section }: { entry: Entry; section: Section }) {
  const { progress, toggleCheck } = useChecklist();
  const { isRevealed, reveal, highlighted } = useChecklistUi();
  const check = entry.trackables.find((t) => t.kind === "check" && !t.retired);
  if (!check || check.kind !== "check") return null;
  const done = isComplete(entryProgress(entry, progress));
  const hidden = isEntryHidden(section, entry, progress, isRevealed);
  const tile = cn(
    FOCUS,
    "relative flex scroll-mt-24 flex-col overflow-hidden rounded-[calc(var(--radius-card)*0.6)] border-2 text-left transition-colors",
    done ? "border-(--done-border) bg-(--done-bg)" : "border-(--border) bg-(--surface) hover:border-(--accent)",
    highlighted === entry.id && "ring-4 ring-(--accent)/40",
  );

  if (hidden) {
    return (
      <button id={entry.id} type="button" onClick={() => reveal(entry.id)} aria-label="Hidden spoiler. Reveal it" className={tile}>
        <span className="flex aspect-square items-center justify-center bg-(--surface-2) text-(--muted)">
          <EyeOff aria-hidden="true" className="size-6" />
        </span>
        <span className="px-2 py-1.5 text-xs font-bold text-(--muted)">Tap to reveal</span>
      </button>
    );
  }

  return (
    <button id={entry.id} type="button" aria-pressed={done} aria-label={`${entry.name}: ${check.label}`} onClick={() => toggleCheck(check)} className={tile}>
      <span aria-hidden="true" className="flex aspect-square items-center justify-center bg-(--surface-2) text-2xl font-black text-(--muted) opacity-70">
        {initials(entry.name)}
      </span>
      <span className="px-2 py-1.5 text-xs leading-tight font-bold">{entry.name}</span>
      <span
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-(--accent) text-(--on-accent)"
        style={{ visibility: done ? "visible" : "hidden" }}
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
    </button>
  );
}

export function GalleryGroup({ group, section }: { group: EntryGroup; section: Section }) {
  const { progress } = useChecklist();
  const entries = group.entries.filter((e) => !e.retired);
  const p = groupProgress(group, progress);
  const complete = isComplete(p);
  return (
    <section aria-labelledby={`${group.id}-title`} className="flex flex-col gap-3 rounded-(--radius-card) border-2 border-(--border) bg-(--surface) p-4 sm:p-5">
      <header className="flex items-center justify-between gap-3">
        <h3 id={`${group.id}-title`} className="m-0 text-lg font-extrabold">
          {group.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-(--accent) px-2.5 py-0.5 text-xs font-extrabold text-(--on-accent)" style={{ visibility: complete ? "visible" : "hidden" }} aria-hidden={!complete}>
            All collected
          </span>
          <span className="text-sm font-bold tabular-nums">
            {p.done} / {p.total}
          </span>
        </div>
      </header>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5">
        {entries.map((e) => (
          <Tile key={e.id} entry={e} section={section} />
        ))}
      </div>
    </section>
  );
}
