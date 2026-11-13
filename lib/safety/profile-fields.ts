import { z } from "zod";

import { isReservedIgn } from "@/lib/safety/reserved-igns";

/**
 * Validation for user-written profile fields. The database enforces the same
 * format and length limits (see supabase/migrations/*_create_profiles.sql);
 * reserved names are checked here only. Profanity filtering arrives in 0.7.
 */

export const IGN_MIN = 3;
export const IGN_MAX = 20;
export const IGN_PATTERN = /^[A-Za-z0-9_]+$/;
export const DISPLAY_NAME_MAX = 40;

export const ignSchema = z
  .string()
  .trim()
  .min(IGN_MIN, `Your IGN needs at least ${IGN_MIN} characters.`)
  .max(IGN_MAX, `Your IGN can be at most ${IGN_MAX} characters.`)
  .regex(IGN_PATTERN, "Use only letters, numbers and underscores.")
  .refine((ign) => !isReservedIgn(ign), "That IGN is reserved. Try another.");

export const displayNameSchema = z
  .string()
  // Collapse runs of whitespace (including newlines) to single spaces.
  .transform((name) => name.replace(/\s+/g, " ").trim())
  .pipe(
    z
      .string()
      .min(1, "Enter a display name.")
      .max(DISPLAY_NAME_MAX, `Your display name can be at most ${DISPLAY_NAME_MAX} characters.`),
  );

export const onboardingSchema = z.object({
  displayName: displayNameSchema,
  ign: ignSchema,
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
