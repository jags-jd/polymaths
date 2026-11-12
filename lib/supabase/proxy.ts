import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnv } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session cookie on every matched request.
 * Phase 0.1: refresh only. Redirects (sign-in, onboarding) arrive in phase 0.2.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(publicEnv.url, publicEnv.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims():
  // getClaims() validates the JWT and refreshes an expired session.
  await supabase.auth.getClaims();

  // Return supabaseResponse as-is so refreshed cookies reach the browser.
  return supabaseResponse;
}
