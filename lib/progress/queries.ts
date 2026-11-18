import "server-only";

import type { DatedProgressRow } from "@/lib/games/my-games";
import type { ProgressRow } from "@/lib/games/progress";
import { createClient } from "@/lib/supabase/server";

/**
 * A player's progress rows for one game. Progress is public (RLS), so this
 * also serves read-only views of other players' checklists (phase 0.5).
 * Rows for unknown or retired items are harmless: the progress maths only
 * looks up IDs that exist in the game data.
 */
export async function getProgressRows(userId: string, gameSlug: string): Promise<ProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("item_id, value")
    .eq("user_id", userId)
    .eq("game_slug", gameSlug);
  if (error) throw new Error(`Could not load progress: ${error.message}`);
  return data;
}

/** Supabase returns at most this many rows per request by default. */
const PAGE = 1000;

/**
 * All of a player's progress rows, every game, for the home page's
 * "My games". Paged, because across several big games a player can pass
 * the per-request row limit.
 */
export async function getMyProgressRows(userId: string): Promise<DatedProgressRow[]> {
  const supabase = await createClient();
  const rows: DatedProgressRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("progress")
      .select("game_slug, item_id, value, updated_at")
      .eq("user_id", userId)
      .order("item_id")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Could not load progress: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}
