import { hasPage } from "@/lib/games/load";
import { gameProgress, toProgressMap, type Progress, type ProgressRow } from "@/lib/games/progress";
import type { Game } from "@/lib/games/schema";

/**
 * The home page's "My games" and "All games" — docs/spec.md ("Home").
 * Pure: takes the registered games and a player's rows for every game.
 */

export type DatedProgressRow = ProgressRow & { game_slug: string; updated_at: string };

export type GameSummary = {
  game: Game;
  progress: Progress;
  /** The newest `updated_at` among the player's rows for this game (ISO). */
  lastPlayed: string;
};

export type GamesOverview = {
  /** Games the player has ticked something in, most recently played first. */
  started: GameSummary[];
  /** Every other game with a page, in registry order. */
  others: Game[];
};

export function summarizeGames(games: readonly Game[], rows: readonly DatedProgressRow[]): GamesOverview {
  const bySlug = new Map<string, DatedProgressRow[]>();
  for (const row of rows) {
    const list = bySlug.get(row.game_slug);
    if (list) list.push(row);
    else bySlug.set(row.game_slug, [row]);
  }

  const started: GameSummary[] = [];
  const others: Game[] = [];
  for (const game of games) {
    if (!hasPage(game)) continue;
    const gameRows = bySlug.get(game.slug);
    if (!gameRows) {
      others.push(game);
      continue;
    }
    started.push({
      game,
      progress: gameProgress(game, toProgressMap(gameRows)),
      // ISO timestamps from Postgres compare correctly as strings.
      lastPlayed: gameRows.reduce((latest, r) => (r.updated_at > latest ? r.updated_at : latest), ""),
    });
  }
  started.sort((a, b) => (a.lastPlayed < b.lastPlayed ? 1 : a.lastPlayed > b.lastPlayed ? -1 : 0));
  return { started, others };
}
