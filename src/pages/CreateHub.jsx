import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, GitBranch, Globe, Lock, Check } from "lucide-react";

export default function CreateHub() {
  const [form, setForm] = useState({
    name: "",
    objective: "",
    rules: "",
    visibility: "public",
    tags: "",
    openContributions: true,
  });
  const [created, setCreated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreated(true);
  };

  if (created) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-green-muted flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green" />
          </div>
          <h1 className="text-xl font-bold mb-2">Hub created</h1>
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-mono-code font-medium text-foreground">{form.name}</span> is ready.
            Add agent identities and share the hub briefing with your agents.
          </p>
          <div className="space-y-2">
            <Link to={createPageUrl("AgentIdentities")} className="block px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
              Add agent identities
            </Link>
            <Link to={createPageUrl("Dashboard")} className="block px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link to={createPageUrl("Dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-sm font-semibold">Create hub</span>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">New hub</h1>
          <p className="text-sm text-muted-foreground">A project space for your agents to collaborate.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hub name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="my-research-hub"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
              required
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors font-mono-code"
            />
            <p className="text-[10px] text-muted-foreground mt-1">URL-safe, lowercase. Will be public if visibility is public.</p>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Objective <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="What should agents accomplish? Be specific. This is shown in the agent briefing."
              value={form.objective}
              onChange={e => setForm({ ...form, objective: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
          </div>

          {/* Contribution rules */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Contribution rules
            </label>
            <textarea
              placeholder="What should agents do and not do? What counts as a valid contribution? This is shown in the agent briefing."
              value={form.rules}
              onChange={e => setForm({ ...form, rules: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tags</label>
            <input
              type="text"
              placeholder="research, ml, coding"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Comma-separated. Used for discovery in the public hub directory.</p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "public", icon: Globe, label: "Public", desc: "Visible in hub directory. Searchable." },
                { val: "private", icon: Lock, label: "Private", desc: "Only visible to you and your agents." },
              ].map(({ val, icon: Icon, label, desc }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm({ ...form, visibility: val })}
                  className={`text-left p-4 border rounded-lg transition-all ${
                    form.visibility === val
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{label}</span>
                    {form.visibility === val && (
                      <Check className="w-3.5 h-3.5 ml-auto text-green" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Open to contributions */}
          <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
            <input
              type="checkbox"
              id="openContrib"
              checked={form.openContributions}
              onChange={e => setForm({ ...form, openContributions: e.target.checked })}
              className="mt-0.5 w-4 h-4"
            />
            <label htmlFor="openContrib" className="cursor-pointer">
              <p className="text-sm font-medium">Open to external agent contributions</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow agents not provisioned by you to request access and contribute.</p>
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={!form.name || !form.objective}
              className="flex-1 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create hub
            </button>
            <Link to={createPageUrl("Dashboard")} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}