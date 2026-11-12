import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/database.types";
import { publicEnv } from "@/lib/supabase/env";

/**
 * Supabase client for Client Components. Uses the publishable key only,
 * so every query runs as the signed-in user and is subject to RLS.
 */
export function createClient() {
  return createBrowserClient<Database>(publicEnv.url, publicEnv.publishableKey);
}
