"use server";

import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { pipId } from "@/lib/games/ids";
import { getGame, getTrackable } from "@/lib/games/load";
import { METER_MAX, PIPS_MAX } from "@/lib/games/schema";
import { createClient } from "@/lib/supabase/server";

/**
 * Progress writes — see docs/data-model.md ("progress") and the spec's
 * "Ticking". The client updates optimistically and rolls back on `ok: false`.
 *
 * Every write is checked against the game data first: the database doesn't
 * know which item IDs exist, so this check must never be skipped.
 * Rate limits (0.7) and activity events (0.6) arrive in later phases.
 */

export type TickResult = { ok: true } | { ok: false; reason: "signed-out" | "invalid" | "failed" };

const UNIQUE_VIOLATION = "23505";

const slug = z.string().min(1).max(100);
const trackableId = z.string().min(1).max(200);

const checkInput = z.object({ gameSlug: slug, trackableId, done: z.boolean() });
const pipInput = z.object({ gameSlug: slug, trackableId, pip: z.int().min(1).max(PIPS_MAX), done: z.boolean() });
const meterInput = z.object({ gameSlug: slug, trackableId, value: z.int().min(0).max(METER_MAX) });

/** Tick or un-tick a `check`. */
export async function setCheck(gameSlug: string, trackableId: string, done: boolean): Promise<TickResult> {
  const input = checkInput.safeParse({ gameSlug, trackableId, done });
  if (!input.success) return invalid("check", gameSlug, trackableId);
  const ref = lookup(input.data.gameSlug, input.data.trackableId);
  if (ref?.kind !== "check") return invalid("check", gameSlug, trackableId);
  return setFlag(input.data.gameSlug, input.data.trackableId, input.data.done);
}

/** Tick or un-tick pip `pip` (1-based) of a `pips` trackable. */
export async function setPip(gameSlug: string, trackableId: string, pip: number, done: boolean): Promise<TickResult> {
  const input = pipInput.safeParse({ gameSlug, trackableId, pip, done });
  if (!input.success) return invalid("pip", gameSlug, trackableId);
  const ref = lookup(input.data.gameSlug, input.data.trackableId);
  if (ref?.kind !== "pips" || input.data.pip > ref.count) return invalid("pip", gameSlug, trackableId);
  return setFlag(input.data.gameSlug, pipId(input.data.trackableId, input.data.pip), input.data.done);
}

/** Set a `meter` to `value` (0 removes the row). */
export async function setMeter(gameSlug: string, trackableId: string, value: number): Promise<TickResult> {
  const input = meterInput.safeParse({ gameSlug, trackableId, value });
  if (!input.success) return invalid("meter", gameSlug, trackableId);
  const ref = lookup(input.data.gameSlug, input.data.trackableId);
  if (ref?.kind !== "meter" || input.data.value > ref.max) return invalid("meter", gameSlug, trackableId);

  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "signed-out" };
  const supabase = await createClient();
  const { gameSlug: game, trackableId: itemId, value: newValue } = input.data;

  if (newValue === 0) {
    const { error } = await supabase.from("progress").delete().eq("user_id", userId).eq("item_id", itemId);
    return error ? failed("meter", game, itemId, error.code) : { ok: true };
  }

  // Users may only UPDATE `value` (column grant), so no upsert: update the
  // row if it exists, else insert it; if a parallel request inserted first,
  // update again.
  const update = () =>
    supabase.from("progress").update({ value: newValue }).eq("user_id", userId).eq("item_id", itemId).select("item_id");

  const updated = await update();
  if (updated.error) return failed("meter", game, itemId, updated.error.code);
  if (updated.data.length > 0) return { ok: true };

  const inserted = await supabase.from("progress").insert({ user_id: userId, game_slug: game, item_id: itemId, value: newValue });
  if (!inserted.error) return { ok: true };
  if (inserted.error.code !== UNIQUE_VIOLATION) return failed("meter", game, itemId, inserted.error.code);
  const retried = await update();
  return retried.error ? failed("meter", game, itemId, retried.error.code) : { ok: true };
}

// --- Helpers -------------------------------------------------------------------

function lookup(gameSlug: string, id: string) {
  const game = getGame(gameSlug);
  return game ? (getTrackable(game, id)?.trackable ?? null) : null;
}

async function currentUserId(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

/** Checks and pips: a row with value 1, or no row. */
async function setFlag(gameSlug: string, itemId: string, done: boolean): Promise<TickResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "signed-out" };
  const supabase = await createClient();

  if (done) {
    const { error } = await supabase.from("progress").insert({ user_id: userId, game_slug: gameSlug, item_id: itemId, value: 1 });
    // Already ticked (double tap, two tabs): that's the state we wanted.
    if (error && error.code !== UNIQUE_VIOLATION) return failed("tick", gameSlug, itemId, error.code);
  } else {
    const { error } = await supabase.from("progress").delete().eq("user_id", userId).eq("item_id", itemId);
    if (error) return failed("untick", gameSlug, itemId, error.code);
  }
  return { ok: true };
}

function invalid(kind: string, gameSlug: unknown, itemId: unknown): TickResult {
  console.warn(JSON.stringify({ event: "progress.invalid", kind, game: String(gameSlug).slice(0, 100), itemId: String(itemId).slice(0, 200) }));
  return { ok: false, reason: "invalid" };
}

function failed(kind: string, gameSlug: string, itemId: string, code: string | undefined): TickResult {
  console.error(JSON.stringify({ event: "progress.save_failed", kind, game: gameSlug, itemId, code }));
  return { ok: false, reason: "failed" };
}
