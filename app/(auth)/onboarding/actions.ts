"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ONBOARDED_COOKIE, onboardedCookieOptions } from "@/lib/auth/onboarded-cookie";
import { getSessionUser } from "@/lib/auth/session";
import { onboardingSchema } from "@/lib/safety/profile-fields";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = {
  values: { displayName: string; ign: string };
  fieldErrors?: { displayName?: string; ign?: string };
  formError?: string;
};

const UNIQUE_VIOLATION = "23505";

export async function createProfile(
  _previous: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const values = {
    displayName: formData.get("displayName")?.toString() ?? "",
    ign: formData.get("ign")?.toString() ?? "",
  };

  const user = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = onboardingSchema.safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      values,
      fieldErrors: { displayName: fieldErrors.displayName?.[0], ign: fieldErrors.ign?.[0] },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    display_name: parsed.data.displayName,
    ign: parsed.data.ign,
    avatar_url: user.providerAvatarUrl,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION && error.message.includes("profiles_ign_key")) {
      return { values, fieldErrors: { ign: "That IGN is taken. Try another." } };
    }
    if (error.code === UNIQUE_VIOLATION) {
      // A profile already exists for this user (double submit): carry on.
    } else {
      console.error(JSON.stringify({ event: "onboarding.insert_failed", code: error.code }));
      return { values, formError: "We couldn't save your profile. Please try again." };
    }
  }

  (await cookies()).set(ONBOARDED_COOKIE, user.id, onboardedCookieOptions);
  // The header now has an IGN to show; drop the cached version.
  refresh();
  redirect("/");
}
