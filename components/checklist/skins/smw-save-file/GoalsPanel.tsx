"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { FOCUS, FramedPanel, InnerBox, Score, Star } from "@/components/checklist/skins/smw-save-file/parts";
import { autoGoalValue, isGoalDone } from "@/lib/games/progress";
import type { Check } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * "Whole game" goals as star chips. Automatic goals (all of Super Mario
 * World's) tick themselves and show how far along they are; a manual goal
 * would be a button like any other check.
 */

// Flat cards: no drop shadow, because they aren't buttons. A manual goal adds one.
const CHIP = "flex h-full min-h-11 w-full items-center gap-2.5 rounded-lg border-3 border-(--smw-brown) px-3 py-2 text-left text-[10px] leading-[1.6] text-(--smw-ink) uppercase sm:text-[11px]";

export function GoalsPanel() {
  const { game, progress, toggleCheck } = useChecklist();
  const goals = (game.goals ?? []).filter((e) => !e.retired);
  if (goals.length === 0) return null;

  const chips = goals.flatMap((entry) =>
    entry.trackables
      .filter((t): t is Check => t.kind === "check" && !t.retired)
      .map((t) => ({ entry, t, done: isGoalDone(game, t, progress) })),
  );
  const done = chips.filter((c) => c.done).length;

  return (
    <FramedPanel labelledBy="goals-title">
      <div className="flex items-center gap-3 px-2 pt-1.5 pb-2.5 sm:px-2.5 sm:pt-2 sm:pb-3">
        <h2 id="goals-title" className="m-0 flex-1 text-[clamp(14px,2.4vw,20px)] leading-[1.4] uppercase [text-shadow:2px_2px_0_#FFFFFF]">
          Whole game
        </h2>
        <Score done={done} total={chips.length} className="text-[11px] sm:text-xs" />
      </div>
      <InnerBox className="p-2.5 sm:p-3">
        <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {chips.map(({ entry, t, done: isDone }) => {
            const star = <Star size={18} outline={!isDone} stroke="var(--smw-ink)" />;
            const bg = isDone ? "bg-(--smw-row-b)" : "bg-white";

            if (!t.auto) {
              return (
                <li key={t.id}>
                  <button type="button" aria-pressed={isDone} onClick={() => toggleCheck(t)} className={cn(FOCUS, CHIP, bg, "shadow-[0_3px_0_var(--smw-brown)]")}>
                    {star}
                    {entry.name}
                  </button>
                </li>
              );
            }

            const v = autoGoalValue(game, t.auto, progress);
            return (
              <li key={t.id} className={cn(CHIP, bg)}>
                {star}
                <span className="flex flex-col">
                  <span>{entry.name}</span>
                  <span className="text-[9px] text-(--smw-blue) normal-case sm:text-[10px]">
                    {isDone ? "Done!" : `${v.done}/${v.total} ${t.auto.unit}`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </InnerBox>
    </FramedPanel>
  );
}
