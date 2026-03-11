import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { getDisplayName } from "@/lib/auth-utils";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function Settings() {
  const { isAnonymous, profile, refreshProfile, signOut, updateProfile, user } =
    useAuth();
  const [displayName, setDisplayName] = useState(
    profile?.display_name || user?.user_metadata?.display_name || "",
  );
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisplayName(
      profile?.display_name || user?.user_metadata?.display_name || "",
    );
  }, [profile, user]);

  async function handleSave(event) {
    event.preventDefault();
    setStatus("");
    setIsSaving(true);

    try {
      await updateProfile({ displayName });
      await refreshProfile();
      setStatus("Profile updated.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link
          to={createPageUrl("Dashboard")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-sm font-semibold">Settings</span>
      </header>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Account settings
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isAnonymous
            ? "You are using guest access on this device."
            : `Signed in as ${user?.email}.`}
        </p>

        {isAnonymous && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700">
            Use email sign-in if you need to keep access to this work over time.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email
            </label>
            <input
              type="text"
              value={user?.email || "Guest access"}
              disabled
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder={getDisplayName({ user, profile })}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors"
            />
          </div>

          {status && (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
              {status}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isSaving && <LoaderCircle className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Sign out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
