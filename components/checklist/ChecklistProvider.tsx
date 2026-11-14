"use client";

import { useRouter } from "next/navigation";
import { createContext, startTransition, use, useOptimistic, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { pipId } from "@/lib/games/ids";
import { isPipDone, meterValue, toProgressMap, type ProgressMap, type ProgressRow } from "@/lib/games/progress";
import type { Game, Meter, Pips, Trackable } from "@/lib/games/schema";
import { setCheck, setMeter, setPip, type TickResult } from "@/lib/progress/actions";

/**
 * Progress state for one checklist page — docs/spec.md ("Ticking") and
 * CLAUDE.md principle 5: a tick shows instantly, then saves; if the save
 * fails it's undone and we say so. Never show progress that isn't saved.
 */

type Change = { itemId: string; value: number | null };

type ChecklistContextValue = {
  game: Game;
  /** Saved progress with in-flight ticks applied on top. */
  progress: ProgressMap;
  /** "edit": the player's own list. "sign-in": a visitor; taps ask to sign in. */
  mode: "edit" | "sign-in";
  toggleCheck: (trackable: Extract<Trackable, { kind: "check" }>) => void;
  togglePip: (trackable: Pips, n: number) => void;
  tapMeter: (trackable: Meter, n: number) => void;
};

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

export function useChecklist(): ChecklistContextValue {
  const value = use(ChecklistContext);
  if (!value) throw new Error("useChecklist must be used inside <ChecklistProvider>");
  return value;
}

function apply(progress: ProgressMap, change: Change): ProgressMap {
  const next = new Map(progress);
  if (change.value === null) next.delete(change.itemId);
  else next.set(change.itemId, change.value);
  return next;
}

type Props = {
  game: Game;
  rows: ProgressRow[];
  mode: "edit" | "sign-in";
  children: ReactNode;
};

export function ChecklistProvider({ game, rows, mode, children }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState<ProgressMap>(() => toProgressMap(rows));
  const [progress, addOptimistic] = useOptimistic(saved, apply);

  function save(change: Change, write: () => Promise<TickResult>) {
    if (mode !== "edit") {
      toast("Sign in to tick things off", {
        action: { label: "Sign in", onClick: () => router.push(`/login?next=/games/${game.slug}`) },
      });
      return;
    }
    startTransition(async () => {
      addOptimistic(change);
      let result: TickResult;
      try {
        result = await write();
      } catch {
        result = { ok: false, reason: "failed" };
      }
      if (result.ok) {
        startTransition(() => setSaved((current) => apply(current, change)));
      } else if (result.reason === "signed-out") {
        toast.error("You've been signed out. Sign in again to keep ticking.");
      } else {
        toast.error("That didn't save, so we undid it. Please try again.");
      }
    });
  }

  const value: ChecklistContextValue = {
    game,
    progress,
    mode,
    toggleCheck(trackable) {
      const done = (progress.get(trackable.id) ?? 0) >= 1;
      save({ itemId: trackable.id, value: done ? null : 1 }, () => setCheck(game.slug, trackable.id, !done));
    },
    togglePip(trackable, n) {
      const done = isPipDone(trackable, n, progress);
      save({ itemId: pipId(trackable.id, n), value: done ? null : 1 }, () => setPip(game.slug, trackable.id, n, !done));
    },
    tapMeter(trackable, n) {
      // Tapping the Nth icon sets the value to N; tapping the current value
      // again lowers it by one (docs/spec.md).
      const next = meterValue(trackable, progress) === n ? n - 1 : n;
      save({ itemId: trackable.id, value: next === 0 ? null : next }, () => setMeter(game.slug, trackable.id, next));
    },
  };

  return <ChecklistContext value={value}>{children}</ChecklistContext>;
}
