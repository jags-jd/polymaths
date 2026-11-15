import { games } from "@/data/games/registry";
import { parseItemId } from "@/lib/games/ids";
import type { Entry, Game, Section, Trackable } from "@/lib/games/schema";

/**
 * Looking up games and items. The database doesn't know the game data, so the
 * progress server actions must resolve every item through here before writing.
 */

export function listGames(): readonly Game[] {
  return games;
}

export function getGame(slug: string): Game | null {
  return games.find((game) => game.slug === slug) ?? null;
}

export type TrackableRef = {
  trackable: Trackable;
  entry: Entry;
  /** The section the entry sits in (directly or in its extras); null for goals. */
  section: Section | null;
};

const indexes = new WeakMap<Game, Map<string, TrackableRef>>();

function trackableIndex(game: Game): Map<string, TrackableRef> {
  let index = indexes.get(game);
  if (!index) {
    index = new Map();
    const add = (entry: Entry, section: Section | null) => {
      for (const trackable of entry.trackables) index!.set(trackable.id, { trackable, entry, section });
    };
    for (const section of game.sections) {
      for (const entry of section.entries) add(entry, section);
      for (const group of section.extras ?? []) for (const entry of group.entries) add(entry, section);
    }
    for (const entry of game.goals ?? []) add(entry, null);
    indexes.set(game, index);
  }
  return index;
}

/**
 * A live (not retired) trackable by ID, or null. Retired items can't be ticked.
 */
export function getTrackable(game: Game, trackableId: string): TrackableRef | null {
  const ref = trackableIndex(game).get(trackableId);
  if (!ref || ref.trackable.retired || ref.entry.retired) return null;
  return ref;
}

/**
 * Resolves a progress `item_id` (`<id>` or `<id>#<n>`) to a live trackable,
 * checking the pip suffix matches the kind and the pip number is in range.
 */
export function resolveItem(game: Game, itemId: string): (TrackableRef & { pip: number | null }) | null {
  const parsed = parseItemId(itemId);
  if (!parsed) return null;
  const ref = getTrackable(game, parsed.trackableId);
  if (!ref) return null;
  const { trackable } = ref;
  if (trackable.kind === "pips") {
    if (parsed.pip === null || parsed.pip > trackable.count) return null;
  } else if (parsed.pip !== null) {
    return null;
  }
  return { ...ref, pip: parsed.pip };
}
