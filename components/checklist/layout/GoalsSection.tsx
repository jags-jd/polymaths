"use client";

import { Star } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { CheckChip } from "@/components/checklist/layout/Trackables";
import { autoGoalValue, isGoalDone } from "@/lib/games/progress";
import type { Check } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * "Whole game" goals. Automatic goals tick themselves and show how far along
 * they are (docs/decisions/2026-11-15-automatic-goals.md), so they're cards,
 * not buttons; a manual goal is a normal chip.
 */
export function GoalsSection() {
  const { game, progress } = useChecklist();
  const goals = (game.goals ?? []).filter((e) => !e.retired);
  if (goals.length === 0) return null;
  const items = goals.flatMap((entry) =>
    entry.trackables.filter((t): t is Check => t.kind === "check" && !t.retired).map((t) => ({ entry, t, done: isGoalDone(game, t, progress) })),
  );

  return (
    <section id="whole-game" aria-labelledby="whole-game-title" className="flex scroll-mt-6 flex-col gap-4">
      <header className="flex items-center justify-between gap-3 border-b-2 border-(--border) pb-3">
        <h2 id="whole-game-title" className="m-0 font-(family-name:--font-display) text-2xl font-black [text-transform:var(--display-case)]">
          Whole game
        </h2>
        <span className="text-sm font-bold tabular-nums">
          {items.filter((i) => i.done).length} / {items.length}
        </span>
      </header>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {items.map(({ entry, t, done }) => {
          if (!t.auto) {
            return (
              <li key={t.id} id={entry.id}>
                <CheckChip entryName={entry.name} trackable={{ ...t, label: entry.name }} />
              </li>
            );
          }
          const v = autoGoalValue(game, t.auto, progress);
          return (
            <li
              key={t.id}
              id={entry.id}
              className={cn(
                "flex items-center gap-3 rounded-(--radius-card) border-2 p-4",
                done ? "border-(--done-border) bg-(--done-bg)" : "border-(--border) bg-(--surface)",
              )}
            >
              <Star aria-hidden="true" className={cn("size-7 shrink-0", done ? "fill-(--accent) text-(--accent)" : "text-(--muted)")} />
              <span className="flex min-w-0 flex-col">
                <span className="font-extrabold">{entry.name}</span>
                <span className="text-sm text-(--muted)">{t.label}</span>
                <span className="text-sm font-bold text-(--accent) tabular-nums">{done ? "Done!" : `${v.done} / ${v.total} ${t.auto.unit}`}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
