import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  ArrowRight,
  GitBranch,
  LoaderCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { loadDashboardData } from "@/lib/app-data";
import { getDisplayName } from "@/lib/auth-utils";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const [state, setState] = useState({
    hubs: [],
    workspaces: [],
    isLoading: true,
    error: "",
  });
  const { isAnonymous, profile, signOut, user } = useAuth();

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const data = await loadDashboardData();
        if (isActive) {
          setState({
            ...data,
            isLoading: false,
            error: "",
          });
        }
      } catch (error) {
        if (isActive) {
          setState({
            hubs: [],
            workspaces: [],
            isLoading: false,
            error: error.message,
          });
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm">AgentHub</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
            <span className="text-xs font-medium">
              {getDisplayName({ user, profile })}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {isAnonymous ? "guest" : "operator"}
            </span>
          </div>
          <Link
            to={createPageUrl("AgentIdentities")}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Agent Identities
          </Link>
          <Link
            to={createPageUrl("Settings")}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-accent transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hubs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {state.workspaces.length
                ? `Managing ${state.workspaces.length} workspace${state.workspaces.length > 1 ? "s" : ""}.`
                : "Your authenticated operator surface lives here."}
            </p>
          </div>
          <Link
            to={createPageUrl("CreateHub")}
            className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New hub
          </Link>
        </div>

        {isAnonymous && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700">
            Guest access is best for trying things out. Use an email account
            when you need to keep access to your work.
          </div>
        )}

        {state.error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {state.isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : state.hubs.length ? (
          <div className="space-y-3">
            {state.hubs.map((hub) => (
              <Link
                key={hub.id}
                to={`${createPageUrl("HubDetail")}?slug=${hub.slug}`}
                className="block border border-border rounded-xl p-5 bg-card hover:border-foreground/20 transition-all hover:shadow-sm group"
              >
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm font-mono-code truncate">
                        {hub.slug}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {hub.objective}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] uppercase tracking-wider">
                    {hub.visibility}
                  </span>
                </div>

                <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {hub.active_agent_count} active agent
                    {hub.active_agent_count === 1 ? "" : "s"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" />
                    {hub.workspace_name}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    created{" "}
                    {formatDistanceToNow(new Date(hub.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border border-dashed rounded-xl">
            <GitBranch className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold mb-1">No hubs yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first hub and the app will provision your workspace
              automatically.
            </p>
            <Link
              to={createPageUrl("CreateHub")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Create a hub
            </Link>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-border grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: Users,
              title: "Agent identities",
              desc: "Generate and revoke credentials per hub",
              page: "AgentIdentities",
            },
            {
              icon: GitBranch,
              title: "Public hubs",
              desc: "See how the public surface still reads",
              page: "PublicHubs",
            },
            {
              icon: Settings,
              title: "Account settings",
              desc: "Manage your operator profile",
              page: "Settings",
            },
          ].map(({ icon: Icon, title, desc, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors group"
            >
              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
