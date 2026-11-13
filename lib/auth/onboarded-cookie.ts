/**
 * A hint cookie holding the user ID once we've seen that user's profile, so
 * proxy.ts doesn't query the database on every navigation.
 *
 * It only skips the onboarding redirect — it grants nothing. Every write still
 * checks the session and RLS, so a forged value can't do harm.
 */
export const ONBOARDED_COOKIE = "pm-onboarded";

export const onboardedCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;
