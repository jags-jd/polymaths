import { entryProgress, isComplete, type ProgressMap } from "@/lib/games/progress";
import type { Entry, Game, Section } from "@/lib/games/schema";

/**
 * Spoilers and in-game search — docs/spec.md ("Spoilers", "Search in game").
 * One rule everywhere (CLAUDE.md, "Spoilers"): a spoiler entry stays hidden
 * until the viewer reveals it or has completed it.
 */

/** Whether an entry is marked as a spoiler, directly or through its section. */
export function isSpoiler(section: Section | null, entry: Entry): boolean {
  return Boolean(section?.spoiler || entry.spoiler);
}

/** Whether an entry's name (and everything in it) must stay blurred. */
export function isEntryHidden(section: Section | null, entry: Entry, progress: ProgressMap, isRevealed: (entryId: string) => boolean): boolean {
  return isSpoiler(section, entry) && !isRevealed(entry.id) && !isComplete(entryProgress(entry, progress));
}

export type SearchResult = {
  entry: Entry;
  section: Section | null;
  /** The trackable label that matched, or null when the entry's name did. */
  matched: string | null;
};

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_LIMIT = 12;

function normalize(s: string): string {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Entries whose name, or one of whose trackable labels, contains the query.
 * Hidden spoilers never match, so a search can't leak a blurred name.
 * Name matches come first, then label matches, each in game order.
 */
export function searchGame(game: Game, query: string, progress: ProgressMap, isRevealed: (entryId: string) => boolean): SearchResult[] {
  const q = normalize(query);
  if (q.length < SEARCH_MIN_LENGTH) return [];

  const byName: SearchResult[] = [];
  const byLabel: SearchResult[] = [];
  const consider = (section: Section | null, entry: Entry) => {
    if (entry.retired || isEntryHidden(section, entry, progress, isRevealed)) return;
    if (normalize(entry.name).includes(q)) {
      byName.push({ entry, section, matched: null });
      return;
    }
    const label = entry.trackables.find((t) => !t.retired && normalize(t.label).includes(q))?.label;
    if (label) byLabel.push({ entry, section, matched: label });
  };

  for (const section of game.sections) {
    for (const entry of section.entries) consider(section, entry);
    for (const group of section.extras ?? []) for (const entry of group.entries) consider(section, entry);
  }
  for (const entry of game.goals ?? []) consider(null, entry);
  return [...byName, ...byLabel].slice(0, SEARCH_LIMIT);
}
