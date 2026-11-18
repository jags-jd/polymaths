"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { LevelRow } from "@/components/checklist/skins/smw-save-file/LevelRow";
import { FramedPanel, InnerBox, Score, Star } from "@/components/checklist/skins/smw-save-file/parts";
import { isComplete, sectionProgress } from "@/lib/games/progress";
import type { Section } from "@/lib/games/schema";

/** One world: title bar, "World complete" badge (space always reserved), rows. */
export function WorldPanel({ section }: { section: Section }) {
  const { progress } = useChecklist();
  const p = sectionProgress(section, progress);
  const complete = isComplete(p);
  const entries = section.entries.filter((e) => !e.retired);
  const titleId = `${section.id}-title`;
  const coinSlots = Math.max(5, ...entries.flatMap((e) => e.trackables.map((t) => (t.kind === "pips" ? t.count : 0))));

  return (
    <FramedPanel id={section.id} labelledBy={titleId}>
      <div className="flex items-center gap-x-3 px-3.5 py-2.5 sm:px-5 sm:py-3">
        <h2 id={titleId} className="m-0 min-w-0 flex-1 text-[clamp(14px,2.4vw,20px)] leading-[1.4] uppercase [text-shadow:2px_2px_0_#FFFFFF]">
          {section.title}
        </h2>
        {/* Space is always reserved, so nothing moves when it appears. Just the star on phones. */}
        <span
          className="inline-flex shrink-0 items-center gap-1.5 text-[10px] uppercase sm:rounded-md sm:border-2 sm:border-(--smw-brown) sm:bg-(--smw-inner) sm:px-2 sm:py-1"
          style={{ visibility: complete ? "visible" : "hidden" }}
          aria-hidden={!complete}
        >
          <Star size={14} />
          <span className="sr-only sm:not-sr-only">World complete</span>
        </span>
        <Score done={p.done} total={p.total} className="shrink-0 text-[11px] sm:text-xs" />
      </div>
      <InnerBox className="flex px-1.5 pt-0.5 pb-1.5 sm:px-2.5 sm:pb-2.5">
        <div className="flex min-w-0 flex-1 flex-col">
          {entries.map((entry, i) => (
            <LevelRow
              key={entry.id}
              entry={entry}
              stripe={i % 2 === 0 ? "a" : "b"}
              spoiler={Boolean(section.spoiler || entry.spoiler)}
              coinSlots={coinSlots}
            />
          ))}
        </div>
      </InnerBox>
    </FramedPanel>
  );
}
