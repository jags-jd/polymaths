import { z } from "zod";

import { ID_PATTERN, ID_PREFIX_PATTERN } from "@/lib/games/ids";

/**
 * The game data format — see docs/data-model.md (Part 1).
 *
 * These schemas are the single source of truth: the TypeScript types below are
 * inferred from them, data files use `satisfies Game`, and `pnpm data:validate`
 * parses every registered game with `gameSchema`. No transforms or defaults, so
 * a data file's shape is exactly what the app reads.
 */

export const PIPS_MIN = 2;
export const PIPS_MAX = 30;
export const METER_MIN = 2;
export const METER_MAX = 999;

export const THEME_NAMES = ["default", "nintendo", "souls", "square"] as const;
export const SKIN_NAMES = ["smw-save-file"] as const;
export const TRACKABLE_KINDS = ["check", "pips", "meter"] as const;

const id = z.string().regex(ID_PATTERN, "IDs are lowercase words joined by dashes");
const text = z.string().trim().min(1);
const iconKey = z.string().regex(ID_PATTERN, "Icon keys are lowercase words joined by dashes");
const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a 6-digit hex color like #1F7F2D");

// --- Trackables ----------------------------------------------------------------

const trackableBase = {
  id,
  label: text,
  icon: iconKey,
  group: text.optional(),
  spoiler: z.boolean().optional(),
  retired: z.boolean().optional(),
};

export const checkSchema = z.strictObject({ ...trackableBase, kind: z.literal("check") });

/**
 * 2–30 pips, or exactly 1 with `singlePip: true` — the agreed exception in
 * docs/decisions/2026-11-14-trackable-exceptions.md.
 */
export const pipsSchema = z
  .strictObject({
    ...trackableBase,
    kind: z.literal("pips"),
    count: z.int(),
    singlePip: z.literal(true).optional(),
  })
  .superRefine((pips, ctx) => {
    if (pips.singlePip) {
      if (pips.count !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["singlePip"],
          message: "`singlePip: true` is only allowed with `count: 1`",
        });
      }
    } else if (pips.count < PIPS_MIN || pips.count > PIPS_MAX) {
      ctx.addIssue({
        code: "custom",
        path: ["count"],
        message:
          pips.count === 1
            ? "A single pip needs `singlePip: true` (a lone thing is normally a `check`)"
            : `Pips count must be ${PIPS_MIN}–${PIPS_MAX}`,
      });
    }
  });

export const meterSchema = z.strictObject({
  ...trackableBase,
  kind: z.literal("meter"),
  max: z.int().min(METER_MIN).max(METER_MAX),
});

export const trackableSchema = z.discriminatedUnion("kind", [checkSchema, pipsSchema, meterSchema]);

// --- Entries, groups, sections -------------------------------------------------

export const entrySchema = z.strictObject({
  id,
  name: text,
  /** Free label per game: 'course', 'castle', 'boss', 'costume'... Used by stats. */
  kind: iconKey,
  note: text.optional(),
  spoiler: z.boolean().optional(),
  retired: z.boolean().optional(),
  /** Key into the game's art manifest. */
  image: iconKey.optional(),
  icon: iconKey.optional(),
  trackables: z.array(trackableSchema).min(1, "An entry needs at least one trackable"),
});

export const entryGroupSchema = z.strictObject({
  id,
  title: text,
  layout: z.enum(["gallery", "chips"]),
  entries: z.array(entrySchema).min(1, "A group needs at least one entry"),
});

export const sectionSchema = z.strictObject({
  id,
  title: text,
  label: text.optional(),
  layout: z.enum(["rows", "cards", "gallery"]),
  spoiler: z.boolean().optional(),
  entries: z.array(entrySchema).min(1, "A section needs at least one entry"),
  extras: z.array(entryGroupSchema).optional(),
});

// --- Stats ---------------------------------------------------------------------

/**
 * A summary tile. Either counts trackables (all given `match` fields must hold)
 * or, with `match: { section: true }`, counts completed sections.
 */
export const statDefSchema = z
  .strictObject({
    label: text,
    match: z.strictObject({
      trackableKind: z.enum(TRACKABLE_KINDS).optional(),
      icon: iconKey.optional(),
      entryKind: iconKey.optional(),
      idSuffix: z.string().min(1).optional(),
      section: z.literal(true).optional(),
    }),
    count: z.enum(["units", "completed"]),
  })
  .superRefine((stat, ctx) => {
    const { section, ...trackableFilters } = stat.match;
    const hasFilter = Object.values(trackableFilters).some((v) => v !== undefined);
    if (section) {
      if (hasFilter) {
        ctx.addIssue({ code: "custom", path: ["match"], message: "`section: true` can't be combined with other filters" });
      }
      if (stat.count !== "completed") {
        ctx.addIssue({ code: "custom", path: ["count"], message: "A section stat counts `completed` sections" });
      }
    } else if (!hasFilter) {
      ctx.addIssue({ code: "custom", path: ["match"], message: "A stat needs at least one match filter" });
    }
  });

