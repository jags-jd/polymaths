import { pipId } from "@/lib/games/ids";
import { matchList, type AutoGoal, type Check, type Entry, type EntryGroup, type Game, type Section, type StatDef, type Trackable, type TrackableMatch } from "@/lib/games/schema";

/**
 * Progress maths — see docs/data-model.md ("Progress maths").
 *
 * Pure functions over a game and the player's progress rows. Retired entries
 * and trackables are left out of every total (their rows are kept). Percentages
 * round down, so 100% only shows when everything is done.
 */

/** item_id → value, built from a player's `progress` rows for one game. */
export type ProgressMap = ReadonlyMap<string, number>;

export type ProgressRow = { item_id: string; value: number };

export type Progress = { done: number; total: number; percent: number };

export const EMPTY_PROGRESS: ProgressMap = new Map();

export function toProgressMap(rows: readonly ProgressRow[]): ProgressMap {
  return new Map(rows.map((row) => [row.item_id, row.value]));
}

// --- Trackables ----------------------------------------------------------------

/** How many units a trackable adds to the total. */
export function units(trackable: Trackable): number {
  return trackable.kind === "pips" ? trackable.count : 1;
}

/** Whether pip `n` (1-based) is ticked. Out-of-range pips are never ticked. */
export function isPipDone(trackable: Extract<Trackable, { kind: "pips" }>, n: number, progress: ProgressMap): boolean {
  return n >= 1 && n <= trackable.count && (progress.get(pipId(trackable.id, n)) ?? 0) >= 1;
}

/** A meter's current value, clamped to 0..max. */
export function meterValue(trackable: Extract<Trackable, { kind: "meter" }>, progress: ProgressMap): number {
  const value = progress.get(trackable.id) ?? 0;
  return Math.min(Math.max(Math.floor(value), 0), trackable.max);
}

/** How many of a trackable's units are done. */
export function doneUnits(trackable: Trackable, progress: ProgressMap): number {
  switch (trackable.kind) {
    case "check":
      return (progress.get(trackable.id) ?? 0) >= 1 ? 1 : 0;
    case "pips": {
      let done = 0;
      for (let n = 1; n <= trackable.count; n++) if (isPipDone(trackable, n, progress)) done++;
      return done;
    }
    case "meter":
      return meterValue(trackable, progress) >= trackable.max ? 1 : 0;
  }
}

export function trackableProgress(trackable: Trackable, progress: ProgressMap): Progress {
  if (trackable.retired) return makeProgress(0, 0);
  return makeProgress(doneUnits(trackable, progress), units(trackable));
}

// --- Entries, sections, games --------------------------------------------------

/** Progress over any list of trackables (e.g. one side of a two-sided card). */
export function trackablesProgress(trackables: readonly Trackable[], progress: ProgressMap): Progress {
  return sum(trackables.map((t) => trackableProgress(t, progress)));
}

export function entryProgress(entry: Entry, progress: ProgressMap): Progress {
  if (entry.retired) return makeProgress(0, 0);
  return trackablesProgress(entry.trackables, progress);
}

export function groupProgress(group: EntryGroup, progress: ProgressMap): Progress {
  return entriesProgress(group.entries, progress);
}

/** Any list of entries, e.g. a run of entries sharing an `Entry.group`. */
export function entriesProgress(entries: readonly Entry[], progress: ProgressMap): Progress {
  return sum(entries.map((e) => entryProgress(e, progress)));
}

/** A section's entries plus its extras groups. */
export function sectionProgress(section: Section, progress: ProgressMap): Progress {
  return sum([
    ...section.entries.map((e) => entryProgress(e, progress)),
    ...(section.extras ?? []).map((g) => groupProgress(g, progress)),
  ]);
}

/** Every section plus the whole-game goals (automatic goals worked out, not read). */
export function gameProgress(game: Game, progress: ProgressMap): Progress {
  return sum([
    ...game.sections.map((s) => sectionProgress(s, progress)),
    ...(game.goals ?? []).map((e) => goalProgress(game, e, progress)),
  ]);
}

/** A whole-game goal entry. Automatic checks ignore any saved row. */
export function goalProgress(game: Game, entry: Entry, progress: ProgressMap): Progress {
  if (entry.retired) return makeProgress(0, 0);
  return sum(
    entry.trackables.map((t) => {
      if (t.kind !== "check" || !t.auto || t.retired) return trackableProgress(t, progress);
      return makeProgress(isGoalDone(game, t, progress) ? 1 : 0, 1);
    }),
  );
}

