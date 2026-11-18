"use client";

import { createContext, use, useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

/**
 * Page-level view state that isn't progress: which spoilers are revealed,
 * the per-game "reveal all spoilers" switch (docs/spec.md: remembered per
 * user; localStorage for v1), and the entry a search result just jumped to.
 */

type ChecklistUi = {
  revealAll: boolean;
  setRevealAll: (on: boolean) => void;
  isRevealed: (entryId: string) => boolean;
  reveal: (entryId: string) => void;
  /** The entry to highlight after a search jump, or null. */
  highlighted: string | null;
  jumpTo: (entryId: string) => void;
};

const Context = createContext<ChecklistUi | null>(null);

export function useChecklistUi(): ChecklistUi {
  const value = use(Context);
  if (!value) throw new Error("useChecklistUi must be used inside <ChecklistUiProvider>");
  return value;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false; // storage blocked (private mode): spoilers stay hidden
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    if (on) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    // Not remembered, but the switch still works for this visit via state below.
  }
  listeners.forEach((l) => l());
}

export function ChecklistUiProvider({ gameSlug, children }: { gameSlug: string; children: ReactNode }) {
  const key = `pm-reveal-${gameSlug}`;
  // Server and first client render: hidden, so nothing flashes before hydration.
  const stored = useSyncExternalStore(subscribe, () => readFlag(key), () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const revealAll = override ?? stored;

  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set());
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const setRevealAll = useCallback(
    (on: boolean) => {
      setOverride(on);
      writeFlag(key, on);
    },
    [key],
  );

  const jumpTo = useCallback((entryId: string) => {
    setHighlighted(entryId);
    document.getElementById(entryId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setHighlighted((current) => (current === entryId ? null : current)), 2400);
  }, []);

  const value = useMemo<ChecklistUi>(
    () => ({
      revealAll,
      setRevealAll,
      isRevealed: (id) => revealAll || revealed.has(id),
      reveal: (id) => setRevealed((prev) => new Set(prev).add(id)),
      highlighted,
      jumpTo,
    }),
    [revealAll, setRevealAll, revealed, highlighted, jumpTo],
  );

  return <Context value={value}>{children}</Context>;
}
