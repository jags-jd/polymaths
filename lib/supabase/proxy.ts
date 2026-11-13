import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ONBOARDED_COOKIE, onboardedCookieOptions } from "@/lib/auth/onboarded-cookie";
import type { Database } from "@/lib/supabase/database.types";
import { publicEnv } from "@/lib/supabase/env";

/** Paths a signed-in user without a profile may still visit. */
function skipsOnboardingCheck(pathname: string) {
  return pathname === "/onboarding" || pathname.startsWith("/auth/");
}

/**
 * Runs on every matched request:
 * 1. Refreshes the Supabase session cookie.
 * 2. Signed-out users can't open /onboarding (→ /login).
 * 3. Signed-in users skip /login (→ /).
 * 4. Signed-in users without a profile always go to /onboarding (spec).
 *
 * Pages and server actions still check the session themselves; this is
 * routing, not authorization.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  let authHeaders: Record<string, string> = {};

  const supabase = createServerClient<Database>(publicEnv.url, publicEnv.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        // Responses that set auth cookies must never be cached by a CDN.
        authHeaders = headers;
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims():
  // getClaims() validates the JWT and refreshes an expired session.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const { pathname } = request.nextUrl;

  // Redirect while keeping any refreshed session cookies and cache headers.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    Object.entries(authHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  };

  if (!userId) {
    if (pathname === "/onboarding") return redirectTo("/login");
    return supabaseResponse;
  }

  if (pathname === "/login") return redirectTo("/");

  // Only page navigations get the onboarding redirect; leave server actions,
  // route handlers and the onboarding flow itself alone.
  if (request.method !== "GET" || skipsOnboardingCheck(pathname)) return supabaseResponse;
  if (request.cookies.get(ONBOARDED_COOKIE)?.value === userId) return supabaseResponse;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  // If the lookup fails, let the request through rather than trapping the
  // user in a redirect loop; the next navigation tries again.
  if (error) return supabaseResponse;
  if (!profile) return redirectTo("/onboarding");

  supabaseResponse.cookies.set(ONBOARDED_COOKIE, userId, onboardedCookieOptions);
  return supabaseResponse;
}
