"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { Blocks } from "@/components/checklist/layout/Blocks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackablesProgress } from "@/lib/games/progress";
import type { Entry, Trackable } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * A two-sided entry card: trackables with `side: "back"` (Yoshi: the Flip
 * Side pups and timer, flip-side crafts, the Sprout) on the back, everything
 * else on the front (docs/data-model.md). Tabs show each side's count, so the side you can't see
 * still shows its progress.
 *
 * Both faces are always rendered, stacked in one grid cell, so the card is as
 * tall as its taller side and never resizes when turned. Turning rotates the
 * pair 180° in 3D (motion-safe only); each face hides its back, and the face
 * turned away becomes `invisible` and `inert` at the half-way point, so only
 * one side is ever seen, tabbed into or read out. The tabs only switch sides:
 * the faces are our own tabpanels, not Base UI panels, which mount and unmount.
 * A search jump to something on the back turns the card over.
 */

type Side = "front" | "back";
export type Sides = { front: Trackable[]; back: Trackable[] };

/** Two sides only when an entry has trackables on both faces. */
export function splitSides(trackables: Trackable[]): Sides | null {
  const front = trackables.filter((t) => t.side !== "back");
  const back = trackables.filter((t) => t.side === "back");
  return front.length > 0 && back.length > 0 ? { front, back } : null;
}

const LABEL: Record<Side, string> = { front: "Front", back: "Back" };

export function CardSides({ entry, sides, complete }: { entry: Entry; sides: Sides; complete: boolean }) {
  const { progress } = useChecklist();
  const { lastJump } = useChecklistUi();
  const [side, setSide] = useState<Side>("front");
  const [seenJump, setSeenJump] = useState(0);

  // A search result on the back turns the card over (adjusting state during
  // render, as React recommends, rather than in an effect).
  if (lastJump && lastJump.seq !== seenJump && lastJump.entryId === entry.id) {
    setSeenJump(lastJump.seq);
    if (lastJump.matched && sides.back.some((t) => t.label === lastJump.matched) && side !== "back") {
      setSide("back");
    }
  }

  return (
    <Tabs value={side} onValueChange={(v) => setSide(v as Side)} className="gap-3">
      <TabsList
        aria-label={`${entry.name} card side`}
        className={cn("h-auto w-full rounded-(--radius-control) p-1 group-data-horizontal/tabs:h-auto", complete ? "bg-(--surface)/70" : "bg-(--surface-2)")}
      >
        {(["front", "back"] as const).map((s) => {
          const p = trackablesProgress(sides[s], progress);
          const done = p.total > 0 && p.done === p.total;
          return (
            <TabsTrigger
              key={s}
              value={s}
              className="min-h-9 rounded-(--radius-control) text-sm font-bold text-(--muted) hover:text-(--text) focus-visible:ring-(--accent)/50 data-active:bg-(--surface) data-active:text-(--text) data-active:shadow-sm"
            >
              {done && <Check aria-hidden="true" className="size-3.5 text-(--accent)" strokeWidth={3} />}
              {LABEL[s]}
              <span className="text-(--accent) tabular-nums">
                {p.done}/{p.total}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <div className="perspective-[1400px]">
        <div className={cn("grid transform-3d motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-in-out", side === "back" && "rotate-y-180")}>
          {(["front", "back"] as const).map((s) => {
            const shown = s === side;
            return (
              <div
                key={s}
                role="tabpanel"
                aria-label={`${entry.name}: ${LABEL[s]}`}
                inert={!shown}
                className={cn(
                  "col-start-1 row-start-1 flex flex-col gap-4 self-start backface-hidden",
                  s === "back" && "rotate-y-180",
                  // Swap visibility half-way through the turn (instantly with reduced motion).
                  "transition-[visibility] motion-safe:delay-250",
                  shown ? "visible" : "invisible",
                )}
              >
                <Blocks entryName={entry.name} items={sides[s]} complete={complete} />
              </div>
            );
          })}
        </div>
      </div>
    </Tabs>
  );
}
