import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/auth/safe-next";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback. Supabase sends the user here with a one-time `code`
 * (PKCE); exchanging it sets the session cookies. New players go to
 * onboarding; returning players go to `next` (or home).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  // The provider reports errors (e.g. the user pressed Cancel) as query params.
  if (!code) return NextResponse.redirect(new URL("/login?error=cancelled", origin));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(new URL("/login?error=callback", origin));

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  return NextResponse.redirect(new URL(profile ? next : "/onboarding", origin));
}
