import "server-only";

import { connection } from "next/server";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** The narrow view of the signed-in user that pages need. */
export type SessionUser = {
  id: string;
  /** Name from the OAuth provider, used to suggest a display name. */
  providerName: string | null;
  /** Avatar URL from the OAuth provider (avatars aren't uploaded; see spec). */
  providerAvatarUrl: string | null;
};

export type MyProfile = {
  id: string;
  ign: string;
  displayName: string;
  avatarUrl: string | null;
};

function stringClaim(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * The signed-in user, or null. Reads cookies, so callers must sit inside a
 * <Suspense> boundary (Cache Components). getClaims() verifies the JWT.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  // getClaims() checks token expiry with Date.now(), so this must never run
  // during a prerender or runtime prefetch.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: claims.sub,
    providerName: stringClaim(meta.full_name) ?? stringClaim(meta.name),
    providerAvatarUrl: stringClaim(meta.avatar_url) ?? stringClaim(meta.picture),
  };
});

/** The signed-in user's profile, or null if signed out or not onboarded. */
export const getMyProfile = cache(async (): Promise<MyProfile | null> => {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, ign, display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Could not load profile: ${error.message}`);
  if (!data) return null;
  return {
    id: data.id,
    ign: data.ign,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
  };
});
