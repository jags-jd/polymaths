"use client";

import { Check } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { EntryCard } from "@/components/checklist/layout/EntryCard";
import { GalleryGroup } from "@/components/checklist/layout/GalleryGroup";
import { CheckChip } from "@/components/checklist/layout/Trackables";
import { groupProgress, isComplete, sectionProgress } from "@/lib/games/progress";
import type { Check as CheckTrackable, EntryGroup, Section } from "@/lib/games/schema";

/**
 * One section: header (label, title, complete badge, bar, score), its
 * entries, then its extras groups. `cards` is built; `rows` and `gallery`
 * sections render as cards until their first game needs them (Stellar Blade,
 * phase 0.4 step 3).
 */

function ChipsGroup({ group }: { group: EntryGroup }) {
  const { progress } = useChecklist();
  const p = groupProgress(group, progress);
  return (
    <section aria-label={group.title} className="flex flex-col gap-3 rounded-(--radius-card) border-2 border-(--border) bg-(--surface) p-4 sm:p-5">
      <header className="flex items-center justify-between gap-3">
        <h3 className="m-0 text-lg font-extrabold">{group.title}</h3>
        <span className="text-sm font-bold tabular-nums">
          {p.done} / {p.total}
        </span>
      </header>
      <div className="flex flex-wrap gap-2">
        {group.entries
          .filter((e) => !e.retired)
          .flatMap((e) =>
            e.trackables
              .filter((t): t is CheckTrackable => t.kind === "check" && !t.retired)
              .map((t) => <CheckChip key={t.id} entryName={e.name} trackable={{ ...t, label: e.name }} />),
          )}
      </div>
    </section>
  );
}

export function SectionBlock({ section }: { section: Section }) {
  const { progress } = useChecklist();
  const p = sectionProgress(section, progress);
  const complete = isComplete(p);
  const entries = section.entries.filter((e) => !e.retired);

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-6 flex-col gap-4">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-(--border) pb-3">
        {section.label && <span className="text-sm font-bold text-(--muted)">{section.label}</span>}
        <h2 id={`${section.id}-title`} className="m-0 font-(family-name:--font-display) text-2xl font-black [text-transform:var(--display-case)]">
          {section.title}
        </h2>
        <span
          className="inline-flex items-center gap-1 rounded-full bg-(--accent) px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-(--on-accent) uppercase"
          style={{ visibility: complete ? "visible" : "hidden" }}
          aria-hidden={!complete}
        >
          <Check className="size-3.5" strokeWidth={3} /> Complete
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span aria-hidden="true" className="h-1.5 w-24 overflow-hidden rounded-full bg-(--border)">
            <span className="block h-full rounded-full bg-(--accent) transition-[width]" style={{ width: `${p.percent}%` }} />
          </span>
          <span className="text-sm font-bold tabular-nums">
            {p.done} / {p.total}
          </span>
        </span>
      </header>
      <div className="grid items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} section={section} />
        ))}
      </div>
      {(section.extras ?? []).map((group) =>
        group.layout === "gallery" ? <GalleryGroup key={group.id} group={group} section={section} /> : <ChipsGroup key={group.id} group={group} />,
      )}
    </section>
  );
}
