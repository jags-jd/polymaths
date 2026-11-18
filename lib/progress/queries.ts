import "server-only";

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
