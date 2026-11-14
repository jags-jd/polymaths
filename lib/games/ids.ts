/**
 * Item IDs — see docs/data-model.md ("IDs").
 *
 * Every section, group, entry and trackable has a permanent ID: lowercase words
 * separated by `-`, starting with the game's `idPrefix`. A pip is stored as
 * `<trackable id>#<n>` (1-based). IDs are never renamed or reused.
 */

/** Lowercase letters and digits, words joined by single dashes. */
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A game's prefix: one or more lowercase words, ending in a dash (`smw-`). */
export const ID_PREFIX_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-$/;

const PIP_NUMBER = /^[1-9][0-9]*$/;

export function isValidId(id: string): boolean {
  return ID_PATTERN.test(id);
}

/** The progress row ID for pip `n` (1-based) of a pips trackable. */
export function pipId(trackableId: string, n: number): string {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`Pip number must be a positive integer, got ${n}`);
  return `${trackableId}#${n}`;
}

export type ParsedItemId = {
  trackableId: string;
  /** 1-based pip number, or null for a check or meter row. */
  pip: number | null;
};

/**
 * Splits a progress row's `item_id` into the trackable ID and pip number.
 * Returns null for anything malformed. It doesn't check the ID exists in any
 * game — see `resolveItem` in lib/games/load.ts for that.
 */
export function parseItemId(itemId: string): ParsedItemId | null {
  const parts = itemId.split("#");
  if (parts.length > 2) return null;
  const [trackableId, pipPart] = parts as [string, string | undefined];
  if (!isValidId(trackableId)) return null;
  if (pipPart === undefined) return { trackableId, pip: null };
  if (!PIP_NUMBER.test(pipPart)) return null;
  const pip = Number(pipPart);
  return Number.isSafeInteger(pip) ? { trackableId, pip } : null;
}
