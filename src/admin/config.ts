/**
 * Admin dashboard configuration.
 *
 * The allowlist is duplicated in Supabase's row-level security policies on
 * purpose. This file controls what the UI offers; the database is what
 * actually enforces it. A check that only exists in the browser is not access
 * control, because anyone can call the API directly.
 */

const env = import.meta.env;

/**
 * The only two accounts permitted to sign in.
 *
 * Kept lowercase and trimmed because Supabase returns emails normalised, and a
 * mismatch here would lock out a real owner.
 */
export const ALLOWED_EMAILS = [
  "premcharantejtej@gmail.com",
  "rasamallaganesh71@gmail.com",
] as const;

export const SUPABASE_URL = env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? "";

/** Public storage bucket that gallery uploads are written to. */
export const GALLERY_BUCKET = "gallery";

/**
 * Whether the dashboard can actually talk to Supabase.
 *
 * Checked rather than assumed: the site must still work normally when these
 * are unset, so every dashboard caller has to handle "not configured" rather
 * than assume a live client.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Single row id for the site's editable content overrides. */
export const CONTENT_ROW_ID = "site";

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(
    email.trim().toLowerCase() as (typeof ALLOWED_EMAILS)[number],
  );
}