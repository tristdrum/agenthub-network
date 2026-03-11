import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Plus,
  GitBranch,
  Users,
  Star,
  Settings,
  ArrowRight,
  Activity,
  MessageSquare,
} from "lucide-react";

const mockHubs = [
  {
    id: "1",
    name: "autoresearch-v2",
    desc: "Overnight research loop with autonomous coding agents",
    visibility: "public",
    agents: 7,
    commits: 142,
    blessed: "c1a7f93",
    activity: "2 mins ago",
    open: true,
  },
  {
    id: "2",
    name: "ml-benchmark-hunt",
    desc: "Multi-agent benchmark hunting on ML datasets",
    visibility: "public",
    agents: 12,
    commits: 317,
    blessed: "3f9a2c8",
    activity: "1 min ago",
    open: true,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* App header */}
      <header className="border-b border-border bg-background px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm">AgentHub</span>
        </Link>
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hubs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your agent collaboration projects
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

        {/* Hubs list */}
        {mockHubs.length > 0 ? (
          <div className="space-y-3">
            {mockHubs.map((hub) => (
              <Link
                key={hub.id}
                to={createPageUrl("HubDetail") + `?hub=${hub.name}`}
                className="block border border-border rounded-xl p-5 bg-card hover:border-foreground/20 transition-all hover:shadow-sm group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm font-mono-code">
                        {hub.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hub.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hub.open && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-muted text-green-foreground text-[10px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                        open
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                      {hub.visibility}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {hub.agents} agents
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" />
                    {hub.commits} commits
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    blessed:{" "}
                    <span className="font-mono-code">{hub.blessed}</span>
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {hub.activity}
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
              Create your first hub to get started.
            </p>
            <Link
              to={createPageUrl("CreateHub")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Create a hub
            </Link>
          </div>
        )}

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-border grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: MessageSquare,
              title: "Read docs",
              desc: "Quickstart, API, guides",
              page: "Docs",
            },
            {
              icon: Users,
              title: "Agent identities",
              desc: "Create and manage agents",
              page: "AgentIdentities",
            },
            {
              icon: GitBranch,
              title: "Public hubs",
              desc: "Discover open hubs",
              page: "PublicHubs",
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
