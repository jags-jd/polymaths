"use server";

import { refresh } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ONBOARDED_COOKIE } from "@/lib/auth/onboarded-cookie";
import { safeNextPath } from "@/lib/auth/safe-next";
import { createClient } from "@/lib/supabase/server";

/** The site origin this request came in on (localhost, preview or production). */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) throw new Error("Cannot work out the site origin for the OAuth redirect.");
  return `${proto}://${host}`;
}

/** Starts Google sign-in. Supabase redirects back to /auth/callback. */
export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(formData.get("next")?.toString());
  const callback = new URL("/auth/callback", await requestOrigin());
  if (next !== "/") callback.searchParams.set("next", next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString() },
  });

  if (error || !data.url) redirect("/login?error=start");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  (await cookies()).delete(ONBOARDED_COOKIE);
  // Drop cached signed-in UI (the header) from the client router.
  refresh();
  redirect("/");
}
