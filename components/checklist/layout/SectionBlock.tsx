"use client";

import { Check } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { EntryCard } from "@/components/checklist/layout/EntryCard";
import { GalleryGroup, Tile } from "@/components/checklist/layout/GalleryGroup";
import { RowItem, singleCheck } from "@/components/checklist/layout/RowItem";
import { CheckChip } from "@/components/checklist/layout/Trackables";
import { entriesProgress, groupProgress, isComplete, sectionProgress } from "@/lib/games/progress";
import type { Check as CheckTrackable, Entry, EntryGroup, Section } from "@/lib/games/schema";

/**
 * One section: header (label, title, complete badge, bar, score), its
 * entries, then its extras groups. Entries are laid out by `section.layout`:
 * `cards` (EntryCard), `rows` (a tile per single-check entry, RowItem; any
 * other entry, like a Stellar Blade camp meter, is a card in the same grid) or `gallery` (square tiles; an entry
 * without a check falls back to a full-width card).
 * Consecutive entries sharing an `Entry.group` sit under a small sub-heading.
 */

type EntryRun = { group: string | undefined; entries: Entry[] };

/** Splits entries into runs of the same `group`, keeping data order. */
export function groupRuns(entries: Entry[]): EntryRun[] {
  const runs: EntryRun[] = [];
  for (const entry of entries) {
    const last = runs.at(-1);
    if (last && last.group === entry.group) last.entries.push(entry);
    else runs.push({ group: entry.group, entries: [entry] });
  }
  return runs;
}

function Entries({ entries, section }: { entries: Entry[]; section: Section }) {
  if (section.layout === "gallery") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {entries.map((e) =>
          e.trackables.some((t) => t.kind === "check" && !t.retired) ? (
            <Tile key={e.id} entry={e} section={section} />
          ) : (
            <div key={e.id} className="col-span-full">
              <EntryCard entry={e} section={section} />
            </div>
          ),
        )}
      </div>
    );
  }
  if (section.layout === "rows") {
    return (
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => {
          const check = singleCheck(e);
          return check ? <RowItem key={e.id} entry={e} check={check} section={section} /> : <EntryCard key={e.id} entry={e} section={section} />;
        })}
      </div>
    );
  }
  return (
    <div className="grid items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} section={section} />
      ))}
    </div>
  );
}

function EntryRuns({ entries, section }: { entries: Entry[]; section: Section }) {
  const { progress } = useChecklist();
  const runs = groupRuns(entries);
  if (runs.length === 1 && !runs[0]!.group) return <Entries entries={entries} section={section} />;
  return (
    <div className="flex flex-col gap-5">
      {runs.map((run, i) => {
        const p = entriesProgress(run.entries, progress);
        return (
          <div key={`${run.group ?? ""}-${i}`} className="flex flex-col gap-2.5">
            {run.group && (
              <h3 className="m-0 flex items-baseline justify-between gap-3 text-xs font-bold tracking-wider text-(--muted) uppercase">
                <span>{run.group}</span>
                <span className="text-sm tracking-normal text-(--text) tabular-nums normal-case">
                  {p.done} / {p.total}
                </span>
              </h3>
            )}
            <Entries entries={run.entries} section={section} />
          </div>
        );
      })}
    </div>
  );
}

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
      <EntryRuns entries={entries} section={section} />
      {(section.extras ?? []).map((group) =>
        group.layout === "gallery" ? <GalleryGroup key={group.id} group={group} section={section} /> : <ChipsGroup key={group.id} group={group} />,
      )}
    </section>
  );
}
