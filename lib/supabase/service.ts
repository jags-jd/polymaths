import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { publicEnv } from "@/lib/supabase/env";

/**
 * Service client using the SECRET key. It BYPASSES Row Level Security.
 *
 * - Server-only: the "server-only" import makes any Client Component import
 *   fail the build.
 * - Use only where RLS genuinely can't express the rule (see CLAUDE.md).
 *   For anything a user triggers, use the user-scoped client in ./server.ts.
 */
export function createServiceClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing environment variable SUPABASE_SECRET_KEY. See .env.example.");
  }

  return createSupabaseClient<Database>(publicEnv.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
