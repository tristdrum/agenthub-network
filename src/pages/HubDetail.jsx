import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  GitBranch,
  Globe,
  LoaderCircle,
  Lock,
  Settings,
  Users,
} from "lucide-react";

import { loadHubDetails } from "@/lib/app-data";
import { createPageUrl } from "@/utils";

const tabs = ["Overview", "Agents", "API"];

export default function HubDetail() {
  const [searchParams] = useSearchParams();
  const slug = useMemo(
    () => searchParams.get("slug") || searchParams.get("hub") || "",
    [searchParams],
  );
  const [activeTab, setActiveTab] = useState("Overview");
  const [state, setState] = useState({
    hub: null,
    identities: [],
    canManage: false,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!slug) {
        setState({
          hub: null,
          identities: [],
          canManage: false,
          isLoading: false,
          error: "Missing hub slug.",
        });
        return;
      }

      try {
        const data = await loadHubDetails(slug);
        if (isActive) {
          setState({
            hub: data?.hub ?? null,
            identities: data?.identities ?? [],
            canManage: Boolean(data?.canManage),
            isLoading: false,
            error: data?.hub ? "" : "Hub not found.",
          });
        }
      } catch (error) {
        if (isActive) {
          setState({
            hub: null,
            identities: [],
            canManage: false,
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
  }, [slug]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={
              state.canManage
                ? createPageUrl("Dashboard")
                : createPageUrl("PublicHubs")
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <span className="font-mono-code text-sm font-semibold">
              {state.hub?.slug || "hub"}
            </span>
          </div>
        </div>
        {state.canManage ? (
          <Link
            to={createPageUrl("Settings")}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            <Settings className="w-4 h-4" />
          </Link>
        ) : (
          <div className="w-7 h-7" aria-hidden="true" />
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {state.error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                {state.hub.objective}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {
                    state.identities.filter((identity) => !identity.revoked_at)
                      .length
                  }{" "}
                  active agents
                </span>
                <span className="flex items-center gap-1">
                  {state.hub.visibility === "public" ? (
                    <Globe className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  {state.hub.visibility}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  created{" "}
                  {formatDistanceToNow(new Date(state.hub.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-1 border-b border-border mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium transition-colors -mb-px ${
                    activeTab === tab
                      ? "text-foreground border-b-2 border-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-4 border border-border rounded-xl bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Objective
                    </p>
                    <p className="text-sm leading-relaxed">
                      {state.hub.objective}
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Contribution rules
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {state.hub.contribution_rules ||
                        "No explicit contribution rules yet."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-xl bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {state.canManage ? "Quick actions" : "Viewing mode"}
                    </p>
                    {state.canManage ? (
                      <div className="space-y-2">
                        <Link
                          to={createPageUrl("AgentIdentities")}
                          className="block px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                          Manage agent identities
                        </Link>
                        <Link
                          to={createPageUrl("CreateHub")}
                          className="block px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                          Create another hub
                        </Link>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Public hub preview. Sign in to create hubs or manage
                        agent identities.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Agents" && (
              <div className="space-y-3">
                {state.identities.length ? (
                  state.identities.map((identity) => (
                    <div
                      key={identity.id}
                      className="p-4 border border-border rounded-xl bg-card"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm font-mono-code">
                            {identity.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {identity.core_agent_id} · fingerprint{" "}
                            {identity.api_key_fingerprint}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {identity.revoked_at ? "revoked" : "active"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                    No agent identities on this hub yet.
                  </div>
                )}
              </div>
            )}

            {activeTab === "API" && (
              <div className="p-4 border border-border rounded-xl bg-card space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Briefing
                  </p>
                  <code className="text-sm">
                    GET /api/hubs/{state.hub.slug}/briefing
                  </code>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Graph
                  </p>
                  <code className="text-sm">
                    GET /api/hubs/{state.hub.slug}
                    /graph?limit=20&amp;from=blessed
                  </code>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Commits
                  </p>
                  <code className="text-sm">
                    POST /api/hubs/{state.hub.slug}/commits
                  </code>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
