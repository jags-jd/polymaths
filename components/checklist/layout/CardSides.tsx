"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { Blocks } from "@/components/checklist/layout/Blocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackablesProgress } from "@/lib/games/progress";
import type { Entry, Trackable } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * A two-sided entry card: the course itself on the front (ungrouped
 * trackables), its grouped extras ("Craft requests", "Flip Side", "After the
 * story") on the back. Tabs show each side's count, so the side you can't see
 * still shows its progress. Switching turns the new side in like a flipped
 * card (motion-safe only, never on page load). A search jump to something on
 * the back turns the card over.
 */

type Side = "front" | "back";
export type Sides = { front: Trackable[]; back: Trackable[] };

/** Two sides only when an entry has both ungrouped and grouped trackables. */
export function splitSides(trackables: Trackable[]): Sides | null {
  const front = trackables.filter((t) => !t.group);
  const back = trackables.filter((t) => t.group);
  return front.length > 0 && back.length > 0 ? { front, back } : null;
}

const LABEL: Record<Side, string> = { front: "Front", back: "Back" };

export function CardSides({ entry, sides, complete }: { entry: Entry; sides: Sides; complete: boolean }) {
  const { progress } = useChecklist();
  const { lastJump } = useChecklistUi();
  const [side, setSide] = useState<Side>("front");
  const [flipped, setFlipped] = useState(false);
  const [seenJump, setSeenJump] = useState(0);

  // A search result on the back turns the card over (adjusting state during
  // render, as React recommends, rather than in an effect).
  if (lastJump && lastJump.seq !== seenJump && lastJump.entryId === entry.id) {
    setSeenJump(lastJump.seq);
    if (lastJump.matched && sides.back.some((t) => t.label === lastJump.matched) && side !== "back") {
      setSide("back");
      setFlipped(true);
    }
  }

  const turn = (next: Side) => {
    setSide(next);
    setFlipped(true);
  };

  return (
    <Tabs value={side} onValueChange={(v) => turn(v as Side)} className="gap-3">
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
      {(["front", "back"] as const).map((s) => (
        <TabsContent key={s} value={s} className={cn("flex flex-col gap-4 text-base", flipped && "motion-safe:animate-card-flip")}>
          <Blocks entryName={entry.name} items={sides[s]} complete={complete} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
