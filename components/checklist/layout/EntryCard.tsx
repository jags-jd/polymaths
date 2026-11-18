"use client";

import { EyeOff } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { CheckChip, FOCUS, MeterRow, PipRow } from "@/components/checklist/layout/Trackables";
import { entryProgress } from "@/lib/games/progress";
import type { Check, Entry, Section, Trackable } from "@/lib/games/schema";
import { isEntryHidden } from "@/lib/games/visibility";
import { cn } from "@/lib/utils";

/**
 * One entry as a card (`cards` layout): kind, name, "x / y found", a % pill,
 * then its trackables in data order. Consecutive checks share a chip row;
 * each `group` ("Craft requests", "Flip Side") starts under its own heading.
 */

type Block = { group: string | undefined; items: Trackable[] };

/** Trackables split into groups, keeping data order. */
function toBlocks(trackables: Trackable[]): Block[] {
  const blocks: Block[] = [];
  for (const t of trackables) {
    const last = blocks.at(-1);
    if (last && last.group === t.group) last.items.push(t);
    else blocks.push({ group: t.group, items: [t] });
  }
  return blocks;
}

function BlockItems({ entryName, items }: { entryName: string; items: Trackable[] }) {
  const out: React.ReactNode[] = [];
  let chips: Check[] = [];
  const flush = () => {
    if (chips.length) out.push(<div key={`chips-${chips[0]!.id}`} className="flex flex-wrap gap-2">{chips.map((t) => <CheckChip key={t.id} entryName={entryName} trackable={t} />)}</div>);
    chips = [];
  };
  for (const t of items) {
    if (t.kind === "check") {
      chips.push(t);
      continue;
    }
    flush();
    out.push(t.kind === "pips" ? <PipRow key={t.id} entryName={entryName} trackable={t} /> : <MeterRow key={t.id} entryName={entryName} trackable={t} />);
  }
  flush();
  return <>{out}</>;
}

export function EntryCard({ entry, section }: { entry: Entry; section: Section | null }) {
  const { progress } = useChecklist();
  const { isRevealed, reveal, highlighted } = useChecklistUi();
  const p = entryProgress(entry, progress);
  const hidden = isEntryHidden(section, entry, progress, isRevealed);
  const live = entry.trackables.filter((t) => !t.retired);
  const card = cn(
    "flex scroll-mt-24 flex-col gap-4 rounded-(--radius-card) border-2 p-4 transition-shadow sm:p-5",
    p.percent === 100 ? "border-(--done-border) bg-(--done-bg)" : "border-(--border) bg-(--surface)",
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
        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-extrabold tabular-nums", p.percent === 100 ? "bg-(--accent) text-(--on-accent)" : "bg-(--surface-2) text-(--muted)")}>
          {p.percent}%
        </span>
      </header>
      {entry.note && <p className="m-0 text-sm text-(--muted)">{entry.note}</p>}
      {toBlocks(live).map((block, i) => (
        <div key={i} className={cn("flex flex-col gap-3", i > 0 && "border-t-2 border-dashed border-(--border) pt-3")}>
          {block.group && <span className="text-xs font-bold tracking-wider text-(--muted) uppercase">{block.group}</span>}
          <BlockItems entryName={entry.name} items={block.items} />
        </div>
      ))}
    </article>
  );
}
