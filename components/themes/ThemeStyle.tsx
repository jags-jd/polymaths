import type { Game } from "@/lib/games/schema";
import { gameTokens, tokensToCss } from "@/lib/themes/tokens";

/**
 * Applies a game's theme tokens to the whole document (including the site
 * header, which sits outside the page) for as long as the page is mounted.
 * A plain <style> — not hoisted — so it goes away on client navigation.
 * The CSS is built only from our own constants, never from user input.
 */
export function ThemeStyle({ game }: { game: Pick<Game, "theme" | "accent" | "skin"> }) {
  return <style>{tokensToCss(gameTokens(game))}</style>;
}