// --- Game ----------------------------------------------------------------------

export const gameSchema = z
  .strictObject({
    slug: z.string().regex(ID_PATTERN, "Slugs are lowercase words joined by dashes"),
    title: text,
    idPrefix: z.string().regex(ID_PREFIX_PATTERN, "The ID prefix is lowercase and ends with a dash, e.g. `smw-`"),
    publisher: text,
    platforms: z.array(text).min(1),
    theme: z.enum(THEME_NAMES),
    accent: hexColor.optional(),
    skin: z.enum(SKIN_NAMES).optional(),
    sections: z.array(sectionSchema).min(1, "A game needs at least one section"),
    goals: z.array(entrySchema).optional(),
    stats: z.array(statDefSchema),
  })
  .superRefine((game, ctx) => {
    for (const { id: itemId, path } of collectIds(game)) {
      if (!itemId.startsWith(game.idPrefix)) {
        ctx.addIssue({ code: "custom", path, message: `ID "${itemId}" must start with "${game.idPrefix}"` });
      }
    }
    const seen = new Set<string>();
    for (const { id: itemId, path } of collectIds(game)) {
      if (seen.has(itemId)) ctx.addIssue({ code: "custom", path, message: `Duplicate ID "${itemId}"` });
      seen.add(itemId);
    }
  });

export type Check = z.infer<typeof checkSchema>;
export type Pips = z.infer<typeof pipsSchema>;
export type Meter = z.infer<typeof meterSchema>;
export type Trackable = z.infer<typeof trackableSchema>;
export type TrackableKind = Trackable["kind"];
export type Entry = z.infer<typeof entrySchema>;
export type EntryGroup = z.infer<typeof entryGroupSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type StatDef = z.infer<typeof statDefSchema>;
export type Game = z.infer<typeof gameSchema>;
export type ThemeName = Game["theme"];
export type SkinName = NonNullable<Game["skin"]>;

type IdAt = { id: string; path: (string | number)[] };

/**
 * Every ID in a game (sections, groups, entries, trackables, goals) with its
 * path, for the prefix and uniqueness checks. Takes the unrefined shape so it
 * can run inside the schema's own refinement.
 */
export function collectIds(game: Pick<Game, "sections" | "goals">): IdAt[] {
  const out: IdAt[] = [];
  const addEntry = (entry: Entry, path: (string | number)[]) => {
    out.push({ id: entry.id, path: [...path, "id"] });
    entry.trackables.forEach((t, i) => out.push({ id: t.id, path: [...path, "trackables", i, "id"] }));
  };
  game.sections.forEach((section, s) => {
    out.push({ id: section.id, path: ["sections", s, "id"] });
    section.entries.forEach((entry, e) => addEntry(entry, ["sections", s, "entries", e]));
    section.extras?.forEach((group, g) => {
      out.push({ id: group.id, path: ["sections", s, "extras", g, "id"] });
      group.entries.forEach((entry, e) => addEntry(entry, ["sections", s, "extras", g, "entries", e]));
    });
  });
  game.goals?.forEach((entry, e) => addEntry(entry, ["goals", e]));
  return out;
}

// --- Art manifest --------------------------------------------------------------

/** See CLAUDE.md "Art policy" and docs/decisions/2026-11-12-art-policy.md. */
export const artItemSchema = z
  .strictObject({
    /** File name inside public/games/<slug>/. */
    file: z.string().regex(/^[a-z0-9][a-z0-9._-]*\.(png|jpg|jpeg|webp|svg|avif)$/, "Lowercase file name with an image extension"),
    alt: text,
    /** Where the image came from (URL). Optional only for our own original art. */
    source: z.url().optional(),
    owner: text,
    license: z.enum(["official-unlicensed", "licensed", "original"]),
  })
  .superRefine((art, ctx) => {
    if (art.license !== "original" && !art.source) {
      ctx.addIssue({ code: "custom", path: ["source"], message: "Non-original art must record its source URL" });
    }
  });

export const artManifestSchema = z.record(iconKey, artItemSchema);

export type ArtItem = z.infer<typeof artItemSchema>;
export type ArtManifest = z.infer<typeof artManifestSchema>;
