/**
 * Sign-in state for the dashboard.
 *
 * Two separate checks are applied, and both matter:
 *
 *  1. Is there a valid Supabase session?
 *  2. Is that session's email on the allowlist?
 *
 * The second check hides the UI, but it is not the security boundary - anyone
 * can call the Supabase API directly with the public anon key. The real
 * enforcement is the row-level security policy in supabase/schema.sql, which
 * refuses reads and writes from any other account.
 */
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isAllowedEmail, isSupabaseConfigured } from "./config";
import { getSupabase } from "./supabase";

export type AuthStatus =
  | "unconfigured"
  | "loading"
  | "signed-out"
  | "signed-in"
  | "not-allowed";

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  email: string | null;
}

export function useAuth(): AuthState & {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    status: isSupabaseConfigured ? "loading" : "unconfigured",
    session: null,
    email: null,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    getSupabase()
      .then(async (supabase) => {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        apply(data.session);

        // Keeps the "signed in" state accurate across tabs and token refreshes.
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (active) apply(session);
          },
        );
        return () => listener.subscription.unsubscribe();
      })
      .catch(() => {
        if (active) {
          setState({ status: "signed-out", session: null, email: null });
        }
      });

    function apply(session: Session | null) {
      const email = session?.user?.email ?? null;
      if (!session) {
        setState({ status: "signed-out", session: null, email: null });
      } else if (isAllowedEmail(email)) {
        setState({ status: "signed-in", session, email });
      } else {
        setState({ status: "not-allowed", session, email });
      }
    }

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string) => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + "/#/admin" },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signOut };
}