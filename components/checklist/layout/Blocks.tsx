"use client";

import { CheckChip, MeterRow, PipRow } from "@/components/checklist/layout/Trackables";
import type { Check, Trackable } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * Trackables in data order (EntryCard, CardSides): consecutive checks share a
 * chip row, and each `group` ("Craft requests", "Flip Side") sits in its own
 * tinted panel under its heading.
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

/** Trackables in data order, split into their groups (a tinted panel each). */
export function Blocks({ entryName, items, complete }: { entryName: string; items: Trackable[]; complete: boolean }) {
  return toBlocks(items).map((block, i) => (
    <div key={i} className={cn("flex flex-col gap-3", block.group && cn("rounded-[calc(var(--radius-card)-6px)] p-3", complete ? "bg-(--surface)/70" : "bg-(--surface-2)"))}>
      {block.group && <span className="text-xs font-bold tracking-wider text-(--muted) uppercase">{block.group}</span>}
      <BlockItems entryName={entryName} items={block.items} />
    </div>
  ));
}
