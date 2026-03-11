import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { captureEvent, captureException } from "@/lib/analytics";
import { loadProfile, updateDisplayName } from "@/lib/app-data";
import { getAuthRedirectUrl, isAnonymousUser } from "@/lib/auth-utils";
import { requireSupabaseClient, supabaseConfigError } from "@/lib/supabase";
import { createPageUrl } from "@/utils";

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
      captureException(error, {
        source: "auth.refresh_profile",
        user_id: nextUser.id,
      });
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
        captureException(error, {
          source: "auth.bootstrap_session",
        });
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

  async function runAuthAction(action, options = {}) {
    const {
      errorProperties = {},
      successEvent,
      successProperties = {},
    } = options;

    setAuthError(null);
    const supabase = requireSupabaseClient();

    let result;

    try {
      result = await action(supabase);
    } catch (error) {
      captureException(error, {
        source: "auth.action",
        ...errorProperties,
      });
      setAuthError(error.message);
      throw error;
    }

    if (result.error) {
      captureException(result.error, {
        source: "auth.action",
        ...errorProperties,
      });
      setAuthError(result.error.message);
      throw result.error;
    }

    if (successEvent) {
      captureEvent(successEvent, successProperties);
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
        runAuthAction(
          (supabase) =>
            supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: getAuthRedirectUrl(createPageUrl("Dashboard")),
                data: displayName ? { display_name: displayName.trim() } : {},
              },
            }),
          {
            errorProperties: {
              action: "sign_up",
            },
            successEvent: "account_signed_up",
            successProperties: {
              auth_method: "password",
            },
          },
        ),
      signIn: ({ email, password }) =>
        runAuthAction(
          (supabase) =>
            supabase.auth.signInWithPassword({
              email,
              password,
            }),
          {
            errorProperties: {
              action: "sign_in",
            },
            successEvent: "account_signed_in",
            successProperties: {
              auth_method: "password",
            },
          },
        ),
      signInAnonymously: () =>
        runAuthAction((supabase) => supabase.auth.signInAnonymously(), {
          errorProperties: {
            action: "sign_in_anonymously",
          },
          successEvent: "guest_access_started",
          successProperties: {
            auth_method: "anonymous",
          },
        }),
      signOut: () =>
        runAuthAction((supabase) => supabase.auth.signOut(), {
          errorProperties: {
            action: "sign_out",
            user_id: user?.id,
          },
          successEvent: "account_signed_out",
          successProperties: {
            user_id: user?.id,
          },
        }),
      updateProfile: async ({ displayName }) => {
        if (!user) {
          throw new Error("You must be signed in to update your profile.");
        }

        try {
          const nextProfile = await updateDisplayName(
            user.id,
            displayName.trim(),
          );
          setProfile(nextProfile);
          captureEvent("profile_updated", {
            has_display_name: Boolean(nextProfile.display_name),
          });
          return nextProfile;
        } catch (error) {
          captureException(error, {
            source: "auth.update_profile",
            user_id: user.id,
          });
          throw error;
        }
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
