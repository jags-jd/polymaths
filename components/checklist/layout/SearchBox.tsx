"use client";

import { Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { FOCUS } from "@/components/checklist/layout/Trackables";
import { searchGame, SEARCH_MIN_LENGTH, type SearchResult } from "@/lib/games/visibility";
import { cn } from "@/lib/utils";

/**
 * In-game search — docs/spec.md ("Search in game"): finds entries and
 * trackables by name; picking a result jumps to the entry and highlights it.
 * Hidden spoilers never match (lib/games/visibility.ts).
 */
export function SearchBox() {
  const { game, progress } = useChecklist();
  const { isRevealed, jumpTo } = useChecklistUi();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const listId = useId();
  const results = useMemo(() => searchGame(game, query, progress, isRevealed), [game, query, progress, isRevealed]);
  const searching = query.trim().length >= SEARCH_MIN_LENGTH;

  const pick = (r: SearchResult) => {
    setQuery("");
    jumpTo(r.entry.id, r.matched);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        Search this checklist
      </label>
      <div className="flex min-h-11 items-center gap-2 rounded-(--radius-control) border-2 border-(--border) bg-(--surface) px-4 focus-within:border-(--accent)">
        <Search aria-hidden="true" className="size-4 shrink-0 text-(--muted)" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) pick(results[0]);
            if (e.key === "Escape") setQuery("");
          }}
          placeholder={`Search ${game.title}`}
          aria-controls={listId}
          autoComplete="off"
          className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-(--muted) [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className={cn(FOCUS, "rounded-full p-1 text-(--muted)")}>
            <X className="size-4" />
          </button>
        )}
      </div>
      <div id={listId} aria-live="polite">
        {searching &&
          (results.length === 0 ? (
            <p className="m-0 px-1 text-sm text-(--muted)">Nothing matches “{query.trim()}”.</p>
          ) : (
            <ul aria-label="Search results" className="m-0 flex list-none flex-col gap-1 p-0">
              {results.map((r) => (
                <li key={r.entry.id}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className={cn(FOCUS, "flex min-h-11 w-full items-center justify-between gap-3 rounded-(--radius-control) px-3 text-left hover:bg-(--surface-2)")}
                  >
                    <span className="min-w-0">
                      <span className="font-bold">{r.entry.name}</span>
                      {r.matched && <span className="text-(--muted)"> · {r.matched}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-(--muted)">{r.section?.title ?? "Whole game"}</span>
                  </button>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
