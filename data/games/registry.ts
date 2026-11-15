import type { ArtManifest, Game } from "@/lib/games/schema";

/**
 * Ordered list of supported games, each with its art manifest.
 * Add a game here after following docs/adding-a-game.md.
 */
export type RegisteredGame = { game: Game; art: ArtManifest };

export const registry: readonly RegisteredGame[] = [];

export const games: readonly Game[] = registry.map((entry) => entry.game);