/**
 * Whether a goal check is done: automatic goals when their condition is met,
 * manual goals when ticked.
 */
export function isGoalDone(game: Game, check: Check, progress: ProgressMap): boolean {
  if (!check.auto) return (progress.get(check.id) ?? 0) >= 1;
  const v = autoGoalValue(game, check.auto, progress);
  return v.total > 0 && v.done === v.total;
}

/**
 * How far an automatic goal has got: matched trackables completed / matched,
 * or with `count: "units"`, their units done / units (every pip counts).
 */
export function autoGoalValue(game: Game, auto: AutoGoal, progress: ProgressMap): { done: number; total: number } {
  const matches = matchList(auto.match);
  let done = 0;
  let total = 0;
  for (const { section, entry, trackable } of sectionTrackables(game)) {
    if (auto.section && section.id !== auto.section) continue;
    if (entry.retired || trackable.retired || !matches.some((m) => matchesTrackable(m, entry, trackable))) continue;
    const p = trackableProgress(trackable, progress);
    if (auto.count === "units") {
      done += p.done;
      total += p.total;
    } else {
      done += isComplete(p) ? 1 : 0;
      total += 1;
    }
  }
  return { done, total };
}

/**
 * Done when every unit is done. Something with nothing to count (everything
 * retired) is never complete, so it can't show a "complete" badge or feed event.
 */
export function isComplete(p: Progress): boolean {
  return p.total > 0 && p.done === p.total;
}

// --- Stats ---------------------------------------------------------------------

export type StatValue = { label: string; done: number; total: number };

/**
 * The value of one summary tile. Trackable stats look at section entries and
 * extras only — whole-game goals are not counted in stats. Pass `onlySection`
 * to count within one section (e.g. exits per world on the section tabs).
 */
export function statValue(game: Game, stat: StatDef, progress: ProgressMap, onlySection?: Section): StatValue {
  const { match } = stat;
  if (match.section) {
    const sections = onlySection ? [onlySection] : game.sections;
    const counted = sections.map((s) => sectionProgress(s, progress)).filter((p) => p.total > 0);
    return { label: stat.label, done: counted.filter(isComplete).length, total: counted.length };
  }

  let done = 0;
  let total = 0;
  for (const { section, entry, trackable } of sectionTrackables(game)) {
    if (onlySection && section.id !== onlySection.id) continue;
    if (entry.retired || trackable.retired || !matchesTrackable(match, entry, trackable)) continue;

    const p = trackableProgress(trackable, progress);
    if (stat.count === "units") {
      done += p.done;
      total += p.total;
    } else {
      done += isComplete(p) ? 1 : 0;
      total += 1;
    }
  }
  return { label: stat.label, done, total };
}

export function gameStats(game: Game, progress: ProgressMap): StatValue[] {
  return game.stats.map((stat) => statValue(game, stat, progress));
}

// --- Helpers -------------------------------------------------------------------

/** Whether a trackable passes every given filter. */
export function matchesTrackable(match: TrackableMatch, entry: Entry, trackable: Trackable): boolean {
  if (match.trackableKind && trackable.kind !== match.trackableKind) return false;
  if (match.icon && trackable.icon !== match.icon) return false;
  if (match.entryKind && entry.kind !== match.entryKind) return false;
  if (match.idSuffix && !trackable.id.endsWith(match.idSuffix)) return false;
  return true;
}

/** Every trackable in a game's sections (entries and extras), in order. */
export function* sectionTrackables(game: Game): Generator<{ section: Section; entry: Entry; trackable: Trackable }> {
  for (const section of game.sections) {
    const entries = [...section.entries, ...(section.extras ?? []).flatMap((g) => g.entries)];
    for (const entry of entries) for (const trackable of entry.trackables) yield { section, entry, trackable };
  }
}

function makeProgress(done: number, total: number): Progress {
  return { done, total, percent: total === 0 ? 0 : Math.floor((done * 100) / total) };
}

function sum(parts: Progress[]): Progress {
  let done = 0;
  let total = 0;
  for (const p of parts) {
    done += p.done;
    total += p.total;
  }
  return makeProgress(done, total);
}
