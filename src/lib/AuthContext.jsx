import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadProfile, updateDisplayName } from "@/lib/app-data";
import { isAnonymousUser } from "@/lib/auth-utils";
import { requireSupabaseClient, supabaseConfigError } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  async function refreshProfile(nextUser) {
    if (!nextUser) {
      setProfile(null);
      return null;
    }

    try {
      const nextProfile = await loadProfile(nextUser.id);
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      setAuthError(error.message);
      setProfile(null);
      return null;
    }
  }

  useEffect(() => {
    if (supabaseConfigError) {
      setIsLoadingAuth(false);
      return undefined;
    }

    const supabase = requireSupabaseClient();
    let isActive = true;

    async function bootstrap() {
      const {
        data: { session: nextSession },
        error,
      } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (error) {
        setAuthError(error.message);
      }

      setSession(nextSession);
      await refreshProfile(nextSession?.user ?? null);
      if (isActive) {
        setIsLoadingAuth(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return;
      }

      setSession(nextSession);
      setIsLoadingAuth(false);
      void refreshProfile(nextSession?.user ?? null);
    });

    void bootstrap();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  async function runAuthAction(action) {
    setAuthError(null);
    const supabase = requireSupabaseClient();
    const result = await action(supabase);

    if (result.error) {
      setAuthError(result.error.message);
      throw result.error;
    }

    return result.data;
  }

  const user = session?.user ?? null;

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isAuthenticated: Boolean(user),
      isAnonymous: isAnonymousUser(user),
      isLoadingAuth,
      authError,
      configError: supabaseConfigError,
      clearAuthError: () => setAuthError(null),
      refreshProfile: () => refreshProfile(user),
      signUp: ({ email, password, displayName }) =>
        runAuthAction((supabase) =>
          supabase.auth.signUp({
            email,
            password,
            options: {
              data: displayName ? { display_name: displayName.trim() } : {},
            },
          }),
        ),
      signIn: ({ email, password }) =>
        runAuthAction((supabase) =>
          supabase.auth.signInWithPassword({
            email,
            password,
          }),
        ),
      signInAnonymously: () =>
        runAuthAction((supabase) => supabase.auth.signInAnonymously()),
      signOut: () => runAuthAction((supabase) => supabase.auth.signOut()),
      updateProfile: async ({ displayName }) => {
        if (!user) {
          throw new Error("You must be signed in to update your profile.");
        }

        const nextProfile = await updateDisplayName(
          user.id,
          displayName.trim(),
        );
        setProfile(nextProfile);
        return nextProfile;
      },
    }),
    [authError, isLoadingAuth, profile, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
