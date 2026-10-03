/**
 * Supabase client, created on first use.
 *
 * The client is built with a dynamic import so the ~100KB SDK is only fetched
 * when someone actually opens the dashboard. Importing it eagerly would tax
 * every visitor to the public site for a feature almost nobody sees.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";

let clientPromise: Promise<SupabaseClient> | null = null;

export async function getSupabase(): Promise<SupabaseClient> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // Keep the admin out of the marketing GA4 property.
          storageKey: "bright-admin-auth",
        },
      }),
    );
  }

  return clientPromise;
}