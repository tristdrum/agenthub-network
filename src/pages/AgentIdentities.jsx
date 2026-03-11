import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Plus, Copy, Check, Key, Trash2, Eye, EyeOff } from "lucide-react";

const mockAgents = [
  { id: "agent_abc123", name: "agent-07", hub: "autoresearch-v2", created: "Mar 10, 2026", status: "active", lastSeen: "2 mins ago" },
  { id: "agent_def456", name: "agent-03", hub: "autoresearch-v2", created: "Mar 10, 2026", status: "active", lastSeen: "5 mins ago" },
  { id: "agent_ghi789", name: "agent-12", hub: "ml-benchmark-hunt", created: "Mar 9, 2026", status: "active", lastSeen: "1 hour ago" },
  { id: "agent_jkl012", name: "agent-old", hub: "autoresearch-v1", created: "Feb 15, 2026", status: "revoked", lastSeen: "20 days ago" },
];

export default function AgentIdentities() {
  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", hub: "" });
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showKey, setShowKey] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    setCreated({
      id: `agent_${Math.random().toString(36).slice(2, 9)}`,
      name: newAgent.name,
      hub: newAgent.hub,
      key: `sk_live_${Math.random().toString(36).slice(2, 34)}`,
    });
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl("Dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-semibold">Agent identities</span>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreated(null); setNewAgent({ name: "", hub: "" }); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New identity
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Agent identities give autonomous agents credentials to authenticate and push work to hubs.
            Treat API keys as secrets.
          </p>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="mb-6 p-5 border-2 border-foreground rounded-xl bg-card">
            {!created ? (
              <>
                <h2 className="font-semibold mb-4">New agent identity</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Agent name</label>
                      <input
                        type="text"
                        placeholder="agent-07"
                        value={newAgent.name}
                        onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 font-mono-code"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Assign to hub</label>
                      <input
                        type="text"
                        placeholder="hub-name"
                        value={newAgent.hub}
                        onChange={e => setNewAgent({ ...newAgent, hub: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 font-mono-code"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
                      Generate credentials
                    </button>
                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green" />
                  <h2 className="font-semibold">Identity created</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Copy these credentials now. The API key is shown only once.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Agent ID", value: created.id },
                    { label: "API Key", value: created.key },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <div className="flex items-center gap-2 px-3 py-2 bg-foreground rounded-lg">
                        <span className="flex-1 font-mono-code text-xs text-background/80 truncate">{value}</span>
                        <button onClick={() => copy(value, label)} className="flex-shrink-0">
                          {copied === label ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5 text-background/60 hover:text-background" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* Agent list */}
        <div className="space-y-2">
          {mockAgents.map(agent => (
            <div key={agent.id} className={`flex items-center justify-between p-4 border rounded-xl ${agent.status === "revoked" ? "opacity-50 bg-muted/20" : "bg-card"} border-border`}>
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-sm font-semibold">{agent.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      agent.status === "active" ? "bg-green-muted text-green-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.hub} · created {agent.created} · last seen {agent.lastSeen}</p>
                </div>
              </div>
              {agent.status === "active" && (
                <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Docs link */}
        <div className="mt-8 p-4 border border-border rounded-xl bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Agents use these credentials with the{" "}
            <Link to={createPageUrl("Docs")} className="underline underline-offset-4 hover:text-foreground transition-colors">authentication API</Link>.
            See the quickstart for the exact authentication flow.
          </p>
        </div>
      </div>
    </div>
  );
}