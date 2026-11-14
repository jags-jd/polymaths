"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { Chevrons, FOCUS, FramedPanel, InnerBox, Score, Star } from "@/components/checklist/skins/smw-save-file/parts";
import type { Trackable } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/** "Whole game" goals as star chips. Goals use `check` trackables only. */
export function GoalsPanel() {
  const { game, progress, toggleCheck } = useChecklist();
  const goals = (game.goals ?? []).filter((e) => !e.retired);
  if (goals.length === 0) return null;

  const chips = goals.flatMap((entry) =>
    entry.trackables
      .filter((t): t is Extract<Trackable, { kind: "check" }> => t.kind === "check" && !t.retired)
      .map((t) => ({ entry, t, done: (progress.get(t.id) ?? 0) >= 1 })),
  );
  const done = chips.filter((c) => c.done).length;

  return (
    <FramedPanel labelledBy="goals-title">
      <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
        <Chevrons />
        <h2 id="goals-title" className="m-0 flex-1 font-(family-name:--font-pixel) text-[clamp(19.5px,3.6vw,28.5px)] leading-[1.4] [text-shadow:2px_2px_0_#FFFFFF]">
          WHOLE GAME
        </h2>
        <Score done={done} total={chips.length} className="text-[16.5px]" />
      </div>
      <InnerBox className="flex flex-wrap gap-2 p-3">
        {chips.map(({ entry, t, done: isDone }) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={isDone}
            onClick={() => toggleCheck(t)}
            className={cn(
              FOCUS,
              "inline-flex min-h-12 items-center gap-2 rounded-lg border-3 border-(--smw-brown) px-3.5 text-left text-[clamp(18px,4.5vw,24px)] font-bold text-(--smw-ink) shadow-[0_3px_0_var(--smw-brown)]",
              isDone ? "bg-(--smw-row-b)" : "bg-white",
            )}
          >
            <Star size={20} outline={!isDone} stroke="var(--smw-ink)" />
            {entry.name}
          </button>
        ))}
      </InnerBox>
    </FramedPanel>
  );
}
