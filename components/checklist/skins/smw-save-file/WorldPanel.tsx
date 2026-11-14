"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { LevelRow } from "@/components/checklist/skins/smw-save-file/LevelRow";
import { Chevrons, FramedPanel, InnerBox, Score, Star } from "@/components/checklist/skins/smw-save-file/parts";
import { isComplete, sectionProgress } from "@/lib/games/progress";
import type { Section } from "@/lib/games/schema";

/** One world: title bar, "World complete" badge (space always reserved), rows. */
export function WorldPanel({ section }: { section: Section }) {
  const { progress } = useChecklist();
  const p = sectionProgress(section, progress);
  const complete = isComplete(p);
  const entries = section.entries.filter((e) => !e.retired);
  const titleId = `${section.id}-title`;

  return (
    <FramedPanel id={section.id} labelledBy={titleId}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-2.5 pt-2 pb-3">
        <Chevrons />
        <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" className="shrink-0">
          <path d="M1 1l12 7-12 7z" fill="#FFFFFF" stroke="var(--smw-ink)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <h2
          id={titleId}
          className="m-0 min-w-0 flex-[1_1_200px] font-(family-name:--font-pixel) text-[clamp(19.5px,3.6vw,28.5px)] leading-[1.4] uppercase [text-shadow:2px_2px_0_#FFFFFF]"
        >
          {section.title}
        </h2>
        <span
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-(--smw-brown) bg-(--smw-inner) px-2.5 py-1 text-[21px] font-bold uppercase"
          style={{ visibility: complete ? "visible" : "hidden" }}
          aria-hidden={!complete}
        >
          <Star />
          World complete
        </span>
        <Score done={p.done} total={p.total} className="text-[16.5px]" />
      </div>
      <InnerBox className="flex p-1.5">
        <div className="flex min-w-0 flex-1 flex-col px-1 pt-0.5 pb-1.5">
          {entries.map((entry, i) => (
            <LevelRow key={entry.id} entry={entry} stripe={i % 2 === 0 ? "a" : "b"} spoiler={Boolean(section.spoiler || entry.spoiler)} />
          ))}
        </div>
      </InnerBox>
    </FramedPanel>
  );
}
